const service = require('./plans.service');
module.exports = require('../_shared/crud.controller')(service);
