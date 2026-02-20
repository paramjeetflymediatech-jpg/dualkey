import mysql from "mysql2/promise";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import "./models/sql/index.js"; // Import to register models with Sequelize

dotenv.config();

const setupMysql = async () => {
  const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

  console.log("Starting MySQL Setup...");

  try {
    // 1. Create Database if it doesn't exist
    const connection = await mysql.createConnection({
      host: DB_HOST || "localhost",
      user: DB_USER || "root",
      password: DB_PASS || "root",
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME || "dualkey_db"}\`;`,
    );
    console.log(
      `Database '${DB_NAME || "dualkey_db"}' created or already exists.`,
    );
    await connection.end();

    // 2. Sync Sequelize Models (Create Tables)
    console.log("Syncing tables...");
    await sequelize.authenticate();
    console.log("Sequelize authenticated.");

    // 'alter: true' adds missing columns/tables without dropping data
    // 'force: true' would drop everything and recreate (use with caution)
    await sequelize.sync({ alter: true });

    console.log("All MySQL tables created/updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("MySQL Setup Failed:", error);
    process.exit(1);
  }
};

setupMysql();
