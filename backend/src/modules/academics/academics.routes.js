const express=require('express');
const build=require('../_shared/crud.routes');
const C=require('../../core');
const {PERMISSIONS:P}=require('../../constants/permissions');
const c=require('./academics.controller'),v=require('./academics.validator');

const router=express.Router();

const sessionsRouter = build({
  controller: c.sessions,
  readPermission: P.ACADEMICS_READ,
  writePermission: P.ACADEMICS_WRITE,
  validateCreate: v.sessions.create
});
sessionsRouter.post('/:id/make-current', C.authenticate, C.tenant(true), C.permission(P.ACADEMICS_WRITE), C.validateId, c.sessions.makeCurrent);

router.use('/sessions', sessionsRouter);

const mount=(path,key)=>router.use(path,build({controller:c[key],readPermission:P.ACADEMICS_READ,writePermission:P.ACADEMICS_WRITE,validateCreate:v[key].create}));
mount('/classes','classes');
mount('/sections','sections');
mount('/subjects','subjects');

module.exports=router;

