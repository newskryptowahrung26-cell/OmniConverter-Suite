const fs = require('fs');

const files = [
  'es/blog/2000-usd-a-gbp.html',
  'de/blog/2000-usd-in-gbp.html',
  'pt/blog/2000-usd-para-gbp.html'
];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const canon = (content.match(/<link[^>]+rel=["']canonical["'][^>]*>/i) || [])[0];
  const title = (content.match(/<title>([^<]*)<\/title>/i) || [])[1];
  console.log(f, '-->', canon, '| Title:', title);
}
