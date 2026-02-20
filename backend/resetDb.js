import sequelize from "./config/database.js";
import "./models/sql/index.js"; // Initialize models

const resetDb = async () => {
  try {
    console.log("Dropping all tables...");
    // force: true drops tables before recreating them
    await sequelize.sync({ force: true });
    console.log("All tables dropped and recreated successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to reset database:", error);
    process.exit(1);
  }
};

resetDb();
