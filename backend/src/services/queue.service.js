const { Queue } = require('bullmq');
const Redis = require('ioredis');
const cacheService = require('./cache.service');
const N = require('./notification.service');

let notificationQueue = null;
let queueConnection = null;

const queueEnabled = cacheService.hasRedisConfig();

if (queueEnabled) {
  queueConnection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  });
  
  notificationQueue = new Queue('notifications', {
    connection: queueConnection
  });
} else {
  console.log('[Queue] BullMQ background queue is disabled. Running jobs synchronously.');
}

const queueService = {
  async addNotificationJob(type, data) {
    if (queueEnabled && notificationQueue) {
      try {
        await notificationQueue.add(type, { type, data });
        return true;
      } catch (err) {
        console.error('[Queue] BullMQ add error, falling back to sync:', err);
      }
    }
    
    // Sync fallback
    try {
      switch (type) {
        case 'ATTENDANCE_NOTIFY':
          await N.notifyParentsForStudents(data.studentIds, data.payload);
          break;
        case 'NOTICE_FANOUT':
          await N.notifyAudience(data);
          break;
        case 'RESULT_PUBLISH':
          await N.notifyUsers(data.userIds, data.payload);
          break;
        case 'CALENDAR_EVENT':
          await N.notifyAudience(data);
          break;
      }
    } catch (err) {
      console.error('[Queue] Sync fallback execution failed:', err);
    }
    return true;
  }
};

// Graceful shutdown support for connection
if (queueEnabled) {
  const shutdown = async () => {
    console.log('[Queue] Shutting down queue connection...');
    if (notificationQueue) await notificationQueue.close();
    if (queueConnection) await queueConnection.quit();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = queueService;
