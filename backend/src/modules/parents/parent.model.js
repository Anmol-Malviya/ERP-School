const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({schoolId:id('School',{required:true,index:true}),userId:id('User',{unique:true,sparse:true}),name:{type:String,required:true},relation:{type:String,enum:['FATHER','MOTHER','GUARDIAN','OTHER'],default:'GUARDIAN'},phone:{type:String,required:true},email:String,occupation:String,studentIds:[id('Student')],address:{line1:String,city:String,state:String,postalCode:String},status:{type:String,enum:['ACTIVE','INACTIVE'],default:'ACTIVE'}},{timestamps:true});
module.exports=model('Parent',schema);
