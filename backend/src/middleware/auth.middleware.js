const ApiError = require('../utils/apiError');
const { verifyAccess } = require('../utils/tokens');
const M = require('../models');
const { ROLES } = require('../constants/roles');
const cacheService = require('../services/cache.service');
const mongoose = require('mongoose');

module.exports = async function authenticate(req, _res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return next(new ApiError(401, 'Authentication required'));
  try {
    const decoded = verifyAccess(token);
    const userId = decoded.sub;
    const cacheKey = `auth:user:${userId}`;
    
    let cachedContext = await cacheService.get(cacheKey);
    
    if (!cachedContext) {
      const user = await M.User.findById(userId).lean();
      if (!user || user.status !== 'ACTIVE') throw new ApiError(401, 'Account unavailable');
      
      let studentProfile = null;
      let parentProfile = null;
      let teacherProfile = null;
      
      if (user.role === ROLES.STUDENT) {
        studentProfile = await M.Student.findOne({ userId: user._id }).lean();
      } else if (user.role === ROLES.PARENT) {
        parentProfile = await M.Parent.findOne({ userId: user._id })
          .populate({ path: 'studentIds', select: '_id classId sectionId academicSessionId' })
          .lean();
      } else if (user.role === ROLES.TEACHER) {
        teacherProfile = await M.Teacher.findOne({ userId: user._id }).lean();
      }
      
      cachedContext = {
        user,
        studentProfile,
        parentProfile,
        teacherProfile
      };
      
      await cacheService.set(cacheKey, cachedContext, 30); // 30 seconds TTL
    } else {
      // Hydrate ObjectIds to avoid type comparison issues in application code
      if (cachedContext.user) {
        cachedContext.user._id = new mongoose.Types.ObjectId(String(cachedContext.user._id));
        if (cachedContext.user.schoolId) {
          cachedContext.user.schoolId = new mongoose.Types.ObjectId(String(cachedContext.user.schoolId));
        }
        if (Array.isArray(cachedContext.user.assignedSchoolIds)) {
          cachedContext.user.assignedSchoolIds = cachedContext.user.assignedSchoolIds.map(
            id => new mongoose.Types.ObjectId(String(id))
          );
        }
      }
      if (cachedContext.studentProfile) {
        cachedContext.studentProfile._id = new mongoose.Types.ObjectId(String(cachedContext.studentProfile._id));
        cachedContext.studentProfile.userId = new mongoose.Types.ObjectId(String(cachedContext.studentProfile.userId));
        if (cachedContext.studentProfile.classId) {
          cachedContext.studentProfile.classId = new mongoose.Types.ObjectId(String(cachedContext.studentProfile.classId));
        }
        if (cachedContext.studentProfile.sectionId) {
          cachedContext.studentProfile.sectionId = new mongoose.Types.ObjectId(String(cachedContext.studentProfile.sectionId));
        }
        if (cachedContext.studentProfile.academicSessionId) {
          cachedContext.studentProfile.academicSessionId = new mongoose.Types.ObjectId(String(cachedContext.studentProfile.academicSessionId));
        }
      }
      if (cachedContext.teacherProfile) {
        cachedContext.teacherProfile._id = new mongoose.Types.ObjectId(String(cachedContext.teacherProfile._id));
        cachedContext.teacherProfile.userId = new mongoose.Types.ObjectId(String(cachedContext.teacherProfile.userId));
      }
      if (cachedContext.parentProfile) {
        cachedContext.parentProfile._id = new mongoose.Types.ObjectId(String(cachedContext.parentProfile._id));
        cachedContext.parentProfile.userId = new mongoose.Types.ObjectId(String(cachedContext.parentProfile.userId));
        if (Array.isArray(cachedContext.parentProfile.studentIds)) {
          cachedContext.parentProfile.studentIds = cachedContext.parentProfile.studentIds.map(s => ({
            ...s,
            _id: new mongoose.Types.ObjectId(String(s._id || s)),
            classId: s.classId ? new mongoose.Types.ObjectId(String(s.classId)) : undefined,
            sectionId: s.sectionId ? new mongoose.Types.ObjectId(String(s.sectionId)) : undefined,
            academicSessionId: s.academicSessionId ? new mongoose.Types.ObjectId(String(s.academicSessionId)) : undefined
          }));
        }
      }
    }
    
    if (!cachedContext.user || cachedContext.user.status !== 'ACTIVE') {
      throw new ApiError(401, 'Account unavailable');
    }
    
    req.user = cachedContext.user;
    req.studentProfile = cachedContext.studentProfile;
    req.parentProfile = cachedContext.parentProfile;
    req.teacherProfile = cachedContext.teacherProfile;
    
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, 'Invalid or expired access token'));
  }
};
