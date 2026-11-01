const fs = require('fs');

const files = [
  'blog/2000-usd-to-gbp.html',
  'es/blog/2000-usd-a-gbp.html',
  'de/blog/2000-usd-in-gbp.html',
  'pt/blog/2000-usd-para-gbp.html',
  'pt/blog/2000-usd-to-gbp.html'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const canon = (content.match(/<link[^>]+rel=["']canonical["'][^>]*>/i) || [])[0];
    console.log(f, '--> Canonical:', canon);
  }
}
