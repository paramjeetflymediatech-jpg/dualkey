import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

import { upload } from "../middleware/uploadMiddleware.js";

router.post(
  "/",
  protect,
  requireRole(["admin"]),
  upload.single("image"),
  createPost,
);
router.put(
  "/:id",
  protect,
  requireRole(["admin"]),
  upload.single("image"),
  updatePost,
);
router.delete("/:id", protect, requireRole(["admin"]), deletePost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);

export default router;
