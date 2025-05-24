import postgres from "postgres";

// Create a postgres instance to get its types
const sql = postgres(process.env.MTM_DATABASE_URL!);
type PostgresType = typeof sql;

// Helper type for function parameters
interface FunctionParams {
  [key: string]: { value: any; type?: string };
}

// Helper function to build function parameters
const buildFunctionParams = (params: FunctionParams): string => {
  return Object.entries(params)
    .map(([key, { value, type }]) => {
      const typecast = type ? `::${type}` : "";
      return `${key} => ${value}${typecast}`;
    })
    .join(",\n    ");
};

// Create custom SQL function with the same type as postgres
const createCustomSql = (): PostgresType => {
  // Create a proxy to handle the template literal calls
  return new Proxy(sql, {
    apply: async (target, thisArg, args) => {
      const [strings, ...values] = args;

      // Here you can implement your custom HTTP API logic
      const response = await fetch("your-api-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: strings.join("?"),
          parameters: values,
        }),
      });

      return response.json();
    },
  }) as PostgresType;
};

// Create an instance of your custom SQL function
const customSql = createCustomSql();

// Example usage with dynamic parameters
const demo = async () => {
  try {
    // Example 1: Simple function call
    const functionName = "list_site_hosts_json";
    const result1 = await customSql`SELECT * from ${sql(functionName)}(
      p_site_id => ${123}::integer
    )`;

    // Example 2: Dynamic parameters
    const params: FunctionParams = {
      p_site_id: { value: 123, type: "integer" },
      p_host: { value: "example.com", type: "text" },
      p_active: { value: true, type: "boolean" },
    };

    const result2 = await customSql`
      SELECT * from upsert_site_host(
        ${sql(buildFunctionParams(params))}
      )
    `;

    console.log(result1, result2);
  } catch (error) {
    console.error("Query error:", error);
  }
};

demo();
