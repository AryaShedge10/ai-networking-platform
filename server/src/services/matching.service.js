import Onboarding from "../models/Onboarding.js";
import mongoose from "mongoose";

/**
 * Fetch all completed onboarding data for ML processing
 * Returns clean data structure for cosine similarity calculation
 * @returns {Promise<Array>} Array of user quiz data for ML
 */
export const fetchMatchingData = async () => {
  try {
    // Query only completed onboarding records
    // Exclude sensitive information - only return userId and quizAnswers
    const onboardingData = await Onboarding.find(
      { isCompleted: true },
      { userId: 1, quizAnswers: 1, _id: 0 }
    ).lean();

    // Transform Map to plain object for JSON serialization
    // ML service expects numeric values (0-3) for each question (1-10)
    const matchingData = onboardingData.map((record) => {
      const quizAnswersObj = {};

      // Convert Map to plain object with string keys and numeric values
      if (record.quizAnswers instanceof Map) {
        for (const [questionId, answerIndex] of record.quizAnswers) {
          quizAnswersObj[questionId] = answerIndex;
        }
      } else {
        // Handle case where quizAnswers is already an object
        Object.assign(quizAnswersObj, record.quizAnswers);
      }

      return {
        userId: record.userId.toString(),
        quizAnswers: quizAnswersObj,
      };
    });

    return matchingData;
  } catch (error) {
    console.error("Error fetching matching data:", error);
    throw new Error("Failed to fetch matching data");
  }
};

/**
 * Store/log matching results from ML service
 * Currently logs results - can be extended to store in database
 * @param {string} sourceUserId - User ID who got matches
 * @param {Array} matches - Array of match objects with userId and similarityScore
 * @returns {Promise<boolean>} Success status
 */
export const storeMatchingResults = async (sourceUserId, matches) => {
  try {
    // Validate sourceUserId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(sourceUserId)) {
      throw new Error("Invalid source user ID");
    }

    // Validate matches array structure
    if (!Array.isArray(matches)) {
      throw new Error("Matches must be an array");
    }

    // Validate each match object
    for (const match of matches) {
      if (!match.userId || !mongoose.Types.ObjectId.isValid(match.userId)) {
        throw new Error("Invalid match user ID");
      }

      if (
        typeof match.similarityScore !== "number" ||
        match.similarityScore < 0 ||
        match.similarityScore > 1
      ) {
        throw new Error("Invalid similarity score - must be between 0 and 1");
      }
    }

    // Log the matching results for development/debugging
    console.log(`🤖 ML Matching Results Received:`);
    console.log(`   Source User: ${sourceUserId}`);
    console.log(`   Matches Found: ${matches.length}`);

    matches.forEach((match, index) => {
      console.log(
        `   ${index + 1}. User ${match.userId} - Score: ${(
          match.similarityScore * 100
        ).toFixed(1)}%`
      );
    });

    // TODO: In production, store results in a dedicated Matches collection
    // Example schema: { sourceUserId, targetUserId, similarityScore, createdAt }
    // This would enable features like:
    // - Match history tracking
    // - Filtering already seen matches
    // - Analytics on matching success rates
    // - Caching for performance

    return true;
  } catch (error) {
    console.error("Error storing matching results:", error);
    throw error;
  }
};

/**
 * Get user matches (placeholder for future implementation)
 * Will be used to retrieve and filter stored matches
 * @param {string} userId - User ID to get matches for
 * @returns {Promise<Array>} Array of user matches
 */
export const getUserMatchesData = async (userId) => {
  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    // TODO: Implement match retrieval from database
    // This will query the Matches collection and return:
    // - Filtered matches above threshold (75%)
    // - User profile data for each match
    // - Exclude already connected users
    // - Sort by similarity score

    console.log(`📊 Fetching matches for user: ${userId}`);

    // Placeholder return - in production this will return actual stored matches
    return [];
  } catch (error) {
    console.error("Error fetching user matches:", error);
    throw new Error("Failed to fetch user matches");
  }
};
