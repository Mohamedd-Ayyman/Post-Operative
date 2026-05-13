const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');
const config = require('../config');

let redis;
try {
  redis = new Redis(config.redis.url, { maxRetriesPerRequest: null, enableReadyCheck: false, lazyConnect: true });
  redis.on('error', () => {});
} catch { redis = null; }

const reminderQueue = redis ? new Queue('reminders', { connection: redis }) : null;

async function scheduleReminder(userId, message) {
  if (!reminderQueue) return;
  await reminderQueue.add('daily-reminder', { userId, message }, {
    repeat: { pattern: '0 9 * * *' },
    attempts: 3,
    backoff: { type: 'exponential', delay: 60000 },
  });
}

module.exports = { scheduleReminder };