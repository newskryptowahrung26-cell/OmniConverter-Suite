const fs = require('fs');

const files = [
  '70kg-in-stone',
  '4-meters-to-feet',
  '1-bigha-in-square-feet',
  '5-usd-to-aud',
  'convert-file-type-to-pdf',
  'convert-pdf-form',
  '1-aud-to-vnd',
  '100-fahrenheit-to-celsius'
];

files.forEach(s => {
  const p = 'blog/' + s + '.html';
  const html = fs.readFileSync(p, 'utf8');
  const title = (html.match(/<title>([^<]+)<\/title>/i) || ['',''])[1];
  const desc = (html.match(/name="description"[^>]*content="([^"]+)"/i) || ['',''])[1];
  console.log(`\n=== ${s} ===`);
  console.log(`Title (${title.length} chars): ${title}`);
  console.log(`Meta Desc (${desc.length} chars): ${desc}`);
});
