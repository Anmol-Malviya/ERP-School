const express=require('express');
const C=require('../../core');
function buildCrudRouter({controller,readPermission,writePermission,tenantScoped=true,validateCreate=[],validateUpdate=[]}){
  const router=express.Router();const base=[C.authenticate,...(tenantScoped?[C.tenant(true)]:[])];
  router.get('/',...base,C.permission(readPermission),controller.list);
  router.get('/:id',...base,C.permission(readPermission),C.validateId,controller.get);
  router.post('/',...base,C.permission(writePermission),...validateCreate,controller.create);
  router.patch('/:id',...base,C.permission(writePermission),C.validateId,...validateUpdate,controller.update);
  router.delete('/:id',...base,C.permission(writePermission),C.validateId,controller.remove);
  return router;
}
module.exports=buildCrudRouter;
