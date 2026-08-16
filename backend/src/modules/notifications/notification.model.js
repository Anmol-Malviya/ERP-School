const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({schoolId:id('School',{index:true}),userId:id('User',{required:true,index:true}),title:{type:String,required:true},message:{type:String,required:true},type:{type:String,default:'INFO'},link:String,readAt:Date},{timestamps:true});
schema.index({userId:1,readAt:1,createdAt:-1});
module.exports=model('Notification',schema);
