import { errorResponse } from "../utils/response.js";

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).reduce((acc, error) => {
      acc[error.path] = error.message;
      return acc;
    }, {});

    return errorResponse(res, 400, "Validation failed", errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } already exists`;
    return errorResponse(res, 409, message);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return errorResponse(res, 400, "Invalid ID format");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, 401, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, 401, "Token expired");
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return errorResponse(res, statusCode, message);
};

/**
 * 404 Not Found middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const notFound = (req, res) => {
  return errorResponse(res, 404, `Route ${req.originalUrl} not found`);
};
