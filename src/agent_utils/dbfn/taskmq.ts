import postgres from "postgres";

export async function taskmq_submit(dbConnStr: string, task_type: string, input: any) {
  const sql = postgres(dbConnStr, {
    // Limit the connections for the Worker request to 5 due to Workers' limits on concurrent external connections
    max: 5,
    // If you are not using array types in your Postgres schema, disable `fetch_types` to avoid an additional round-trip (unnecessary latency)
    fetch_types: false,
  });

  return await sql`SELECT * from taskmq_submit(
      p_task_type  => ${task_type}::text,
      p_input      => ${JSON.stringify(input)}::jsonb
  )`;
}

export async function get_taskmq_result(dbConnStr: string, task_id: string) {
  const sql = postgres(dbConnStr, {
    // Limit the connections for the Worker request to 5 due to Workers' limits on concurrent external connections
    max: 5,
    // If you are not using array types in your Postgres schema, disable `fetch_types` to avoid an additional round-trip (unnecessary latency)
    fetch_types: false,
  });

  // try {
  //   // A very simple test query
  //   const result = await sql`select * from pg_tables`;

  //   // Clean up the client, ensuring we don't kill the worker before that is
  //   // completed.
  //   ctx.waitUntil(sql.end());

  //   // Return result rows as JSON
  //   return Response.json({ success: true, result: result });
  // } catch (e: any) {
  //   console.error("Database error:", e.message);

  //   return Response.error();
  // }

  const result = await sql`SELECT * from get_taskmq_result(
      p_task_id  => ${task_id}::uuid
  )`;

  // await sql.end();

  return result?.at(0)?.get_taskmq_result;
}
