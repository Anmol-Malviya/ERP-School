const { Schema, id, model } = require('../../models/helpers');
const schema = new Schema({
  schoolId: id('School', { index: true }),
  openedBy: id('User', { required: true, index: true }),
  subject: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'OPEN', index: true },
  assignedTo: id('User'),
  comments: [{ userId: id('User'), message: String, createdAt: { type: Date, default: Date.now } }]
}, { timestamps: true });
module.exports = model('SupportTicket', schema);
