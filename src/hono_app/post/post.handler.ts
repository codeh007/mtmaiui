import { getDbV3 } from "@mtmaiui/db/queries";
import { sql } from "drizzle-orm";
import { createRouter } from "../agent_api/lib/createApp";
export const postRouter = createRouter();

postRouter.get("/list", async (c) => {
  const res = await getDbV3().execute(sql`SELECT * from post`);
  return c.json(res);
});
/**
 * 提交任务
 */
postRouter.post("/submit_post", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.task_type) {
      return c.json({ error: "task_type is required" }, 400);
    }
    const res = await getDbV3().execute(sql`SELECT * from taskmq_submit(
      p_task_type  => ${body.task_type}::text,
      p_input      => ${JSON.stringify(body)}::jsonb
    )`);
    return c.json(res);
  } catch (e: any) {
    console.error("MQ error:", e);
    return c.json({ error: e.message, stack: e.stack }, 500);
  }
});
