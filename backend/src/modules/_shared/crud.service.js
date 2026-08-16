const C = require('../../core');
const { ROLES } = require('../../constants/roles');
const esc = value => String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const tenantBase = req => req.user.role===ROLES.SUPER_ADMIN?(req.tenantId?{schoolId:req.tenantId}:{}):{schoolId:req.tenantId||req.user.schoolId};
const queryFilters = (query, fields=[]) => Object.fromEntries(fields.filter(f=>query[f]!==undefined&&query[f]!=='').map(f=>[f,query[f]]));
const searchFilter = (query, fields=[]) => query.search&&fields.length ? {$or:fields.map(field=>({[field]:new RegExp(esc(query.search),'i')}))} : {};

function createCrudService({Model,resource,searchFields=[],filterFields=[],tenantScoped=true,beforeCreate,beforeUpdate,baseFilter}){
  const scope = req => {
    const base = {...(tenantScoped?tenantBase(req):{}),...(baseFilter?baseFilter(req):{})};
    return C.scoped(req,resource,base);
  };
  return {
    async list(req){const {page,limit,skip}=C.page(req.query);const filter={...scope(req),...queryFilters(req.query,filterFields),...searchFilter(req.query,searchFields)};const [total,items]=await Promise.all([Model.countDocuments(filter),Model.find(filter).sort(req.query.sort||'-createdAt').skip(skip).limit(limit).lean()]);return{items,meta:{total,page,limit,pages:Math.ceil(total/limit)}}},
    async get(req,id){const item=await Model.findOne({...scope(req),_id:id}).lean();if(!item)throw new C.ApiError(404,`${resource} not found`);return item},
    async create(req){let data={...req.body};if(tenantScoped&&req.tenantId)data.schoolId=req.tenantId;if(beforeCreate)data=await beforeCreate(req,data);const item=await Model.create(data);await C.audit(req,'CREATE',resource,item._id);return item},
    async update(req,id){let data={...req.body};delete data._id;delete data.schoolId;if(beforeUpdate)data=await beforeUpdate(req,data);const item=await Model.findOneAndUpdate({...scope(req),_id:id},data,{new:true,runValidators:true});if(!item)throw new C.ApiError(404,`${resource} not found`);await C.audit(req,'UPDATE',resource,item._id);return item},
    async remove(req,id){const item=await Model.findOneAndDelete({...scope(req),_id:id});if(!item)throw new C.ApiError(404,`${resource} not found`);await C.audit(req,'DELETE',resource,item._id);return item},
  };
}
module.exports={createCrudService,tenantBase};
