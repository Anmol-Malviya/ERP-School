const express=require('express');
const C=require('../core');
const router=express.Router();

// Custom dashboard bootstrap route
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

// Onboarding & Onboarding-related Modular routes
router.use('/onboarding', require('../modules/onboarding/onboarding.routes'));

// Calendar modular routes
router.use('/calendar', require('../modules/calendar/calendar.routes'));

// Certificates modular routes
router.use('/certificates', require('../modules/certificates/certificates.routes'));

// Billing/Plans/Subscriptions modular routes
router.use('/plans', require('../modules/plans/plans.routes'));
router.use('/subscriptions', require('../modules/subscriptions/subscriptions.routes'));

// Support Ticket modular routes
router.use('/support', require('../modules/support/support.routes'));

// Platform Settings key-value modular routes
router.use('/platform-settings', require('../modules/platform-settings/platform-settings.routes'));

// Upload Sign modular routes
router.use('/uploads', require('../modules/uploads/uploads.routes'));

// Assignment submissions modular routes
router.use('/assignment-submissions', require('../modules/submissions/submissions.routes'));

// Payments modular routes (handles online-payments, fees-payments)
router.use('/', require('../modules/payments/payments.routes'));

module.exports=router;

