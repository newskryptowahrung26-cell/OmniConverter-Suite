import fs from 'fs';

const targets = [
  { url: '/blog/convert-pdf-form', file: 'blog/convert-pdf-form.html' },
  { url: '/blog/1-guntha-in-sq-ft', file: 'blog/1-guntha-in-sq-ft.html' },
  { url: '/es/blog/convertir-formulario-pdf', file: 'es/blog/convertir-formulario-pdf.html' },
  { url: '/es/blog/1-bar-a-psi', file: 'es/blog/1-bar-a-psi.html' },
  { url: '/de/blog/16-unzen-in-milliliter', file: 'de/blog/16-unzen-in-milliliter.html' },
  { url: '/de/blog/300-dollar-in-gbp', file: 'de/blog/300-dollar-in-gbp.html' },
  { url: '/pt/blog/converter-tipo-de-arquivo-para-pdf', file: 'pt/blog/converter-tipo-de-arquivo-para-pdf.html' },
  { url: '/pt/blog/converter-lakh-para-usd', file: 'pt/blog/converter-lakh-para-usd.html' },
  { url: '/pt/blog/moeda-jpy-para-inr', file: 'pt/blog/moeda-jpy-para-inr.html' },
  { url: '/pt/blog/300-dolares-em-gbp', file: 'pt/blog/300-dolares-em-gbp.html' },
  { url: '/pt/blog/1-4-xicara-em-ml', file: 'pt/blog/1-4-xicara-em-ml.html' }
];

// Check all HTML files across repository to see who links to these URLs
function getAllHtmlFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      if (entry.name !== '.git' && entry.name !== 'node_modules') {
        getAllHtmlFiles(fullPath, fileList);
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allHtmls = getAllHtmlFiles('.');
console.log(`Total HTML files found: ${allHtmls.length}`);

// Check sitemaps
const sitemaps = ['sitemap.xml', 'sitemap-es.xml', 'sitemap-de.xml', 'sitemap-pt.xml'].filter(s => fs.existsSync(s));
const sitemapContents = sitemaps.map(s => ({ name: s, text: fs.readFileSync(s, 'utf8') }));

targets.forEach(t => {
  console.log(`\n========================================`);
  console.log(`TARGET: ${t.url}`);
  
  // 1. In sitemap?
  const inSitemaps = sitemapContents.filter(sm => sm.text.includes(t.url)).map(sm => sm.name);
  console.log(`  In Sitemap: ${inSitemaps.length > 0 ? inSitemaps.join(', ') : 'NO (MISSING FROM SITEMAP!)'}`);

  // 2. File checks: canonical, robots, title, hreflang
  if (fs.existsSync(t.file)) {
    const content = fs.readFileSync(t.file, 'utf8');
    const canonical = content.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    const robots = content.match(/<meta\s+name="robots"\s+content="([^"]+)"/i);
    const title = content.match(/<title>([^<]+)<\/title>/i);
    const hreflangs = [...content.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)].map(m => `${m[1]}->${m[2]}`);

    console.log(`  Canonical: ${canonical ? canonical[1] : 'NONE'}`);
    console.log(`  Robots: ${robots ? robots[1] : 'DEFAULT (index, follow)'}`);
    console.log(`  Title: ${title ? title[1] : 'NONE'}`);
    console.log(`  Hreflang count: ${hreflangs.length}`);

    // 3. Who links to this target?
    const linkingPages = [];
    allHtmls.forEach(htmlPath => {
      // Don't count self
      if (htmlPath === t.file || htmlPath === `./${t.file}`) return;
      const fileText = fs.readFileSync(htmlPath, 'utf8');
      if (fileText.includes(t.url) || fileText.includes(`${t.url}.html`)) {
        linkingPages.push(htmlPath);
      }
    });

    console.log(`  Inbound Internal Links count: ${linkingPages.length}`);
    if (linkingPages.length > 0) {
      console.log(`  Linked from: ${linkingPages.slice(0, 5).join(', ')}${linkingPages.length > 5 ? '... and ' + (linkingPages.length - 5) + ' more' : ''}`);
    } else {
      console.log(`  ⚠️ ORPHAN PAGE: Zero internal links found pointing to this URL!`);
    }
  } else {
    console.log(`  FILE DOES NOT EXIST!`);
  }
});
