const { z } = require('zod');
const ApiError = require('../utils/apiError');

const validate = (schemas) => (req, res, next) => {
  try {
    const toValidate = {};
    if (schemas.body) toValidate.body = req.body;
    if (schemas.params) toValidate.params = req.params;
    if (schemas.query) toValidate.query = req.query;

    const schemaObject = z.object(schemas);
    const parsed = schemaObject.safeParse(toValidate);
    
    if (!parsed.success) {
      const details = parsed.error.issues.map(issue => ({
        field: issue.path.slice(1).join('.'),
        message: issue.message
      }));
      const err = new ApiError(400, 'Validation failed');
      err.code = 'VALIDATION_ERROR';
      err.details = details;
      return next(err);
    }
    
    if (schemas.body) req.body = parsed.data.body;
    if (schemas.params) req.params = parsed.data.params;
    if (schemas.query) req.query = parsed.data.query;
    
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validate;
