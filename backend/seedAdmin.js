import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import sequelize from "./config/database.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await sequelize.sync(); // Ensure tables exist

    const adminEmail = "admin@dualkey.com";
    const adminPassword = "admin123";

    const [user, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        name: "Admin User",
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        role: "admin",
        isApproved: true,
      },
    });

    if (!created) {
      // If user exists, ensure they are admin
      user.role = "admin";
      user.isApproved = true;
      user.password = await bcrypt.hash(adminPassword, 10); // Reset password to ensure access
      await user.save();
      console.log("Admin user updated successfully");
    } else {
      console.log("Admin user created successfully");
    }

    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
