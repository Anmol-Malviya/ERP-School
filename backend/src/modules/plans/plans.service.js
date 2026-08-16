const { createCrudService } = require('../_shared/crud.service');
const { Plan } = require('../../models');
module.exports = createCrudService({
  Model: Plan,
  resource: 'Plan',
  tenantScoped: false
});
