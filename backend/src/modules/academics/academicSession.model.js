const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({schoolId:id('School',{required:true,index:true}),name:{type:String,required:true},startsAt:{type:Date,required:true},endsAt:{type:Date,required:true},isCurrent:{type:Boolean,default:false,index:true},status:{type:String,enum:['PLANNED','ACTIVE','CLOSED'],default:'PLANNED'}},{timestamps:true});
schema.index({schoolId:1,name:1},{unique:true});
module.exports=model('AcademicSession',schema);
