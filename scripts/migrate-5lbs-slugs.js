const fs = require('fs');

// 1. Rename files on disk
if (fs.existsSync('es/blog/5-lbs-in-kg.html')) {
  fs.renameSync('es/blog/5-lbs-in-kg.html', 'es/blog/5-libras-a-kg.html');
  console.log('[OK] Renamed to es/blog/5-libras-a-kg.html');
}
if (fs.existsSync('de/blog/5-lbs-in-kg.html')) {
  fs.renameSync('de/blog/5-lbs-in-kg.html', 'de/blog/5-pfund-in-kg.html');
  console.log('[OK] Renamed to de/blog/5-pfund-in-kg.html');
}
if (fs.existsSync('pt/blog/5-lbs-in-kg.html')) {
  fs.renameSync('pt/blog/5-lbs-in-kg.html', 'pt/blog/5-libras-para-kg.html');
  console.log('[OK] Renamed to pt/blog/5-libras-para-kg.html');
}

// 2. Update English file hreflangs and lang-switcher
if (fs.existsSync('blog/5-lbs-in-kg.html')) {
  let enHtml = fs.readFileSync('blog/5-lbs-in-kg.html', 'utf8');
  enHtml = enHtml.replace(
    /<link rel="alternate" hreflang="es" href="[^"]+">/,
    '<link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk/es/blog/5-libras-a-kg">'
  );
  enHtml = enHtml.replace(
    /<link rel="alternate" hreflang="de" href="[^"]+">/,
    '<link rel="alternate" hreflang="de" href="https://www.omniconverter.co.uk/de/blog/5-pfund-in-kg">'
  );
  enHtml = enHtml.replace(
    /<link rel="alternate" hreflang="pt" href="[^"]+">/,
    '<link rel="alternate" hreflang="pt" href="https://www.omniconverter.co.uk/pt/blog/5-libras-para-kg">'
  );
  enHtml = enHtml.replace(
    /<a href="\/es\/blog\/5-lbs-in-kg" title="Español">ES<\/a>/,
    '<a href="/es/blog/5-libras-a-kg" title="Español">ES</a>'
  );
  enHtml = enHtml.replace(
    /<a href="\/de\/blog\/5-lbs-in-kg" title="Deutsch">DE<\/a>/,
    '<a href="/de/blog/5-pfund-in-kg" title="Deutsch">DE</a>'
  );
  enHtml = enHtml.replace(
    /<a href="\/pt\/blog\/5-lbs-in-kg" title="Português">PT<\/a>/,
    '<a href="/pt/blog/5-libras-para-kg" title="Português">PT</a>'
  );
  fs.writeFileSync('blog/5-lbs-in-kg.html', enHtml, 'utf8');
  console.log('[OK] Updated blog/5-lbs-in-kg.html with native localized cross-links');
}

// 3. Helper to update localized files
const localConfigs = [
  { file: 'es/blog/5-libras-a-kg.html', lang: 'es', slug: '5-libras-a-kg' },
  { file: 'de/blog/5-pfund-in-kg.html', lang: 'de', slug: '5-pfund-in-kg' },
  { file: 'pt/blog/5-libras-para-kg.html', lang: 'pt', slug: '5-libras-para-kg' }
];

localConfigs.forEach(cfg => {
  if (fs.existsSync(cfg.file)) {
    let html = fs.readFileSync(cfg.file, 'utf8');
    // Canonical
    html = html.replace(
      /<link rel="canonical" href="[^"]+">/,
      '<link rel="canonical" href="https://www.omniconverter.co.uk/' + cfg.lang + '/blog/' + cfg.slug + '">'
    );
    // Hreflang
    html = html.replace(
      /<link rel="alternate" hreflang="es" href="[^"]+">/,
      '<link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk/es/blog/5-libras-a-kg">'
    );
    html = html.replace(
      /<link rel="alternate" hreflang="de" href="[^"]+">/,
      '<link rel="alternate" hreflang="de" href="https://www.omniconverter.co.uk/de/blog/5-pfund-in-kg">'
    );
    html = html.replace(
      /<link rel="alternate" hreflang="pt" href="[^"]+">/,
      '<link rel="alternate" hreflang="pt" href="https://www.omniconverter.co.uk/pt/blog/5-libras-para-kg">'
    );
    // OpenGraph URL
    html = html.replace(
      /<meta property="og:url" content="[^"]+">/,
      '<meta property="og:url" content="https://www.omniconverter.co.uk/' + cfg.lang + '/blog/' + cfg.slug + '">'
    );
    // JSON-LD URL
    html = html.replace(
      /"url":\s*"https:\/\/www\.omniconverter\.co\.uk\/[^"]+"/,
      '"url": "https://www.omniconverter.co.uk/' + cfg.lang + '/blog/' + cfg.slug + '"'
    );
    // Breadcrumb schema 3rd item
    html = html.replace(
      /("position":\s*3,\s*"name":\s*"[^"]+",\s*"item":\s*")https:\/\/www\.omniconverter\.co\.uk\/[^"]+(")/,
      '$1https://www.omniconverter.co.uk/' + cfg.lang + '/blog/' + cfg.slug + '$2'
    );
    // Lang switcher
    html = html.replace(
      /<a href="\/es\/blog\/[^"]+" title="Español">ES<\/a>/,
      '<a href="/es/blog/5-libras-a-kg" title="Español">ES</a>'
    );
    html = html.replace(
      /<a href="\/de\/blog\/[^"]+" title="Deutsch">DE<\/a>/,
      '<a href="/de/blog/5-pfund-in-kg" title="Deutsch">DE</a>'
    );
    html = html.replace(
      /<a href="\/pt\/blog\/[^"]+" title="Português">PT<\/a>/,
      '<a href="/pt/blog/5-libras-para-kg" title="Português">PT</a>'
    );
    // Breadcrumbs in header & nav
    html = html.replace(
      /<a href="\/blog"/g,
      '<a href="/' + cfg.lang + '/blog"'
    );
    fs.writeFileSync(cfg.file, html, 'utf8');
    console.log('[OK] Updated', cfg.file);
  }
});
