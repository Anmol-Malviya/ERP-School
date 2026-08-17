const Redis = require('ioredis');
const config = require('../config/env');

let redis = null;
let redisAvailable = false;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableOfflineQueue: false,
    retryStrategy(times) {
      if (times > 3) {
        console.warn('[Cache] Redis connection failed. Falling back to in-memory/MongoDB.');
        redisAvailable = false;
        return null; // Stop retrying
      }
      return Math.min(times * 100, 2000);
    }
  });

  redis.on('connect', () => {
    console.log('[Cache] Redis connected successfully.');
    redisAvailable = true;
  });

  redis.on('error', (err) => {
    console.error('[Cache] Redis connection error:', err.message);
    redisAvailable = false;
  });
} else {
  console.log('[Cache] REDIS_URL not configured. Using local in-memory fallback.');
}

const memoryCache = new Map();
const MAX_MEM_CACHE_SIZE = 1000;

// Periodic cleanup of expired memory cache entries
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of memoryCache.entries()) {
    if (v.expiresAt <= now) {
      memoryCache.delete(k);
    }
  }
}, 5 * 60 * 1000).unref();

const cacheService = {
  async get(key) {
    if (redisAvailable && redis) {
      try {
        const val = await redis.get(key);
        return val ? JSON.parse(val) : null;
      } catch (err) {
        console.error('[Cache] Redis get error:', err);
      }
    }
    const memVal = memoryCache.get(key);
    if (memVal && memVal.expiresAt > Date.now()) {
      return memVal.value;
    }
    if (memVal) {
      memoryCache.delete(key);
    }
    return null;
  },

  async set(key, value, ttlSeconds = 30) {
    if (redisAvailable && redis) {
      try {
        await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return true;
      } catch (err) {
        console.error('[Cache] Redis set error:', err);
      }
    }
    
    if (memoryCache.size >= MAX_MEM_CACHE_SIZE) {
      let oldestKey = null;
      const now = Date.now();
      for (const [k, v] of memoryCache.entries()) {
        if (v.expiresAt <= now) {
          memoryCache.delete(k);
        } else if (!oldestKey) {
          oldestKey = k;
        }
      }
      if (memoryCache.size >= MAX_MEM_CACHE_SIZE && oldestKey) {
        memoryCache.delete(oldestKey);
      }
    }

    memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
    return true;
  },

  async del(key) {
    if (redisAvailable && redis) {
      try {
        await redis.del(key);
        return true;
      } catch (err) {
        console.error('[Cache] Redis del error:', err);
      }
    }
    memoryCache.delete(key);
    return true;
  },

  async remember(key, ttlSeconds, cb) {
    const cached = await this.get(key);
    if (cached !== null) return cached;
    const fresh = await cb();
    if (fresh !== null && fresh !== undefined) {
      await this.set(key, fresh, ttlSeconds);
    }
    return fresh;
  },

  async invalidatePattern(pattern) {
    if (redisAvailable && redis) {
      try {
        let cursor = '0';
        let keys = [];
        do {
          const res = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
          cursor = res[0];
          keys.push(...res[1]);
        } while (cursor !== '0');

        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } catch (err) {
        console.error('[Cache] Redis invalidatePattern error:', err);
      }
    }
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*'));
    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        memoryCache.delete(key);
      }
    }
  },

  isRedisEnabled() {
    return redisAvailable;
  },

  hasRedisConfig() {
    return Boolean(process.env.REDIS_URL);
  },

  getRedisClient() {
    return redis;
  }
};

module.exports = cacheService;
