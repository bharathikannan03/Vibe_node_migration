import "dotenv/config";
import app from "./app.js/index.js";
import db from "./config/database.js";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
})();
