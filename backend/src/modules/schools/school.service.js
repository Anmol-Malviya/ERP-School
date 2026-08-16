const C=require('../../core');const School=require('./school.model');
const search=q=>{
  if (!q.search) return {};
  const s = String(q.search).trim();
  if (s.length < 2 || s.length > 100) return {};
  return {$or:['name','code','slug','email'].map(f=>({[f]:new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i')}))};
};
module.exports={
 async list(req){const {page,limit,skip}=C.page(req.query);const filter={...C.schoolFilter(req),...search(req.query)};const[total,items]=await Promise.all([School.countDocuments(filter),School.find(filter).sort('-createdAt').skip(skip).limit(limit).lean()]);return{items,meta:{total,page,limit,pages:Math.ceil(total/limit)}}},
 async get(req,id){const item=await School.findOne({_id:id,...C.schoolFilter(req)}).lean();if(!item)throw new C.ApiError(404,'School not found');return item},
 async create(req){const item=await School.create({...req.body,createdBy:req.user._id});await C.audit(req,'CREATE','School',item._id);return item},
 async update(req,id){const item=await School.findOneAndUpdate({_id:id,...C.schoolFilter(req)},req.body,{new:true,runValidators:true});if(!item)throw new C.ApiError(404,'School not found');await C.audit(req,'UPDATE','School',item._id);return item},
 async remove(req,id){const item=await School.findByIdAndDelete(id);if(!item)throw new C.ApiError(404,'School not found');await C.audit(req,'DELETE','School',item._id);return item}
};
