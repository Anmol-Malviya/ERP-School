const mongoose = require('mongoose');
const ApiError = require('../utils/apiError');
const { ROLES } = require('../constants/roles');
module.exports = (required = true) => (req, _res, next) => {
  let schoolId = req.headers['x-school-id'] || req.user?.schoolId;
  if (req.user?.role === ROLES.ADMINISTRATOR) {
    const allowed = (req.user.assignedSchoolIds || []).map(String);
    if (!schoolId && allowed.length === 1) schoolId = allowed[0];
    if (schoolId && !allowed.includes(String(schoolId))) return next(new ApiError(403, 'School is not assigned to this administrator'));
  } else if (req.user?.role !== ROLES.SUPER_ADMIN) schoolId = req.user?.schoolId;
  if (!schoolId && required) return next(new ApiError(400, 'School context is required'));
  if (schoolId && !mongoose.isValidObjectId(schoolId)) return next(new ApiError(400, 'Invalid school context'));
  req.tenantId = schoolId ? String(schoolId) : null;
  next();
};
