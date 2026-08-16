const C=require('../../core'),s=require('./report.service');
module.exports={
  dashboard:C.asyncHandler(async(req,res)=>C.success(res,await s.dashboard(req),'Dashboard report')),
  bootstrap:C.asyncHandler(async(req,res)=>C.success(res,await s.bootstrap(req),'Dashboard bootstrap data'))
};
