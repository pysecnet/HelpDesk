import express from "express";
import { askAI, addQA } from "../controllers/assistantController.js";
import protect from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// AI Assistant - PUBLIC (no authentication required)
router.post("/ask", askAI);

// Add Q&A - ADMIN ONLY
router.post("/add", protect, adminOnly, addQA);

export default router;
