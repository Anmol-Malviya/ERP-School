const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({schoolId:id('School',{required:true,index:true}),academicSessionId:id('AcademicSession',{required:true,index:true}),classId:id('Class',{required:true,index:true}),sectionId:id('Section',{index:true}),subjectId:id('Subject',{required:true,index:true}),teacherId:id('Teacher'),title:{type:String,required:true},description:String,type:{type:String,enum:['HOMEWORK','ASSIGNMENT','PROJECT'],default:'ASSIGNMENT'},attachments:[{name:String,url:String}],dueAt:Date,maxMarks:Number,status:{type:String,enum:['DRAFT','PUBLISHED','CLOSED'],default:'DRAFT',index:true}},{timestamps:true});
schema.index({ schoolId: 1, classId: 1, sectionId: 1, status: 1, dueAt: -1 });
module.exports=model('Assignment',schema);
