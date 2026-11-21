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
const MAX_BATCH_SIZE = 50;

// Known non-indexable or redirect paths to block
const BLOCKED_PATHS = new Set([
  '/', // root is fine, but redirects/404s must be filtered
  '/404',
  '/404.html',
  '/pt/blog/2000-usd-to-gbp',
  '/pt/blog/2000-usd-to-gbp.html'
]);

/**
 * Validates a single URL for IndexNow submission
 */
export function validateUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') {
      return { valid: false, reason: `Unsupported protocol: ${parsed.protocol} (must be https:)` };
    }
    if (parsed.hostname !== INDEXNOW_HOST) {
      return { valid: false, reason: `External domain rejected: ${parsed.hostname} (must be ${INDEXNOW_HOST})` };
    }
    if (BLOCKED_PATHS.has(parsed.pathname) && parsed.pathname !== '/') {
      return { valid: false, reason: `Blocked non-indexable or redirect path: ${parsed.pathname}` };
    }
    return { valid: true, url: parsed.href };
  } catch (err) {
    return { valid: false, reason: `Malformed URL string: ${rawUrl} (${err.message})` };
  }
}

/**
 * Submits a validated batch of URLs to IndexNow endpoints
 */
export async function submitToIndexNow(urlList, isDryRun = false) {
  if (!urlList || urlList.length === 0) {
    console.log('[IndexNow] No URLs provided for submission.');
    return { success: false, submitted: 0, reason: 'Empty URL list' };
  }

  // Filter and validate all input URLs
  const validated = [];
  const rejected = [];

  for (const raw of urlList) {
    const res = validateUrl(raw);
    if (res.valid) {
      validated.push(res.url);
    } else {
      rejected.push({ url: raw, reason: res.reason });
    }
  }

  if (rejected.length > 0) {
    console.warn(`[IndexNow WARN] Rejected ${rejected.length} invalid URL(s):`);
    rejected.forEach(r => console.warn(`  - ${r.url} -> ${r.reason}`));
  }

  if (validated.length === 0) {
    console.error('[IndexNow ERROR] Zero valid URLs remaining after validation.');
    return { success: false, submitted: 0, rejected };
  }

  // De-duplicate URLs
  const uniqueUrls = [...new Set(validated)];

  console.log(`[IndexNow] Prepared ${uniqueUrls.length} valid, unique URL(s) for host ${INDEXNOW_HOST}.`);

  if (isDryRun) {
    console.log('[IndexNow DRY-RUN] Dry run enabled. Network submission skipped.');
    console.log('[IndexNow DRY-RUN] Sample URLs that would be submitted:');
    uniqueUrls.slice(0, 10).forEach(u => console.log(`  * ${u}`));
    if (uniqueUrls.length > 10) console.log(`  ... and ${uniqueUrls.length - 10} more.`);
    return { success: true, dryRun: true, count: uniqueUrls.length, urls: uniqueUrls };
  }

  // Batch submission
  const endpoints = [
    { hostname: 'api.indexnow.org', path: '/IndexNow' },
    { hostname: 'www.bing.com', path: '/indexnow' }
  ];

  const results = [];

  for (let i = 0; i < uniqueUrls.length; i += MAX_BATCH_SIZE) {
    const batch = uniqueUrls.slice(i, i + MAX_BATCH_SIZE);
    const payload = JSON.stringify({
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: batch
    });

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
              console.log(`[IndexNow OK @ ${ep.hostname}] Submitted batch of ${batch.length} URL(s) (HTTP ${res.statusCode})`);
              results.push({ endpoint: ep.hostname, status: res.statusCode, count: batch.length });
            } else {
              console.warn(`[IndexNow WARN @ ${ep.hostname}] HTTP ${res.statusCode}: ${body || 'No response body'}`);
              results.push({ endpoint: ep.hostname, status: res.statusCode, body });
            }
            resolve();
          });
        });

        req.on('error', (e) => {
          console.error(`[IndexNow ERROR @ ${ep.hostname}] ${e.message}`);
          results.push({ endpoint: ep.hostname, error: e.message });
          resolve();
        });

        req.write(payload);
        req.end();
      });
    }
  }

  return { success: true, count: uniqueUrls.length, results };
}

// CLI runner
async function run() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const filteredArgs = args.filter(a => a !== '--dry-run');

  if (filteredArgs.length === 0) {
    console.log(`
IndexNow Submission CLI - OmniConverter
---------------------------------------
Usage:
  node scripts/submit-indexnow.js [--dry-run] <URL1> [URL2] ...
  node scripts/submit-indexnow.js --dry-run https://www.omniconverter.co.uk/blog/98-kg-pounds

Options:
  --dry-run   Validate URLs and display payload without transmitting network requests.
  <URL>       One or more absolute https://www.omniconverter.co.uk/... URLs.

Safety Safeguards:
  - External domains are rejected automatically.
  - Redirects and 404 pages are blocked.
  - Batches capped at 50 URLs per request.
  - Submission alerts search engines for crawl prioritization; does not guarantee ranking.
    `);
    process.exit(0);
  }

  const urls = filteredArgs;
  console.log(`IndexNow CLI: Processing ${urls.length} URL(s) [Mode: ${isDryRun ? 'DRY-RUN' : 'LIVE'}]:`);
  try {
    const outcome = await submitToIndexNow(urls, isDryRun);
    if (!outcome.success) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal execution error:', err.message);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('submit-indexnow.js')) {
  run();
}
