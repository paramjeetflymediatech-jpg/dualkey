import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import sequelize from "./config/database.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import accessRoutes from "./routes/accessRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
  }),
);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());

// Serve static files
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/access", accessRoutes);

// Connect to Database based on Type
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const dbType = process.env.DB_TYPE || "mysql";
    if (dbType === "mysql") {
      await sequelize.sync({ alter: true });
      console.log("MySQL Database Connected & Synced");
    } else {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected");
    }

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} [${process.env.DB_TYPE || "mysql"}]`,
      );
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
