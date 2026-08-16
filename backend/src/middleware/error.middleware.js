const ApiError = require('../utils/apiError');
module.exports = function errorHandler(err, _req, res, _next) {
  let error = err;
  if (err?.name === 'ValidationError') error = new ApiError(400, 'Validation failed', Object.values(err.errors).map(x => x.message));
  if (err?.name === 'CastError') error = new ApiError(400, `Invalid ${err.path}`);
  if (err?.code === 11000) error = new ApiError(409, 'Duplicate value', err.keyValue);
  res.status(error.statusCode || 500).json({ success:false, message:error.message || 'Internal server error', details:error.details });
};
