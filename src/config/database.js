import "dotenv/config";
import mysql from "mysql2/promise";

const databaseConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0
};

const db = mysql.createPool(databaseConfig);

try {
  const connection = await db.getConnection();
  console.log("Database connected successfully");
  connection.release();
} catch (error) {
  console.error("Database connection failed:", error.message);
}

export default db;