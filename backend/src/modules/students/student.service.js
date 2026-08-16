const {createCrudService}=require('../_shared/crud.service');
const { runInTransaction } = require('../../utils/transactions');
const M = require('../../models');
const E = require('../../models/extended');
const C = require('../../core');
const cacheService = require('../../services/cache.service');

const base = createCrudService({Model:require('./student.model'),resource:'Student',searchFields:['firstName','lastName','admissionNo','rollNo'],filterFields:['academicSessionId','classId','sectionId','status']});

module.exports = {
  ...base,
  async promote(req, id) {
    const { academicSessionId, classId, sectionId, rollNo, status = 'PROMOTED' } = req.body;
    if (!academicSessionId || !classId || !sectionId) {
      throw new C.ApiError(400, 'New session, class and section are required');
    }

    return runInTransaction(async (session) => {
      const student = await M.Student.findOne({ _id: id, schoolId: req.tenantId }).session(session);
      if (!student) throw new C.ApiError(404, 'Student not found');

      await E.Enrollment.updateMany(
        { studentId: student._id, status: 'ACTIVE' },
        { $set: { status, promotedAt: new Date() } },
        { session }
      );

      const enrollment = await E.Enrollment.findOneAndUpdate(
        { schoolId: req.tenantId, studentId: student._id, academicSessionId },
        { $set: { classId, sectionId, rollNo, status: 'ACTIVE' } },
        { new: true, upsert: true, runValidators: true, session }
      );

      student.academicSessionId = academicSessionId;
      student.classId = classId;
      student.sectionId = sectionId;
      if (rollNo != null) student.rollNo = rollNo;
      await student.save({ session });
      
      // Invalidate student auth context cache if exists
      await cacheService?.del(`auth:user:${student.userId}`);

      return { student, enrollment };
    });
  },

  async enrollments(req, id) {
    const allowed = await M.Student.exists(C.scoped(req, 'Student', { _id: id, schoolId: req.tenantId }));
    if (!allowed) throw new C.ApiError(404, 'Student not found');
    return E.Enrollment.find({ schoolId: req.tenantId, studentId: id }).sort('-createdAt').lean();
  }
};

