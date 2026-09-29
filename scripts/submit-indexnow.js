import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const INDEXNOW_HOST = 'www.omniconverter.co.uk';
const INDEXNOW_KEY = '6fdaa0c92ff04f4286f61604e0fd86dd';
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

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/IndexNow',
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
          console.log(`[IndexNow OK] Successfully submitted ${urlList.length} URL(s) (HTTP ${res.statusCode})`);
          resolve({ status: res.statusCode, body });
        } else {
          console.warn(`[IndexNow WARN] HTTP ${res.statusCode}: ${body || 'No response body'}`);
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', (e) => {
      console.error(`[IndexNow ERROR] ${e.message}`);
      reject(e);
    });

    req.write(payload);
    req.end();
  });
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
