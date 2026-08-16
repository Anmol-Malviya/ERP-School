const {requireFields}=require('../../validators/common.validator');module.exports={login:[requireFields('email','password')],changePassword:[requireFields('currentPassword','newPassword')]};
