const ApiError = require('../utils/apiError');
module.exports = (...roles) => (req, _res, next) => roles.includes(req.user?.role) ? next() : next(new ApiError(403, 'Role is not allowed'));
