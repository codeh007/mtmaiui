import type { InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const blogPost = pgTable("blog_post", {
  id: uuid("id").notNull().defaultRandom(),
  createdAt: timestamp("created_at").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  kind: text("kind", { enum: ["text", "code", "image", "sheet"] })
    .notNull()
    .default("text"),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
});

export type BlogPost = InferSelectModel<typeof blogPost>;
