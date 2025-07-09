### Components

#### 1. **Cron + Feed Fetching**
- XML feeds are fetched using `node-cron`
- Each URL is retried with exponential backoff (configurable via `.env`)
- Parsed jobs are pushed to BullMQ for async processing

#### 2. **Job Queue (BullMQ + Redis)**
- Each job batch is processed independently
- Retry logic with exponential backoff ensures resilience
- Queue concurrency is controlled via `QUEUE_CONCURRENCY` env variable

#### 3. **Worker**
- Upserts jobs into the `jobs` collection
- Logs import runs into `importlogs` collection
- Handles per-job and per-feed failure cases with meaningful logs

#### 4. **Frontend UI**
- Built with App Router + Client Components
- Uses dynamic route `/import-history/[fileName]` to view logs

---

## Assumptions

- Feed URLs are stable and do not change frequently
- Job IDs in XML feeds are unique and suitable as DB keys
- External feeds may occasionally fail or return invalid XML — handled by logging to `importlogs`
- System does not deduplicate across feeds (only within)

---

## UX Notes

### Feed Dropdown on Homepage
To simplify navigation:
- A dropdown menu lists all supported feeds
- On selection, the app routes to `/import-history/<encoded-url>`
- This provides an accessible way to explore logs per feed

### Import Logs Table
- Shows filename, imported timestamp, total, new, updated, and failed jobs
- Highlights full feed failures as `Feed Failed` (if XML fetch fails)

---

## Cleanup Utility

### `server/cleanup.js`
- Clears all existing `jobs`, `importlogs`, and Redis queue data
- Intended for development/testing resets
- Run it manually: `node cleanup.js`

---

## Configurability via `.env`

- Change env variables as desired

## Summary
- The system is modular, extensible, and resilient against failures
- Dynamic routing based on file name
- Frontend offers quick access to logs via dropdown
- Feed imports are logged consistently for traceability
- Cleanup and retry behavior is environment-driven


## Potential Improvements

1. **Use shared `Log` Type Interface**
   - Extract and reuse the `Log` type across frontend components and APIs to avoid duplication.

2. **Dynamic Feed URL Management**
   - Store feed URLs in a MongoDB collection instead of hardcoding in `cronjob.js`.

3. **Auto-refresh Import Logs**
   - Poll or use WebSockets to update import status live after cron runs.