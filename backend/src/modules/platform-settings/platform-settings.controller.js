const C = require('../../core');
const service = require('./platform-settings.service');

module.exports = {
  getSetting: C.asyncHandler(async (req, res) => {
    const result = await service.getSetting(req, req.params.key);
    C.success(res, result);
  }),
  saveSetting: C.asyncHandler(async (req, res) => {
    const result = await service.saveSetting(req, req.params.key);
    C.success(res, result, 'Setting saved');
  })
};
