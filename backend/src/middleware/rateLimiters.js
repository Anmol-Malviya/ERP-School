const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const cacheService = require('../services/cache.service');
const { verifyAccess } = require('../utils/tokens');

const store = cacheService.hasRedisConfig()
  ? new RedisStore({
      sendCommand: (...args) => cacheService.getRedisClient().call(...args),
      prefix: 'erp:rl:'
    })
  : undefined;

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

function limiter(options) {
  return rateLimit({
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    passOnStoreError: true,
    store,
    ...options
  });
}

const loginLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    return `login:${ipKey(req)}:${email}`;
  },
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many login attempts, please try again later.' }
});

const passwordLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => `password:${bearerSubject(req) || req.user?._id || ipKey(req)}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many password change requests.' }
});

const refreshLimiter = limiter({
  windowMs: 60 * 1000,
  limit: 60,
  keyGenerator: (req) => `refresh:${ipKey(req)}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many refresh operations.' }
});

const uploadLimiter = limiter({
  windowMs: 60 * 1000,
  limit: 20,
  keyGenerator: (req) => `upload:${bearerSubject(req) || req.user?._id || ipKey(req)}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Upload signature rate limit exceeded.' }
});

const paymentLimiter = limiter({
  windowMs: 60 * 1000,
  limit: 10,
  keyGenerator: (req) => `payment:${bearerSubject(req) || req.user?._id || ipKey(req)}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Payment request rate limit exceeded.' }
});

const publicLimiter = limiter({
  windowMs: 60 * 1000,
  limit: 120,
  keyGenerator: (req) => `public:${ipKey(req)}`,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many requests.' }
});

const authenticatedLimiter = limiter({
  windowMs: 60 * 1000,
  limit: 900,
  // This middleware runs before module authentication, so derive the user id from the verified JWT.
  // Falling back to IP keeps public auth endpoints protected without making shared school networks
  // share one authenticated quota.
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
  authenticatedLimiter
};
