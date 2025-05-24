import { type InferSelectModel, sql } from "drizzle-orm";
import { jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const adkSessions = pgTable(
  "adk_sessions",
  {
    app_name: text("app_name").notNull(),
    user_id: text("user_id").notNull(),
    id: text("id").notNull().default(sql`gen_random_uuid()`),
    state: jsonb("state").notNull().default("{}"),
    create_time: timestamp("create_time").notNull().defaultNow(),
    update_time: timestamp("update_time").notNull().defaultNow(),
    // 在 google adk session 基础上扩展
    title: text("title").notNull().default("no title"),
  },
  (t) => [
    {
      compositePK: primaryKey({
        columns: [t.app_name, t.user_id, t.id],
      }),
    },
  ],
);

export type AdkSessions = InferSelectModel<typeof adkSessions>;
