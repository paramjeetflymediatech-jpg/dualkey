import express from "express";
import {
  getAllBrochures,
  createBrochure,
  deleteBrochure,
} from "../controllers/brochureController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllBrochures);
router.post(
  "/",
  protect,
  requireRole(["admin"]),
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createBrochure,
);
router.delete("/:id", protect, requireRole(["admin"]), deleteBrochure);

export default router;
