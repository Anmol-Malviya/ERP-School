const C=require('../../core');const Audit=require('./auditLog.model');const {ROLES}=require('../../constants/roles');const {tenantBase}=require('../_shared/crud.service');const mongoose = require('mongoose');

module.exports={
  async list(req){
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const filter=req.user.role===ROLES.SUPER_ADMIN&&!req.tenantId?{}:tenantBase(req);
    if(req.query.action)filter.action=req.query.action;
    if(req.query.resource)filter.resource=req.query.resource;
    
    let items;
    let nextCursor = null;
    
    if (req.query.after) {
      filter._id = { $lt: new mongoose.Types.ObjectId(req.query.after) };
      items = await Audit.find(filter).sort({ _id: -1 }).limit(limit).lean();
    } else {
      const { skip } = C.page(req.query);
      items = await Audit.find(filter).sort('-createdAt').skip(skip).limit(limit).lean();
    }
    
    if (items.length > 0) {
      nextCursor = String(items[items.length - 1]._id);
    }
    
    const total = await Audit.countDocuments(req.user.role===ROLES.SUPER_ADMIN&&!req.tenantId?{}:tenantBase(req));
    
    return {
      items,
      meta: {
        total,
        limit,
        nextCursor
      }
    };
  }
};
