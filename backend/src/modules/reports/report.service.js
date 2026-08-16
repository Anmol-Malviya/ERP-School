const mongoose = require('mongoose');
const M = require('../../models');
const { ROLES } = require('../../constants/roles');
const cacheService = require('../../services/cache.service');
const C = require('../../core');

module.exports = {
  async dashboard(req) {
    const sid = req.user.role === ROLES.SUPER_ADMIN ? req.tenantId : (req.tenantId || req.user.schoolId);
    const scoped = sid ? { schoolId: new mongoose.Types.ObjectId(String(sid)) } : {};
    
    const [schools, users, students, teachers, total, present, revenue] = await Promise.all([
      M.School.countDocuments(sid ? { _id: scoped.schoolId } : {}),
      M.User.countDocuments(scoped),
      M.Student.countDocuments({ ...scoped, status: 'ACTIVE' }),
      M.Teacher.countDocuments({ ...scoped, status: 'ACTIVE' }),
      M.Attendance.countDocuments(scoped),
      M.Attendance.countDocuments({ ...scoped, status: 'PRESENT' }),
      M.Payment.aggregate([
        { $match: { ...scoped, status: 'SUCCESS' } },
        { $group: { _id: null, total: { $sum: '$amount' }, transactions: { $sum: 1 } } }
      ])
    ]);

    return {
      schools,
      users,
      students,
      teachers,
      attendanceRate: total ? Number(((present / total) * 100).toFixed(2)) : 0,
      revenue: revenue[0]?.total || 0,
      paymentTransactions: revenue[0]?.transactions || 0
    };
  },

  async bootstrap(req) {
    const role = req.user.role;
    const userId = req.user._id;
    const schoolId = req.user.schoolId || 'platform';
    const cacheKey = `dashboard:${role}:${userId}:${schoolId}`;

    return cacheService.remember(cacheKey, 30, async () => {
      let stats = [];
      let notices = [];
      let timetable = [];
      let notifications = [];
      let currentSession = null;

      // 1. Fetch current active session
      if (req.user.schoolId) {
        currentSession = await M.AcademicSession.findOne({ schoolId: req.user.schoolId, isCurrent: true }).lean();
      }

      // 2. Fetch notices
      const audienceFilter = role === ROLES.TEACHER ? 'TEACHER' : role === ROLES.STUDENT ? 'STUDENT' : role === ROLES.PARENT ? 'PARENT' : null;
      const noticeQuery = {
        ...(req.user.schoolId ? { schoolId: req.user.schoolId } : {})
      };
      if (audienceFilter) {
        noticeQuery.audience = { $in: ['ALL', audienceFilter] };
      }
      notices = await M.Notice.find(noticeQuery).sort('-publishedAt').limit(4).lean();

      // 3. Fetch notifications
      notifications = await M.Notification.find({ userId }).sort('-createdAt').limit(5).lean();

      // 4. Fetch stats & timetable based on role
      if (role === ROLES.STUDENT) {
        const s = req.studentProfile;
        if (s) {
          // Optimized aggregation for student attendance rate
          const attStats = await M.Attendance.aggregate([
            { $match: { schoolId: req.user.schoolId, studentId: s._id } },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                present: { $sum: { $cond: [{ $eq: ["$status", "PRESENT"] }, 1, 0] } }
              }
            }
          ]);
          const statsObj = attStats[0] || { total: 0, present: 0 };
          const pct = statsObj.total ? Math.round((statsObj.present / statsObj.total) * 1000) / 10 : 0;

          const [assign, r] = await Promise.all([
            M.Assignment.countDocuments(C.scoped(req, 'Assignment', { schoolId: req.user.schoolId })),
            M.Result.countDocuments({ schoolId: req.user.schoolId, studentId: s._id, published: true })
          ]);

          stats = [
            { label: 'Attendance', value: `${pct}%` },
            { label: 'Assignments', value: String(assign) },
            { label: 'Published results', value: String(r) }
          ];

          // Timetable for student class/section
          timetable = await M.Timetable.find({
            schoolId: req.user.schoolId,
            classId: s.classId,
            $or: [{ sectionId: s.sectionId }, { sectionId: null }]
          }).limit(6).lean();
        }
      } else if (role === ROLES.PARENT) {
        const childrenIds = C.ids(req.parentProfile?.studentIds || []);
        if (childrenIds.length > 0) {
          const [presentCount, totalCount, r] = await Promise.all([
            M.Attendance.countDocuments({ schoolId: req.user.schoolId, studentId: { $in: childrenIds }, status: 'PRESENT' }),
            M.Attendance.countDocuments({ schoolId: req.user.schoolId, studentId: { $in: childrenIds } }),
            M.Result.countDocuments({ schoolId: req.user.schoolId, studentId: { $in: childrenIds }, published: true })
          ]);

          stats = [
            { label: 'Children', value: String(childrenIds.length) },
            { label: 'Present records', value: String(presentCount) },
            { label: 'Published results', value: String(r) }
          ];
        }
      } else {
        // SUPER_ADMIN, ADMINISTRATOR, SCHOOL_ADMIN, TEACHER
        let schoolIds = [];
        if (role === ROLES.SUPER_ADMIN) {
          schoolIds = await M.School.find({}).distinct('_id');
        } else if (role === ROLES.ADMINISTRATOR) {
          schoolIds = req.user.assignedSchoolIds || [];
        } else if (req.user.schoolId) {
          schoolIds = [req.user.schoolId];
        }
        
        const f = schoolIds.length ? { schoolId: { $in: schoolIds } } : {};
        
        const [schools, students, teachers, payments] = await Promise.all([
          M.School.countDocuments(role === ROLES.SUPER_ADMIN ? {} : { _id: { $in: schoolIds } }),
          M.Student.countDocuments(f),
          M.Teacher.countDocuments(f),
          M.Payment.aggregate([
            { $match: { ...f, status: 'SUCCESS' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ])
        ]);

        stats = [
          { label: 'Schools', value: String(schools) },
          { label: 'Students', value: students.toLocaleString('en-IN') },
          { label: 'Teachers', value: teachers.toLocaleString('en-IN') },
          { label: 'Fees collected', value: `₹${Number(payments[0]?.total || 0).toLocaleString('en-IN')}` }
        ];

        if (role === ROLES.TEACHER) {
          const ta = C.teacherAssignmentIds(req.teacherProfile);
          timetable = await M.Timetable.find({
            schoolId: req.user.schoolId,
            sectionId: { $in: ta.sections }
          }).limit(6).lean();
        }
      }

      return {
        stats,
        notices,
        timetable,
        notifications,
        currentSession
      };
    });
  }
};
