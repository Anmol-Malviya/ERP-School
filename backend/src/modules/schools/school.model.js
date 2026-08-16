const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({
  name:{type:String,required:true,trim:true},code:{type:String,required:true,unique:true,index:true,uppercase:true,trim:true},slug:{type:String,required:true,unique:true,index:true,lowercase:true,trim:true},
  board:String,logoUrl:String,email:{type:String,lowercase:true,trim:true},phone:String,address:{line1:String,line2:String,city:String,state:String,postalCode:String,country:{type:String,default:'India'}},
  status:{type:String,enum:['ACTIVE','TRIAL','SUSPENDED','INACTIVE'],default:'TRIAL',index:true},subscription:{plan:{type:String,default:'TRIAL'},startsAt:Date,endsAt:Date,maxStudents:{type:Number,default:500},maxStaff:{type:Number,default:100}},
  settings:{timezone:{type:String,default:'Asia/Kolkata'},currency:{type:String,default:'INR'},academicYearLabel:String},createdBy:id('User')
},{timestamps:true});
module.exports=model('School',schema);
