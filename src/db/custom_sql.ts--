import postgres from "postgres";

// Create a postgres instance to get its types
const sql_origin = postgres(process.env.MTM_DATABASE_URL!);
type PostgresType = typeof sql_origin;

// Create custom SQL function with the same type as postgres
const createCustomSql = (): PostgresType => {
  // Create a proxy to handle the template literal calls
  return new Proxy(sql, {
    apply: async (target, thisArg, args) => {
      const [strings, ...values] = args;

      // Combine the SQL string with values (using postgres.js style)
      const sqlText = strings.reduce((result, str, i) => {
        return result + str + (values[i] !== undefined ? `$${i + 1}` : "");
      }, "");

      // Here you can implement your custom HTTP API logic
      const response = await fetch("your-api-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: sqlText,
          parameters: values,
        }),
      });

      return response.json();
    },
  }) as PostgresType;
};

// Create an instance of your custom SQL function
const sql = createCustomSql();

// Example usage - this will have the same type hints as postgres.js
const demo = async () => {
  try {
    const result = await sql`
      SELECT * from list_site_hosts_json(
        p_site_id => ${123}
      )
    `;
    console.log(result);
  } catch (error) {
    console.error("Query error:", error);
  }
};

demo();
