const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({schoolId:id('School',{required:true,index:true}),userId:id('User',{unique:true,sparse:true}),employeeCode:{type:String,required:true},name:{type:String,required:true},email:String,phone:String,department:String,designation:{type:String,default:'Teacher'},subjectIds:[id('Subject')],classAssignments:[{academicSessionId:id('AcademicSession'),classId:id('Class'),sectionId:id('Section'),subjectId:id('Subject')}],joiningDate:Date,status:{type:String,enum:['ACTIVE','INACTIVE','ON_LEAVE'],default:'ACTIVE',index:true}},{timestamps:true});
schema.index({schoolId:1,employeeCode:1},{unique:true});
module.exports=model('Teacher',schema);
