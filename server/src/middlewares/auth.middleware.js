import { verifyToken, extractToken } from "../config/jwt.js";
import { errorResponse } from "../utils/response.js";
import User from "../models/User.js";

/**
 * Middleware to authenticate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return errorResponse(res, 401, "Access token required");
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user exists and is active
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return errorResponse(res, 401, "User not found");
    }

    if (!user.isActive) {
      return errorResponse(res, 401, "Account is deactivated");
    }

    if (user.isBanned) {
      return errorResponse(res, 403, "Account is banned");
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return errorResponse(res, 401, "Invalid token");
    }

    if (error.name === "TokenExpiredError") {
      return errorResponse(res, 401, "Token expired");
    }

    console.error("Auth middleware error:", error);
    return errorResponse(res, 500, "Authentication failed");
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select("-password");

      if (user && user.isActive && !user.isBanned) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
