const { rateLimit } = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const cacheService = require('../services/cache.service');
const crypto = require('crypto');

function createStore(prefix) {
  if (!cacheService.hasRedisConfig()) return undefined;
  return new RedisStore({
    sendCommand: (...args) => cacheService.getRedisClient().call(...args),
    prefix: `erp:rl:${prefix}:`
  });
}

const getRefreshTokenHash = (req) => {
  const cookieName = process.env.REFRESH_COOKIE_NAME || 'erp_refresh';
  let token = '';
  if (req.headers.cookie) {
    const parts = req.headers.cookie.split(';');
    for (const part of parts) {
      const trimPart = part.trim();
      if (trimPart.startsWith(`${cookieName}=`)) {
        token = decodeURIComponent(trimPart.slice(cookieName.length + 1));
        break;
      }
    }
  }
  if (!token && req.body && req.body.refreshToken) {
    token = req.body.refreshToken;
  }
  if (token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
  return req.ip;
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    return `${req.ip}:${email}`;
  },
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many login attempts, please try again after 15 minutes.' },
  store: createStore('login'),
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => `${req.user?._id || req.ip}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many password reset requests.' },
  store: createStore('password'),
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const refreshLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  keyGenerator: (req) => getRefreshTokenHash(req),
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many refresh operations.' },
  store: createStore('refresh'),
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  keyGenerator: (req) => `${req.user?._id || req.ip}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Upload rate limit exceeded.' },
  store: createStore('upload'),
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const paymentLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  keyGenerator: (req) => `${req.user?._id || req.ip}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Payment link request rate limit exceeded.' },
  store: createStore('payment'),
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  keyGenerator: (req) => `${req.ip}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many requests.' },
  store: createStore('public'),
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 600,
  keyGenerator: (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        return crypto.createHash('sha256').update(token).digest('hex');
      }
    }
    return req.ip;
  },
  message: { success: false, code: 'RATE_LIMITED', message: 'API request limit exceeded.' },
  store: createStore('api'),
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
  apiLimiter
};
