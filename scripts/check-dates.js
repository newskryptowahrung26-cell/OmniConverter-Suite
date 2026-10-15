const fs = require('fs');

const slugs = [
  '70kg-in-stone',
  '4-meters-to-feet',
  '1-bigha-in-square-feet',
  '5-usd-to-aud',
  'convert-file-type-to-pdf',
  'convert-pdf-form',
  '1-aud-to-vnd',
  '100-fahrenheit-to-celsius'
];

slugs.forEach(s => {
  const html = fs.readFileSync('blog/' + s + '.html', 'utf8');
  const m1 = html.match(/"datePublished":\s*"([^"]+)"/);
  const m2 = html.match(/article:published_time"[^>]*content="([^"]+)"/);
  const m3 = html.match(/Published:\s*([0-9a-zA-Z\s]+)/);
  console.log(s, '| JSON Date:', (m1 ? m1[1] : 'NONE'), '| Meta Date:', (m2 ? m2[1] : 'NONE'), '| Visible Date:', (m3 ? m3[1].trim() : 'NONE'));
});
