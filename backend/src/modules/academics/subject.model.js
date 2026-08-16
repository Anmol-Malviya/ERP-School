const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({schoolId:id('School',{required:true,index:true}),academicSessionId:id('AcademicSession',{required:true,index:true}),name:{type:String,required:true},code:{type:String,required:true,uppercase:true},type:{type:String,enum:['CORE','ELECTIVE','PRACTICAL','ACTIVITY'],default:'CORE'},classIds:[id('Class')],teacherIds:[id('Teacher')],maxMarks:{type:Number,default:100},passingMarks:{type:Number,default:33},status:{type:String,enum:['ACTIVE','INACTIVE'],default:'ACTIVE'}},{timestamps:true});
schema.index({schoolId:1,academicSessionId:1,code:1},{unique:true});
module.exports=model('Subject',schema);
