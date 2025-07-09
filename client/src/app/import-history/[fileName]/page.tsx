'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import JobHistoryTable from '@/components/JobHistoryTable'

interface Log {
  fileName: string;
  timestamp: string;
  totalFetched: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: { jobId: string; reason: string }[];
}

export default function Page() {
  const { fileName } = useParams() as { fileName: string }
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
    if (!fileName) return
    axios.get<Log[]>(`/api/import-logs/${fileName}`)
      .then((res) => setLogs(res.data))
      .catch(() => alert('Failed to load logs'))
  }, [fileName])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Import History: {decodeURIComponent(fileName)}</h1>
      <JobHistoryTable logs={logs} />
    </div>
  )
}
