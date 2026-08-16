const {createCrudService}=require('../_shared/crud.service');
module.exports=createCrudService({Model:require('./student.model'),resource:'Student',searchFields:['firstName','lastName','admissionNo','rollNo'],filterFields:['academicSessionId','classId','sectionId','status']});
