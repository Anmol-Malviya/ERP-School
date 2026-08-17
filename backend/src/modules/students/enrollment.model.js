const { Schema, id, model } = require('../../models/helpers');
const schema = new Schema({
  schoolId: id('School', { required: true, index: true }),
  studentId: id('Student', { required: true, index: true }),
  academicSessionId: id('AcademicSession', { required: true, index: true }),
  classId: id('Class', { required: true, index: true }),
  sectionId: id('Section', { required: true, index: true }),
  rollNo: String,
  status: { type: String, enum: ['ACTIVE', 'PROMOTED', 'REPEATED', 'TRANSFERRED', 'GRADUATED'], default: 'ACTIVE' },
  promotedAt: Date,
  remarks: String
}, { timestamps: true });
schema.index({ schoolId: 1, studentId: 1, academicSessionId: 1 }, { unique: true });
module.exports = model('Enrollment', schema);
