const service = require('./calendar.service');
module.exports = require('../_shared/crud.controller')(service);
