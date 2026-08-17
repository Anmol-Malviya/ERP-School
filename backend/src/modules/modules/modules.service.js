const { createCrudService } = require('../_shared/crud.service');
const { ModuleCatalog } = require('../../models');

module.exports = createCrudService({
  Model: ModuleCatalog,
  resource: 'ModuleCatalog',
  tenantScoped: false,
  searchFields: ['key', 'name', 'description'],
  filterFields: ['active', 'enabledByDefault']
});
