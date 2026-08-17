const { Schema, id, model } = require('../../models/helpers');
const schema = new Schema({
  userId: id('User', { required: true, index: true }),
  tokenHash: { type: String, required: true, unique: true, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  userAgent: String,
  ip: String
}, { timestamps: true });
module.exports = model('AuthSession', schema);
