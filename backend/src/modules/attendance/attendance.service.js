const C=require('../../core');const Attendance=require('./attendance.model');const {createCrudService}=require('../_shared/crud.service');
const { ROLES } = require('../../constants/roles');
const queueService = require('../../services/queue.service');

const base=createCrudService({Model:Attendance,resource:'Attendance',searchFields:['status','remarks'],filterFields:['academicSessionId','classId','sectionId','studentId','status','date']});

module.exports={
  ...base,
  async bulk(req){
    const{academicSessionId,date,classId,sectionId,records=[]}=req.body;
    if(!academicSessionId||!date||!classId||!sectionId||!Array.isArray(records)) {
      throw new C.ApiError(400,'session, date, class, section and records are required');
    }
    
    if(req.user.role===ROLES.TEACHER){
      const assigned=(req.teacherProfile?.classAssignments||[]).some(x=>String(x.classId)===String(classId)&&String(x.sectionId)===String(sectionId));
      if(!assigned)throw new C.ApiError(403,'Class/section is not assigned to this teacher');
    }

    const d=new Date(date);
    d.setUTCHours(0,0,0,0);
    
    const ops=records.map(r=>({
      updateOne:{
        filter:{schoolId:req.tenantId,academicSessionId,date:d,studentId:r.studentId},
        update:{$set:{classId,sectionId,status:r.status,remarks:r.remarks,markedBy:req.user._id}},
        upsert:true
      }
    }));
    
    const result=ops.length?await Attendance.bulkWrite(ops,{ordered:false}):{};
    
    const absent=records.filter(x=>['ABSENT','LATE'].includes(x.status)).map(x=>x.studentId);
    if(absent.length) {
      await queueService.addNotificationJob('ATTENDANCE_NOTIFY', {
        studentIds: absent,
        payload: {
          schoolId: req.tenantId,
          title: 'Attendance update',
          message: 'Your child attendance has been updated.',
          type: 'ATTENDANCE',
          link: '/parent/attendance'
        }
      });
    }

    await C.audit(req,'BULK_MARK','Attendance',undefined,{date,count:records.length});
    return result;
  }
};
