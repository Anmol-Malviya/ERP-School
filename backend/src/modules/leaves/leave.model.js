const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({schoolId:id('School',{required:true,index:true}),applicantUserId:id('User',{required:true,index:true}),studentId:id('Student'),type:{type:String,enum:['SICK','CASUAL','EMERGENCY','OTHER'],default:'OTHER'},startsAt:{type:Date,required:true},endsAt:{type:Date,required:true},reason:{type:String,required:true},status:{type:String,enum:['PENDING','APPROVED','REJECTED','CANCELLED'],default:'PENDING',index:true},reviewedBy:id('User'),reviewNote:String},{timestamps:true});
module.exports=model('Leave',schema);
