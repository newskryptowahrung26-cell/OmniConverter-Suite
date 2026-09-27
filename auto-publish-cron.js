/**
 * OmniConverter Automated Cron Runner
 * Automatically delegates to scripts/vertex-publisher.js
 * Powered by Gemini API, Unsplash API, Competitor Gap Intelligence, and Instant Google Indexing.
 */

const { main } = require('./scripts/vertex-publisher.js');

console.log('====================================================');
console.log(`[${new Date().toISOString()}] Automated Daily Publisher Triggered`);
console.log('====================================================');

main().catch(err => {
  console.error('[CRON ERROR]', err.message || String(err));
});
