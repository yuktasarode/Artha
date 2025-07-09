const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  title: String,
  company: String,
  description: String,
  category: String,
  location: String,
  type: String,
  url: String,
  postedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
