const fs = require('fs');

const targetFiles = [
  'indian-units.html',
  'currency.html',
  'length.html',
  'temperature.html',
  'time-zone.html',
  'blog/50-fahrenheit-to-celsius.html',
  'blog/60-mph-to-kmh.html'
];

targetFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const fixed = content.replace(/(<meta\s+name="description"\s+content="[^"]*">)>/g, '$1');
    if (fixed !== content) {
      fs.writeFileSync(file, fixed, 'utf8');
      console.log(`[FIXED] Removed stray > from ${file}`);
    } else {
      console.log(`[NO CHANGE] ${file}`);
    }
  }
});
