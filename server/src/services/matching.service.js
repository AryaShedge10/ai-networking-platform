import Onboarding from "../models/Onboarding.js";
import User from "../models/User.js";
import Match from "../models/Match.js";

const MATCH_THRESHOLD = 0.75;

/**
 * Calculate cosine similarity between two vectors
 * @param {Array} vectorA - First vector
 * @param {Array} vectorB - Second vector
 * @returns {number} - Cosine similarity score (0-1)
 */
function calculateCosineSimilarity(vectorA, vectorB) {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Convert quiz answers to normalized vector
 * @param {Map} quizAnswers - Quiz answers map
 * @returns {Array} - Normalized vector of 10 elements
 */
function quizAnswersToVector(quizAnswers) {
  const vector = [];

  // Convert quiz answers to ordered array (Q1 to Q10)
  for (let i = 1; i <= 10; i++) {
    const answer = quizAnswers.get(i.toString()) || 0;
    // Normalize: divide by 3 to get values between 0 and 1
    vector.push(answer / 3);
  }

  return vector;
}

/**
 * Find matches for a specific user using cosine similarity
 * @param {string} userId - User ID to find matches for
 * @returns {Array} - Array of matched users with similarity scores
 */
export async function findUserMatches(userId) {
  try {
    // FIX: First check if matches already exist in database
    const existingMatches = await Match.findUserMatches(userId);

    if (existingMatches.length > 0) {
      console.log(
        `📋 Found ${existingMatches.length} existing matches for user ${userId}`
      );

      // FIX: Filter for mutual matches only - show match only if both A→B and B→A exist
      const mutualMatches = [];

      for (const match of existingMatches) {
        const otherUserId =
          match.userA._id.toString() === userId
            ? match.userB._id
            : match.userA._id;

        // Check if reverse match exists (mutual matching)
        const reverseMatch = await Match.findOne({
          $or: [
            { userA: otherUserId, userB: userId },
            { userA: userId, userB: otherUserId },
          ],
        }).populate("userA userB", "name");

        if (reverseMatch) {
          const otherUser =
            match.userA._id.toString() === userId ? match.userB : match.userA;
          mutualMatches.push({
            userId: otherUser._id,
            name: otherUser.name,
            similarityScore: match.similarityScore,
          });
        }
      }

      console.log(
        `🤝 Found ${mutualMatches.length} mutual matches out of ${existingMatches.length} total matches`
      );
      return mutualMatches;
    }

    console.log(`🧮 Computing new matches for user ${userId}`);

    // Get the user's onboarding data
    const userOnboarding = await Onboarding.findOne({
      userId,
      isCompleted: true,
    });

    if (!userOnboarding) {
      throw new Error("User onboarding not found or not completed");
    }

    // Get all other completed onboardings
    const allOnboardings = await Onboarding.find({
      userId: { $ne: userId },
      isCompleted: true,
    }).populate("userId", "name");

    if (allOnboardings.length === 0) {
      return [];
    }

    // Convert user's quiz answers to vector
    const userVector = quizAnswersToVector(userOnboarding.quizAnswers);

    // Calculate similarities and store matches
    const matches = [];
    const matchesToStore = [];

    for (const otherOnboarding of allOnboardings) {
      const otherVector = quizAnswersToVector(otherOnboarding.quizAnswers);
      const similarity = calculateCosineSimilarity(userVector, otherVector);

      // Only include matches above threshold
      if (similarity >= MATCH_THRESHOLD) {
        const roundedSimilarity = Math.round(similarity * 100) / 100;

        matches.push({
          userId: otherOnboarding.userId._id,
          name: otherOnboarding.userId.name,
          similarityScore: roundedSimilarity,
        });

        // Prepare for database storage
        matchesToStore.push({
          userA: userId,
          userB: otherOnboarding.userId._id,
          similarityScore: roundedSimilarity,
        });
      }
    }

    // FIX: Store matches in database for future retrieval
    if (matchesToStore.length > 0) {
      console.log(`💾 Storing ${matchesToStore.length} matches in database`);

      // Use Promise.all to store matches concurrently
      await Promise.all(
        matchesToStore.map((match) =>
          Match.upsertMatch(match.userA, match.userB, match.similarityScore)
        )
      );

      // FIX: After storing, filter for mutual matches only
      const mutualMatches = [];

      for (const match of matches) {
        // Check if reverse match exists (other user also matches with current user)
        const reverseMatch = await Match.findOne({
          $or: [
            { userA: match.userId, userB: userId },
            { userA: userId, userB: match.userId },
          ],
        });

        if (reverseMatch) {
          mutualMatches.push(match);
        }
      }

      console.log(
        `🤝 Found ${mutualMatches.length} mutual matches out of ${matches.length} computed matches`
      );

      // Sort mutual matches by similarity score (highest first) and limit to top 10
      mutualMatches.sort((a, b) => b.similarityScore - a.similarityScore);
      return mutualMatches.slice(0, 10);
    }

    // Sort by similarity score (highest first) and limit to top 10
    matches.sort((a, b) => b.similarityScore - a.similarityScore);
    return matches.slice(0, 10);
  } catch (error) {
    console.error("Error finding user matches:", error);
    throw error;
  }
}

/**
 * Get matching statistics for debugging
 * @param {string} userId - User ID
 * @returns {Object} - Statistics about matching process
 */
export async function getMatchingStats(userId) {
  try {
    const totalUsers = await Onboarding.countDocuments({
      userId: { $ne: userId },
      isCompleted: true,
    });

    const matches = await findUserMatches(userId);

    return {
      totalPotentialMatches: totalUsers,
      matchesFound: matches.length,
      threshold: MATCH_THRESHOLD,
      averageSimilarity:
        matches.length > 0
          ? matches.reduce((sum, match) => sum + match.similarityScore, 0) /
            matches.length
          : 0,
    };
  } catch (error) {
    console.error("Error getting matching stats:", error);
    throw error;
  }
}
