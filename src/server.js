<<<<<<< HEAD
// import "dotenv/config";

// import express from "express";
// import mysql from "mysql2/promise";
// import app from "./src/app.js/index.js";
// const PORT = process.env.PORT || 3000;
=======
import "dotenv/config";
import app from "./app.js/index.js";

const port = Number(process.env.PORT);
>>>>>>> c4e2f986a5de3aaefc7327a33f0cd442a9ce3f9b

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import "dotenv/config";
import app from "./server.js";
import db from "./src/config/database.js";

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