const C=require('../../core'),s=require('./audit.service');module.exports={list:C.asyncHandler(async(req,res)=>{const r=await s.list(req);C.success(res,r.items,'Audit logs',200,r.meta)})};
