const { Schema, id, model } = require('../../models/helpers');
const schema = new Schema({
  schoolId: id('School', { required: true, unique: true, index: true }),
  allowOnlinePayments: { type: Boolean, default: false },
  settings: Schema.Types.Mixed
}, { timestamps: true });
module.exports = model('SchoolPreference', schema);
