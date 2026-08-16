const express = require('express');
const C = require('../../core');
const { ROLES } = require('../../constants/roles');
const { PERMISSIONS } = require('../../constants/permissions');
const controller = require('./onboarding.controller');

const router = express.Router();

router.post('/school', C.authenticate, C.allowRoles(ROLES.SUPER_ADMIN), controller.school);
router.post('/administrator', C.authenticate, C.allowRoles(ROLES.SUPER_ADMIN), controller.administrator);
router.post('/school-admin', C.authenticate, C.tenant(true), C.permission(PERMISSIONS.USERS_WRITE), controller.schoolAdmin);
router.post('/teacher', C.authenticate, C.tenant(true), C.permission(PERMISSIONS.TEACHERS_WRITE), controller.teacher);
router.post('/student', C.authenticate, C.tenant(true), C.permission(PERMISSIONS.STUDENTS_WRITE), controller.student);
router.post('/parent', C.authenticate, C.tenant(true), C.permission(PERMISSIONS.STUDENTS_WRITE), controller.parent);

module.exports = router;
