import { validationResult } from "express-validator";
import {
  getQuizQuestions,
  updateOnboardingData,
  getUserOnboarding,
  findSimilarUsers,
} from "../services/onboarding.service.js";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "../utils/response.js";
import User from "../models/User.js";

/**
 * Get quiz questions
 * GET /api/users/quiz/questions
 */
export const getQuizQuestionsController = async (req, res) => {
  try {
    const questions = getQuizQuestions();

    return successResponse(res, 200, "Quiz questions retrieved successfully", {
      questions,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to retrieve quiz questions");
  }
};

/**
 * Update user's onboarding data
 * PUT /api/users/onboarding
 * Requires authentication
 */
export const updateOnboarding = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorResponse(res, errors.array());
    }

    const onboarding = await updateOnboardingData(req.user._id, req.body);

    return successResponse(res, 200, "Onboarding data updated successfully", {
      onboarding,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's onboarding data
 * GET /api/users/onboarding
 * Requires authentication
 */
export const getOnboarding = async (req, res, next) => {
  try {
    const onboarding = await getUserOnboarding(req.user._id);

    return successResponse(res, 200, "Onboarding data retrieved successfully", {
      onboarding,
    });
  } catch (error) {
    if (error.message === "Onboarding data not found") {
      return errorResponse(res, 404, error.message);
    }
    next(error);
  }
};

/**
 * Get user profile by ID
 * GET /api/users/:userId
 * Requires authentication
 */
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password")
      .populate("onboarding");

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    return successResponse(res, 200, "User retrieved successfully", {
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Find similar users (for future matching feature)
 * GET /api/users/similar
 * Requires authentication
 */
export const getSimilarUsers = async (req, res, next) => {
  try {
    const userOnboarding = await getUserOnboarding(req.user._id);
    const { limit = 10, category = "interests" } = req.query;

    // Get the user's preference for the specified category
    const userPreference = userOnboarding[category];

    if (!userPreference) {
      return errorResponse(res, 400, `User has no ${category} preference set`);
    }

    const similarUsers = await findSimilarUsers(
      category,
      userPreference,
      req.user._id,
      parseInt(limit)
    );

    return successResponse(res, 200, "Similar users retrieved successfully", {
      users: similarUsers,
      count: similarUsers.length,
      matchedOn: category,
    });
  } catch (error) {
    next(error);
  }
};
