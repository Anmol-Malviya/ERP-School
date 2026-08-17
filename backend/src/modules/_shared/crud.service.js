const C = require('../../core');
const { ROLES } = require('../../constants/roles');
const mongoose = require('mongoose');
const cacheService = require('../../services/cache.service');
const esc = value => String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const tenantBase = req => req.user.role===ROLES.SUPER_ADMIN?(req.tenantId?{schoolId:req.tenantId}:{}):{schoolId:req.tenantId||req.user.schoolId};
const queryFilters = (query, fields=[]) => Object.fromEntries(fields.filter(f=>query[f]!==undefined&&query[f]!=='').map(f=>[f,query[f]]));
const searchFilter = (query, fields=[]) => {
  if (!query.search || !fields.length) return {};
  const s = String(query.search).trim();
  if (s.length < 2 || s.length > 100) return {};
  return { $or: fields.map(field => ({ [field]: new RegExp(esc(s), 'i') })) };
};

function createCrudService({Model,resource,searchFields=[],filterFields=[],tenantScoped=true,beforeCreate,beforeUpdate,baseFilter,allowDelete=true}){
  const scope = req => {
    const base = {...(tenantScoped?tenantBase(req):{}),...(baseFilter?baseFilter(req):{})};
    return C.scoped(req,resource,base);
  };
  return {
    async list(req){
      const limit=Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
      const filter={...scope(req),...queryFilters(req.query,filterFields),...searchFilter(req.query,searchFields)};
      
      let items;
      let nextCursor = null;
      
      if (req.query.after) {
        filter._id = { $lt: new mongoose.Types.ObjectId(req.query.after) };
        items = await Model.find(filter).sort({ _id: -1 }).limit(limit).lean();
      } else {
        const { skip } = C.page(req.query);
        items = await Model.find(filter).sort(req.query.sort || '-createdAt').skip(skip).limit(limit).lean();
      }
      
      if (items.length > 0) {
        nextCursor = String(items[items.length - 1]._id);
      }
      
      const total = await Model.countDocuments(filter);
      
      return {
        items,
        meta: {
          total,
          limit,
          nextCursor
        }
      };
    },
    async get(req,id){const item=await Model.findOne({...scope(req),_id:id}).lean();if(!item)throw new C.ApiError(404,`${resource} not found`);return item},
    async create(req){let data={...req.body};if(tenantScoped&&req.tenantId)data.schoolId=req.tenantId;if(beforeCreate)data=await beforeCreate(req,data);const item=await Model.create(data);await C.audit(req,'CREATE',resource,item._id);return item},
    async update(req,id){
      let data={...req.body};
      delete data._id;
      delete data.schoolId;
      if(beforeUpdate)data=await beforeUpdate(req,data);
      const item=await Model.findOneAndUpdate({...scope(req),_id:id},data,{new:true,runValidators:true});
      if(!item)throw new C.ApiError(404,`${resource} not found`);
      
      if (item.userId) {
        await cacheService.del(`auth:user:${item.userId}`);
      } else if (resource === 'User') {
        await cacheService.del(`auth:user:${id}`);
      }
      
      await C.audit(req,'UPDATE',resource,item._id);
      return item;
    },
    async remove(req,id){
      if (!allowDelete) {
        throw new C.ApiError(405, `Deletion of ${resource} is not allowed`);
      }
      const item=await Model.findOneAndDelete({...scope(req),_id:id});
      if(!item)throw new C.ApiError(404,`${resource} not found`);
      
      if (item.userId) {
        await cacheService.del(`auth:user:${item.userId}`);
      } else if (resource === 'User') {
        await cacheService.del(`auth:user:${id}`);
      }
      
      await C.audit(req,'DELETE',resource,item._id);
      return item;
    },
  };
}
module.exports={createCrudService,tenantBase};
