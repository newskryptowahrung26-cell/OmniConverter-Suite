const fs = require('fs');
const path = require('path');

function getAllHtml(dir, list = []) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'scripts') getAllHtml(full, list);
    } else if (f.endsWith('.html') && f !== '404.html') list.push(full);
  });
  return list;
}

const all = getAllHtml('.');
const today = new Date().toISOString().split('T')[0];

const urls = all.map(file => {
  const normalized = file.replace(/\\/g, '/').replace(/^\.\//, '');
  let url = 'https://www.omniconverter.co.uk/' + normalized.replace('.html', '');
  if (normalized === 'index.html') url = 'https://www.omniconverter.co.uk/';
  else if (normalized === 'es/index.html') url = 'https://www.omniconverter.co.uk/es/';
  else if (normalized === 'de/index.html') url = 'https://www.omniconverter.co.uk/de/';
  else if (normalized === 'pt/index.html') url = 'https://www.omniconverter.co.uk/pt/';

  let priority = '0.8';
  let changefreq = 'weekly';

  if (url === 'https://www.omniconverter.co.uk/' || url.endsWith('/es/') || url.endsWith('/de/') || url.endsWith('/pt/')) {
    priority = '1.0';
    changefreq = 'daily';
  } else if (url.includes('/temperature') || url.includes('/currency') || url.includes('/weight-mass') || url.includes('/length')) {
    priority = '0.9';
    changefreq = 'daily';
  } else if (url.includes('/50-fahrenheit') || url.includes('/180lbs-in-stone') || url.includes('/32-usd-to-gbp') || url.includes('/220-pounds-in-stone')) {
    priority = '0.9';
    changefreq = 'weekly';
  } else if (url.includes('/privacy-policy') || url.includes('/terms') || url.includes('/about') || url.includes('/contact')) {
    priority = '0.4';
    changefreq = 'monthly';
  }

  return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

fs.writeFileSync('sitemap.xml', sitemapXml, 'utf8');
console.log('Successfully regenerated sitemap.xml with total URLs:', urls.length);
