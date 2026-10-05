import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOPICS_DATA } from './topics-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const esDir = path.join(rootDir, 'es');
const deDir = path.join(rootDir, 'de');
const ptDir = path.join(rootDir, 'pt');
const esBlogDir = path.join(esDir, 'blog');
const deBlogDir = path.join(deDir, 'blog');
const ptBlogDir = path.join(ptDir, 'blog');

[esDir, deDir, ptDir, esBlogDir, deBlogDir, ptBlogDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Common Ads & Head Tags
function makeCommonHead(lang, title, desc, canonical, paths) {
  return `  <meta charset="UTF-8">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4766868021895107" crossorigin="anonymous"></script>
  <meta name="google-adsense-account" content="ca-pub-4766868021895107">
  <script src="/ahrefs-analytics.js" data-key="i4l/B5Lec0bODmBnYEF+kw" async></script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | OmniConverter</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" href="/logo.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="https://www.omniconverter.co.uk/logo.png">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://www.omniconverter.co.uk/logo.png">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="OmniConverter">
  <link rel="stylesheet" href="/styles.css">
  <link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk${paths.en}">
  <link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk${paths.es}">
  <link rel="alternate" hreflang="de" href="https://www.omniconverter.co.uk${paths.de}">
  <link rel="alternate" hreflang="pt" href="https://www.omniconverter.co.uk${paths.pt}">
  <link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk${paths.en}">`;
}

function makeHeader(lang, activeTab, paths) {
  const translations = {
    en: {
      menu: 'Menu',
      tabs: [
        { id: 'home', name: 'Home', url: '/' },
        { id: 'indian-units', name: '🇮🇳 Indian Units', url: '/indian-units' },
        { id: 'time-zone', name: 'Time Zone', url: '/time-zone' },
        { id: 'currency', name: 'Currency', url: '/currency' },
        { id: 'length', name: 'Length', url: '/length' },
        { id: 'temperature', name: 'Temperature', url: '/temperature' },
        { id: 'weight-mass', name: 'Weight', url: '/weight-mass' },
        { id: 'volume-capacity', name: 'Volume', url: '/volume-capacity' },
        { id: 'time-duration', name: 'Time', url: '/time-duration' },
        { id: 'area', name: 'Area', url: '/area' },
        { id: 'speed', name: 'Speed', url: '/speed' },
        { id: 'file-media', name: 'Files', url: '/file-media' },
        { id: 'blog', name: 'Blog', url: '/blog' }
      ]
    },
    es: {
      menu: 'Menú',
      tabs: [
        { id: 'home', name: 'Inicio', url: '/es/' },
        { id: 'indian-units', name: '🇮🇳 Unidades Indias', url: '/indian-units' },
        { id: 'time-zone', name: 'Zonas Horarias', url: '/es/time-zone' },
        { id: 'currency', name: 'Divisas', url: '/es/currency' },
        { id: 'length', name: 'Longitud', url: '/es/length' },
        { id: 'temperature', name: 'Temperatura', url: '/es/temperature' },
        { id: 'weight-mass', name: 'Peso', url: '/es/weight-mass' },
        { id: 'volume-capacity', name: 'Volumen', url: '/es/volume-capacity' },
        { id: 'time-duration', name: 'Tiempo', url: '/es/time-duration' },
        { id: 'area', name: 'Área', url: '/es/area' },
        { id: 'speed', name: 'Velocidad', url: '/es/speed' },
        { id: 'file-media', name: 'Archivos', url: '/es/file-media' },
        { id: 'blog', name: 'Blog', url: '/es/blog' }
      ]
    },
    de: {
      menu: 'Menü',
      tabs: [
        { id: 'home', name: 'Startseite', url: '/de/' },
        { id: 'indian-units', name: '🇮🇳 Indische Maße', url: '/indian-units' },
        { id: 'time-zone', name: 'Zeitzonen', url: '/de/time-zone' },
        { id: 'currency', name: 'Währung', url: '/de/currency' },
        { id: 'length', name: 'Länge', url: '/de/length' },
        { id: 'temperature', name: 'Temperatur', url: '/de/temperature' },
        { id: 'weight-mass', name: 'Gewicht', url: '/de/weight-mass' },
        { id: 'volume-capacity', name: 'Volumen', url: '/de/volume-capacity' },
        { id: 'time-duration', name: 'Zeit', url: '/de/time-duration' },
        { id: 'area', name: 'Fläche', url: '/de/area' },
        { id: 'speed', name: 'Geschwindigkeit', url: '/de/speed' },
        { id: 'file-media', name: 'Dateien', url: '/de/file-media' },
        { id: 'blog', name: 'Blog', url: '/de/blog' }
      ]
    },
    pt: {
      menu: 'Menu',
      tabs: [
        { id: 'home', name: 'Início', url: '/pt/' },
        { id: 'indian-units', name: '🇮🇳 Unidades Indianas', url: '/indian-units' },
        { id: 'time-zone', name: 'Fuso Horário', url: '/pt/time-zone' },
        { id: 'currency', name: 'Moedas', url: '/pt/currency' },
        { id: 'length', name: 'Comprimento', url: '/pt/length' },
        { id: 'temperature', name: 'Temperatura', url: '/pt/temperature' },
        { id: 'weight-mass', name: 'Peso', url: '/pt/weight-mass' },
        { id: 'volume-capacity', name: 'Volume', url: '/pt/volume-capacity' },
        { id: 'time-duration', name: 'Tempo', url: '/pt/time-duration' },
        { id: 'area', name: 'Área', url: '/pt/area' },
        { id: 'speed', name: 'Velocidade', url: '/pt/speed' },
        { id: 'file-media', name: 'Arquivos', url: '/pt/file-media' },
        { id: 'blog', name: 'Blog', url: '/pt/blog' }
      ]
    }
  };

  const t = translations[lang] || translations.en;
  const tabHtml = t.tabs.map(item => {
    const cls = item.id === activeTab ? 'tab-btn active' : 'tab-btn';
    return `<a href="${item.url}" class="${cls}">${item.name}</a>`;
  }).join('\n        ');

  const enLink = lang === 'en' ? `<span class="active" title="English">🇬🇧 EN</span>` : `<a href="${paths.en}" title="English">🇬🇧 EN</a>`;
  const esLink = lang === 'es' ? `<span class="active" title="Español">🇪🇸 ES</span>` : `<a href="${paths.es}" title="Español">🇪🇸 ES</a>`;
  const deLink = lang === 'de' ? `<span class="active" title="Deutsch">🇩🇪 DE</span>` : `<a href="${paths.de}" title="Deutsch">🇩🇪 DE</a>`;
  const ptLink = lang === 'pt' ? `<span class="active" title="Português">🇧🇷 PT</span>` : `<a href="${paths.pt}" title="Português">🇧🇷 PT</a>`;

  return `  <header>
    <div class="header-container">
      <a href="${lang === 'en' ? '/' : `/${lang}/`}" class="logo" aria-label="OmniConverter">
        <img src="/logo.png" alt="OmniConverter Logo" style="width:32px; height:32px; border-radius:6px; object-fit:cover;">
        <span>OmniConverter</span>
      </a>

      <button type="button" class="mobile-menu-btn" onclick="const n=this.nextElementSibling||document.querySelector('.nav-tabs');if(n)n.classList.toggle('is-open');" aria-label="Toggle navigation menu">
        <span>${t.menu}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <nav class="nav-tabs" aria-label="Category navigation">
        ${tabHtml}
      </nav>

      <div class="lang-switcher" aria-label="Language Selector">
        ${enLink}
        <span class="lang-sep">|</span>
        ${esLink}
        <span class="lang-sep">|</span>
        ${deLink}
        <span class="lang-sep">|</span>
        ${ptLink}
      </div>
    </div>
  </header>`;
}

function makeFooter(lang) {
  if (lang === 'de') {
    return `  <footer>
    <p>&copy; 2026 OmniConverter. Alle Rechte vorbehalten. | <a href="/de/blog" style="color:var(--primary-600);">Blog</a> | <a href="/de/sitemap" style="color:var(--primary-600);">Sitemap</a> | <a href="/de/privacy-policy" style="color:var(--primary-600);">Datenschutz</a> | <a href="/de/terms" style="color:var(--primary-600);">AGB</a> | <a href="/de/about" style="color:var(--primary-600);">Über uns</a> | <a href="/de/contact" style="color:var(--primary-600);">Kontakt</a></p>
  </footer>`;
  }
  if (lang === 'pt') {
    return `  <footer>
    <p>&copy; 2026 OmniConverter. Todos os direitos reservados. | <a href="/pt/blog" style="color:var(--primary-600);">Blog</a> | <a href="/pt/sitemap" style="color:var(--primary-600);">Mapa do Site</a> | <a href="/pt/privacy-policy" style="color:var(--primary-600);">Privacidade</a> | <a href="/pt/terms" style="color:var(--primary-600);">Termos</a> | <a href="/pt/about" style="color:var(--primary-600);">Sobre</a> | <a href="/pt/contact" style="color:var(--primary-600);">Contato</a></p>
  </footer>`;
  }
  if (lang === 'es') {
    return `  <footer>
    <p>&copy; 2026 OmniConverter. Todos los derechos reservados. | <a href="/es/blog" style="color:var(--primary-600);">Blog</a> | <a href="/es/sitemap" style="color:var(--primary-600);">Mapa del Sitio</a> | <a href="/es/privacy-policy" style="color:var(--primary-600);">Privacidad</a> | <a href="/es/terms" style="color:var(--primary-600);">Términos</a> | <a href="/es/about" style="color:var(--primary-600);">Nosotros</a> | <a href="/es/contact" style="color:var(--primary-600);">Contacto</a></p>
  </footer>`;
  }
  return `  <footer>
    <p>&copy; 2026 OmniConverter. All rights reserved. | <a href="/blog" style="color:var(--primary-600);">Blog</a> | <a href="/sitemap" style="color:var(--primary-600);">HTML Sitemap</a> | <a href="/privacy-policy" style="color:var(--primary-600);">Privacy</a> | <a href="/terms" style="color:var(--primary-600);">Terms</a> | <a href="/about" style="color:var(--primary-600);">About</a> | <a href="/contact" style="color:var(--primary-600);">Contact</a></p>
  </footer>`;
}

// Topic Categories Helper
function getTopicCategory(slug, lang) {
  const s = slug.toLowerCase();
  const cats = {
    es: {
      kitchen: 'Cocina y Culinaria',
      currency: 'Divisas y Finanzas',
      weight: 'Peso y Masa',
      temp: 'Temperatura',
      tech: 'Archivos y Herramientas',
      length: 'Longitud y Presión',
      other: 'Guías Generales'
    },
    de: {
      kitchen: 'Küche & Kochen',
      currency: 'Währung & Devisen',
      weight: 'Gewicht & Masse',
      temp: 'Temperatur',
      tech: 'Dateien & Tools',
      length: 'Länge & Druck',
      other: 'Allgemeine Ratgeber'
    },
    pt: {
      kitchen: 'Culinária & Cozinha',
      currency: 'Moedas & Câmbio',
      weight: 'Peso & Massa',
      temp: 'Temperatura',
      tech: 'Arquivos & Ferramentas',
      length: 'Comprimento & Pressão',
      other: 'Guias Gerais'
    }
  };
  const c = cats[lang];

  if (s.includes('cup') || s.includes('taza') || s.includes('tasse') || s.includes('xicara') || s.includes('milk') || s.includes('tsp') || s.includes('leche') || s.includes('teeloeffel') || s.includes('cha') || s.includes('gallon') || s.includes('galon') || s.includes('gallone') || s.includes('galao') || s.includes('ml')) {
    return c.kitchen;
  }
  if (s.includes('usd') || s.includes('aud') || s.includes('vnd') || s.includes('won') || s.includes('gbp') || s.includes('lira') || s.includes('inr') || s.includes('rupiah') || s.includes('dollar') || s.includes('pound') || s.includes('waehrung') || s.includes('divisa') || s.includes('moeda') || s.includes('mastercard') || s.includes('lakh') || s.includes('indonesia')) {
    return c.currency;
  }
  if (s.includes('stone') || s.includes('kg') || s.includes('lbs') || s.includes('pound') || s.includes('kilo') || s.includes('peso') || s.includes('gewicht') || s.includes('libra') || s.includes('pfund')) {
    return c.weight;
  }
  if (s.includes('celsius') || s.includes('fahrenheit') || s.includes('temperatur')) {
    return c.temp;
  }
  if (s.includes('pdf') || s.includes('file') || s.includes('archivo') || s.includes('datei') || s.includes('arquivo') || s.includes('converter-app') || s.includes('convertor') || s.includes('weeks') || s.includes('semanas') || s.includes('wochen')) {
    return c.tech;
  }
  if (s.includes('bar') || s.includes('psi') || s.includes('meter') || s.includes('feet') || s.includes('pies') || s.includes('fuss') || s.includes('mph') || s.includes('kmh') || s.includes('pes')) {
    return c.length;
  }
  return c.other;
}

// =========================================================================
// 1. GENERATE RICH BLOG HUB PAGES FOR ES, DE, PT WITH ALL 50 CARDS
// =========================================================================
function generateBlogHub(lang) {
  const paths = {
    en: '/blog',
    es: '/es/blog',
    de: '/de/blog',
    pt: '/pt/blog'
  };

  const meta = {
    es: {
      title: 'Blog de OmniConverter: Artículos y Guías de Medidas',
      desc: 'Explore tablas de medidas de cocina, guías de cambio de divisas, fórmulas de presión y tecnología de conversión en OmniConverter.',
      h1: 'Artículos y Guías de OmniConverter',
      sub: 'Guías de conversión verificadas, medidas culinarias, cálculos de divisas y tutoriales técnicos.',
      searchPlaceholder: 'Buscar artículos por palabra clave o categoría...',
      all: 'Todos los Artículos',
      readMore: 'Leer Guía Completa',
      dirTitle: 'Directorio Completo de Guías de Conversión (50 Artículos)',
      noResults: 'No se encontraron artículos con ese criterio.'
    },
    de: {
      title: 'OmniConverter Blog: Ratgeber & Umrechnungsanleitungen',
      desc: 'Küchenmaße, Währungskurse, Druckformeln und technische Umrechnungen im OmniConverter Ratgeber.',
      h1: 'OmniConverter Ratgeber & Fachartikel',
      sub: 'Verifizierte Umrechnungsleitfäden, Back- und Küchenmaße, Währungsberechnungen und Technik-Updates.',
      searchPlaceholder: 'Artikel nach Stichwort oder Kategorie durchsuchen...',
      all: 'Alle Artikel',
      readMore: 'Ratgeber lesen',
      dirTitle: 'Vollständiges Verzeichnis aller Umrechnungsratgeber (50 Artikel)',
      noResults: 'Keine Artikel für diesen Suchbegriff gefunden.'
    },
    pt: {
      title: 'Blog do OmniConverter: Artigos e Guias de Conversão',
      desc: 'Tabelas de culinária, taxas de câmbio, fórmulas de pressão e ferramentas de arquivo no OmniConverter.',
      h1: 'Artigos e Guias de Conversão do OmniConverter',
      sub: 'Guias práticos de medição, conversões culinárias, cálculos de moedas e tutoriais de tecnologia.',
      searchPlaceholder: 'Pesquisar artigos por palavra-chave ou categoria...',
      all: 'Todos os Artigos',
      readMore: 'Ler Guia Completo',
      dirTitle: 'Diretório Completo de Guias de Conversão (50 Artigos)',
      noResults: 'Nenhum artigo encontrado com esse critério.'
    }
  }[lang];

  // Distinct Categories for Filter Pills
  const catSet = new Set();
  TOPICS_DATA.forEach(t => {
    catSet.add(getTopicCategory(t.enSlug, lang));
  });
  const catPillsHtml = Array.from(catSet).map(cat => {
    return `<button type="button" class="category-pill" data-category="${cat}">${cat}</button>`;
  }).join('\n        ');

  // Build 50 rich cards
  const cardsHtml = TOPICS_DATA.map(t => {
    const item = t[lang];
    const cat = getTopicCategory(t.enSlug, lang);
    return `      <article class="blog-card" data-category="${cat}" style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-sm); transition:transform 0.2s, box-shadow 0.2s;">
        <div>
          <span style="display:inline-block; font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; padding:0.25rem 0.6rem; border-radius:9999px; background:rgba(99,102,241,0.12); color:var(--primary-600); margin-bottom:0.75rem;">${cat}</span>
          <h2 style="font-size:1.15rem; font-weight:800; line-height:1.4; margin-bottom:0.6rem; color:var(--text-main);">
            <a href="/${lang}/blog/${item.slug}" style="color:inherit; text-decoration:none;">${item.title}</a>
          </h2>
          <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6; margin-bottom:1rem;">${item.ans}</p>
        </div>
        <div style="border-top:1px solid var(--card-border); padding-top:0.75rem; display:flex; justify-content:space-between; align-items:center; font-size:0.85rem;">
          <span style="color:var(--text-muted); font-size:0.8rem; font-family:monospace;">${item.form}</span>
          <a href="/${lang}/blog/${item.slug}" style="color:var(--primary-600); font-weight:700; text-decoration:none;">${meta.readMore} &rarr;</a>
        </div>
      </article>`;
  }).join('\n\n');

  // Build directory list
  const dirListHtml = TOPICS_DATA.map(t => {
    const item = t[lang];
    return `        <li><a href="/${lang}/blog/${item.slug}" style="color:var(--primary-600); font-weight:600;">${item.title}</a></li>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${makeCommonHead(lang, meta.title, meta.desc, `https://www.omniconverter.co.uk/${lang}/blog`, paths)}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "${meta.h1}",
    "url": "https://www.omniconverter.co.uk/${lang}/blog",
    "description": "${meta.desc}",
    "inLanguage": "${lang}",
    "publisher": {
      "@type": "Organization",
      "name": "OmniConverter",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.omniconverter.co.uk/logo.png"
      }
    }
  }
  </script>
</head>
<body>
${makeHeader(lang, 'blog', paths)}

  <main style="max-width: 1200px; margin: 1.5rem auto; padding: 0 1rem;">
    <!-- Title Header -->
    <section style="text-align: center; margin-bottom: 1.5rem;">
      <h1 style="font-size: 2rem; font-weight: 900; margin-bottom: 0.5rem; letter-spacing: -0.025em; color: var(--text-main);">${meta.h1}</h1>
      <p style="color: var(--text-muted); font-size: 1rem; max-width: 750px; margin: 0 auto;">${meta.sub}</p>
    </section>

    <!-- Search & Filter Controls -->
    <section class="blog-controls-wrapper" style="margin-bottom: 2rem;">
      <div class="blog-search-box" style="margin-bottom: 1rem;">
        <svg class="blog-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="blogSearchInput" class="blog-search-input" placeholder="${meta.searchPlaceholder}" style="width:100%; padding:0.85rem 1rem 0.85rem 2.5rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); background:var(--card-bg); color:var(--text-main); font-size:0.95rem;">
      </div>

      <div class="category-filter-bar" id="categoryFilterBar" style="display:flex; flex-wrap:wrap; gap:0.5rem;">
        <button type="button" class="category-pill active" data-category="All">${meta.all}</button>
        ${catPillsHtml}
      </div>
    </section>

    <!-- Articles Grid (50 Articles Embedded Directly) -->
    <section id="blogGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.25rem;">
${cardsHtml}
    </section>

    <div id="noResultsMsg" style="display:none; text-align:center; padding:3rem; background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-xl); margin-top:1.5rem;">
      <p style="color:var(--text-muted); font-size:1.1rem;">${meta.noResults}</p>
    </div>

    <!-- Complete Directory Block -->
    <section class="content-section" style="margin-top:3rem; background:var(--card-bg); padding:1.75rem; border-radius:var(--radius-xl); border:1px solid var(--card-border);">
      <h2 style="font-size:1.35rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">${meta.dirTitle}</h2>
      <ul style="line-height:2; color:var(--text-muted); padding-left:1.5rem; display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:0.5rem;">
${dirListHtml}
      </ul>
    </section>
  </main>

${makeFooter(lang)}

  <!-- Real-time Interactive Filter & Search Script -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const searchInput = document.getElementById('blogSearchInput');
      const categoryPills = document.querySelectorAll('.category-pill');
      const cards = document.querySelectorAll('#blogGrid .blog-card');
      const noResultsMsg = document.getElementById('noResultsMsg');

      let currentCategory = 'All';
      let currentQuery = '';

      function filterCards() {
        let visibleCount = 0;
        cards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          const cardText = card.textContent.toLowerCase();
          const matchCat = (currentCategory === 'All' || cardCat === currentCategory);
          const matchQuery = (currentQuery === '' || cardText.includes(currentQuery));

          if (matchCat && matchQuery) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (noResultsMsg) {
          noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      }

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          currentQuery = e.target.value.trim().toLowerCase();
          filterCards();
        });
      }

      categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
          categoryPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          currentCategory = pill.getAttribute('data-category');
          filterCards();
        });
      });
    });
  </script>
</body>
</html>`;
}

// Generate Blog Hubs for ES, DE, PT
fs.writeFileSync(path.join(esDir, 'blog.html'), generateBlogHub('es'), 'utf8');
fs.writeFileSync(path.join(deDir, 'blog.html'), generateBlogHub('de'), 'utf8');
fs.writeFileSync(path.join(ptDir, 'blog.html'), generateBlogHub('pt'), 'utf8');
console.log('Blog hubs generated with all 50 article cards in ES, DE, and PT!');
