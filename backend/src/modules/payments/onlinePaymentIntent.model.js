const { Schema, id, model } = require('../../models/helpers');
const schema = new Schema({
  schoolId: id('School', { required: true, index: true }),
  academicSessionId: id('AcademicSession', { required: true, index: true }),
  studentId: id('Student', { required: true, index: true }),
  feeId: id('Fee', { required: true, index: true }),
  provider: { type: String, default: 'RAZORPAY' },
  providerId: { type: String, index: true },
  referenceId: { type: String, required: true, unique: true, index: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['CREATED', 'PAID', 'PARTIAL', 'EXPIRED', 'CANCELLED', 'FAILED'], default: 'CREATED', index: true },
  shortUrl: String,
  raw: Schema.Types.Mixed
}, { timestamps: true });
module.exports = model('OnlinePaymentIntent', schema);
