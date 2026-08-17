const { Schema, model } = require('../../models/helpers');
const schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  priceMonthly: { type: Number, default: 0 },
  priceAnnual: { type: Number, default: 0 },
  maxStudents: { type: Number, default: 500 },
  maxStaff: { type: Number, default: 100 },
  features: [String],
  active: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = model('Plan', schema);
