const C = require('../../core');
const service = require('./submissions.service');

module.exports = {
  getSubmissionsForAssignment: C.asyncHandler(async (req, res) => {
    const result = await service.getSubmissionsForAssignment(req, req.params.id);
    C.success(res, result);
  }),
  getMySubmissions: C.asyncHandler(async (req, res) => {
    const result = await service.getMySubmissions(req);
    C.success(res, result);
  }),
  submitAssignment: C.asyncHandler(async (req, res) => {
    const result = await service.submitAssignment(req, req.params.id);
    C.success(res, result, 'Assignment submitted');
  }),
  reviewSubmission: C.asyncHandler(async (req, res) => {
    const result = await service.reviewSubmission(req, req.params.id);
    C.success(res, result, 'Submission reviewed');
  })
};
