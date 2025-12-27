import Onboarding from "../models/Onboarding.js";

/**
 * Get quiz questions structure
 * @returns {Array} Array of quiz questions
 */
export const getQuizQuestions = () => {
  return Onboarding.getQuizQuestions();
};

/**
 * Update user's onboarding data with quiz answers
 * @param {string} userId - User ID
 * @param {Object} quizAnswers - Quiz answers object with question IDs as keys and selected options as values
 * @returns {Promise<Object>} Updated onboarding data
 */
export const updateOnboardingData = async (userId, quizAnswers) => {
  // Create or update onboarding record
  const onboarding = await Onboarding.findOneAndUpdate(
    { userId },
    {
      quizAnswers: new Map(Object.entries(quizAnswers)),
      isCompleted: true,
    },
    { new: true, upsert: true }
  );

  // Derive category values from quiz answers
  onboarding.deriveCategoriesFromAnswers();
  await onboarding.save();

  return onboarding.toJSON();
};

/**
 * Get user's onboarding data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User's onboarding data
 */
export const getUserOnboarding = async (userId) => {
  const onboarding = await Onboarding.findOne({ userId });

  if (!onboarding) {
    throw new Error("Onboarding data not found");
  }

  return onboarding.toJSON();
};

/**
 * Delete user's onboarding data
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteOnboardingData = async (userId) => {
  const result = await Onboarding.deleteOne({ userId });
  return result.deletedCount > 0;
};

/**
 * Get users with similar preferences for future matching
 * @param {string} category - Category to match (e.g., 'interests', 'communication')
 * @param {string} value - Value to match
 * @param {string} excludeUserId - User ID to exclude from results
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of similar users
 */
export const findSimilarUsers = async (
  category,
  value,
  excludeUserId,
  limit = 10
) => {
  const query = {
    userId: { $ne: excludeUserId },
    [category]: value,
  };

  const similarUsers = await Onboarding.find(query)
    .populate("userId", "name email reputationScore")
    .limit(limit)
    .sort({ createdAt: -1 });

  return similarUsers.map((onboarding) => onboarding.toJSON());
};
