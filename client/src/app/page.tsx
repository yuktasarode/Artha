'use client'
import Image from "next/image";
import styles from "./page.module.css";


import { useRouter } from 'next/navigation';
import { useState } from 'react';

const feeds = [
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

export default function Home() {

  const router = useRouter();
  const [selectedFeed, setSelectedFeed] = useState('');

  const handleView = () => {
    if (selectedFeed) {
      const encoded = encodeURIComponent(selectedFeed);
      router.push(`/import-history/${encoded}`);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">View Import Logs</h1>
      <select
        value={selectedFeed}
        onChange={e => setSelectedFeed(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">Select a feed URL</option>
        {feeds.map((url, i) => (
          <option key={i} value={url}>
            {url}
          </option>
        ))}
      </select>
      <button
        onClick={handleView}
        disabled={!selectedFeed}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        View Logs
      </button>
    </div>
  );
}
