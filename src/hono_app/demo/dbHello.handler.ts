import { getSql } from "@mtmaiui/db/dbClient";
import { createRouter } from "../agent_api/lib/createApp";

export const dbHelloRouter = createRouter();

dbHelloRouter.get("/1", async (c) => {
  try {
    const sql = await getSql();
    const chatMessages = await sql`select * from chat_message_v2 limit 10`;
    return c.json({
      rows: chatMessages,
    });
  } catch (e: any) {
    return c.json({
      error: e,
      stack: e.stack,
    });
  }
});
