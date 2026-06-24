import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const splitSqlStatements = (sql) => {
  return sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
};

const createMigrationTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      migration_name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_schema_migrations_migration_name (migration_name)
    )
  `);
};

const getExecutedMigrations = async (connection) => {
  const [rows] = await connection.execute("SELECT migration_name FROM schema_migrations");
  return new Set(rows.map((row) => row.migration_name));
};

const runMigrationFile = async (connection, migrationFile) => {
  const filePath = path.join(__dirname, migrationFile);
  const sql = await readFile(filePath, "utf8");
  const statements = splitSqlStatements(sql);

  for (const statement of statements) {
    await connection.execute(statement);
  }
};

const runMigrations = async () => {
  const connection = await db.getConnection();

  try {
    await createMigrationTable(connection);

    const executedMigrations = await getExecutedMigrations(connection);
    const migrationFiles = (await readdir(__dirname))
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const migrationFile of migrationFiles) {
      if (executedMigrations.has(migrationFile)) {
        console.log(`Skipped ${migrationFile}`);
        continue;
      }

      await connection.beginTransaction();

      try {
        await runMigrationFile(connection, migrationFile);
        await connection.execute(
          "INSERT INTO schema_migrations (migration_name) VALUES (?)",
          [migrationFile]
        );
        await connection.commit();
        console.log(`Executed ${migrationFile}`);
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    }

    console.log("Migrations completed successfully");
  } finally {
    connection.release();
    await db.end();
  }
};

runMigrations().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
