const mongoose = require('mongoose');

const importLogSchema = new mongoose.Schema({
  fileName: String,
  timestamp: { type: Date, default: Date.now },
  totalFetched: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [{ jobId: String, reason: String }],
});

module.exports = mongoose.model('ImportLog', importLogSchema);
