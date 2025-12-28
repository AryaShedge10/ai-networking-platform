import express from "express";
import { param } from "express-validator";
import {
  getMatchingData,
  receiveMatchingResults,
  getUserMatches,
} from "../controllers/matching.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Validation for user ID parameter
const userIdValidation = [
  param("userId").isMongoId().withMessage("Invalid user ID format"),
];

// PART 1: Legacy endpoint for ML service compatibility
// GET /api/matching/data - Deprecated
router.get("/data", authenticateToken, getMatchingData);

// PART 2: Legacy endpoint for ML service compatibility
// POST /api/matching/results - Deprecated
router.post("/results", receiveMatchingResults);

// PART 3: Get user matches with cosine similarity (NEW IMPLEMENTATION)
// GET /api/matching/:userId - Get matches for user using internal cosine similarity
router.get("/:userId", authenticateToken, userIdValidation, getUserMatches);

export default router;
