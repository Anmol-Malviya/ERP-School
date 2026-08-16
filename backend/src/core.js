const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('./config/env');
const M = require('./models');
const { ROLES } = require('./constants/roles');
const { getRolePermissions } = require('./constants/permissions');

class ApiError extends Error {
  constructor(statusCode, message, details) { super(message); this.statusCode = statusCode; this.details = details; }
}
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const success = (res, data = null, message = 'Success', statusCode = 200, meta) => {
  const out = { success: true, message, data };
  if (meta) out.meta = meta;
  return res.status(statusCode).json(out);
};
const page = q => {
  const p = Math.max(parseInt(q.page) || 1, 1);
  const l = Math.min(Math.max(parseInt(q.limit) || 20, 1), 100);
  return { page: p, limit: l, skip: (p - 1) * l };
};

const accessToken = u => jwt.sign({ sub: String(u._id), role: u.role, schoolId: u.schoolId ? String(u.schoolId) : null }, config.accessSecret, { expiresIn: config.accessExpiresIn });
const refreshToken = u => jwt.sign({ sub: String(u._id), role: u.role, nonce: Date.now() }, config.refreshSecret, { expiresIn: config.refreshExpiresIn });
const verifyAccess = t => jwt.verify(t, config.accessSecret);
const verifyRefresh = t => jwt.verify(t, config.refreshSecret);

function cookies(req) {
  return Object.fromEntries(String(req.headers.cookie || '').split(';').map(x => x.trim()).filter(Boolean).map(part => {
    const i = part.indexOf('=');
    return [decodeURIComponent(i >= 0 ? part.slice(0, i) : part), decodeURIComponent(i >= 0 ? part.slice(i + 1) : '')];
  }));
}
function setRefreshCookie(res, token) {
  res.cookie(config.cookieName, token, { httpOnly: true, secure: config.cookieSecure, sameSite: config.cookieSameSite, path: '/api/v1/auth', maxAge: 7 * 24 * 60 * 60 * 1000 });
}
function clearRefreshCookie(res) {
  res.clearCookie(config.cookieName, { httpOnly: true, secure: config.cookieSecure, sameSite: config.cookieSameSite, path: '/api/v1/auth' });
}

async function authenticate(req, _res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return next(new ApiError(401, 'Authentication required'));
  try {
    const d = verifyAccess(token);
    const u = await M.User.findById(d.sub);
    if (!u || u.status !== 'ACTIVE') throw new ApiError(401, 'Account unavailable');
    req.user = u;
    if (u.role === ROLES.STUDENT) req.studentProfile = await M.Student.findOne({ userId: u._id }).lean();
    if (u.role === ROLES.PARENT) req.parentProfile = await M.Parent.findOne({ userId: u._id }).populate({ path: 'studentIds', select: '_id classId sectionId academicSessionId' }).lean();
    if (u.role === ROLES.TEACHER) req.teacherProfile = await M.Teacher.findOne({ userId: u._id }).lean();
    next();
  } catch (e) { next(e instanceof ApiError ? e : new ApiError(401, 'Invalid or expired access token')); }
}

const allowRoles = (...roles) => (req, _res, next) => roles.includes(req.user?.role) ? next() : next(new ApiError(403, 'Role is not allowed'));
const permission = (...ps) => (req, _res, next) => {
  const set = new Set([...getRolePermissions(req.user?.role), ...(req.user?.permissions || [])]);
  return ps.every(p => set.has(p)) ? next() : next(new ApiError(403, 'Insufficient permission'));
};
const tenant = (required = true) => (req, _res, next) => {
  let sid = req.headers['x-school-id'] || req.user?.schoolId;
  if (req.user?.role === ROLES.ADMINISTRATOR) {
    const allowed = (req.user.assignedSchoolIds || []).map(String);
    if (!sid && allowed.length === 1) sid = allowed[0];
    if (sid && !allowed.includes(String(sid))) return next(new ApiError(403, 'School is not assigned to this administrator'));
  } else if (req.user?.role !== ROLES.SUPER_ADMIN) sid = req.user?.schoolId;
  if (!sid && required) return next(new ApiError(400, 'School context is required'));
  if (sid && !mongoose.isValidObjectId(sid)) return next(new ApiError(400, 'Invalid school context'));
  req.tenantId = sid ? String(sid) : null;
  next();
};

function ids(v = []) { return v.map(x => String(x?._id || x)).filter(Boolean); }
function teacherAssignmentIds(profile) {
  const a = profile?.classAssignments || [];
  return { classes: ids(a.map(x => x.classId)), sections: ids(a.map(x => x.sectionId)), subjects: ids(a.map(x => x.subjectId)) };
}
function scoped(req, resource, base = {}) {
  const r = req.user.role;
  const s = req.studentProfile;
  const children = req.parentProfile?.studentIds || [];
  const ta = teacherAssignmentIds(req.teacherProfile);
  if ([ROLES.SUPER_ADMIN, ROLES.ADMINISTRATOR, ROLES.SCHOOL_ADMIN].includes(r)) return base;
  if (resource === 'Student') {
    if (r === ROLES.STUDENT) return { ...base, userId: req.user._id };
    if (r === ROLES.PARENT) return { ...base, _id: { $in: ids(children) } };
    if (r === ROLES.TEACHER) return { ...base, sectionId: { $in: ta.sections } };
  }
  if (resource === 'Class' && r === ROLES.TEACHER) return { ...base, _id: { $in: ta.classes } };
  if (resource === 'Section' && r === ROLES.TEACHER) return { ...base, _id: { $in: ta.sections } };
  if (resource === 'Subject' && r === ROLES.TEACHER) return { ...base, _id: { $in: ta.subjects } };
  if (['Attendance', 'Result', 'Payment'].includes(resource)) {
    if (r === ROLES.STUDENT && s) return { ...base, studentId: s._id };
    if (r === ROLES.PARENT) return { ...base, studentId: { $in: ids(children) } };
    if (r === ROLES.TEACHER) return { ...base, sectionId: { $in: ta.sections } };
  }
  if (resource === 'Certificate') {
    if (r === ROLES.STUDENT && s) return { ...base, studentId: s._id };
    if (r === ROLES.PARENT) return { ...base, studentId: { $in: ids(children) } };
    if (r === ROLES.TEACHER) return { ...base, _id: { $in: [] } };
  }
  if (resource === 'Fee') {
    if (r === ROLES.STUDENT && s) return { ...base, $or: [{ studentId: s._id }, { studentId: null, classId: s.classId }] };
    if (r === ROLES.PARENT) return { ...base, $or: [{ studentId: { $in: ids(children) } }, { studentId: null, classId: { $in: ids(children.map(x => x.classId)) } }] };
  }
  if (['Assignment', 'Timetable'].includes(resource)) {
    if (r === ROLES.STUDENT && s) return { ...base, classId: s.classId, ...(resource === 'Assignment' ? { status: 'PUBLISHED' } : {}), $or: [{ sectionId: s.sectionId }, { sectionId: null }] };
    if (r === ROLES.PARENT) return { ...base, classId: { $in: ids(children.map(x => x.classId)) }, ...(resource === 'Assignment' ? { status: 'PUBLISHED' } : {}), sectionId: { $in: ids(children.map(x => x.sectionId)) } };
    if (r === ROLES.TEACHER) return { ...base, sectionId: { $in: ta.sections } };
  }
  if (resource === 'Examination') {
    if (r === ROLES.STUDENT && s) return { ...base, classIds: { $in: [s.classId] } };
    if (r === ROLES.PARENT) return { ...base, classIds: { $in: ids(children.map(x => x.classId)) } };
    if (r === ROLES.TEACHER) return { ...base, classIds: { $in: ta.classes } };
  }
  if (resource === 'Notice') {
    const a = r === ROLES.TEACHER ? 'TEACHER' : r === ROLES.STUDENT ? 'STUDENT' : r === ROLES.PARENT ? 'PARENT' : null;
    if (a) return { ...base, audience: { $in: ['ALL', a] } };
  }
  if (resource === 'CalendarEvent') {
    const a = r === ROLES.TEACHER ? 'TEACHER' : r === ROLES.STUDENT ? 'STUDENT' : r === ROLES.PARENT ? 'PARENT' : null;
    if (a) return { ...base, audience: { $in: ['ALL', a] } };
  }
  if (resource === 'Leave') return { ...base, applicantUserId: req.user._id };
  return base;
}

const schoolFilter = req => req.user.role === ROLES.SUPER_ADMIN ? {} : req.user.role === ROLES.ADMINISTRATOR ? { _id: { $in: req.user.assignedSchoolIds || [] } } : { _id: req.user.schoolId };
async function audit(req, action, resource, resourceId, metadata) {
  try { await M.AuditLog.create({ schoolId: req.tenantId || req.user?.schoolId, userId: req.user?._id, action, resource, resourceId, metadata, ip: req.ip, userAgent: req.headers['user-agent'] }); } catch {}
}
const validateId = (req, _res, next) => mongoose.isValidObjectId(req.params.id) ? next() : next(new ApiError(400, 'Invalid id'));
function errorHandler(err, _req, res, _next) {
  let e = err;
  if (err?.name === 'ValidationError') e = new ApiError(400, 'Validation failed', Object.values(err.errors).map(x => x.message));
  if (err?.name === 'CastError') e = new ApiError(400, `Invalid ${err.path}`);
  if (err?.code === 11000) e = new ApiError(409, 'Duplicate value', err.keyValue);
  res.status(e.statusCode || 500).json({ success: false, message: e.message || 'Internal server error', details: e.details });
}

module.exports = {
  ApiError, asyncHandler, success, page, accessToken, refreshToken, verifyRefresh, cookies, setRefreshCookie, clearRefreshCookie,
  authenticate, allowRoles, permission, tenant, scoped, schoolFilter, audit, validateId, errorHandler, ids, teacherAssignmentIds,
};
