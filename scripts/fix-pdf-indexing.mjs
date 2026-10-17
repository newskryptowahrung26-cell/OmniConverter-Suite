import fs from 'fs';

const pdfFiles = [
  'blog/convert-pdf-form.html',
  'es/blog/convertir-formulario-pdf.html',
  'pt/blog/converter-tipo-de-arquivo-para-pdf.html'
];

pdfFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/<meta\s+name=["']robots["']\s+content=["']noindex,\s*follow["']\s*\/?>/gi, '<meta name="robots" content="index, follow">');
  fs.writeFileSync(f, c, 'utf8');
  console.log(`[ROBOTS] Updated ${f} to index, follow`);
});

// Update sitemap.xml with the 3 URLs
let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const urlsToAdd = [
  'https://www.omniconverter.co.uk/blog/convert-pdf-form',
  'https://www.omniconverter.co.uk/es/blog/convertir-formulario-pdf',
  'https://www.omniconverter.co.uk/pt/blog/converter-tipo-de-arquivo-para-pdf'
];

urlsToAdd.forEach(u => {
  if (!sitemap.includes(u)) {
    const entry = `  <url><loc>${u}</loc><lastmod>2026-10-17</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    sitemap = sitemap.replace('</urlset>', `${entry}</urlset>`);
    console.log(`[SITEMAP] Added ${u}`);
  } else {
    console.log(`[SITEMAP] Already present: ${u}`);
  }
});

fs.writeFileSync('sitemap.xml', sitemap, 'utf8');
