const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const N = require('./notification.service');

const queueEnabled = Boolean(process.env.REDIS_URL);
let notificationQueue = null;
let queueConnection = null;

async function processNotification(type, data) {
  switch (type) {
    case 'ATTENDANCE_NOTIFY':
      return N.notifyParentsForStudents(data.studentIds, data.payload);
    case 'NOTICE_FANOUT':
      return N.notifyAudience(data);
    case 'RESULT_PUBLISH':
      return N.notifyUsers(data.userIds, data.payload);
    case 'CALENDAR_EVENT':
      return N.notifyAudience(data);
    default:
      return null;
  }
}

if (queueEnabled) {
  queueConnection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true
  });
  queueConnection.on('error', () => {});

  notificationQueue = new Queue('notifications', { connection: queueConnection });
}

const queueService = {
  async addNotificationJob(type, data) {
    if (queueEnabled && notificationQueue) {
      try {
        await notificationQueue.add(type, { type, data }, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: 500,
          removeOnFail: 1000
        });
        return true;
      } catch (_) {
        // Redis/queue failure should not make the primary ERP request fail.
      }
    }

    try {
      await processNotification(type, data);
    } catch (_) {
      // Notification delivery is best-effort in synchronous fallback mode.
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
