const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('nav-tabs')) {
    const hasIndian = content.includes('indian-units');
    console.log(`${f}: ${hasIndian ? 'HAS indian-units' : 'MISSING indian-units'}`);
  }
});
