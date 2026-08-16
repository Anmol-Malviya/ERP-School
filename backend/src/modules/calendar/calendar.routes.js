const { PERMISSIONS: P } = require('../../constants/permissions');
module.exports = require('../_shared/crud.routes')({
  controller: require('./calendar.controller'),
  readPermission: P.ACADEMICS_READ,
  writePermission: P.ACADEMICS_WRITE
});
