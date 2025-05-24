import { type SQL, and, asc, count, desc, eq, gt, gte, inArray, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { generateUUID } from "mtxuilib/lib/utils";
import postgres from "postgres";
import type { ArtifactKind } from "../aichatbot/artifact";
import type { VisibilityType } from "../aichatbot/visibility-selector";
import {
  stream,
  type Chat,
  type DBChatMessage,
  type Suggestion,
  type User,
  chat,
  chatMessage,
  document,
  suggestion,
  user,
  vote,
} from "./schema";
import { generateHashedPassword } from "./utils";

let globalInstance: ReturnType<typeof drizzle> | undefined;
let globalPool: postgres.Sql | undefined;

export function getDbV3() {
  if (globalInstance) {
    return globalInstance;
  }

  const connStr = process.env.MTM_DATABASE_URL;
  if (!connStr) {
    throw new Error("MTM_DATABASE_URL is not defined");
  }

  // Create connection pool
  const pool = postgres(connStr, {
    max: 5, // Maximum number of connections
    idle_timeout: 20, // Idle connection timeout in seconds
    connect_timeout: 10, // Connection timeout in seconds
  });

  globalPool = pool;
  const db = drizzle(pool);
  globalInstance = db;

  return db;
}

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await getDbV3().select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);

  try {
    return await getDbV3()
      .insert(user)
      .values({ id: generateUUID(), email, password: hashedPassword });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

export async function createGuestUser() {
  const email = `guest-${Date.now()}`;
  const password = generateHashedPassword(generateUUID());

  try {
    return await getDbV3().insert(user).values({ id: generateUUID(), email, password }).returning({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error("Failed to create guest user in database");
    throw error;
  }
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  try {
    return await getDbV3().insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
      visibility,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await getDbV3().delete(vote).where(eq(vote.chatId, id));
    await getDbV3().delete(chatMessage).where(eq(chatMessage.chatId, id));
    await getDbV3().delete(stream).where(eq(stream.chatId, id));

    const [chatsDeleted] = await getDbV3().delete(chat).where(eq(chat.id, id)).returning();
    return chatsDeleted;
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const extendedLimit = limit + 1;

    const query = (whereCondition?: SQL<any>) =>
      getDbV3()
        .select()
        .from(chat)
        .where(whereCondition ? and(whereCondition, eq(chat.userId, id)) : eq(chat.userId, id))
        .orderBy(desc(chat.createdAt))
        .limit(extendedLimit);

    let filteredChats: Array<Chat> = [];

    if (startingAfter) {
      const [selectedChat] = await getDbV3()
        .select()
        .from(chat)
        .where(eq(chat.id, startingAfter))
        .limit(1);

      if (!selectedChat) {
        throw new Error(`Chat with id ${startingAfter} not found`);
      }

      filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
    } else if (endingBefore) {
      const [selectedChat] = await getDbV3()
        .select()
        .from(chat)
        .where(eq(chat.id, endingBefore))
        .limit(1);

      if (!selectedChat) {
        throw new Error(`Chat with id ${endingBefore} not found`);
      }

      filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
    } else {
      filteredChats = await query();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  // try {
  const [selectedChat] = await getDbV3().select().from(chat).where(eq(chat.id, id));
  return selectedChat;
  // } catch (error) {
  //   console.error(`Failed to get chat by id from database, id: ${id}`);
  //   throw error;
  // }
}

export async function saveMessages({
  messages,
}: {
  messages: Array<DBChatMessage>;
}) {
  try {
    return await getDbV3().insert(chatMessage).values(messages);
  } catch (error) {
    console.error("Failed to save messages in database", error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await getDbV3()
      .select()
      .from(chatMessage)
      .where(eq(chatMessage.chatId, id))
      .orderBy(asc(chatMessage.createdAt));
  } catch (error) {
    console.error("Failed to get messages by chat id from database", error);
    throw error;
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  try {
    const [existingVote] = await getDbV3()
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await getDbV3()
        .update(vote)
        .set({ isUpvoted: type === "up" })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await getDbV3()
      .insert(vote)
      .values({
        chatId,
        messageId,
        isUpvoted: type === "up",
      });
  } catch (error) {
    console.error("Failed to upvote message in database", error);
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await getDbV3().select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    console.error("Failed to get votes by chat id from database", error);
    throw error;
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    return await getDbV3()
      .insert(document)
      .values({
        id,
        title,
        kind,
        content,
        userId,
        createdAt: new Date(),
      })
      .returning();
  } catch (error) {
    console.error(`Failed to save document in database, id: ${id}, error: ${error}`);
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await getDbV3()
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    console.error(`Failed to get document by id from database, id: ${error}`);
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await getDbV3()
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    console.error(`Failed to get document by id from database, id: ${id}`);
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await getDbV3()
      .delete(suggestion)
      .where(and(eq(suggestion.documentId, id), gt(suggestion.documentCreatedAt, timestamp)));

    return await getDbV3()
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)))
      .returning();
  } catch (error) {
    console.error("Failed to delete documents by id after timestamp from database");
    throw error;
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    return await getDbV3().insert(suggestion).values(suggestions);
  } catch (error) {
    console.error("Failed to save suggestions in database");
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await getDbV3()
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    console.error("Failed to get suggestions by document version from database");
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await getDbV3().select().from(chatMessage).where(eq(chatMessage.id, id));
  } catch (error) {
    console.error("Failed to get message by id from database");
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await getDbV3()
      .select({ id: chatMessage.id })
      .from(chatMessage)
      .where(and(eq(chatMessage.chatId, chatId), gte(chatMessage.createdAt, timestamp)));

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await getDbV3()
        .delete(vote)
        .where(and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds)));

      return await getDbV3()
        .delete(chatMessage)
        .where(and(eq(chatMessage.chatId, chatId), inArray(chatMessage.id, messageIds)));
    }
  } catch (error) {
    console.error("Failed to delete messages by id after timestamp from database");
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) {
  try {
    return await getDbV3().update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    console.error("Failed to update chat visibility in database");
    throw error;
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: { id: string; differenceInHours: number }) {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - differenceInHours * 60 * 60 * 1000);

    const [stats] = await getDbV3()
      .select({ count: count(chatMessage.id) })
      .from(chatMessage)
      .innerJoin(chat, eq(chatMessage.chatId, chat.id))
      .where(
        and(
          eq(chat.userId, id),
          gte(chatMessage.createdAt, twentyFourHoursAgo),
          eq(chatMessage.role, "user"),
        ),
      )
      .execute();

    return stats?.count ?? 0;
  } catch (error) {
    console.error("Failed to get message count by user id for the last 24 hours from database");
    throw error;
  }
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  try {
    await getDbV3().insert(stream).values({ id: streamId, chatId, createdAt: new Date() });
  } catch (error) {
    console.error("Failed to create stream id in database");
    throw error;
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    const streamIds = await getDbV3()
      .select({ id: stream.id })
      .from(stream)
      .where(eq(stream.chatId, chatId))
      .orderBy(asc(stream.createdAt))
      .execute();

    return streamIds.map(({ id }) => id);
  } catch (error) {
    console.error("Failed to get stream ids by chat id from database");
    throw error;
  }
}
