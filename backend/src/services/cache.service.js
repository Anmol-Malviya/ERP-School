const Redis = require('ioredis');

let redis = null;
let redisAvailable = false;
const redisConfigured = Boolean(process.env.REDIS_URL);

if (redisConfigured) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 2,
    enableOfflineQueue: true,
    retryStrategy(times) {
      if (times > 5) {
        redisAvailable = false;
        return null;
      }
      return Math.min(times * 200, 2000);
    }
  });

  redis.on('ready', () => {
    redisAvailable = true;
  });

  redis.on('close', () => {
    redisAvailable = false;
  });

  redis.on('error', () => {
    redisAvailable = false;
  });
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

function getMemory(key) {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}

const cacheService = {
  async get(key) {
    if (redisAvailable && redis) {
      try {
        const value = await redis.get(key);
        return value ? JSON.parse(value) : null;
      } catch (_) {
        redisAvailable = false;
      }
    }
    return getMemory(key);
  },

  async set(key, value, ttlSeconds = 30) {
    if (redisAvailable && redis) {
      try {
        await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return true;
      } catch (_) {
        redisAvailable = false;
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

    memoryCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
    return true;
  },

  async del(key) {
    if (redisAvailable && redis) {
      try {
        await redis.del(key);
      } catch (_) {
        redisAvailable = false;
      }
    }
    memoryCache.delete(key);
    return true;
  },

  async remember(key, ttlSeconds, factory) {
    const cached = await this.get(key);
    if (cached !== null) return cached;
    const fresh = await factory();
    if (fresh !== null && fresh !== undefined) await this.set(key, fresh, ttlSeconds);
    return fresh;
  },

  async invalidatePattern(pattern) {
    if (redisAvailable && redis) {
      try {
        let cursor = '0';
        do {
          const [next, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
          cursor = next;
          if (keys.length) await redis.del(...keys);
        } while (cursor !== '0');
      } catch (_) {
        redisAvailable = false;
      }
    }

    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    const regex = new RegExp(`^${escaped}$`);
    for (const key of memoryCache.keys()) if (regex.test(key)) memoryCache.delete(key);
  },

  hasRedisConfig() {
    return redisConfigured;
  },

  isRedisEnabled() {
    return redisAvailable && Boolean(redis);
  },

  getRedisClient() {
    return redis;
  }
};

module.exports = cacheService;
