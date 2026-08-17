const C = require('../../core');
const service = require('./uploads.service');

module.exports = {
  sign: C.asyncHandler(async (req, res) => C.success(res, await service.sign(req), 'Upload signature created'))
};
