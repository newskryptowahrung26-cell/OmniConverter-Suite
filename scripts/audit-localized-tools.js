const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const tools = [
  'area.html', 'currency.html', 'file-media.html', 'length.html',
  'speed.html', 'temperature.html', 'time-duration.html', 'time-zone.html',
  'volume-capacity.html', 'weight-mass.html'
];

['es', 'de', 'pt'].forEach(lang => {
  tools.forEach(tool => {
    const p = path.join(rootDir, lang, tool);
    if (!fs.existsSync(p)) return;
    const c = fs.readFileSync(p, 'utf8');
    
    // Check for inline script or imported module
    const scripts = c.match(/<script[\s\S]*?<\/script>/gi) || [];
    const scriptCount = scripts.length;
    let logicFound = false;
    let importList = [];

    scripts.forEach(s => {
      if (s.includes('addEventListener') || s.includes('calculate') || s.includes('convert')) {
        logicFound = true;
      }
      const imp = s.match(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/);
      if (imp) {
        importList.push({ named: imp[1].trim(), from: imp[2] });
      }
    });

    console.log(`[${lang}/${tool}] logic: ${logicFound}, imports: ${JSON.stringify(importList)}`);
  });
});
