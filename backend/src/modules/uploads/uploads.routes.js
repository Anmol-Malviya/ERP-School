const express = require('express');
const C = require('../../core');
const controller = require('./uploads.controller');
const { uploadLimiter } = require('../../middleware/rateLimiters');

const router = express.Router();
router.post('/sign', C.authenticate, C.tenant(false), uploadLimiter, controller.sign);

module.exports = router;
