import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  createProject,
  getProjectBySlug,
  getAllProjects,
} from "../controllers/projectController.js";

import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllProjects);

router.post(
  "/",
  protect,
  requireRole(["admin"]),
  upload.array("image", 5),
  createProject,
);

router.get("/:id", protect, getProjectBySlug);

export default router;
