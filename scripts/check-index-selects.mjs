import fs from 'fs';

['index.html', 'es/index.html', 'de/index.html', 'pt/index.html'].forEach(f => {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    const selects = [...c.matchAll(/<select\s+[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/select>/gi)];
    console.log(f, 'select count:', selects.length);
    selects.forEach(s => console.log(' ', s[1], 'options:', (s[2].match(/<option/gi)||[]).length));
  }
});
