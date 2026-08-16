const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({schoolId:id('School',{required:true,index:true}),academicSessionId:id('AcademicSession',{required:true,index:true}),classId:id('Class',{required:true,index:true}),name:{type:String,required:true},capacity:{type:Number,default:50},room:String,classTeacherId:id('Teacher'),status:{type:String,enum:['ACTIVE','INACTIVE'],default:'ACTIVE'}},{timestamps:true});
schema.index({schoolId:1,academicSessionId:1,classId:1,name:1},{unique:true});
module.exports=model('Section',schema);
