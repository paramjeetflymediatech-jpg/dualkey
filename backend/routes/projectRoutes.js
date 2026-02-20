import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  createProject,
  getProjectBySlug,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
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

router.get("/slug/:slug", getProjectBySlug);
router.get("/:id", protect, getProjectById);

router.put(
  "/:id",
  protect,
  requireRole(["admin"]),
  upload.array("image", 5),
  updateProject,
);

router.delete("/:id", protect, requireRole(["admin"]), deleteProject);

export default router;
