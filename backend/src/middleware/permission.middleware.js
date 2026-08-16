const ApiError = require('../utils/apiError');
const { getRolePermissions } = require('../constants/permissions');
module.exports = (...required) => (req, _res, next) => {
  const permissions = new Set([...getRolePermissions(req.user?.role), ...(req.user?.permissions || [])]);
  return required.every(p => permissions.has(p)) ? next() : next(new ApiError(403, 'Insufficient permission'));
};
