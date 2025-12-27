/**
 * Standardized success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object} data - Response data
 */
export const successResponse = (
  res,
  statusCode = 200,
  message = "Success",
  data = null
) => {
  const response = {
    success: true,
    message,
    ...(data && { data }),
  };

  return res.status(statusCode).json(response);
};

/**
 * Standardized error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} errors - Detailed errors
 */
export const errorResponse = (
  res,
  statusCode = 500,
  message = "Internal Server Error",
  errors = null
) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors }),
  };

  return res.status(statusCode).json(response);
};

/**
 * Validation error response
 * @param {Object} res - Express response object
 * @param {Array} validationErrors - Array of validation errors
 */
export const validationErrorResponse = (res, validationErrors) => {
  const errors = validationErrors.reduce((acc, error) => {
    acc[error.path] = error.msg;
    return acc;
  }, {});

  return errorResponse(res, 400, "Validation failed", errors);
};
