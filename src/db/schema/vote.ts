import type { InferSelectModel } from "drizzle-orm";

import { boolean, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { chat } from "./chat";
import { chatMessage } from "./message";

export const vote = pgTable(
  "vote",
  {
    chatId: uuid("chat_id")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("message_id")
      .notNull()
      .references(() => chatMessage.id),
    isUpvoted: boolean("is_upvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;
