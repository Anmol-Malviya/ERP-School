const express = require('express');
const C = require('../../core');
const { PERMISSIONS: P } = require('../../constants/permissions');
const controller = require('./payments.controller');
const { paymentLimiter } = require('../../middleware/rateLimiters');

const router = express.Router();
const base = [C.authenticate, C.tenant(true)];

router.post('/online-payments/payment-link', ...base, C.permission(P.FEES_READ), paymentLimiter, controller.createPaymentLink);
router.get('/online-payments', ...base, C.permission(P.FEES_READ), controller.getPaymentIntents);
router.get('/fees-payments', ...base, C.permission(P.FEES_READ), controller.listPayments);

module.exports = router;
