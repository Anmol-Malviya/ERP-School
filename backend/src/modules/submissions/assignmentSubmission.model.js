const { Schema, id, model } = require('../../models/helpers');
const schema = new Schema({
  schoolId: id('School', { required: true, index: true }),
  assignmentId: id('Assignment', { required: true, index: true }),
  studentId: id('Student', { required: true, index: true }),
  text: String,
  attachments: [{ name: String, url: String }],
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['SUBMITTED', 'LATE', 'REVIEWED'], default: 'SUBMITTED' },
  marks: Number,
  remarks: String,
  reviewedBy: id('User'),
  reviewedAt: Date
}, { timestamps: true });
schema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
module.exports = model('AssignmentSubmission', schema);
