const fs = require('fs');

const files = [
  'blog/100-usd-in-australian.html',
  'de/blog/100-usd-in-australische-dollar.html',
  'pt/blog/100-usd-em-dolar-australiano.html'
];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const canon = (content.match(/<link[^>]+rel=["']canonical["'][^>]*>/i) || [])[0];
  console.log(f, 'canonical:', canon);
}
