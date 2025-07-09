const axios = require('axios');
const xml2js = require('xml2js');

async function fetchJobsFromUrl(url) {
  try {
    const { data: xml } = await axios.get(url);
    const json = await xml2js.parseStringPromise(xml, { explicitArray: false });
    const items = json.rss.channel.item || [];
    const jobs = items.map((item) => ({
      jobId: item.guid._ || item.link,
      title: item.title,
      company: item['job:company'] || '',
      description: item.description,
      category: item.category,
      location: item['job:location'] || '',
      type: item['job:type'] || '',
      url: item.link,
      postedAt: new Date(item.pubDate),
    }));
    return jobs;
  } catch (err) {
    console.error(`Failed to fetch jobs from ${url}:`, err.message);
    return [];
  }
}

module.exports = { fetchJobsFromUrl };
