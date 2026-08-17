const express=require('express');
const C=require('../core');
const router=express.Router();

// Authentication must be mounted explicitly because the legacy secure-auth router was removed.
router.use('/auth', require('../modules/auth/auth.routes'));

// Dashboard bootstrap keeps the school portal to a single initial request.
router.get('/dashboard/bootstrap', C.authenticate, require('../modules/reports/report.controller').bootstrap);

router.use('/schools',require('../modules/schools/school.routes'));
router.use('/users',require('../modules/users/user.routes'));
router.use('/administrators',require('../modules/administrators/administrator.routes'));
router.use('/academics',require('../modules/academics/academics.routes'));
router.use('/students',require('../modules/students/student.routes'));
router.use('/parents',require('../modules/parents/parent.routes'));
router.use('/teachers',require('../modules/teachers/teacher.routes'));
router.use('/timetable',require('../modules/timetable/timetable.routes'));
router.use('/assignments',require('../modules/assignments/assignment.routes'));
router.use('/examinations',require('../modules/examinations/examination.routes'));
router.use('/attendance',require('../modules/attendance/attendance.routes'));
router.use('/results',require('../modules/results/result.routes'));
router.use('/',require('../modules/fees/fee.routes'));
router.use('/notices',require('../modules/notices/notice.routes'));
router.use('/leaves',require('../modules/leaves/leave.routes'));
router.use('/notifications',require('../modules/notifications/notification.routes'));
router.use('/reports',require('../modules/reports/report.routes'));
router.use('/audit',require('../modules/audit/audit.routes'));
router.use('/onboarding', require('../modules/onboarding/onboarding.routes'));
router.use('/calendar', require('../modules/calendar/calendar.routes'));
router.use('/certificates', require('../modules/certificates/certificates.routes'));
router.use('/plans', require('../modules/plans/plans.routes'));
router.use('/modules', require('../modules/modules/modules.routes'));
router.use('/subscriptions', require('../modules/subscriptions/subscriptions.routes'));
router.use('/support', require('../modules/support/support.routes'));
router.use('/platform-settings', require('../modules/platform-settings/platform-settings.routes'));
router.use('/school-preferences', require('../modules/school-preferences/school-preferences.routes'));
router.use('/uploads', require('../modules/uploads/uploads.routes'));
router.use('/assignment-submissions', require('../modules/submissions/submissions.routes'));
router.use('/', require('../modules/payments/payments.routes'));

module.exports=router;
