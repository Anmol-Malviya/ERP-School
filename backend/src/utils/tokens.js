const jwt = require('jsonwebtoken');
const config = require('../config/env');
const accessToken = user => jwt.sign({ sub:String(user._id), role:user.role, schoolId:user.schoolId?String(user.schoolId):null }, config.accessSecret, { expiresIn:config.accessExpiresIn });
const refreshToken = user => jwt.sign({ sub:String(user._id), role:user.role, nonce:Date.now() }, config.refreshSecret, { expiresIn:config.refreshExpiresIn });
const verifyAccess = token => jwt.verify(token, config.accessSecret);
const verifyRefresh = token => jwt.verify(token, config.refreshSecret);
module.exports = { accessToken, refreshToken, verifyAccess, verifyRefresh };
