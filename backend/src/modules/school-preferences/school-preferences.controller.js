const C = require('../../core');
const service = require('./school-preferences.service');

module.exports = {
  get: C.asyncHandler(async (req, res) => C.success(res, await service.get(req))),
  update: C.asyncHandler(async (req, res) => C.success(res, await service.update(req), 'Preferences saved'))
};
