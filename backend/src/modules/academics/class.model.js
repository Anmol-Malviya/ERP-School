const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({schoolId:id('School',{required:true,index:true}),academicSessionId:id('AcademicSession',{required:true,index:true}),name:{type:String,required:true},numericOrder:{type:Number,default:0},classTeacherId:id('Teacher'),status:{type:String,enum:['ACTIVE','INACTIVE'],default:'ACTIVE'}},{timestamps:true});
schema.index({schoolId:1,academicSessionId:1,name:1},{unique:true});
module.exports=model('Class',schema);
