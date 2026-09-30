import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const INDEXNOW_HOST = 'www.omniconverter.co.uk';
const INDEXNOW_KEY = '25038A8801D42437BBC34723A41AC6C4';
const KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

export async function submitToIndexNow(urlList) {
  if (!urlList || urlList.length === 0) {
    console.log('[IndexNow] No URLs to submit.');
    return;
  }

  const payload = JSON.stringify({
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
  });

  const endpoints = [
    { hostname: 'api.indexnow.org', path: '/IndexNow' },
    { hostname: 'www.bing.com', path: '/indexnow' }
  ];

  const results = [];
  for (const ep of endpoints) {
    await new Promise((resolve) => {
      const options = {
        hostname: ep.hostname,
        port: 443,
        path: ep.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 202) {
            console.log(`[IndexNow OK @ ${ep.hostname}] Submitted ${urlList.length} URL(s) (HTTP ${res.statusCode})`);
            results.push({ endpoint: ep.hostname, status: res.statusCode });
          } else {
            console.warn(`[IndexNow WARN @ ${ep.hostname}] HTTP ${res.statusCode}: ${body || 'No response body'}`);
            results.push({ endpoint: ep.hostname, status: res.statusCode, body });
          }
          resolve();
        });
      });

      req.on('error', (e) => {
        console.error(`[IndexNow ERROR @ ${ep.hostname}] ${e.message}`);
        resolve();
      });

      req.write(payload);
      req.end();
    });
  }
  return results;
}

// CLI runner: node scripts/submit-indexnow.js [--all] or [url1 url2 ...]
async function run() {
  const args = process.argv.slice(2);
  let urls = [];

  if (args.includes('--all') || args.length === 0) {
    const sitemapPath = path.join(rootDir, 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      const sitemap = fs.readFileSync(sitemapPath, 'utf8');
      const matches = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
      urls = matches;
      console.log(`Loaded ${urls.length} URLs from sitemap.xml for IndexNow submission.`);
    } else {
      console.error('sitemap.xml not found.');
      process.exit(1);
    }
  } else {
    urls = args.filter(a => a.startsWith('http'));
  }

  console.log(`Submitting ${urls.length} URLs to api.indexnow.org...`);
  try {
    await submitToIndexNow(urls);
  } catch (err) {
    console.error('Submission failed:', err);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('submit-indexnow.js')) {
  run();
}
