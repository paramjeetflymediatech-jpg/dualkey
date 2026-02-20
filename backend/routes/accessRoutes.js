import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  requestAccess,
  getAccessRequests,
  approveAccess,
} from "../controllers/accessController.js";

const router = express.Router();

router.post("/", protect, requestAccess);
router.get("/requests", protect, requireRole(["admin"]), getAccessRequests);
router.put("/:id/approve", protect, requireRole(["admin"]), approveAccess);

export default router;
