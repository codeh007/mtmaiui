import { eq } from "drizzle-orm";
import { adkEvents } from "../../db/schema";
import { createRouter } from "../agent_api/lib/createApp";
export const eventRouter = createRouter();

eventRouter.get("/list", async (c) => {
  const sessionId = c.req.query("session_id");
  if (!sessionId) {
    return c.json({ error: "session_id is required" }, 400);
  }
  try {
    const result = await getDbV3()
      .select({
        id: adkEvents.id,
        appName: adkEvents.appName,
        userId: adkEvents.userId,
        sessionId: adkEvents.sessionId,
        author: adkEvents.author,
        // branch: adkEvents.branch,
        // timestamp: adkEvents.timestamp,
        // content: adkEvents.content,
        // actions: adkEvents.actions,
      })
      .from(adkEvents)
      .where(eq(adkEvents.id, sessionId))
      .limit(10);
    return c.json({
      rows: result,
    });
  } catch (e: any) {
    console.error("Database error:", e);
    return c.json({ error: e.message, stack: e.stack }, 500);
  }
});
