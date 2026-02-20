import dotenv from "dotenv";
import User from "./models/User.js";
import sequelize from "./config/database.js";

dotenv.config();

const checkAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    const adminEmail = "admin@dualkey.com";
    const user = await User.findOne({ where: { email: adminEmail } });

    if (user) {
      console.log("Admin User FOUND:");
      console.log(`ID: ${user.id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Is Approved: ${user.isApproved}`);
    } else {
      console.log("Admin User NOT FOUND in database.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error checking admin:", error);
    process.exit(1);
  }
};

checkAdmin();
