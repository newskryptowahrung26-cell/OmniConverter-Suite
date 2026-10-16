import fs from 'fs';

const files = [
  'area.html',
  'file-media.html',
  'length.html',
  'speed.html',
  'temperature.html',
  'time-duration.html',
  'time-zone.html',
  'volume-capacity.html',
  'weight-mass.html',
  'currency.html'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  const selects = [...content.matchAll(/<select\s+[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/select>/gi)];
  selects.forEach(sel => {
    const id = sel[1];
    const inner = sel[2].trim();
    const count = (inner.match(/<option/gi) || []).length;
    console.log(f, id, 'options:', count);
  });
});
