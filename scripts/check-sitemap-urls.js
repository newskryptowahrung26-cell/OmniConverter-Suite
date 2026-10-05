const fs = require('fs');
const https = require('https');

const sitemaps = ['sitemap-en.xml', 'sitemap-es.xml', 'sitemap-de.xml', 'sitemap-pt.xml'];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode, location: res.headers.location });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR', error: err.message });
    });
  });
}

async function run() {
  for (const sm of sitemaps) {
    const xml = fs.readFileSync(sm, 'utf8');
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    console.log(`Checking ${sm} (${urls.length} URLs)...`);
    
    // Check first 10 URLs and sample 5 random URLs
    const sample = urls.slice(0, 5).concat(urls.slice(-5));
    for (const u of sample) {
      const res = await checkUrl(u);
      if (res.status !== 200) {
        console.log(`  FAIL/REDIRECT: ${u} -> ${res.status} (location: ${res.location})`);
      } else {
        // console.log(`  OK: ${u}`);
      }
    }
    console.log(`  Sample check complete for ${sm}.`);
  }
}

run();
