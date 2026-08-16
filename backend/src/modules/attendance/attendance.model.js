const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({schoolId:id('School',{required:true,index:true}),academicSessionId:id('AcademicSession',{required:true,index:true}),date:{type:Date,required:true,index:true},classId:id('Class',{required:true,index:true}),sectionId:id('Section',{required:true,index:true}),studentId:id('Student',{required:true,index:true}),status:{type:String,enum:['PRESENT','ABSENT','LEAVE','LATE','HALF_DAY'],required:true},markedBy:id('User',{required:true}),remarks:String},{timestamps:true});
schema.index({schoolId:1,academicSessionId:1,date:1,studentId:1},{unique:true});
module.exports=model('Attendance',schema);
