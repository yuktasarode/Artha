interface Log {
  fileName: string;
  timestamp: string;
  totalFetched: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: { jobId: string; reason: string }[];
}

export default function JobHistoryTable({ logs }: { logs: Log[] }) {
  return (
    <table className="w-full border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="p-2">Filename</th>
          <th className="p-2">Imported Date Time</th>
          <th className="p-2">Total</th>
          <th className="p-2">New</th>
          <th className="p-2">Updated</th>
          <th className="p-2">Failed</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, i) => (
          <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
            <td className="p-2 break-all">{decodeURIComponent(log.fileName)}</td>
            <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
            <td className="p-2">{log.totalFetched}</td>
            <td className="p-2">{log.newJobs}</td>
            <td className="p-2">{log.updatedJobs}</td>
            <td className="p-2">
            {log.failedJobs.some(f => f.jobId === 'feed-level') ? (
              <span className="text-red-600 font-semibold">Feed Failed</span>
            ) : (
              log.failedJobs.length
            )}
          </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
