import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "dualkey_db",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "root",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: console.log,
  },
);

async function checkIndexes() {
  try {
    const [results] = await sequelize.query("SHOW INDEX FROM Users");
    console.log("Indexes on Users table:");
    for (const idx of results) {
      console.log(
        `- ${idx.Key_name} (${idx.Column_name}) ${idx.Non_unique === 0 ? "UNIQUE" : "INDEX"}`,
      );
      if (idx.Key_name !== "PRIMARY") {
        await sequelize.query(`Alter table users drop index ${idx.Key_name}`);
      }
    }
  } catch (err) {
    console.error("Error checking indexes:", err.message);
  } finally {
    await sequelize.close();
  }
}

checkIndexes();
