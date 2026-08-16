const {createCrudService}=require('../_shared/crud.service');
module.exports={
  sessions:createCrudService({Model:require('./academicSession.model'),resource:'AcademicSession',searchFields:['name','status'],filterFields:['status','isCurrent']}),
  classes:createCrudService({Model:require('./class.model'),resource:'Class',searchFields:['name','status'],filterFields:['academicSessionId','status']}),
  sections:createCrudService({Model:require('./section.model'),resource:'Section',searchFields:['name','room','status'],filterFields:['academicSessionId','classId','status']}),
  subjects:createCrudService({Model:require('./subject.model'),resource:'Subject',searchFields:['name','code','type'],filterFields:['academicSessionId','type','status']}),
};
