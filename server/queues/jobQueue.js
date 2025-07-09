const { Queue } = require('bullmq');
const { REDIS_URL } = process.env;
const connection = { url: REDIS_URL };

const jobQueue = new Queue('job-import-queue', { connection });

module.exports = { jobQueue };
