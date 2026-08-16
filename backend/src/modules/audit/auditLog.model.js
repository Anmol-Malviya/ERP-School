const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({schoolId:id('School',{index:true}),userId:id('User',{index:true}),action:{type:String,required:true,index:true},resource:{type:String,required:true,index:true},resourceId:Schema.Types.ObjectId,metadata:Schema.Types.Mixed,ip:String,userAgent:String},{timestamps:true});
schema.index({schoolId:1,createdAt:-1});
module.exports=model('AuditLog',schema);
