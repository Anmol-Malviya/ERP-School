const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({schoolId:id('School',{required:true,index:true}),academicSessionId:id('AcademicSession',{required:true,index:true}),classId:id('Class',{required:true,index:true}),sectionId:id('Section',{required:true,index:true}),day:{type:String,enum:['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'],required:true},periods:[{periodNo:Number,startsAt:String,endsAt:String,subjectId:id('Subject'),teacherId:id('Teacher'),room:String,type:{type:String,default:'CLASS'}}],published:{type:Boolean,default:false}},{timestamps:true});
schema.index({schoolId:1,academicSessionId:1,classId:1,sectionId:1,day:1},{unique:true});
module.exports=model('Timetable',schema);
