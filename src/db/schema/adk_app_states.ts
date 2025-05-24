import type { InferSelectModel } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const adkAppStates = pgTable("adk_app_states", {
  appName: text("app_name").primaryKey(),
  state: jsonb("state").notNull().default("{}"),
  updateTime: timestamp("update_time").notNull().defaultNow(),
});

export type AdkAppStates = InferSelectModel<typeof adkAppStates>;
