const { Queue, Worker } = require('bullmq');
const cacheService = require('./cache.service');
const N = require('./notification.service');

let notificationQueue = null;
let notificationWorker = null;

const queueEnabled = cacheService.isRedisEnabled();

if (queueEnabled) {
  const redisClient = cacheService.getRedisClient();
  
  notificationQueue = new Queue('notifications', {
    connection: redisClient
  });
  
  notificationWorker = new Worker('notifications', async (job) => {
    const { type, data } = job.data;
    console.log(`[Queue] Processing background job: ${type}`);
    
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
      default:
        console.warn(`[Queue] Unknown job type: ${type}`);
    }
  }, {
    connection: redisClient
  });
  
  notificationWorker.on('failed', (job, err) => {
    console.error(`[Queue] Job ${job?.id} failed:`, err);
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

module.exports = queueService;
