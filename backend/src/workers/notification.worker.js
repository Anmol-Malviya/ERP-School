const { Worker } = require('bullmq');
const Redis = require('ioredis');
const { connectDB, disconnectDB } = require('../config/db');
require('../models'); // Register all models
const N = require('../services/notification.service');

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.error('[Worker] REDIS_URL not configured. Exiting.');
  process.exit(1);
}

let connection;
let worker;

async function start() {
  await connectDB();
  console.log('[Worker] Connected to MongoDB.');

  connection = new Redis(redisUrl, {
    maxRetriesPerRequest: null
  });

  worker = new Worker('notifications', async (job) => {
    const { type, data } = job.data;
    console.log(`[Worker] Processing background job: ${type}`);
    
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
        console.warn(`[Worker] Unknown job type: ${type}`);
    }
  }, {
    connection
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err);
  });

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job?.id} completed.`);
  });

  console.log('[Worker] BullMQ background worker started.');
}

async function stop(sig) {
  console.log(`[Worker] ${sig} received. Shutting down...`);
  if (worker) await worker.close();
  if (connection) await connection.quit();
  await disconnectDB();
  process.exit(0);
}

process.on('SIGTERM', () => stop('SIGTERM'));
process.on('SIGINT', () => stop('SIGINT'));
process.on('unhandledRejection', e => console.error('[Worker] unhandled rejection', e));

start().catch(e => {
  console.error('[Worker] startup failed', e);
  process.exit(1);
});
