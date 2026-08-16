const express = require('express');
const C = require('../../core');
const { ROLES } = require('../../constants/roles');
const controller = require('./platform-settings.controller');

const router = express.Router();
const base = [C.authenticate, C.allowRoles(ROLES.SUPER_ADMIN)];

router.get('/:key', ...base, controller.getSetting);
router.put('/:key', ...base, controller.saveSetting);

module.exports = router;
