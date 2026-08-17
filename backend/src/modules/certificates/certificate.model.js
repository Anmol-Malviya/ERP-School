const { Schema, id, model } = require('../../models/helpers');
const schema = new Schema({
  schoolId: id('School', { required: true, index: true }),
  studentId: id('Student', { required: true, index: true }),
  type: { type: String, enum: ['BONAFIDE', 'TRANSFER_CERTIFICATE', 'CHARACTER', 'ID_CARD', 'OTHER'], required: true, index: true },
  reason: String,
  status: { type: String, enum: ['REQUESTED', 'APPROVED', 'ISSUED', 'REJECTED'], default: 'REQUESTED', index: true },
  requestedBy: id('User', { required: true }),
  reviewedBy: id('User'),
  reviewNote: String,
  fileUrl: String,
  certificateNo: String,
  issuedAt: Date
}, { timestamps: true });
module.exports = model('Certificate', schema);
