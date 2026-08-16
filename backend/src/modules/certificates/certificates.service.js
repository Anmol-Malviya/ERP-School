const { createCrudService } = require('../_shared/crud.service');
const M = require('../../models');
const { runInTransaction } = require('../../utils/transactions');
const { ROLES } = require('../../constants/roles');
const cacheService = require('../../services/cache.service');
const C = require('../../core');

const base = createCrudService({
  Model: M.Certificate,
  resource: 'Certificate',
  filterFields: ['type', 'status', 'studentId'],
  beforeCreate: async (req, data) => {
    let studentId = data.studentId;
    if (req.user.role === ROLES.STUDENT) studentId = req.studentProfile?._id;
    if (req.user.role === ROLES.PARENT && !C.ids(req.parentProfile?.studentIds || []).includes(String(studentId))) {
      throw new C.ApiError(403, 'Child is not linked');
    }
    if (!studentId) throw new C.ApiError(400, 'studentId is required');
    return {
      ...data,
      schoolId: req.tenantId,
      studentId,
      requestedBy: req.user._id
    };
  }
});

module.exports = {
  ...base,
  async review(req, id) {
    const status = String(req.body.status || '').toUpperCase();
    if (!['APPROVED', 'ISSUED', 'REJECTED'].includes(status)) {
      throw new C.ApiError(400, 'Invalid status');
    }

    return runInTransaction(async (session) => {
      const set = {
        status,
        reviewedBy: req.user._id,
        reviewNote: req.body.reviewNote
      };
      if (req.body.fileUrl) set.fileUrl = req.body.fileUrl;
      if (req.body.certificateNo) set.certificateNo = req.body.certificateNo;
      if (status === 'ISSUED') set.issuedAt = new Date();

      const row = await M.Certificate.findOneAndUpdate(
        { _id: id, schoolId: req.tenantId },
        { $set: set },
        { new: true, session }
      );
      if (!row) throw new C.ApiError(404, 'Certificate not found');

      if (status === 'ISSUED' && row.type === 'TRANSFER_CERTIFICATE') {
        const student = await M.Student.findOneAndUpdate(
          { _id: row.studentId, schoolId: req.tenantId },
          { $set: { status: 'TRANSFERRED' } },
          { new: true, session }
        );
        if (student) {
          await M.User.updateOne({ _id: student.userId }, { $set: { status: 'INACTIVE' } }, { session });
          await cacheService.del(`auth:user:${student.userId}`);
        }
      }

      await C.audit(req, 'REVIEW', 'Certificate', row._id, { status });
      return row;
    });
  }
};
