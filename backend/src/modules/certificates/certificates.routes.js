const express = require('express');
const C = require('../../core');
const { ROLES } = require('../../constants/roles');
const controller = require('./certificates.controller');

const router = express.Router();
const base = [C.authenticate, C.tenant(true)];

router.get('/', ...base, controller.list);
router.post('/', ...base, controller.create);
router.post('/:id/review', ...base, C.allowRoles(ROLES.SUPER_ADMIN, ROLES.ADMINISTRATOR, ROLES.SCHOOL_ADMIN), C.validateId, controller.review);

module.exports = router;
