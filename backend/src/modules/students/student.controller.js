const C = require('../../core');
const service = require('./student.service');
const crud = require('../_shared/crud.controller')(service);

module.exports = {
  ...crud,
  promote: C.asyncHandler(async (req, res) => {
    const result = await service.promote(req, req.params.id);
    C.success(res, result, 'Student promoted');
  }),
  enrollments: C.asyncHandler(async (req, res) => {
    const result = await service.enrollments(req, req.params.id);
    C.success(res, result, 'Enrollments list');
  })
};

