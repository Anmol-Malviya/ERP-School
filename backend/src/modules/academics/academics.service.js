const {createCrudService}=require('../_shared/crud.service');
const AcademicSession = require('./academicSession.model');
const C = require('../../core');
const { runInTransaction } = require('../../utils/transactions');

const sessionsBase = createCrudService({Model:AcademicSession,resource:'AcademicSession',searchFields:['name','status'],filterFields:['status','isCurrent']});

const sessions = {
  ...sessionsBase,
  async makeCurrent(req, id) {
    return runInTransaction(async (session) => {
      const row = await AcademicSession.findOne({ _id: id, schoolId: req.tenantId }).session(session);
      if (!row) throw new C.ApiError(404, 'Session not found');
      
      await AcademicSession.updateMany(
        { schoolId: req.tenantId },
        { $set: { isCurrent: false } },
        { session }
      );
      
      row.isCurrent = true;
      row.status = 'ACTIVE';
      await row.save({ session });
      return row;
    });
  }
};

module.exports={
  sessions,
  classes:createCrudService({Model:require('./class.model'),resource:'Class',searchFields:['name','status'],filterFields:['academicSessionId','status']}),
  sections:createCrudService({Model:require('./section.model'),resource:'Section',searchFields:['name','room','status'],filterFields:['academicSessionId','classId','status']}),
  subjects:createCrudService({Model:require('./subject.model'),resource:'Subject',searchFields:['name','code','type'],filterFields:['academicSessionId','type','status']}),
};

