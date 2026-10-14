const fs = require('fs');

const dirs = [
  { lang: 'es', dir: 'es/blog', prefix: '/es/blog/' },
  { lang: 'de', dir: 'de/blog', prefix: '/de/blog/' },
  { lang: 'pt', dir: 'pt/blog', prefix: '/pt/blog/' }
];

dirs.forEach(({ lang, dir, prefix }) => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');
  let specificGuideCount = 0;
  let genericOnlyCount = 0;
  files.forEach(f => {
    const c = fs.readFileSync(dir + '/' + f, 'utf8');
    if (c.includes('related-guides-section')) {
      const match = c.match(/<section class="related-guides-section"[\s\S]*?<\/section>/);
      if (match) {
        const section = match[0];
        const hasSpecific = section.includes(prefix);
        if (hasSpecific) specificGuideCount++;
        else genericOnlyCount++;
      }
    }
  });
  console.log(`${lang}: specific articles: ${specificGuideCount}, generic only: ${genericOnlyCount}`);
});
