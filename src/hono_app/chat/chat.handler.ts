import { geolocation } from "@vercel/functions";
import { eq } from "drizzle-orm";

import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  smoothStream,
  streamText,
} from "ai";
import { differenceInSeconds } from "date-fns";

import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  getStreamIdsByChatId,
  saveChat,
  saveMessages,
} from "@mtmaiui/db/queries";
import { stream, type Chat, chat } from "@mtmaiui/db/schema";
import { type UserType, auth } from "@mtmaiui/lib/auth/auth";
import { generateUUID } from "mtxuilib/lib/utils";
import { type RequestHints, systemPrompt } from "../../agent_utils/prompts";
import { myProvider } from "../../agent_utils/providers";
import { createDocument } from "../../agents/tools/create-document";
import { requestSuggestions } from "../../agents/tools/request-suggestions";
import { updateDocument } from "../../agents/tools/update-document";
// import { getWeather } from "../../aichatbot/lib/ai/tools/get-weather";
import { getTrailingMessageId, isProductionEnvironment } from "../../aichatbot/lib/utils";
import { getDbV3 } from "../../db/queries";
import { createRouter } from "../agent_api/lib/createApp";
import { type PostRequestBody, postRequestBodySchema } from "./schema";

export const maxDuration = 60;
export const chatRouter = createRouter();
chatRouter.post("/sse", async (c) => {
  let requestBody: PostRequestBody;
  const request = c.req.raw;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new Response("Invalid request body", { status: 400 });
  }

  try {
    const { id, message, selectedChatModel, selectedVisibilityType } = requestBody;

    const session = await auth();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userType: UserType = session.user.type;

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    // 免费用户 日请求限制
    // if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
    //   return new Response(
    //     'You have exceeded your maximum number of messages for the day! Please try again later.',
    //     {
    //       status: 429,
    //     },
    //   );
    // }

    const chat = await getChatById({ id });

    if (!chat) {
      // const title = await generateTitleFromUserMessage({
      //   message,
      // });
      const title = "fake title";

      await saveChat({
        id,
        userId: session.user.id,
        title,
        visibility: selectedVisibilityType,
      });
    } else {
      if (chat.userId !== session.user.id) {
        return new Response("Forbidden", { status: 403 });
      }
    }

    const previousMessages = await getMessagesByChatId({ id });

    const messages = appendClientMessage({
      // @ts-expect-error: todo add type conversion from DBMessage[] to UIMessage[]
      messages: previousMessages,
      message,
    });

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: "user",
          parts: message.parts,
          attachments: message.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });

    const model = myProvider.languageModel(selectedChatModel);
    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model,
          system: systemPrompt({ selectedChatModel, requestHints }),
          messages,
          maxSteps: 5,
          experimental_activeTools:
            selectedChatModel === "chat-model-reasoning"
              ? []
              : ["createDocument", "updateDocument", "requestSuggestions"],
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateUUID,
          tools: {
            // getWeather,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({
              session,
              dataStream,
            }),
          },
          onFinish: async ({ response }) => {
            if (session.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter((message) => message.role === "assistant"),
                });

                if (!assistantId) {
                  throw new Error("No assistant message found!");
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [message],
                  responseMessages: response.messages,
                });

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      parts: assistantMessage.parts,
                      attachments: assistantMessage.experimental_attachments ?? [],
                      createdAt: new Date(),
                    },
                  ],
                });
              } catch (_) {
                console.error("Failed to save chat");
              }
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text",
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (e: any) => {
        console.error(e, e.stack);
        // return "Oops, an error occurred!";
        return `Oops, an error occurred!${e.stack}`;
      },
    });

    // const streamContext = getStreamContext();

    // if (streamContext) {
    //   return new Response(await streamContext.resumableStream(streamId, () => stream));
    // }
    return new Response(stream);
  } catch (err: any) {
    console.error(`Failed to process chat request, error: ${err}`);
    return new Response("An error occurred while processing your request!", {
      status: 500,
    });
  }
});

chatRouter.get("/", async (c) => {
  const request = c.req.raw;
  // const streamContext = getStreamContext();
  const resumeRequestedAt = new Date();

  // if (!streamContext) {
  //   return new Response(null, { status: 204 });
  // }

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new Response("id is required", { status: 400 });
  }

  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  let chat: Chat;

  try {
    chat = await getChatById({ id: chatId });
  } catch {
    return new Response("Not found", { status: 404 });
  }

  if (!chat) {
    return new Response("Not found", { status: 404 });
  }

  if (chat.visibility === "private" && chat.userId !== session.user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  const streamIds = await getStreamIdsByChatId({ chatId });

  if (!streamIds.length) {
    return new Response("No streams found", { status: 404 });
  }

  const recentStreamId = streamIds.at(-1);

  if (!recentStreamId) {
    return new Response("No recent stream found", { status: 404 });
  }

  const emptyDataStream = createDataStream({
    execute: () => {},
  });

  // const stream = await streamContext.resumableStream(recentStreamId, () => emptyDataStream);

  /*
   * For when the generation is streaming during SSR
   * but the resumable stream has concluded at this point.
   */
  if (!stream) {
    const messages = await getMessagesByChatId({ id: chatId });
    const mostRecentMessage = messages.at(-1);

    if (!mostRecentMessage) {
      return new Response(emptyDataStream, { status: 200 });
    }

    if (mostRecentMessage.role !== "assistant") {
      return new Response(emptyDataStream, { status: 200 });
    }

    const messageCreatedAt = new Date(mostRecentMessage.createdAt);

    if (differenceInSeconds(resumeRequestedAt, messageCreatedAt) > 15) {
      return new Response(emptyDataStream, { status: 200 });
    }

    const restoredStream = createDataStream({
      execute: (buffer) => {
        buffer.writeData({
          type: "append-message",
          message: JSON.stringify(mostRecentMessage),
        });
      },
    });

    return new Response(restoredStream, { status: 200 });
  }

  return new Response(stream, { status: 200 });
});

chatRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const [selectedChat] = await getDbV3().select().from(chat).where(eq(chat.id, id));
    return c.json(selectedChat);
  } catch (e: any) {
    return c.json({ error: e.message, stack: e.stack }, 500);
  }
});

chatRouter.delete("/", async (c) => {
  const request = c.req.raw;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Forbidden", { status: 403 });
    }

    const deletedChat = await deleteChatById({ id });

    return Response.json(deletedChat, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("An error occurred while processing your request!", {
      status: 500,
    });
  }
});
