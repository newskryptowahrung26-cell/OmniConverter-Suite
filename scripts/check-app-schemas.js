const fs = require('fs');

const files = [
  'area.html', 'currency.html', 'file-media.html', 'index.html',
  'indian-units.html', 'length.html', 'speed.html', 'temperature.html',
  'time-duration.html', 'time-zone.html', 'volume-capacity.html', 'weight-mass.html'
];

files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  // Match the script tag containing SoftwareApplication
  const match = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?"@type"\s*:\s*"SoftwareApplication"[\s\S]*?)<\/script>/i);
  if (match) {
    console.log(`=== ${f} ===`);
    console.log(match[0].slice(0, 300) + '...\n');
  } else {
    console.log(`=== ${f} === NOT MATCHED`);
  }
});
