const C = require('../../core');
const service = require('./payments.service');

module.exports = {
  createPaymentLink: C.asyncHandler(async (req, res) => {
    const result = await service.createPaymentLink(req);
    C.success(res, result, 'Payment link created', 201);
  }),
  getPaymentIntents: C.asyncHandler(async (req, res) => {
    const result = await service.getPaymentIntents(req);
    C.success(res, result);
  }),
  listPayments: C.asyncHandler(async (req, res) => {
    const result = await service.listPayments(req);
    C.success(res, result.items, 'Payments list', 200, result.meta);
  }),
  webhookHandler: async (req, res) => {
    try {
      const result = await service.webhookHandler(req);
      res.json(result);
    } catch (err) {
      res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Webhook failed' });
    }
  }
};
