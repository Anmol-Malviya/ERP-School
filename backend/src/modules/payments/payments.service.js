const crypto = require('crypto');
const mongoose = require('mongoose');
const config = require('../../config/env');
const M = require('../../models');
const E = require('../../models');
const C = require('../../core');
const pay = require('../../payments/razorpay');
const { ROLES } = require('../../constants/roles');
const { runInTransaction } = require('../../utils/transactions');

module.exports = {
  async createPaymentLink(req) {
    const pref = await E.SchoolPreference.findOne({ schoolId: req.tenantId }).lean();
    if (!pref?.allowOnlinePayments) {
      throw new C.ApiError(403, 'Online payments are disabled for this school');
    }
    const fee = await M.Fee.findOne({ _id: req.body.feeId, schoolId: req.tenantId });
    if (!fee) throw new C.ApiError(404, 'Fee not found');
    
    let studentId = req.body.studentId;
    if (req.user.role === ROLES.STUDENT) studentId = req.studentProfile?._id;
    if (req.user.role === ROLES.PARENT && !C.ids(req.parentProfile?.studentIds || []).includes(String(studentId))) {
      throw new C.ApiError(403, 'Child not linked');
    }
    const student = await M.Student.findOne({ _id: studentId, schoolId: req.tenantId });
    if (!student) throw new C.ApiError(404, 'Student not found');
    
    const paid = await M.Payment.aggregate([
      { $match: { schoolId: fee.schoolId, feeId: fee._id, studentId: student._id, status: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const due = Math.max(0, Number(fee.amount || 0) + Number(fee.lateFee || 0) - Number(paid[0]?.total || 0));
    if (!due) throw new C.ApiError(400, 'No amount is due');
    
    const { referenceId, link } = await pay.createLink({
      fee,
      student,
      amount: due,
      callbackUrl: `${config.portalUrl}/student/fees`
    });
    
    const intent = await E.OnlinePaymentIntent.create({
      schoolId: req.tenantId,
      academicSessionId: fee.academicSessionId,
      studentId: student._id,
      feeId: fee._id,
      providerId: link.id,
      referenceId,
      amount: due,
      shortUrl: link.short_url,
      raw: { status: link.status }
    });
    
    return { intent, url: link.short_url };
  },

  async getPaymentIntents(req) {
    let f = { schoolId: req.tenantId };
    if (req.user.role === ROLES.STUDENT) f.studentId = req.studentProfile?._id;
    if (req.user.role === ROLES.PARENT) f.studentId = { $in: C.ids(req.parentProfile?.studentIds || []) };
    
    return E.OnlinePaymentIntent.find(f).sort('-createdAt').lean();
  },

  async listPayments(req) {
    const f = C.scoped(req, 'Payment', {
      schoolId: req.tenantId || req.user.schoolId
    });
    
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    let items;
    let nextCursor = null;
    
    if (req.query.after) {
      f._id = { $lt: new mongoose.Types.ObjectId(req.query.after) };
      items = await M.Payment.find(f).sort({ _id: -1 }).limit(limit).lean();
    } else {
      const { skip } = C.page(req.query);
      items = await M.Payment.find(f).sort('-createdAt').skip(skip).limit(limit).lean();
    }
    
    if (items.length > 0) {
      nextCursor = String(items[items.length - 1]._id);
    }
    
    const total = await M.Payment.countDocuments(C.scoped(req, 'Payment', { schoolId: req.tenantId || req.user.schoolId }));
    
    return { items, meta: { total, limit, nextCursor } };
  },

  async webhookHandler(req) {
    const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || '');
    if (!pay.verify(raw, req.headers['x-razorpay-signature'])) {
      throw new C.ApiError(401, 'Invalid webhook signature');
    }
    
    const event = JSON.parse(raw.toString());
    const link = event?.payload?.payment_link?.entity;
    const payment = event?.payload?.payment?.entity;
    if (!link?.id) return { success: true };
    
    const map = {
      'payment_link.paid': 'PAID',
      'payment_link.partially_paid': 'PARTIAL',
      'payment_link.expired': 'EXPIRED',
      'payment_link.cancelled': 'CANCELLED'
    };
    
    const targetStatus = map[event.event];
    if (!targetStatus) return { success: true };
    
    return runInTransaction(async (session) => {
      const intent = await E.OnlinePaymentIntent.findOne({ providerId: link.id }).session(session);
      if (!intent) return { success: true, reason: 'Intent not found' };
      
      intent.status = targetStatus;
      intent.raw = { event: event.event, paymentId: payment?.id };
      
      if (intent.status === 'PAID') {
        const receiptNo = `RZP-${payment?.id || link.id}`.slice(0, 50);
        let recorded = await M.Payment.findOne({ schoolId: intent.schoolId, receiptNo }).session(session);
        
        if (!recorded) {
          recorded = (await M.Payment.create([{
            schoolId: intent.schoolId,
            academicSessionId: intent.academicSessionId,
            feeId: intent.feeId,
            studentId: intent.studentId,
            amount: intent.amount,
            mode: 'ONLINE',
            transactionRef: payment?.id || link.id,
            receiptNo,
            paidAt: new Date(),
            status: 'SUCCESS'
          }], { session }))[0];
        } else {
          return { success: true, duplicate: true };
        }
        intent.raw = { ...intent.raw, paymentRecordId: String(recorded._id) };
      }
      
      await intent.save({ session });
      return { success: true };
    }).catch(err => {
      if (err.code === 11000) {
        return { success: true, duplicate: true };
      }
      throw err;
    });
  }
};
