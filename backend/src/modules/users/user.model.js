const bcrypt = require('bcryptjs');
const { Schema, id, model } = require('../../models/helpers');
const { ROLE_VALUES } = require('../../constants/roles');

const schema = new Schema({
  name:{type:String,required:true,trim:true}, email:{type:String,required:true,unique:true,index:true,lowercase:true,trim:true},
  password:{type:String,required:true,minlength:8,select:false}, role:{type:String,enum:ROLE_VALUES,required:true,index:true},
  schoolId:id('School',{default:null,index:true}), assignedSchoolIds:[id('School')], permissions:[String], phone:String, avatarUrl:String,
  status:{type:String,enum:['ACTIVE','INACTIVE','SUSPENDED'],default:'ACTIVE',index:true}, lastLoginAt:Date, refreshTokenHash:{type:String,select:false}
},{timestamps:true});
schema.index({schoolId:1,role:1,status:1});
schema.pre('save',async function(next){if(!this.isModified('password'))return next();this.password=await bcrypt.hash(this.password,12);next();});
schema.methods.comparePassword=function(value){return bcrypt.compare(value,this.password)};
schema.methods.setRefreshToken=async function(token){this.refreshTokenHash=token?await bcrypt.hash(token,10):undefined};
schema.methods.compareRefreshToken=function(token){return this.refreshTokenHash?bcrypt.compare(token,this.refreshTokenHash):false};
schema.set('toJSON',{transform(_d,r){delete r.password;delete r.refreshTokenHash;return r}});
module.exports=model('User',schema);
