import type { InferSelectModel } from "drizzle-orm";
import { jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const adkUserStates = pgTable(
  "adk_user_states",
  {
    appName: text("app_name").notNull(),
    userId: text("user_id").notNull(),
    state: jsonb("state").notNull().default("{}"),
    updateTime: timestamp("update_time").notNull().defaultNow(),
  },
  (t) => [
    {
      compositePK: primaryKey({
        columns: [t.appName, t.userId],
      }),
    },
  ],
);

export type AdkUserStates = InferSelectModel<typeof adkUserStates>;
