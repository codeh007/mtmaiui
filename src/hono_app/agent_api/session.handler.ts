import postgres from "postgres";
import { createRouter } from "../agent_api/lib/createApp";

export const agentSessionRouter = createRouter().get("/list", async (c) => {
  const sqlfunctionName = "list_agents_json";
  const limit = Number(c.req.query("limit")) || 10;
  const offset = Number(c.req.query("offset")) || 0;

  try {
    const sql = postgres(c.env.HYPERDRIVE.connectionString);
    const res = await sql`SELECT * from ${sql(sqlfunctionName)}(${limit}, ${offset})`;

    //sql`SELECT * from ${sql(sqlfunctionName)}(
    //   p_limit  => ${limit},
    //   p_offset => ${offset}
    // )`);
    if (res[0]?.[sqlfunctionName]) {
      return c.json(res[0]?.[sqlfunctionName]);
    }
    return c.json({
      data: [],
    });
  } catch (e: any) {
    console.error("agentSessionRouter, Database error:", e);
    return c.json({ error: e.message, stack: e.stack }, 500);
  }
});
