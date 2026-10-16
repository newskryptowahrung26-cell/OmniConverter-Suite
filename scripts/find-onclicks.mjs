import fs from 'fs';

const langs = ['es', 'de', 'pt'];

console.log('--- Inspecting onclick handlers across localized pages ---');

langs.forEach(lang => {
  const dir = `${lang}`;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  files.forEach(f => {
    const filePath = `${lang}/${f}`;
    const content = fs.readFileSync(filePath, 'utf8');
    const onclicks = [...content.matchAll(/onclick="([^"]+)"/g)].map(m => m[1]);
    if (onclicks.length > 0) {
      console.log(`\n[${filePath}] ${onclicks.length} onclicks:`);
      const unique = [...new Set(onclicks)];
      unique.forEach(u => console.log('   ', u));
    }
  });
});
