import { validationResult } from "express-validator";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../services/auth.service.js";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "../utils/response.js";

/**
 * Register a new user
 * POST /api/auth/register
 *
 * Request body:
 * {
 *   "name": "John Doe",
 *   "username": "johndoe",
 *   "email": "john@example.com",
 *   "password": "password123",
 *   "onboardingAnswers": {
 *     "1": 0,
 *     "2": 1,
 *     "3": 2,
 *     // ... quiz answers as indices
 *   }
 * }
 */
export const register = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorResponse(res, errors.array());
    }

    const result = await registerUser(req.body);

    return successResponse(res, 201, "User registered successfully", result);
  } catch (error) {
    if (error.message === "User already exists with this email") {
      return errorResponse(res, 409, error.message);
    }
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 *
 * Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 */
export const login = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorResponse(res, errors.array());
    }

    const result = await loginUser(req.body);

    return successResponse(res, 200, "Login successful", result);
  } catch (error) {
    if (
      error.message.includes("Invalid email or password") ||
      error.message.includes("Account is")
    ) {
      return errorResponse(res, 401, error.message);
    }
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/auth/profile
 * Requires authentication
 */
export const getProfile = async (req, res, next) => {
  try {
    const profile = await getUserProfile(req.user._id);

    return successResponse(res, 200, "Profile retrieved successfully", {
      user: profile,
    });
  } catch (error) {
    if (error.message === "User not found") {
      return errorResponse(res, 404, error.message);
    }
    next(error);
  }
};

/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 * Requires authentication
 */
export const logout = async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // by removing the token from storage
  return successResponse(
    res,
    200,
    "Logout successful. Please remove token from client storage."
  );
};
