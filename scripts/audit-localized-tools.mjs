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
  const en = fs.readFileSync(f, 'utf8');
  const enIds = [...en.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  console.log(`\n=== Checking ${f} ===`);
  
  ['es', 'de', 'pt'].forEach(lang => {
    const target = `${lang}/${f}`;
    if (!fs.existsSync(target)) {
      console.log(`  [${lang}] FILE MISSING: ${target}`);
      return;
    }
    const content = fs.readFileSync(target, 'utf8');
    const langIds = new Set([...content.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
    
    // Key interactive elements
    const missing = enIds.filter(id => {
      const isInteractive = id.includes('Input') || id.includes('Select') || id.includes('Btn') || id.includes('Result') || id.includes('Formula') || id.includes('Explanation') || id.includes('Grid');
      return isInteractive && !langIds.has(id);
    });

    console.log(`  [${lang}] Missing IDs: ${missing.length ? missing.join(', ') : 'None (OK)'}`);

    // Check script tags
    const scriptTags = [...content.matchAll(/<script[\s\S]*?<\/script>/gi)].map(m => m[0]);
    console.log(`  [${lang}] Scripts: ${scriptTags.length}`);
    scriptTags.forEach((s, idx) => {
      const srcMatch = s.match(/src="([^"]+)"/);
      const isModule = s.includes('type="module"');
      if (srcMatch) {
        console.log(`    Script ${idx}: src=${srcMatch[1]} (module: ${isModule})`);
      } else {
        console.log(`    Script ${idx}: inline (module: ${isModule}, length: ${s.length})`);
      }
    });
  });
});
