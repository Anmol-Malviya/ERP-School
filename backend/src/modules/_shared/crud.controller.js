const C=require('../../core');
module.exports = service => ({
  list:C.asyncHandler(async(req,res)=>{const result=await service.list(req);C.success(res,result.items,'List loaded',200,result.meta)}),
  get:C.asyncHandler(async(req,res)=>C.success(res,await service.get(req,req.params.id))),
  create:C.asyncHandler(async(req,res)=>C.success(res,await service.create(req),'Created',201)),
  update:C.asyncHandler(async(req,res)=>C.success(res,await service.update(req,req.params.id),'Updated')),
  remove:C.asyncHandler(async(req,res)=>{await service.remove(req,req.params.id);C.success(res,null,'Deleted')}),
});
