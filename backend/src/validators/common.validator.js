const mongoose = require('mongoose');
const ApiError = require('../utils/apiError');

const requireFields = (...fields) => (req, _res, next) => {
  const missing = fields.filter(field => req.body?.[field] === undefined || req.body?.[field] === null || req.body?.[field] === '');
  return missing.length ? next(new ApiError(400, `Missing required fields: ${missing.join(', ')}`)) : next();
};
const objectIdParam = (name = 'id') => (req, _res, next) => mongoose.isValidObjectId(req.params[name]) ? next() : next(new ApiError(400, `Invalid ${name}`));
const enumField = (field, values) => (req, _res, next) => !req.body?.[field] || values.includes(String(req.body[field]).toUpperCase()) ? next() : next(new ApiError(400, `${field} must be one of: ${values.join(', ')}`));
module.exports = { requireFields, objectIdParam, enumField };
