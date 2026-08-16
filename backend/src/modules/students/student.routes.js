const express = require('express');
const C = require('../../core');
const { PERMISSIONS: P } = require('../../constants/permissions');
const controller = require('./student.controller');
const v = require('./student.validator');

const router = express.Router();
const base = [C.authenticate, C.tenant(true)];

router.post('/:id/promote', ...base, C.permission(P.STUDENTS_WRITE), C.validateId, controller.promote);
router.get('/:id/enrollments', ...base, C.permission(P.STUDENTS_READ), C.validateId, controller.enrollments);

const crudRouter = require('../_shared/crud.routes')({
  controller,
  readPermission: P.STUDENTS_READ,
  writePermission: P.STUDENTS_WRITE,
  validateCreate: v.create,
  validateUpdate: v.update
});

router.use('/', crudRouter);

module.exports = router;

