const { Schema, id, model } = require('../../models/helpers');

function calculateResult(marks) {
  if (!Array.isArray(marks)) return { totalObtained: 0, totalMax: 0, percentage: 0, grade: 'F' };
  const totalObtained = marks.reduce((s, r) => s + Number(r.marksObtained || 0), 0);
  const totalMax = marks.reduce((s, r) => s + Number(r.maxMarks || 0), 0);
  const percentage = totalMax ? Number(((totalObtained / totalMax) * 100).toFixed(2)) : 0;
  
  let grade = 'F';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 50) grade = 'D';
  
  return { totalObtained, totalMax, percentage, grade };
}

const schema=new Schema({schoolId:id('School',{required:true,index:true}),academicSessionId:id('AcademicSession',{required:true,index:true}),examinationId:id('Examination',{required:true,index:true}),studentId:id('Student',{required:true,index:true}),classId:id('Class',{required:true,index:true}),sectionId:id('Section',{required:true,index:true}),marks:[{subjectId:id('Subject',{required:true}),marksObtained:Number,maxMarks:Number,grade:String,remarks:String}],totalObtained:{type:Number,default:0},totalMax:{type:Number,default:0},percentage:{type:Number,default:0},grade:String,rank:Number,published:{type:Boolean,default:false,index:true},enteredBy:id('User')},{timestamps:true});
schema.index({schoolId:1,academicSessionId:1,examinationId:1,studentId:1},{unique:true});
schema.index({ schoolId: 1, studentId: 1, published: 1, createdAt: -1 });

schema.pre('save',function(next){
  const calc = calculateResult(this.marks);
  this.totalObtained = calc.totalObtained;
  this.totalMax = calc.totalMax;
  this.percentage = calc.percentage;
  this.grade = calc.grade;
  next();
});

schema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (!update) return next();
  
  let marks = null;
  if (update.marks) marks = update.marks;
  else if (update.$set && update.$set.marks) marks = update.$set.marks;
  
  if (marks) {
    const calc = calculateResult(marks);
    if (update.$set) {
      update.$set.totalObtained = calc.totalObtained;
      update.$set.totalMax = calc.totalMax;
      update.$set.percentage = calc.percentage;
      update.$set.grade = calc.grade;
    } else {
      update.totalObtained = calc.totalObtained;
      update.totalMax = calc.totalMax;
      update.percentage = calc.percentage;
      update.grade = calc.grade;
    }
  }
  next();
});

const ResultModel = model('Result',schema);
module.exports = ResultModel;
module.exports.calculateResult = calculateResult;

