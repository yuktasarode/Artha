#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const { createClient } = require('redis');

// Clear MongoDB
async function clearMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🧹 Connected to MongoDB");

    const db = mongoose.connection.db;
    await db.collection('jobs').deleteMany({});
    await db.collection('importlogs').deleteMany({});
    console.log("✅ Cleared MongoDB collections: jobs, importlogs");

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ MongoDB cleanup failed:", err.message);
  }
}

// Clear Redis
async function clearRedis() {
  try {
    const redis = createClient({ url: process.env.REDIS_URL });
    await redis.connect();
    await redis.flushAll();
    console.log("✅ Flushed all Redis keys");
    await redis.quit();
  } catch (err) {
    console.error("❌ Redis cleanup failed:", err.message);
  }
}

// Run both
(async () => {
  await clearMongoDB();
  await clearRedis();
  console.log("🧽 Cleanup completed");
})();