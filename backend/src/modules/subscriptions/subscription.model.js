const { Schema, id, model } = require('../../models/helpers');
const schema = new Schema({
  schoolId: id('School', { required: true, index: true }),
  planId: id('Plan', { required: true, index: true }),
  status: { type: String, enum: ['TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED'], default: 'TRIAL', index: true },
  billingCycle: { type: String, enum: ['MONTHLY', 'ANNUAL'], default: 'ANNUAL' },
  startsAt: { type: Date, default: Date.now },
  endsAt: Date,
  amount: { type: Number, default: 0 },
  notes: String
}, { timestamps: true });
schema.index({ schoolId: 1, status: 1 });
module.exports = model('Subscription', schema);
