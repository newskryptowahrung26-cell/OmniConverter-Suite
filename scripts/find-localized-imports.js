const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

['es', 'de', 'pt'].forEach(lang => {
  const dir = path.join(rootDir, lang);
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  files.forEach(f => {
    const full = path.join(dir, f);
    const content = fs.readFileSync(full, 'utf8');
    const scripts = content.match(/<script[\s\S]*?<\/script>/gi) || [];
    scripts.forEach(s => {
      const match = s.match(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/);
      if (match) {
        console.log(`[${lang}/${f}] imports: { ${match[1].trim()} } from '${match[2]}'`);
      }
    });
  });
});
