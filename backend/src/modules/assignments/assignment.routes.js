const express = require('express');
const C = require('../../core');
const { PERMISSIONS: P } = require('../../constants/permissions');
const controller = require('./assignment.controller');
const submissionsController = require('../submissions/submissions.controller');
const v = require('./assignment.validator');

const router = express.Router();
const base = [C.authenticate, C.tenant(true)];

router.get('/:id/submissions', ...base, C.permission(P.ASSIGNMENTS_WRITE), C.validateId, submissionsController.getSubmissionsForAssignment);
router.post('/:id/submit', ...base, C.validateId, submissionsController.submitAssignment);

const crudRouter = require('../_shared/crud.routes')({
  controller,
  readPermission: P.ASSIGNMENTS_READ,
  writePermission: P.ASSIGNMENTS_WRITE,
  validateCreate: v.create
});

router.use('/', crudRouter);

module.exports = router;

