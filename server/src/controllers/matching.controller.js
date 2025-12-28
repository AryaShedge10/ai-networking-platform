import { validationResult } from "express-validator";
import {
  findUserMatches,
  getMatchingStats,
} from "../services/matching.service.js";

/**
 * @desc    Get matches for current user
 * @route   GET /api/matching/:userId
 * @access  Private
 */
export const getUserMatches = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { userId } = req.params;

    // Verify user is requesting their own matches or is admin
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own matches.",
      });
    }

    // Find matches using cosine similarity
    const matches = await findUserMatches(userId);

    // Get matching statistics for debugging
    const stats = await getMatchingStats(userId);

    res.status(200).json({
      success: true,
      message: "Matches retrieved successfully",
      data: {
        userId,
        matches,
        count: matches.length,
        stats,
      },
    });
  } catch (error) {
    console.error("Error in getUserMatches:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve matches",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get matching data for ML processing (legacy endpoint)
 * @route   GET /api/matching/data
 * @access  Private
 */
export const getMatchingData = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message:
        "This endpoint is deprecated. Matching is now handled internally.",
      data: {
        note: "Use GET /api/matching/:userId to get user matches",
      },
    });
  } catch (error) {
    console.error("Error in getMatchingData:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @desc    Receive matching results (legacy endpoint)
 * @route   POST /api/matching/results
 * @access  Public
 */
export const receiveMatchingResults = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message:
        "This endpoint is deprecated. Matching is now handled internally.",
      data: {
        note: "Use GET /api/matching/:userId to get user matches",
      },
    });
  } catch (error) {
    console.error("Error in receiveMatchingResults:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
