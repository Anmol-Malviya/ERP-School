const express=require('express');
const C=require('../../core');
const c=require('./auth.controller'),v=require('./auth.validator');
const { loginLimiter, refreshLimiter, passwordLimiter } = require('../../middleware/rateLimiters');

const router=express.Router();

router.post('/login', loginLimiter, ...v.login, c.login);
router.post('/refresh', refreshLimiter, c.refresh);
router.get('/me', C.authenticate, c.me);
router.post('/logout', C.authenticate, c.logout);
router.post('/change-password', C.authenticate, passwordLimiter, ...v.changePassword, c.changePassword);

module.exports=router;

