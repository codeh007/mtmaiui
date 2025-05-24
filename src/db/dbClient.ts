// import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
// import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { cache } from "react";
// let globalInstance: ReturnType<typeof drizzle> | undefined;
// let globalPool: postgres.Sql | undefined;

// export function getDbV3() {
//   if (globalInstance) {
//     return globalInstance;
//   }

//   const connStr = process.env.MTM_DATABASE_URL;
//   if (!connStr) {
//     throw new Error("MTM_DATABASE_URL is not defined");
//   }

//   // Create connection pool
//   const pool = postgres(connStr, {
//     max: 5, // Maximum number of connections
//     idle_timeout: 20, // Idle connection timeout in seconds
//     connect_timeout: 10, // Connection timeout in seconds
//   });

//   globalPool = pool;
//   const db = drizzle(pool);
//   globalInstance = db;

//   return db;
// }

// Cleanup function to close the pool when needed
// export async function closeDbPool() {
//   if (globalPool) {
//     await globalPool.end();
//     globalPool = undefined;
//     globalInstance = undefined;
//   }
// }

let sqlInstance: ReturnType<typeof postgres> | undefined = undefined;
// export function getSql() {
//   if (globalThis.env) {
//     // cloudflare worker
//     console.log(
//       "globalThis.env.HYPERDRIVE.connectionString",
//       globalThis.env.HYPERDRIVE.connectionString,
//     );
//     sqlInstance = postgres(globalThis.env.HYPERDRIVE.connectionString, {
//       // max: 5, // Maximum number of connections
//       // idle_timeout: 20, // Idle connection timeout in seconds
//       // connect_timeout: 10, // Connection timeout in seconds
//     });
//     return sqlInstance!;
//   }
//   // if (sqlInstance) {
//   //   return sqlInstance!;
//   // }
//   sqlInstance = postgres(
//     process.env.MTM_DATABASE_URL!,
//     //   {
//     //   max: 5, // Maximum number of connections
//     //   idle_timeout: 20, // Idle connection timeout in seconds
//     //   connect_timeout: 10, // Connection timeout in seconds
//     // }
//   );
//   return sqlInstance!;
// }

export function setupPostgres(conn: string) {
  sqlInstance = postgres(conn, {
    max: 5, // Maximum number of connections
    idle_timeout: 20, // Idle connection timeout in seconds
    connect_timeout: 10, // Connection timeout in seconds
  });
}

//lib/db.ts
// import { drizzle } from "drizzle-orm/node-postgres";
// // You can use cache from react to cache the client during the same request
// // this is not mandatory and only has an effect for server components
// import { cache } from "react";
// import * as schema from "./schema/pg";
// import { Pool } from "pg";

// initOpenNextCloudflareForDev();

export const getDb = cache(() => {
  // const { env } = getCloudflareContext();
  // if (env.HYPERDRIVE) {
  //   return postgres(env.HYPERDRIVE.connectionString, {
  //     max: 5, // Maximum number of connections
  //     idle_timeout: 20, // Idle connection timeout in seconds
  //     connect_timeout: 10, // Connection timeout in seconds
  //   });
  // }
  return postgres(process.env.MTM_DATABASE_URL!, {
    max: 5, // Maximum number of connections
    idle_timeout: 20, // Idle connection timeout in seconds
    connect_timeout: 10, // Connection timeout in seconds
  });
});

export const getSql = cache(() => {
  return getDb() as postgres.Sql<Record<string, unknown>>;
});

// export const sql = getDb() as postgres.Sql<Record<string, unknown>>;
