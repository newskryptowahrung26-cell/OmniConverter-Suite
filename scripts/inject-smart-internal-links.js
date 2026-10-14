const fs = require('fs');
const path = require('path');

// 1. Category Classifier based on keywords & slugs
function getArticleCategory(slug) {
  const s = slug.toLowerCase();
  if (s.includes('usd') || s.includes('eur') || s.includes('gbp') || s.includes('aud') || s.includes('vnd') || s.includes('cad') || s.includes('jpy') || s.includes('currency') || s.includes('forex') || s.includes('dolar') || s.includes('inr') || s.includes('crore') || s.includes('lakh') || s.includes('pounds-to') || s.includes('libras-a-gbp') || s.includes('libras-para-gbp') || s.includes('pfund-in-gbp')) return 'currency';
  if (s.includes('kg') || s.includes('lbs') || s.includes('pound') || s.includes('libra') || s.includes('pfund') || s.includes('gram') || s.includes('ounce') || s.includes('stone') || s.includes('weight') || s.includes('peso') || s.includes('gewicht') || s.includes('massa')) return 'weight';
  if (s.includes('cup') || s.includes('liter') || s.includes('litre') || s.includes('ml') || s.includes('gallon') || s.includes('taza') || s.includes('xicara') || s.includes('tasse') || s.includes('volume') || s.includes('volumen') || s.includes('bar-to-psi') || s.includes('bar-a-psi') || s.includes('bar-em-psi') || s.includes('bar-in-psi')) return 'volume';
  if (s.includes('celsius') || s.includes('fahrenheit') || s.includes('kelvin') || s.includes('temperature') || s.includes('temperatura')) return 'temperature';
  return 'general';
}

const localizedCrossTitle = {
  en: 'Related Conversion Guides:',
  es: 'Guías de Conversión Relacionadas:',
  de: 'Verwandte Umrechnungsratgeber:',
  pt: 'Guias de Conversão Relacionados:'
};

const languages = [
  { lang: 'en', dir: 'blog', prefix: '/blog/' },
  { lang: 'es', dir: 'es/blog', prefix: '/es/blog/' },
  { lang: 'de', dir: 'de/blog', prefix: '/de/blog/' },
  { lang: 'pt', dir: 'pt/blog', prefix: '/pt/blog/' }
];

let updatedCount = 0;

languages.forEach(({ lang, dir, prefix }) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');
  
  // Collect all articles with categories and titles
  const allArticles = files.map(f => {
    const slug = f.replace('.html', '');
    const cat = getArticleCategory(slug);
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    const titleMatch = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : slug.replace(/-/g, ' ');
    if (title.length > 55) {
      title = title.split(':')[0].trim();
    }
    return { file: f, slug, cat, title };
  });

  files.forEach(f => {
    const filePath = path.join(dir, f);
    let content = fs.readFileSync(filePath, 'utf8');
    const slug = f.replace('.html', '');
    const currentCat = getArticleCategory(slug);

    // Filter relevant articles in the same language and category
    const sameCat = allArticles.filter(a => a.slug !== slug && a.cat === currentCat);
    const diffCat = allArticles.filter(a => a.slug !== slug && a.cat !== currentCat);
    const related = [...sameCat, ...diffCat].slice(0, 4);

    if (related.length === 0) return;

    const crossLinksBlock = `<!-- CROSS_LINKS_BLOCK -->
    <div style="margin:2rem 0; padding:1.25rem 1.5rem; background:var(--bg-elevated); border-radius:var(--radius-lg); border:1px solid var(--card-border);">
      <p style="color:var(--text-muted); font-size:0.95rem; margin:0;">
        <strong>${localizedCrossTitle[lang]}</strong> 
        ${related.map(r => `<a href="${prefix}${r.slug}" style="color:var(--primary-600); font-weight:600; margin:0 0.5rem;">${r.title}</a>`).join(' &bull; ')}
      </p>
    </div>`;

    if (content.includes('<!-- CROSS_LINKS_BLOCK -->')) {
      content = content.replace(/<!-- CROSS_LINKS_BLOCK -->[\s\S]*?<\/div>/, crossLinksBlock);
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
    }
  });
});

console.log(`Successfully updated category-aware smart internal links across ${updatedCount} HTML articles.`);
