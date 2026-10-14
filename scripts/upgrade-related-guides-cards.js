const fs = require('fs');
const path = require('path');

// Category Classifier
function getArticleCategory(slug) {
  const s = slug.toLowerCase();
  if (s.includes('usd') || s.includes('eur') || s.includes('gbp') || s.includes('aud') || s.includes('vnd') || s.includes('cad') || s.includes('jpy') || s.includes('currency') || s.includes('forex') || s.includes('dolar') || s.includes('inr') || s.includes('crore') || s.includes('lakh') || s.includes('pounds-to') || s.includes('libras-a-gbp') || s.includes('libras-para-gbp') || s.includes('pfund-in-gbp')) return 'currency';
  if (s.includes('kg') || s.includes('lbs') || s.includes('pound') || s.includes('libra') || s.includes('pfund') || s.includes('gram') || s.includes('ounce') || s.includes('stone') || s.includes('weight') || s.includes('peso') || s.includes('gewicht') || s.includes('massa')) return 'weight';
  if (s.includes('cup') || s.includes('liter') || s.includes('litre') || s.includes('ml') || s.includes('gallon') || s.includes('taza') || s.includes('xicara') || s.includes('tasse') || s.includes('volume') || s.includes('volumen') || s.includes('bar-to-psi') || s.includes('bar-a-psi') || s.includes('bar-em-psi') || s.includes('bar-in-psi')) return 'volume';
  if (s.includes('celsius') || s.includes('fahrenheit') || s.includes('kelvin') || s.includes('temperature') || s.includes('temperatura')) return 'temperature';
  return 'general';
}

const localizedMeta = {
  en: {
    sectionTitle: '📖 Related In-Depth Guides & Conversion Tools',
    sectionDesc: 'Explore closely related calculation guides, verified formulas, and interactive unit converters:'
  },
  es: {
    sectionTitle: '📖 Guías Detalladas y Herramientas Relacionadas',
    sectionDesc: 'Explora guías de cálculo estrechamente relacionadas, fórmulas verificadas y calculadoras interactivas:'
  },
  de: {
    sectionTitle: '📖 Verwandte Umrechnungsratgeber & Rechentools',
    sectionDesc: 'Entdecken Sie themenverwandte Anleitungen, verifizierte Formeln und interaktive Einheitenrechner:'
  },
  pt: {
    sectionTitle: '📖 Guias Detalhados e Ferramentas Relacionadas',
    sectionDesc: 'Explore guias de cálculo relacionados, fórmulas oficiais e conversores práticos de unidades:'
  }
};

const languages = [
  { lang: 'en', dir: 'blog', prefix: '/blog/' },
  { lang: 'es', dir: 'es/blog', prefix: '/es/blog/' },
  { lang: 'de', dir: 'de/blog', prefix: '/de/blog/' },
  { lang: 'pt', dir: 'pt/blog', prefix: '/pt/blog/' }
];

let upgradedSectionsCount = 0;

languages.forEach(({ lang, dir, prefix }) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

  // Load article metadata
  const articles = files.map(f => {
    const slug = f.replace('.html', '');
    const cat = getArticleCategory(slug);
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    const titleMatch = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : slug.replace(/-/g, ' ');
    if (title.length > 55) {
      title = title.split(':')[0].trim();
    }
    return { slug, cat, title };
  });

  files.forEach(f => {
    const filePath = path.join(dir, f);
    let content = fs.readFileSync(filePath, 'utf8');
    const slug = f.replace('.html', '');
    const currentCat = getArticleCategory(slug);

    // Pick 3-4 category-aware articles
    const sameCat = articles.filter(a => a.slug !== slug && a.cat === currentCat);
    const diffCat = articles.filter(a => a.slug !== slug && a.cat !== currentCat);
    const related = [...sameCat, ...diffCat].slice(0, 4);

    if (related.length === 0) return;

    const cardsHtml = related.map(r => `        <a href="${prefix}${r.slug}" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600; font-size:0.92rem; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <span>${r.title}</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>`).join('\n');

    const newSection = `<!-- Related In-Depth Conversion Guides -->
    <section class="related-guides-section" style="margin:2.5rem 0 1.5rem 0; padding:1.5rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; font-weight:800; color:var(--text-main); display:flex; align-items:center; gap:0.5rem;">
        <span>📖</span> ${localizedMeta[lang].sectionTitle}
      </h3>
      <p style="margin:0 0 1rem 0; font-size:0.92rem; color:var(--text-muted); line-height:1.5;">${localizedMeta[lang].sectionDesc}</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:0.85rem;">
${cardsHtml}
      </div>
    </section>`;

    // If related-guides-section exists, replace it
    if (content.includes('class="related-guides-section"')) {
      content = content.replace(/<section class="related-guides-section"[\s\S]*?<\/section>/, newSection);
      fs.writeFileSync(filePath, content, 'utf8');
      upgradedSectionsCount++;
    }
  });
});

console.log(`Upgraded related-guides-section with high-CTR category-aware cards in ${upgradedSectionsCount} articles.`);
