import { PGlite } from "@electric-sql/pglite";
import { type PgliteDatabase, drizzle } from "drizzle-orm/pglite";

let instance: PgliteDatabase<Record<string, never>> | null = null;

export function getPgliteBrowserClient() {
  if (!instance) {
    const client = new PGlite("idb://my-pgdata4");
    const db = drizzle(client);
    instance = db;
  }
  return instance;
}
