import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
config({
  path: "../../../gomtm/env/dev.env",
});

const runMigrate = async () => {
  if (!process.env.MTMAG_DATABASE_URL) {
    throw new Error("MTMAG_DATABASE_URL is not defined");
  }
  console.log("MTMAG_DATABASE_URL:", process.env.MTMAG_DATABASE_URL);

  const connection = postgres(
    `${process.env.MTMAG_DATABASE_URL}?sslmode=require`,
    {
      max: 3,
    },
  );
  const db = drizzle(connection);

  console.log("⏳ Running migrations...");

  const start = Date.now();
  try {
    // console.log("db", db);
    await migrate(db, {
      // migrationsSchema: "./src/db/schema/index.ts",
      migrationsFolder: "./src/db/migrations",
    });
  } catch (e) {
    console.error("❌ Migration failed", e);
    process.exit(1);
  }
  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed", err);
  process.exit(1);
});
