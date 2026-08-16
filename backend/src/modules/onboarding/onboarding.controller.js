const C = require('../../core');
const service = require('./onboarding.service');

module.exports = {
  school: C.asyncHandler(async (req, res) => {
    const result = await service.onboardSchool(req);
    C.success(res, result, 'School onboarded', 201);
  }),
  administrator: C.asyncHandler(async (req, res) => {
    const result = await service.onboardAdministrator(req);
    C.success(res, result, 'Administrator created', 201);
  }),
  schoolAdmin: C.asyncHandler(async (req, res) => {
    const result = await service.onboardSchoolAdmin(req);
    C.success(res, result, 'School admin created', 201);
  }),
  teacher: C.asyncHandler(async (req, res) => {
    const result = await service.onboardTeacher(req);
    C.success(res, result, 'Teacher created', 201);
  }),
  student: C.asyncHandler(async (req, res) => {
    const result = await service.onboardStudent(req);
    C.success(res, result, 'Student admitted', 201);
  }),
  parent: C.asyncHandler(async (req, res) => {
    const result = await service.onboardParent(req);
    C.success(res, result, 'Parent created', 201);
  })
};
