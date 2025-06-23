/**
 * Global error handler middleware for Express
 * Handles all errors thrown in the application
 */
const errorHandler = (err, req, res, next) => {
  // Default error status and message
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Structured error response
  const errorResponse = {
    status: 'error',
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  };

  // Add stack trace in development environment
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  // Handle validation errors (e.g., from Joi)
  if (err.name === 'ValidationError') {
    errorResponse.status = 400;
    errorResponse.errors = err.details?.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    errorResponse.status = 409;
    errorResponse.message = 'Duplicate entry found';
    errorResponse.field = Object.keys(err.keyValue)[0];
  }

  // Log error (consider using a proper logging library in production)
  console.error(`[${new Date().toISOString()}] Error:`, err);

  return res.status(status).json(errorResponse);
};

// Custom error class for application errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  AppError
};