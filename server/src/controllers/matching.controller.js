import {
  fetchMatchingData,
  storeMatchingResults,
  getUserMatchesData,
} from "../services/matching.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Get matching data for ML processing
 * GET /api/matching/data
 *
 * This endpoint provides clean onboarding data to the ML service (Rishika)
 * Returns only userId and quizAnswers for cosine similarity calculation
 * Excludes sensitive information like email, password, name
 *
 * Response format:
 * [
 *   {
 *     "userId": "ObjectId",
 *     "quizAnswers": {
 *       "1": 0,
 *       "2": 3,
 *       "3": 1,
 *       ...
 *       "10": 2
 *     }
 *   }
 * ]
 */
export const getMatchingData = async (req, res, next) => {
  try {
    console.log("🔍 ML Service requesting matching data...");

    const matchingData = await fetchMatchingData();

    console.log(
      `✅ Returning ${matchingData.length} user records for ML processing`
    );

    return successResponse(res, 200, "Matching data retrieved successfully", {
      users: matchingData,
      count: matchingData.length,
      note: "Data prepared for cosine similarity calculation",
    });
  } catch (error) {
    console.error("Error in getMatchingData:", error);

    if (error.message === "Failed to fetch matching data") {
      return errorResponse(res, 500, "Unable to fetch matching data");
    }

    next(error);
  }
};

/**
 * Receive matching results from ML service
 * POST /api/matching/results
 *
 * This endpoint receives similarity results from the ML service
 * The ML service sends back calculated cosine similarity scores
 * Currently stores/logs results - will be extended for chat matching later
 *
 * Expected request body:
 * {
 *   "sourceUserId": "ObjectId",
 *   "matches": [
 *     {
 *       "userId": "ObjectId",
 *       "similarityScore": 0.87
 *     },
 *     {
 *       "userId": "ObjectId",
 *       "similarityScore": 0.79
 *     }
 *   ]
 * }
 */
export const receiveMatchingResults = async (req, res, next) => {
  try {
    const { sourceUserId, matches } = req.body;

    // Validate required fields
    if (!sourceUserId) {
      return errorResponse(res, 400, "sourceUserId is required");
    }

    if (!matches) {
      return errorResponse(res, 400, "matches array is required");
    }

    console.log(`🤖 Receiving ML results for user: ${sourceUserId}`);

    // Store/log the matching results
    await storeMatchingResults(sourceUserId, matches);

    console.log(`✅ ML results processed successfully`);

    return successResponse(res, 200, "Matching results received successfully", {
      sourceUserId,
      matchesProcessed: matches.length,
      note: "Results logged - ready for chat matching integration",
    });
  } catch (error) {
    console.error("Error in receiveMatchingResults:", error);

    if (
      error.message.includes("Invalid") ||
      error.message.includes("must be")
    ) {
      return errorResponse(res, 400, error.message);
    }

    next(error);
  }
};

/**
 * Get user matches with filtering
 * GET /api/matching/:userId
 *
 * This endpoint will return processed matches for a specific user
 * Currently a placeholder - will be implemented when chat system is ready
 * Will include filtering, user profile data, and match recommendations
 */
export const getUserMatches = async (req, res, next) => {
  try {
    const { userId } = req.params;

    console.log(`📊 Fetching matches for user: ${userId}`);

    const matches = await getUserMatchesData(userId);

    return successResponse(res, 200, "User matches retrieved successfully", {
      userId,
      matches,
      count: matches.length,
      note: "Match filtering and chat integration coming soon",
    });
  } catch (error) {
    console.error("Error in getUserMatches:", error);

    if (error.message === "Invalid user ID") {
      return errorResponse(res, 400, error.message);
    }

    if (error.message === "Failed to fetch user matches") {
      return errorResponse(res, 500, "Unable to fetch user matches");
    }

    next(error);
  }
};
