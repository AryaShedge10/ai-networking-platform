import express from "express";
import { body, param, query } from "express-validator";
import {
  getQuizQuestionsController,
  updateOnboarding,
  getOnboarding,
  getUserById,
  getSimilarUsers,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Validation rules for quiz answers
const quizAnswersValidation = [
  body("quizAnswers").isObject().withMessage("Quiz answers must be an object"),

  body("quizAnswers.*")
    .isInt({ min: 0, max: 3 })
    .withMessage("Each answer must be 0, 1, 2, or 3"),
];

// Validation for user ID parameter
const userIdValidation = [
  param("userId").isMongoId().withMessage("Invalid user ID format"),
];

// Validation for similar users query
const similarUsersValidation = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
];

/**
 * @route   GET /api/users/quiz/questions
 * @desc    Get quiz questions structure
 * @access  Public
 */
router.get("/quiz/questions", getQuizQuestionsController);

/**
 * @route   GET /api/users/onboarding
 * @desc    Get current user's onboarding data
 * @access  Private
 */
router.get("/onboarding", authenticateToken, getOnboarding);

/**
 * @route   PUT /api/users/onboarding
 * @desc    Update current user's onboarding data with quiz answers
 * @access  Private
 */
router.put(
  "/onboarding",
  authenticateToken,
  quizAnswersValidation,
  updateOnboarding
);

/**
 * @route   GET /api/users/similar
 * @desc    Get users with similar preferences
 * @access  Private
 */
router.get(
  "/similar",
  authenticateToken,
  similarUsersValidation,
  getSimilarUsers
);

/**
 * @route   GET /api/users/:userId
 * @desc    Get user profile by ID
 * @access  Private
 */
router.get("/:userId", authenticateToken, userIdValidation, getUserById);

export default router;
