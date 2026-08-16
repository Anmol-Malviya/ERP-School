const { rateLimit } = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const cacheService = require('../services/cache.service');

const store = cacheService.isRedisEnabled()
  ? new RedisStore({
      sendCommand: (...args) => cacheService.getRedisClient().call(...args),
    })
  : undefined;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    return `rl:login:${req.ip}:${email}`;
  },
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many login attempts, please try again after 15 minutes.' },
  store,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => `rl:password:${req.user?._id || req.ip}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many password reset requests.' },
  store,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const refreshLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  keyGenerator: (req) => `rl:refresh:${req.user?._id || req.ip}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many refresh operations.' },
  store,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  keyGenerator: (req) => `rl:upload:${req.user?._id || req.ip}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Upload rate limit exceeded.' },
  store,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const paymentLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  keyGenerator: (req) => `rl:payment:${req.user?._id || req.ip}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Payment link request rate limit exceeded.' },
  store,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  keyGenerator: (req) => `rl:public:${req.ip}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many requests.' },
  store,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const authenticatedLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 600,
  keyGenerator: (req) => `rl:auth:${req.user?._id || req.ip}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'API request limit exceeded.' },
  store,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

module.exports = {
  loginLimiter,
  passwordLimiter,
  refreshLimiter,
  uploadLimiter,
  paymentLimiter,
  publicLimiter,
  authenticatedLimiter
};
