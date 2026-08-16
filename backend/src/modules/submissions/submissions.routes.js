const express = require('express');
const C = require('../../core');
const { PERMISSIONS: P } = require('../../constants/permissions');
const controller = require('./submissions.controller');

const router = express.Router();
const base = [C.authenticate, C.tenant(true)];

router.get('/me', ...base, controller.getMySubmissions);
router.patch('/:id/review', ...base, C.permission(P.ASSIGNMENTS_WRITE), C.validateId, controller.reviewSubmission);

module.exports = router;
