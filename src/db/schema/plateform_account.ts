import { type InferSelectModel, sql } from "drizzle-orm";
import { jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const plateformAccount = pgTable(
  "plateform_account",
  {
    id: text("id").notNull().default(sql`gen_random_uuid()`),
    state: jsonb("state").notNull().default("{}"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (t) => [
    {
      compositePK: primaryKey({
        columns: [t.id],
      }),
    },
  ],
);

export type PlateformAccount = InferSelectModel<typeof plateformAccount>;
