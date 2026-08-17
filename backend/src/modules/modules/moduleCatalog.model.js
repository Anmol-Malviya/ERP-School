const { Schema, model } = require('../../models/helpers');
const schema = new Schema({
  key: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  description: String,
  enabledByDefault: { type: Boolean, default: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = model('ModuleCatalog', schema);
