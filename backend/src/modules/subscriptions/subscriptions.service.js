const { createCrudService } = require('../_shared/crud.service');
const { Subscription } = require('../../models');
module.exports = createCrudService({
  Model: Subscription,
  resource: 'Subscription',
  tenantScoped: false
});
