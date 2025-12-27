import express from "express";
import {
  getMatchingData,
  receiveMatchingResults,
  getUserMatches,
} from "../controllers/matching.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// PART 1: Send onboarding data to ML service
// GET /api/matching/data - Fetch data for ML processing
// This endpoint provides clean quiz data for cosine similarity calculation
// Returns only userId and numeric quizAnswers (no sensitive data)
router.get("/data", authenticateToken, getMatchingData);

// PART 2: Receive similarity results from ML service
// POST /api/matching/results - Receive ML results
// ML service sends back similarity scores for user matching
// This endpoint stores/logs results for later filtering and chat initiation
router.post("/results", receiveMatchingResults);

// PART 3: Get user matches with filtering
// GET /api/matching/:userId - Get filtered matches for user
// Returns processed matches for frontend display
router.get("/:userId", authenticateToken, getUserMatches);

export default router;