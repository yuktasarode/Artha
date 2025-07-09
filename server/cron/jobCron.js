const cron = require('node-cron');
const { fetchJobsFromUrl } = require('../jobs/fetchJobs');
const { jobQueue } = require('../queues/jobQueue');
const ImportLog = require('../models/ImportLog');
const retryWithBackoff = require('../utils/retryWithBackoff.js');

const urls = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
  'https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
  'https://jobicy.com/?feed=job_feed&job_categories=business',
  'https://jobicy.com/?feed=job_feed&job_categories=management',
  'https://www.higheredjobs.com/rss/articleFeed.cfm'
];

// Load env-configurable retry settings
const RETRY_ATTEMPTS = Number(process.env.FEED_RETRY_ATTEMPTS || 3);
const RETRY_BACKOFF = Number(process.env.FEED_RETRY_DELAY_MS || 1000);

async function processFeed(url) {
  const fileName = encodeURIComponent(url);

  try {
    const jobs = await retryWithBackoff(
      () => fetchJobsFromUrl(url),
      RETRY_ATTEMPTS,
      RETRY_BACKOFF
    );

    if (jobs.length) {
      await jobQueue.add('importJobs', { jobs, fileName });
      console.log(`[CRON] Enqueued ${jobs.length} jobs from ${url}`);
    } else {
      console.log(`[CRON] No jobs found for ${url}`);
    }
  } catch (err) {
    console.error(`[CRON] Failed to fetch jobs from ${url} after ${RETRY_ATTEMPTS} attempts:`, err.message);

    try {
      await ImportLog.create({
        fileName,
        totalFetched: 0,
        newJobs: 0,
        updatedJobs: 0,
        failedJobs: [{ jobId: 'feed-level', reason: err.message }],
        timestamp: new Date()
      });
      console.log(`[CRON] Logged failed import for ${url}`);
    } catch (logErr) {
      console.error(`[CRON] Failed to log import for ${url}:`, logErr.message);
    }
  }
}

function startJobCron() {
  // Run once at startup
  (async () => {
    console.log('[CRON] Running initial fetch at startup...');
    for (const url of urls) {
      await processFeed(url);
    }
  })();

  // Schedule every hour or env-defined
  cron.schedule(process.env.CRON_SCHEDULE || '0 * * * *', async () => {
    console.log('[CRON] Running scheduled fetch...');
    for (const url of urls) {
      await processFeed(url);
    }
  });
}

module.exports = { startJobCron };
