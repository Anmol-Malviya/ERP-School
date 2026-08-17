const { Schema, id, model } = require('../../models/helpers');
const schema = new Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: Schema.Types.Mixed,
  updatedBy: id('User')
}, { timestamps: true });
module.exports = model('PlatformSetting', schema);
