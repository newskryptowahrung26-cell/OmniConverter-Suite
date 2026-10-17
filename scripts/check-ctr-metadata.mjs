import fs from 'fs';

const files = [
  'index.html',
  'currency.html',
  'temperature.html',
  'length.html',
  'weight-mass.html',
  'indian-units.html',
  'time-zone.html',
  'blog/100-usd-to-aud.html',
  'blog/1-bigha-in-square-feet.html',
  'blog/15-meters-to-feet.html',
  'blog/10-celsius-is-what-fahrenheit.html'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    const t = c.match(/<title>([^<]+)<\/title>/i);
    const d = c.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    console.log(`[${f}]`);
    console.log(`  Title: ${t ? t[1] : 'NONE'} (len: ${t ? t[1].length : 0})`);
    console.log(`  Desc: ${d ? d[1] : 'NONE'} (len: ${d ? d[1].length : 0})`);
  }
});
