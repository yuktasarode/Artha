require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { startJobCron } = require('../cron/jobCron');
const ImportLog = require('../models/ImportLog');
require('../workers/jobWorker');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Job Importer Backend is running');
});

app.get('/api/import-logs/:fileName', async (req, res) => {
  try {
  const decoded = req.params.fileName;
  const encoded = encodeURIComponent(decoded);

  console.log("[API] Decoded fileName:", decoded);
  console.log("[API] Querying for:", encoded);

    const logs = await ImportLog.find({ fileName: encoded }).sort({ timestamp: -1 }); 
    console.log(`[API] Found ${logs.length} logs`);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  startJobCron();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

module.exports = app;
