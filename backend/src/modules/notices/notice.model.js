const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({schoolId:id('School',{required:true,index:true}),title:{type:String,required:true},body:{type:String,required:true},audience:[{type:String,enum:['ALL','SCHOOL_ADMIN','TEACHER','STUDENT','PARENT']}],classIds:[id('Class')],sectionIds:[id('Section')],priority:{type:String,enum:['NORMAL','IMPORTANT','URGENT'],default:'NORMAL'},publishedAt:{type:Date,default:Date.now},expiresAt:Date,createdBy:id('User',{required:true})},{timestamps:true});
module.exports=model('Notice',schema);
