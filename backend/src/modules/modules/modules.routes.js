const express = require('express');
const C = require('../../core');
const { ROLES } = require('../../constants/roles');
const controller = require('./modules.controller');

const router = express.Router();
const base = [C.authenticate, C.allowRoles(ROLES.SUPER_ADMIN)];

router.get('/', ...base, controller.list);
router.post('/', ...base, controller.create);
router.get('/:id', ...base, C.validateId, controller.get);
router.patch('/:id', ...base, C.validateId, controller.update);
router.delete('/:id', ...base, C.validateId, controller.remove);

module.exports = router;
