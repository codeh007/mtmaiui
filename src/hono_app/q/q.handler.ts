import { getDb } from "@mtmaiui/db/dbClient";
import { Hono } from "hono";
export const queryRoute = new Hono<{ Bindings: Env }>();

queryRoute.get("/q/:function_name", async (c) => {
  const function_name = c.req.param("function_name");
  const params = JSON.parse(c.req.query("params") || "{}");
  console.log(function_name, params);
  try {
    const sql = getDb();
    if (Object.keys(params).length === 0) {
      const list = await sql`SELECT * from ${sql(function_name)}()`;
      return c.json(list.at(0)?.[function_name]);
    }
    const list = await sql`SELECT * from ${sql(function_name)}(
      ${Object.keys(params)
        .map((key) => {
          const value = params[key];
          return sql.unsafe(`${sql(key)} => ${sql.unsafe(value)}`);
        })
        .join(",")}
    )`;
    return c.json(list.at(0)?.[function_name]);
  } catch (error: any) {
    console.error(error);
    return c.json({ error: "Failed to query sites", stack: error.stack }, 500);
  }
});

/**创建 site */
queryRoute.post("/q", async (c) => {
  const body = await c.req.json();
  try {
    const sql = getDb();
    const res = await sql`SELECT * from upsert_site(
      p_title => ${body.title}::text,
      p_host => ${body.host}::text
    )`;
    const item = res?.at(0);
    return c.json({
      item,
    });
  } catch (error) {
    console.error(error);

    return c.json({ error: "Failed to create site" }, 500);
  }
});
