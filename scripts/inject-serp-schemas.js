const fs = require('fs');
const path = require('path');

// 1. Update index.html with Google Sitelinks Searchbox
let idx = fs.readFileSync('index.html', 'utf8');
const searchActionSchema = `  <!-- Schema.org WebSite for Google Sitelinks Searchbox -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "OmniConverter",
    "alternateName": ["OmniConverter Suite", "OmniConverter UK", "omniconverter.co.uk"],
    "url": "https://www.omniconverter.co.uk/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.omniconverter.co.uk/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "description": "Universal online unit and media file converter suite."
  }
  </script>`;

if (!idx.includes('SearchAction')) {
  idx = idx.replace(/<!-- Schema\.org WebSite for Google Sitelinks -->[\s\S]*?<\/script>/, searchActionSchema);
  fs.writeFileSync('index.html', idx, 'utf8');
  console.log('Updated index.html with Sitelinks Searchbox');
}

// 2. Ensure all pages have BreadcrumbList schema
function getAllHtml(dir, list = []) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'scripts') getAllHtml(full, list);
    } else if (f.endsWith('.html')) list.push(full);
  });
  return list;
}

const all = getAllHtml('.');
let bcCount = 0;

for (const file of all) {
  let content = fs.readFileSync(file, 'utf8');
  if (file === 'index.html' || file === '404.html' || file.endsWith('index.html')) continue;

  if (!content.includes('BreadcrumbList')) {
    // Generate Breadcrumb based on file path
    const normalized = file.replace(/\\/g, '/');
    let title = 'Converter Guide';
    const m = content.match(/<title>([^<]+)<\/title>/);
    if (m) title = m[1].split('|')[0].trim();

    let items = [
      { name: 'Home', url: 'https://www.omniconverter.co.uk/' }
    ];

    if (normalized.startsWith('es/')) {
      items[0] = { name: 'Inicio', url: 'https://www.omniconverter.co.uk/es/' };
      if (normalized.includes('/blog/')) {
        items.push({ name: 'Blog', url: 'https://www.omniconverter.co.uk/es/blog' });
      }
    } else if (normalized.startsWith('de/')) {
      items[0] = { name: 'Startseite', url: 'https://www.omniconverter.co.uk/de/' };
      if (normalized.includes('/blog/')) {
        items.push({ name: 'Blog', url: 'https://www.omniconverter.co.uk/de/blog' });
      }
    } else if (normalized.startsWith('pt/')) {
      items[0] = { name: 'Início', url: 'https://www.omniconverter.co.uk/pt/' };
      if (normalized.includes('/blog/')) {
        items.push({ name: 'Blog', url: 'https://www.omniconverter.co.uk/pt/blog' });
      }
    } else {
      if (normalized.includes('blog/')) {
        items.push({ name: 'Blog', url: 'https://www.omniconverter.co.uk/blog' });
      }
    }

    const currentUrl = `https://www.omniconverter.co.uk/${normalized.replace('.html', '')}`;
    items.push({ name: title, url: currentUrl });

    const itemListElement = items.map((it, idx) => `      {
        "@type": "ListItem",
        "position": ${idx + 1},
        "name": ${JSON.stringify(it.name)},
        "item": "${it.url}"
      }`).join(',\n');

    const breadcrumbSchema = `
  <!-- Schema.org BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
${itemListElement}
    ]
  }
  </script>
</head>`;

    content = content.replace('</head>', breadcrumbSchema);
    fs.writeFileSync(file, content, 'utf8');
    bcCount++;
  }
}

console.log('Successfully added BreadcrumbList schema to files:', bcCount);
