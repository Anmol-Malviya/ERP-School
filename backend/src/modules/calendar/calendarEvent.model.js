const { Schema, id, model } = require('../../models/helpers');
const schema = new Schema({
  schoolId: id('School', { required: true, index: true }),
  academicSessionId: id('AcademicSession', { index: true }),
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['HOLIDAY', 'EXAM', 'EVENT', 'PTM', 'ACTIVITY', 'OTHER'], default: 'EVENT' },
  startsAt: { type: Date, required: true, index: true },
  endsAt: Date,
  audience: [{ type: String, enum: ['ALL', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] }],
  classIds: [id('Class')],
  sectionIds: [id('Section')],
  createdBy: id('User', { required: true })
}, { timestamps: true });
module.exports = model('CalendarEvent', schema);
