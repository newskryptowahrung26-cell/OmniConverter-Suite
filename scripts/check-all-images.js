const fs = require('fs');
const https = require('https');

const blogData = fs.readFileSync('blog-data.js', 'utf8');
const imgUrls = [...new Set([...blogData.matchAll(/"image":\s*"([^"]+)"/g)].map(m => m[1]))];

console.log(`Checking ${imgUrls.length} unique image URLs in blog-data.js...`);

async function checkImage(url) {
  return new Promise((resolve) => {
    try {
      https.get(url, (res) => {
        resolve({ url, status: res.statusCode });
      }).on('error', (err) => {
        resolve({ url, status: 'ERROR: ' + err.message });
      });
    } catch (e) {
      resolve({ url, status: 'EXCEPTION: ' + e.message });
    }
  });
}

async function run() {
  const broken = [];
  for (const u of imgUrls) {
    const res = await checkImage(u);
    if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
      console.log(`[BROKEN] ${res.status}: ${u}`);
      broken.push(u);
    }
  }
  console.log(`Total broken images found: ${broken.length}`);
}

run();
