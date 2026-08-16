const factory = require('../_shared/crud.controller');
const service = require('./academics.service');
const C = require('../../core');

const sessionsCrud = factory(service.sessions);

module.exports = {
  sessions: {
    ...sessionsCrud,
    makeCurrent: C.asyncHandler(async (req, res) => {
      const result = await service.sessions.makeCurrent(req, req.params.id);
      C.success(res, result, 'Current academic session updated');
    })
  },
  classes: factory(service.classes),
  sections: factory(service.sections),
  subjects: factory(service.subjects)
};

