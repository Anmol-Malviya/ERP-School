const C = require('../../core');
const service = require('./certificates.service');
const crud = require('../_shared/crud.controller')(service);

module.exports = {
  ...crud,
  review: C.asyncHandler(async (req, res) => {
    const result = await service.review(req, req.params.id);
    C.success(res, result, 'Certificate updated');
  })
};
