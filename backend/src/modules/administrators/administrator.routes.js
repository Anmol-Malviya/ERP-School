const express=require('express');
const C=require('../../core');
const {ROLES}=require('../../constants/roles');
const {PERMISSIONS:P}=require('../../constants/permissions');
const c=require('./administrator.controller');
const v=require('./administrator.validator');
const router=express.Router();

router.use(C.authenticate,C.allowRoles(ROLES.SUPER_ADMIN));
router.get('/',C.permission(P.USERS_READ),c.list);
router.get('/:id',C.permission(P.USERS_READ),C.validateId,c.get);
router.post('/',C.permission(P.USERS_WRITE),...v.create,c.create);
router.patch('/:id',C.permission(P.USERS_WRITE),C.validateId,c.update);
router.delete('/:id',C.permission(P.USERS_WRITE),C.validateId,c.remove);

module.exports=router;
