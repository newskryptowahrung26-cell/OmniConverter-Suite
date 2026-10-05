const fs = require('fs');
const path = require('path');

console.log('=== MASTER MULTILINGUAL BLOG SYNCHRONIZER ===\n');

// Specific publication timestamps for articles on 2026-10-05 to guarantee exact chronological order
const KNOWN_TIMESTAMPS = {
  '95-usd-to-gbp': '2026-10-05T12:07:34Z',
  '95-usd-a-gbp': '2026-10-05T12:07:34Z',
  '95-usd-in-gbp': '2026-10-05T12:07:34Z',
  '95-usd-para-gbp': '2026-10-05T12:07:34Z',
  '1500-usd-to-aud': '2026-10-05T00:16:47Z',
  '1500-usd-a-aud': '2026-10-05T00:16:47Z',
  '1500-usd-in-aud': '2026-10-05T00:16:47Z',
  '1500-usd-para-aud': '2026-10-05T00:16:47Z',
  '1-bigha-in-square-feet': '2026-10-05T00:05:00Z',
  '1-crore-in-millions': '2026-10-05T00:04:00Z',
  '1-gaj-in-square-feet': '2026-10-05T00:03:00Z',
  '1-guntha-in-sq-ft': '2026-10-05T00:02:00Z',
  '1-tola-in-grams': '2026-10-05T00:01:00Z'
};

const CATEGORY_TRANSLATIONS = {
  es: {
    'Kitchen & Culinary': 'Cocina y Culinaria',
    'Currency & Forex': 'Divisas y Forex',
    'Volume & Geometry': 'Volumen y Geometría',
    'Weight & Mass': 'Peso y Masa',
    'Temperature & Cooking': 'Temperatura y Cocina',
    'Length & Distance': 'Longitud y Distancia',
    'Conversion Guide': 'Guías de Conversión',
    'Product & Tech': 'Tecnología y Datos',
    'File & Media Tools': 'Archivos y Herramientas',
    'Indian Units & Land': 'Unidades Indias y Tierra',
    'author': 'Equipo Editorial OmniConverter',
    'readTime': '4 min de lectura',
    'dirTitle': 'Directorio Completo de Guías de Conversión'
  },
  de: {
    'Kitchen & Culinary': 'Küche & Kulinarik',
    'Currency & Forex': 'Währung & Devisen',
    'Volume & Geometry': 'Volumen & Geometrie',
    'Weight & Mass': 'Gewicht & Masse',
    'Temperature & Cooking': 'Temperatur & Kochen',
    'Length & Distance': 'Länge & Distanz',
    'Conversion Guide': 'Umrechnungsratgeber',
    'Product & Tech': 'Technologie & Daten',
    'File & Media Tools': 'Dateien & Medien',
    'Indian Units & Land': 'Indische Maße & Land',
    'author': 'OmniConverter Redaktionsteam',
    'readTime': '4 Min. Lesezeit',
    'dirTitle': 'Vollständiges Verzeichnis der Umrechnungsratgeber'
  },
  pt: {
    'Kitchen & Culinary': 'Culinária & Cozinha',
    'Currency & Forex': 'Moedas & Câmbio',
    'Volume & Geometry': 'Volume & Geometria',
    'Weight & Mass': 'Peso & Massa',
    'Temperature & Cooking': 'Temperatura & Culinária',
    'Length & Distance': 'Comprimento e Distância',
    'Conversion Guide': 'Guias de Conversão',
    'Product & Tech': 'Tecnologia & Dados',
    'File & Media Tools': 'Arquivos & Ferramentas',
    'Indian Units & Land': 'Unidades Indianas e Terras',
    'author': 'Equipe Editorial OmniConverter',
    'readTime': '4 min de leitura',
    'dirTitle': 'Diretório Completo de Guias de Conversão'
  },
  en: {
    'author': 'OmniConverter Editorial Team',
    'readTime': '4 min read',
    'dirTitle': 'Complete Directory of Conversion Guides'
  }
};

function getCategoryInfo(slug, title) {
  const s = slug.toLowerCase();
  const t = title.toLowerCase();
  let categoryKey = "Conversion Guide";
  let icon = "📊";

  if (s.includes('bigha') || s.includes('guntha') || s.includes('gaj') || s.includes('tola') || s.includes('crore') || s.includes('lakh')) {
    categoryKey = "Indian Units & Land";
    icon = "🇮🇳";
  } else if (s.includes('cup') || s.includes('tsp') || s.includes('tbsp') || s.includes('milk') || s.includes('baking') || t.includes('culinary') || t.includes('kitchen') || s.includes('taza') || s.includes('tasse') || s.includes('xicara') || s.includes('milch') || s.includes('leche') || s.includes('cucharadita') || s.includes('teeloeffel') || s.includes('colher')) {
    categoryKey = "Kitchen & Culinary";
    icon = "🍳";
  } else if (s.includes('usd') || s.includes('aud') || s.includes('vnd') || s.includes('gbp') || s.includes('won') || s.includes('cu') || s.includes('currency') || s.includes('forex') || s.includes('divisa') || s.includes('moeda') || s.includes('waehrung') || s.includes('dolar') || s.includes('dollar') || s.includes('pound') || s.includes('libra') || s.includes('rupiah') || s.includes('rupia') || s.includes('lira')) {
    categoryKey = "Currency & Forex";
    icon = "💱";
  } else if (s.includes('kg') || s.includes('lbs') || s.includes('stone') || s.includes('gram') || s.includes('weight') || s.includes('mass') || t.includes('weight') || t.includes('mass') || s.includes('kilo') || s.includes('pfund') || s.includes('peso') || s.includes('massa') || s.includes('quilo')) {
    categoryKey = "Weight & Mass";
    icon = "⚖️";
  } else if (s.includes('meter') || s.includes('inch') || s.includes('feet') || s.includes('foot') || s.includes('cm') || s.includes('mm') || s.includes('yard') || s.includes('length') || s.includes('height') || s.includes('fuss') || s.includes('pie') || s.includes('pes') || s.includes('longitud') || s.includes('comprimento') || s.includes('laenge')) {
    categoryKey = "Length & Distance";
    icon = "📏";
  } else if (s.includes('celsius') || s.includes('fahrenheit') || s.includes('kelvin') || s.includes('temperature') || t.includes('celsius') || t.includes('fahrenheit') || s.includes('temperatur') || s.includes('temperatura')) {
    categoryKey = "Temperature & Cooking";
    icon = "🌡️";
  } else if (s.includes('gallon') || s.includes('litres') || s.includes('liter') || s.includes('ml') || s.includes('bar-to-psi') || s.includes('bar-a-psi') || s.includes('bar-in-psi') || s.includes('bar-para-psi') || s.includes('volume') || t.includes('volume') || t.includes('pressure') || s.includes('galon') || s.includes('gallone') || s.includes('galao') || s.includes('unzen') || s.includes('onza') || s.includes('onca')) {
    categoryKey = "Volume & Geometry";
    icon = "🧪";
  } else if (s.includes('mph') || s.includes('kmh') || s.includes('speed') || s.includes('velocity') || s.includes('velocidad') || s.includes('geschwindigkeit') || s.includes('velocidade')) {
    categoryKey = "Product & Tech";
    icon = "⚡";
  } else if (s.includes('file') || s.includes('format') || s.includes('media') || s.includes('pdf') || s.includes('archivo') || s.includes('datei') || s.includes('arquivo')) {
    categoryKey = "File & Media Tools";
    icon = "📁";
  }

  return { categoryKey, icon };
}

// 1. First Pass: Read English articles and build master date lookup
const enMasterDates = new Map();
const enBlogDir = 'blog';
const enFiles = fs.readdirSync(enBlogDir).filter(f => f.endsWith('.html'));

enFiles.forEach(filename => {
  const slug = filename.replace('.html', '');
  const raw = fs.readFileSync(path.join(enBlogDir, filename), 'utf8');

  const metaDateMatch = raw.match(/<meta\s+(?:name|property)="article:published_time"\s+content="([^"]+)"/i);
  const jsonLdDateMatch = raw.match(/"datePublished":\s*"([^"]+)"/);
  const rawPubDate = (metaDateMatch && metaDateMatch[1]) || (jsonLdDateMatch && jsonLdDateMatch[1]) || '2026-09-15';

  const exactTimestamp = KNOWN_TIMESTAMPS[slug] || `${rawPubDate.split('T')[0]}T00:00:00Z`;
  const cleanDisplayDate = exactTimestamp.split('T')[0];

  enMasterDates.set(slug, {
    date: cleanDisplayDate,
    publicationDate: exactTimestamp
  });
});

// 2. Process all languages
function processBlogDirectory(lang) {
  const dir = lang === 'en' ? 'blog' : `${lang}/blog`;
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

  const posts = files.map(filename => {
    const slug = filename.replace('.html', '');
    const raw = fs.readFileSync(path.join(dir, filename), 'utf8');

    const titleMatch = raw.match(/<title[^>]*>(.*?)<\/title>/i);
    let fullTitle = titleMatch
      ? titleMatch[1].replace(/\s*\|\s*OmniConverter.*$/i, '').trim()
      : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const descMatch = raw.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    const summary = descMatch ? descMatch[1] : 'Comprehensive conversion guide.';

    // Look up canonical date from English counterpart or localized metadata
    let cleanDisplayDate = '2026-09-15';
    let exactTimestamp = '2026-09-15T00:00:00Z';

    const hreflangEnMatch = raw.match(/hreflang="en"\s+href="https:\/\/www\.omniconverter\.co\.uk\/blog\/([^"]+)"/i);
    const enSlug = hreflangEnMatch ? hreflangEnMatch[1] : slug;

    if (KNOWN_TIMESTAMPS[slug]) {
      exactTimestamp = KNOWN_TIMESTAMPS[slug];
      cleanDisplayDate = exactTimestamp.split('T')[0];
    } else if (enMasterDates.has(enSlug)) {
      const enMeta = enMasterDates.get(enSlug);
      exactTimestamp = enMeta.publicationDate;
      cleanDisplayDate = enMeta.date;
    } else {
      const metaDateMatch = raw.match(/<meta\s+(?:name|property)="article:published_time"\s+content="([^"]+)"/i);
      const jsonLdDateMatch = raw.match(/"datePublished":\s*"([^"]+)"/);
      const rawPubDate = (metaDateMatch && metaDateMatch[1]) || (jsonLdDateMatch && jsonLdDateMatch[1]) || '2026-09-15';
      cleanDisplayDate = rawPubDate.split('T')[0];
      exactTimestamp = `${cleanDisplayDate}T00:00:00Z`;
    }

    const ogImgMatch = raw.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    const bodyImgMatch = raw.match(/<img[^>]+src="(https:\/\/images\.unsplash[^"]+)"/i);
    const image = (ogImgMatch && ogImgMatch[1]) || (bodyImgMatch && bodyImgMatch[1]) || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80';

    const { categoryKey, icon } = getCategoryInfo(slug, fullTitle);
    const localizedCategory = (CATEGORY_TRANSLATIONS[lang] && CATEGORY_TRANSLATIONS[lang][categoryKey]) || categoryKey;
    const author = (CATEGORY_TRANSLATIONS[lang] && CATEGORY_TRANSLATIONS[lang].author) || 'OmniConverter Editorial Team';
    const readTime = (CATEGORY_TRANSLATIONS[lang] && CATEGORY_TRANSLATIONS[lang].readTime) || '4 min read';

    const articleSlug = lang === 'en' ? `/blog/${slug}` : `/${lang}/blog/${slug}`;

    return {
      id: slug,
      slug: articleSlug,
      title: fullTitle,
      date: cleanDisplayDate,
      publicationDate: exactTimestamp,
      category: localizedCategory,
      categoryKey: categoryKey,
      author: author,
      readTime: readTime,
      icon: icon,
      image: image,
      summary: summary
    };
  });

  // Sort strictly newest first (descending timestamp)
  posts.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());

  // Assign deterministic order index
  posts.forEach((p, index) => {
    p.order = index;
  });

  return posts;
}

// 1. Process all 4 languages
const enPosts = processBlogDirectory('en');
const esPosts = processBlogDirectory('es');
const dePosts = processBlogDirectory('de');
const ptPosts = processBlogDirectory('pt');

// 2. Write blog-data.js files
fs.writeFileSync('blog-data.js', `// Automatically synchronized blog data (Total: ${enPosts.length} articles)\nconst BLOG_POSTS = ${JSON.stringify(enPosts, null, 2)};\n\nwindow.BLOG_POSTS = BLOG_POSTS;\nwindow.blogArticles = BLOG_POSTS;\n`, 'utf8');
console.log(`[OK] blog-data.js: ${enPosts.length} articles. Top article: ${enPosts[0].id} (${enPosts[0].date})`);

fs.writeFileSync('es/blog-data.js', `// Datos sincronizados del blog en Español (Total: ${esPosts.length} artículos)\nconst BLOG_POSTS = ${JSON.stringify(esPosts, null, 2)};\n\nwindow.BLOG_POSTS = BLOG_POSTS;\nwindow.blogArticles = BLOG_POSTS;\n`, 'utf8');
console.log(`[OK] es/blog-data.js: ${esPosts.length} articles. Top article: ${esPosts[0].id} (${esPosts[0].date})`);

fs.writeFileSync('de/blog-data.js', `// Synchronisierte Blogdaten auf Deutsch (Gesamt: ${dePosts.length} Artikel)\nconst BLOG_POSTS = ${JSON.stringify(dePosts, null, 2)};\n\nwindow.BLOG_POSTS = BLOG_POSTS;\nwindow.blogArticles = BLOG_POSTS;\n`, 'utf8');
console.log(`[OK] de/blog-data.js: ${dePosts.length} articles. Top article: ${dePosts[0].id} (${dePosts[0].date})`);

fs.writeFileSync('pt/blog-data.js', `// Dados sincronizados do blog em Português (Total: ${ptPosts.length} artigos)\nconst BLOG_POSTS = ${JSON.stringify(ptPosts, null, 2)};\n\nwindow.BLOG_POSTS = BLOG_POSTS;\nwindow.blogArticles = BLOG_POSTS;\n`, 'utf8');
console.log(`[OK] pt/blog-data.js: ${ptPosts.length} articles. Top article: ${ptPosts[0].id} (${ptPosts[0].date})`);

// 3. Update static directory blocks in blog hub HTML files
function updateHubDirectory(hubFile, posts, lang) {
  if (!fs.existsSync(hubFile)) return;
  let html = fs.readFileSync(hubFile, 'utf8');

  const dirTitle = (CATEGORY_TRANSLATIONS[lang] && CATEGORY_TRANSLATIONS[lang].dirTitle) || 'Complete Directory of Conversion Guides';
  const listItems = posts.map(p => `        <li><a href="${p.slug}" style="color:var(--primary-600); font-weight:600;">${p.title}</a></li>`).join('\n');

  const newSection = `<!-- DIRECTORY_BLOCK -->\n    <section class="content-section" style="margin-top:2rem;">\n      <h2 style="font-size:1.2rem; font-weight:800; margin-bottom:1rem;">${dirTitle} (${posts.length} Guides)</h2>\n      <ul style="line-height:1.9; color:var(--text-muted); padding-left:1.5rem; display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:0.4rem;">\n${listItems}\n      </ul>\n    </section>`;

  if (html.includes('<!-- DIRECTORY_BLOCK -->')) {
    html = html.replace(/<!-- DIRECTORY_BLOCK -->[\s\S]*?<\/section>/i, newSection);
  } else if (/<!-- ORPHAN_LINKS_BLOCK -->[\s\S]*?<\/section>/i.test(html)) {
    html = html.replace(/<!-- ORPHAN_LINKS_BLOCK -->[\s\S]*?<\/section>/i, newSection);
  } else {
    // Replace section containing Directori / Directory / Verzeichnis
    const dirSectionRegex = /<section class="content-section"[^>]*>\s*<h2[^>]*>[^<]*(?:Directory|Directorio|Verzeichnis|Diretório)[^<]*<\/h2>[\s\S]*?<\/section>/i;
    if (dirSectionRegex.test(html)) {
      html = html.replace(dirSectionRegex, newSection);
    }
  }

  fs.writeFileSync(hubFile, html, 'utf8');
  console.log(`[OK] Updated static directory in ${hubFile} (${posts.length} guides).`);
}

updateHubDirectory('blog.html', enPosts, 'en');
updateHubDirectory('es/blog.html', esPosts, 'es');
updateHubDirectory('de/blog.html', dePosts, 'de');
updateHubDirectory('pt/blog.html', ptPosts, 'pt');

// 4. Synchronize RSS feed.xml with newest posts first
try {
  const topFeedPosts = enPosts.slice(0, 25);
  const feedItems = topFeedPosts.map(p => `    <item>
      <title>${p.title.replace(/&/g, '&amp;')}</title>
      <link>https://www.omniconverter.co.uk${p.slug}</link>
      <guid isPermaLink="true">https://www.omniconverter.co.uk${p.slug}</guid>
      <description>${p.summary.replace(/&/g, '&amp;')}</description>
      <pubDate>${new Date(p.publicationDate).toUTCString()}</pubDate>
    </item>`).join('\n');

  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OmniConverter Blog &amp; Guides</title>
    <link>https://www.omniconverter.co.uk/blog</link>
    <description>Daily conversion guides, measurement references, and unit calculation articles.</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://www.omniconverter.co.uk/feed.xml" rel="self" type="application/rss+xml"/>
${feedItems}
  </channel>
</rss>
`;
  fs.writeFileSync('feed.xml', feedXml, 'utf8');
  console.log(`[OK] feed.xml synchronized with top ${topFeedPosts.length} newest articles.`);
} catch (e) {
  console.warn(`Could not sync feed.xml: ${e.message}`);
}

// 5. Synchronize Google News Sitemap (news-sitemap.xml)
try {
  const twoDaysAgo = Date.now() - (48 * 60 * 60 * 1000);
  let recentNews = enPosts.filter(p => new Date(p.publicationDate).getTime() >= twoDaysAgo);
  if (recentNews.length === 0) recentNews = enPosts.slice(0, 5);

  const newsEntries = recentNews.map(p => `  <url>
    <loc>https://www.omniconverter.co.uk${p.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>OmniConverter</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${p.publicationDate.split('T')[0]}</news:publication_date>
      <news:title>${p.title.replace(/&/g, '&amp;')}</news:title>
    </news:news>
  </url>`).join('\n');

  const newsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsEntries}
</urlset>
`;
  fs.writeFileSync('news-sitemap.xml', newsXml, 'utf8');
  console.log(`[OK] news-sitemap.xml synchronized with ${recentNews.length} articles.`);
} catch (e) {
  console.warn(`Could not sync news-sitemap.xml: ${e.message}`);
}

console.log('\n=== MASTER MULTILINGUAL BLOG SYNCHRONIZATION COMPLETE! ===');
