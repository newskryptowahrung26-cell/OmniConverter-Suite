const fs = require('fs');

const files = [
  'area.html', 'currency.html', 'file-media.html', 'index.html',
  'indian-units.html', 'length.html', 'speed.html', 'temperature.html',
  'time-duration.html', 'time-zone.html', 'volume-capacity.html', 'weight-mass.html'
];

let totalCleaned = 0;

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Match the aggregateRating block inside JSON-LD
  const regex = /,\s*"aggregateRating":\s*\{\s*"@type":\s*"AggregateRating",\s*"ratingValue":\s*"[^"]+",\s*"ratingCount":\s*"[^"]+"\s*\}/g;

  if (regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`[CLEANED] aggregateRating removed from ${file}`);
    totalCleaned++;
  } else {
    // Try alternate format if spacing differs
    const altRegex = /"aggregateRating":\s*\{[\s\S]*?\},?\s*/g;
    // verify it matches inside
    console.log(`[SKIP / CHECK] ${file}`);
  }
});

console.log(`Total files cleaned: ${totalCleaned}`);
