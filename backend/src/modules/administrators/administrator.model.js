const { Schema, id, model } = require('../../models/helpers');
const schema=new Schema({userId:id('User',{required:true,unique:true}),assignedSchoolIds:[id('School')],designation:{type:String,default:'Administrator'},employeeCode:String,notes:String},{timestamps:true});
module.exports=model('Administrator',schema);
