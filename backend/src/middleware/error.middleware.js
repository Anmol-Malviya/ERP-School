const ApiError = require('../utils/apiError');
const config = require('../config/env');

module.exports = function errorHandler(err, req, res, _next) {
  let error = err;
  let code = err.code || 'INTERNAL_SERVER_ERROR';

  if (err?.name === 'ValidationError') {
    error = new ApiError(400, 'Validation failed', Object.values(err.errors).map(x => x.message));
    code = 'VALIDATION_ERROR';
  } else if (err?.name === 'CastError') {
    error = new ApiError(400, `Invalid ${err.path}`);
    code = 'RESOURCE_NOT_FOUND';
  } else if (err?.code === 11000) {
    error = new ApiError(409, 'Duplicate value matches existing record', err.keyValue);
    code = 'DUPLICATE_RESOURCE';
  }

  // Handle specific status code mappings
  const statusCode = error.statusCode || 500;
  if (statusCode === 401 && code === 'INTERNAL_SERVER_ERROR') {
    code = 'AUTH_REQUIRED';
  } else if (statusCode === 403 && code === 'INTERNAL_SERVER_ERROR') {
    code = 'FORBIDDEN';
  } else if (statusCode === 404 && code === 'INTERNAL_SERVER_ERROR') {
    code = 'RESOURCE_NOT_FOUND';
  } else if (statusCode === 429) {
    code = 'RATE_LIMITED';
  }

  // Filter out internal details/stack trace in production
  const isProduction = config.nodeEnv === 'production';
  const responseEnvelope = {
    success: false,
    code: String(code),
    message: isProduction && statusCode === 500 ? 'Internal server error occurred' : error.message || 'Internal server error',
    details: error.details || undefined
  };

  if (!isProduction && statusCode === 500 && err.stack) {
    responseEnvelope.stack = err.stack;
  }

  res.status(statusCode).json(responseEnvelope);
};

