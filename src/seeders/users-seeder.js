import bcrypt from "bcryptjs";
import db from "../config/database.js";

const ADMIN_USER = {
  name: "Admin",
  email: "admin@gmail.com",
  username: "admin",
  password: "admin@123"
};

const seedAdminUser = async () => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const passwordHash = await bcrypt.hash(ADMIN_USER.password, 10);

    await connection.execute(
      `INSERT INTO users (name, email, username, password, is_active)
       VALUES (?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         username = VALUES(username),
         password = VALUES(password),
         is_active = VALUES(is_active),
         deleted_at = NULL,
         updated_at = CURRENT_TIMESTAMP`,
      [ADMIN_USER.name, ADMIN_USER.email, ADMIN_USER.username, passwordHash]
    );

    await connection.commit();
    console.log(`Seeded user: ${ADMIN_USER.email}`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await db.end();
  }
};

seedAdminUser().catch((error) => {
  console.error("User seeding failed:", error.message);
  process.exit(1);
});
