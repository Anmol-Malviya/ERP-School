const M = require('../../models');
const E = require('../../models/extended');
const C = require('../../core');
const { ROLES } = require('../../constants/roles');

module.exports = {
  async getSubmissionsForAssignment(req, assignmentId) {
    const a = await M.Assignment.findOne(C.scoped(req, 'Assignment', { _id: assignmentId }));
    if (!a) throw new C.ApiError(404, 'Assignment not found');
    
    return E.AssignmentSubmission.find({ schoolId: req.tenantId, assignmentId: a._id })
      .populate('studentId', 'firstName lastName admissionNo')
      .lean();
  },

  async getMySubmissions(req) {
    if (req.user.role !== ROLES.STUDENT) {
      throw new C.ApiError(403, 'Only students can access this endpoint');
    }
    return E.AssignmentSubmission.find({
      schoolId: req.tenantId,
      studentId: req.studentProfile?._id
    }).sort('-submittedAt').lean();
  },

  async submitAssignment(req, assignmentId) {
    if (req.user.role !== ROLES.STUDENT) {
      throw new C.ApiError(403, 'Only students can submit assignments');
    }
    const a = await M.Assignment.findOne(C.scoped(req, 'Assignment', { _id: assignmentId }));
    if (!a || a.status !== 'PUBLISHED') {
      throw new C.ApiError(404, 'Published assignment not found');
    }
    
    const late = a.dueAt && new Date() > new Date(a.dueAt);
    
    return E.AssignmentSubmission.findOneAndUpdate(
      { assignmentId: a._id, studentId: req.studentProfile._id },
      {
        $set: {
          schoolId: req.tenantId,
          text: req.body.text,
          attachments: req.body.attachments || [],
          submittedAt: new Date(),
          status: late ? 'LATE' : 'SUBMITTED'
        }
      },
      { new: true, upsert: true, runValidators: true }
    );
  },

  async reviewSubmission(req, id) {
    const row = await E.AssignmentSubmission.findOneAndUpdate(
      { _id: id, schoolId: req.tenantId },
      {
        $set: {
          marks: req.body.marks,
          remarks: req.body.remarks,
          status: 'REVIEWED',
          reviewedBy: req.user._id,
          reviewedAt: new Date()
        }
      },
      { new: true }
    );
    if (!row) throw new C.ApiError(404, 'Submission not found');
    
    await C.audit(req, 'REVIEW', 'AssignmentSubmission', row._id);
    return row;
  }
};
