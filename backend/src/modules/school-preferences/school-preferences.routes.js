const express = require('express');
const C = require('../../core');
const { ROLES } = require('../../constants/roles');
const controller = require('./school-preferences.controller');

const router = express.Router();
router.get('/', C.authenticate, C.tenant(true), controller.get);
router.patch('/', C.authenticate, C.tenant(true), C.allowRoles(ROLES.SUPER_ADMIN, ROLES.ADMINISTRATOR, ROLES.SCHOOL_ADMIN), controller.update);
router.put('/', C.authenticate, C.tenant(true), C.allowRoles(ROLES.SUPER_ADMIN, ROLES.ADMINISTRATOR, ROLES.SCHOOL_ADMIN), controller.update);

module.exports = router;
