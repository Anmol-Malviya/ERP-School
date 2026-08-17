const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const cacheService = require('../services/cache.service');
const { verifyAccess } = require('../utils/tokens');
const crypto = require('crypto');

function createStore(prefix) {
  if (!cacheService.hasRedisConfig()) return undefined;
  return new RedisStore({
    sendCommand: (...args) => cacheService.getRedisClient().call(...args),
    prefix: `erp:rl:${prefix}:`
  });
}

function ipKey(req) {
  return ipKeyGenerator(req.ip || '127.0.0.1');
}

function bearerSubject(req) {
  const [scheme, token] = String(req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  try {
    return String(verifyAccess(token).sub || '');
  } catch (_) {
    return null;
  }
}

function getRefreshTokenHash(req) {
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
  return ipKey(req);
}

function limiter(name, options) {
  return rateLimit({
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    passOnStoreError: true,
    store: createStore(name),
    ...options
  });
}

const loginLimiter = limiter('login', {
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    return `login:${ipKey(req)}:${email}`;
  },
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many login attempts, please try again later.' }
});

const passwordLimiter = limiter('password', {
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => `password:${bearerSubject(req) || req.user?._id || ipKey(req)}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many password change requests.' }
});

const refreshLimiter = limiter('refresh', {
  windowMs: 60 * 1000,
  limit: 60,
  keyGenerator: (req) => `refresh:${getRefreshTokenHash(req)}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many refresh operations.' }
});

const uploadLimiter = limiter('upload', {
  windowMs: 60 * 1000,
  limit: 20,
  keyGenerator: (req) => `upload:${bearerSubject(req) || req.user?._id || ipKey(req)}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Upload signature rate limit exceeded.' }
});

const paymentLimiter = limiter('payment', {
  windowMs: 60 * 1000,
  limit: 10,
  keyGenerator: (req) => `payment:${bearerSubject(req) || req.user?._id || ipKey(req)}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Payment request rate limit exceeded.' }
});

const publicLimiter = limiter('public', {
  windowMs: 60 * 1000,
  limit: 120,
  keyGenerator: (req) => `public:${ipKey(req)}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many requests.' }
});

const apiLimiter = limiter('api', {
  windowMs: 60 * 1000,
  limit: 900,
  keyGenerator: (req) => `api:${bearerSubject(req) || ipKey(req)}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'API request limit exceeded.' }
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
