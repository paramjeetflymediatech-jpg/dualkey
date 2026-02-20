import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const createDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "root",
    });

    const dbName = process.env.DB_NAME || "dualkey_db";

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' created or already exists.`);

    await connection.end();
    process.exit();
  } catch (error) {
    console.error("Error creating database:", error);
    process.exit(1);
  }
};

createDB();
