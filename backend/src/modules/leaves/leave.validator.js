const {requireFields}=require('../../validators/common.validator');module.exports={create:[requireFields('startsAt','endsAt','reason')],review:[requireFields('status')]};
