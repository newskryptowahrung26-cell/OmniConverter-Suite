const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const tools = [
  'area.html', 'file-media.html', 'speed.html', 'temperature.html',
  'time-duration.html', 'volume-capacity.html', 'weight-mass.html',
  'length.html', 'currency.html', 'time-zone.html'
];

tools.forEach(t => {
  const p = path.join(rootDir, t);
  if (!fs.existsSync(p)) return;
  const c = fs.readFileSync(p, 'utf8');
  const scripts = c.match(/<script[\s\S]*?<\/script>/gi) || [];
  const scriptInfos = scripts.map(s => {
    const srcMatch = s.match(/src=["']([^"']+)["']/);
    const typeMatch = s.match(/type=["']([^"']+)["']/);
    if (srcMatch) return `src: ${srcMatch[1]} (type: ${typeMatch ? typeMatch[1] : 'normal'})`;
    return `inline (type: ${typeMatch ? typeMatch[1] : 'normal'}, length: ${s.length})`;
  });
  console.log(`[EN / ${t}]:\n  ${scriptInfos.join('\n  ')}`);
});
