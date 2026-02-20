import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController.js";

const router = express.Router();

router.get("/", getGalleryItems);
router.post(
  "/",
  protect,
  requireRole(["admin"]),
  upload.single("image"),
  createGalleryItem,
);
router.delete("/:id", protect, requireRole(["admin"]), deleteGalleryItem);

export default router;
