// Collects the trend pages the Morning Brief app reads and saves them to data/cache.json.
// Browsers block the app from reading these sites directly (CORS), so the app falls back to this file.
// Runs on GitHub Actions every hour. Node 20+, no dependencies.
import { writeFile, mkdir } from 'node:fs/promises';

const URLS = [
  // Social
  'https://tokchart.com/',
  'https://kworb.net/youtube/trending/kw.html',
  'https://kworb.net/youtube/trending/us.html',
  'https://kworb.net/youtube/trending/uk.html',
  'https://kworb.net/youtube/trending_overall.html',
  'https://trends24.in/kuwait/',
  'https://trends24.in/united-states/',
  'https://trends24.in/united-kingdom/',
  'https://www.reddit.com/r/popular/top.json?t=day&limit=25',
  'https://www.reddit.com/r/popular/top/.rss?t=day',
  'https://trends.google.com/trending/rss?geo=KW',
  'https://trends.google.com/trending/rss?geo=US',
  'https://trends.google.com/trending/rss?geo=GB',
  'https://news.google.com/rss/search?q=%22Instagram%22%20(trending%20audio%20OR%20reels%20trends%20OR%20trending%20on%20Instagram)%20when%3A7d&hl=en&gl=US&ceid=US:en',
  // AI & Tech
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  'https://feeds.arstechnica.com/arstechnica/index',
  // To sell
  'https://www.producthunt.com/feed',
  'https://www.reddit.com/r/dropship+Flipping+ecommerce+AmazonFBA/top.json?t=week&limit=12',
  'https://www.reddit.com/r/dropship/top/.rss?t=week',
  'https://news.google.com/rss/search?q=trending%20products%20to%20sell%20online%20ecommerce%20when%3A1d&hl=en&gl=US&ceid=US:en',
  // Jobs
  'https://remotive.com/api/remote-jobs?limit=150',
  'https://remoteok.com/api',
  'https://www.arbeitnow.com/api/job-board-api',
  // Crypto news
  'https://news.google.com/rss/search?q=cryptocurrency%20market%20opportunity%20when%3A1d&hl=en&gl=US&ceid=US:en',
  // GitHub
  'https://github.com/trending?since=daily',
  'https://github.com/trending?since=weekly',
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

// Shrink HTML pages: drop scripts, styles, svg icons, comments and extra whitespace. Parsing in the app is unaffected.
function slim(text, type) {
  if (!/html/i.test(type)) return text;
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s{2,}/g, ' ');
}

async function get(url) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*', 'Accept-Language': 'en-US,en;q=0.9' }, signal: AbortSignal.timeout(25000) });
    if (!r.ok) { console.log('skip', r.status, url); return null; }
    return slim(await r.text(), r.headers.get('content-type') || '');
  } catch (e) { console.log('fail', url, e.message); return null; }
}

const pages = {};
for (const u of URLS) {
  const t = await get(u);
  if (t) pages[u] = t;
}
await mkdir('data', { recursive: true });
await writeFile('data/cache.json', JSON.stringify({ updated: new Date().toISOString(), pages }));
console.log('saved', Object.keys(pages).length, 'of', URLS.length, 'sources');
