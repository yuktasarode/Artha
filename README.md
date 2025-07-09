# Artha Job Importer

This project fetches jobs from external XML feeds, imports them into MongoDB, and provides a frontend dashboard to view import logs.

---

## Quick Setup

### 1. Clone the repo

```bash
git clone https://github.com/yuktasarode/artha.git
cd artha
```

### 2. Start the frontend

```bash
cd client
npm install
npm run dev
```

Visit: http://localhost:3000

### 3. Set up the Backend (Express + MongoDB + Redis)

open a new terminal 

```bash
cd server
npm install
```

Create a .env file:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
REDIS_URL=your_redis_cloud_uri
QUEUE_CONCURRENCY=5
FEED_RETRY_ATTEMPTS=5
FEED_RETRY_DELAY_MS=1000 
```

### 4.  (Optional) Clean Previous Data

```bash
node cleanup.js
```

### 5. Start backend server

```bash
npm start
```

## Features

1. XML Job Feed Parsing

2. BullMQ Queue with Redis

3. Cron-Based Importing

4. MongoDB for Jobs + Logs

5. Next.js UI with dropdown to view Import History

