const ApiError = require('../utils/apiError');
const { verifyAccess } = require('../utils/tokens');
const M = require('../models');
const { ROLES } = require('../constants/roles');

module.exports = async function authenticate(req, _res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return next(new ApiError(401, 'Authentication required'));
  try {
    const decoded = verifyAccess(token);
    const user = await M.User.findById(decoded.sub);
    if (!user || user.status !== 'ACTIVE') throw new ApiError(401, 'Account unavailable');
    req.user = user;
    if (user.role === ROLES.STUDENT) req.studentProfile = await M.Student.findOne({ userId:user._id }).lean();
    if (user.role === ROLES.PARENT) req.parentProfile = await M.Parent.findOne({ userId:user._id }).populate({ path:'studentIds', select:'_id classId sectionId academicSessionId' }).lean();
    if (user.role === ROLES.TEACHER) req.teacherProfile = await M.Teacher.findOne({ userId:user._id }).lean();
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, 'Invalid or expired access token'));
  }
};
