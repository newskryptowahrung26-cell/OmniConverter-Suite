import fs from 'fs';

const langs = ['es', 'de', 'pt'];

console.log('--- Checking app.js references and tool elements ---');

langs.forEach(lang => {
  const dir = `${lang}`;
  fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
    const c = fs.readFileSync(`${dir}/${f}`, 'utf8');
    if (c.includes('app.js')) {
      const ids = [...c.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
      const inputs = ids.filter(id => id.includes('Input') || id.includes('Select'));
      console.log(`${dir}/${f}: inputs/selects -> ${inputs.join(', ')}`);
    }
  });
});
