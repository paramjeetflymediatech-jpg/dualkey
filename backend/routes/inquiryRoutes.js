import express from "express";
import {
  createInquiry,
  getInquiries,
} from "../controllers/inquiryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", createInquiry);
router.get("/", protect, requireRole(["admin"]), getInquiries);

export default router;
