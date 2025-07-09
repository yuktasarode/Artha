const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const ImportLog = require('../models/ImportLog');

const worker = new Worker('job-import-queue', async job => {
  const { jobs, fileName } = job.data;
  let newJobs = 0, updatedJobs = 0, failedJobs = [];

  for (const item of jobs) {
    try {
      const updated = await Job.findOneAndUpdate(
        { jobId: item.jobId },
        { $set: item },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (updated.createdAt.getTime() === updated.updatedAt.getTime()) newJobs++;
      else updatedJobs++;
    } catch (err) {
      failedJobs.push({ jobId: item.jobId, reason: err.message });
    }
  }

  await ImportLog.create({
    fileName,
    totalFetched: jobs.length,
    newJobs,
    updatedJobs,
    failedJobs,
  });

}, {
  connection: { url: process.env.REDIS_URL },
  concurrency: Number(process.env.QUEUE_CONCURRENCY || 5),
});

module.exports = { worker };
