import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOPICS_DATA } from './topics-data.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { BLOG_POSTS } = require('../blog-data.js');

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

// Map English posts by slug
const enPostsMap = new Map();
BLOG_POSTS.forEach(p => {
  enPostsMap.set(p.slug, p);
});

// Date formatting helper
function formatLocalizedDate(dateStr, lang) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  const months = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
  };

  const monthName = months[lang] ? months[lang][m - 1] : months.en[m - 1];

  if (lang === 'en') return `${d} ${monthName} ${y}`;
  if (lang === 'de') return `${d}. ${monthName} ${y}`;
  if (lang === 'es') return `${d} de ${monthName} de ${y}`;
  if (lang === 'pt') return `${d} de ${monthName} de ${y}`;
  return dateStr;
}

// Category translation map
const CATEGORY_MAP = {
  'Kitchen & Culinary': {
    es: 'Cocina y Culinaria',
    de: 'Küche & Kulinarik',
    pt: 'Culinária & Cozinha',
    key: 'Kitchen & Culinary'
  },
  'Currency & Forex': {
    es: 'Divisas y Forex',
    de: 'Währung & Devisen',
    pt: 'Moedas & Câmbio',
    key: 'Currency & Forex'
  },
  'Weight & Mass': {
    es: 'Peso y Masa',
    de: 'Gewicht & Masse',
    pt: 'Peso & Massa',
    key: 'Weight & Mass'
  },
  'Temperature & Cooking': {
    es: 'Temperatura y Cocina',
    de: 'Temperatur & Kochen',
    pt: 'Temperatura & Culinária',
    key: 'Temperature & Cooking'
  },
  'Time & Timezones': {
    es: 'Tiempo y Zonas Horarias',
    de: 'Zeit & Zeitzonen',
    pt: 'Tempo & Fusos Horários',
    key: 'Time & Timezones'
  },
  'File & Media Tools': {
    es: 'Archivos y Herramientas',
    de: 'Dateien & Medien',
    pt: 'Arquivos & Ferramentas',
    key: 'File & Media Tools'
  },
  'Volume & Geometry': {
    es: 'Volumen y Geometría',
    de: 'Volumen & Geometrie',
    pt: 'Volume & Geometria',
    key: 'Volume & Geometry'
  },
  'Length & Distance': {
    es: 'Longitud y Distancia',
    de: 'Länge & Distanz',
    pt: 'Comprimento e Distância',
    key: 'Length & Distance'
  },
  'Conversion Guide': {
    es: 'Guías de Conversión',
    de: 'Umrechnungsratgeber',
    pt: 'Guias de Conversão',
    key: 'Conversion Guide'
  },
  'Product & Tech': {
    es: 'Tecnología y Datos',
    de: 'Technologie & Daten',
    pt: 'Tecnologia & Dados',
    key: 'Product & Tech'
  }
};

function getCategoryInfo(enCategory, lang) {
  const mapping = CATEGORY_MAP[enCategory] || {
    es: enCategory,
    de: enCategory,
    pt: enCategory,
    key: enCategory
  };
  return {
    localized: mapping[lang] || mapping.en || enCategory,
    key: mapping.key || enCategory
  };
}

// 4-way hreflang builder
function makeHreflangTags(paths) {
  return `  <link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk${paths.en}">
  <link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk${paths.es}">
  <link rel="alternate" hreflang="de" href="https://www.omniconverter.co.uk${paths.de}">
  <link rel="alternate" hreflang="pt" href="https://www.omniconverter.co.uk${paths.pt}">
  <link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk${paths.en}">`;
}

// Common Header builder
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

// Common Footer builder
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

// =========================================================================
// STEP 1: GENERATE es/blog-data.js, de/blog-data.js, pt/blog-data.js
// =========================================================================
console.log('Generating localized blog-data.js files for ES, DE, PT...');

function generateLocalizedBlogData(lang) {
  const authorNames = {
    es: 'Equipo Editorial OmniConverter',
    de: 'OmniConverter Redaktionsteam',
    pt: 'Equipe Editorial OmniConverter'
  };
  const readTimes = {
    es: '4 min de lectura',
    de: '4 Min. Lesezeit',
    pt: '4 min de leitura'
  };

  const localizedPosts = TOPICS_DATA.map(topic => {
    const enPost = enPostsMap.get(topic.enSlug) || {};
    const l = topic[lang];
    const catInfo = getCategoryInfo(enPost.category || 'Conversion Guide', lang);
    const pubDate = enPost.date || enPost.publicationDate || '2026-09-17';

    return {
      id: l.slug,
      slug: `/${lang}/blog/${l.slug}`,
      title: l.title,
      date: pubDate,
      publicationDate: pubDate,
      category: catInfo.localized,
      categoryKey: catInfo.key,
      author: authorNames[lang],
      readTime: readTimes[lang],
      icon: enPost.icon || '📄',
      image: enPost.image || 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1200&q=80',
      summary: l.ans
    };
  });

  const code = `// Automatically synchronized blog data for ${lang.toUpperCase()} (Total: ${localizedPosts.length} articles)
const BLOG_POSTS = ${JSON.stringify(localizedPosts, null, 2)};

// Make articles available globally for blog.html and Node.js
if (typeof window !== 'undefined') {
  window.BLOG_POSTS = BLOG_POSTS;
  window.blogArticles = BLOG_POSTS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BLOG_POSTS, blogArticles: BLOG_POSTS };
}
`;
  return code;
}

fs.writeFileSync(path.join(esDir, 'blog-data.js'), generateLocalizedBlogData('es'), 'utf8');
fs.writeFileSync(path.join(deDir, 'blog-data.js'), generateLocalizedBlogData('de'), 'utf8');
fs.writeFileSync(path.join(ptDir, 'blog-data.js'), generateLocalizedBlogData('pt'), 'utf8');
console.log('[OK] es/blog-data.js, de/blog-data.js, pt/blog-data.js successfully generated with matching dates and Unsplash images!');


// =========================================================================
// STEP 2: BUILD es/blog.html, de/blog.html, pt/blog.html MATCHING blog.html EXACTLY
// =========================================================================
console.log('Generating localized blog hub pages (es/blog.html, de/blog.html, pt/blog.html)...');

function generateBlogHubPage(lang) {
  const paths = {
    en: '/blog',
    es: '/es/blog',
    de: '/de/blog',
    pt: '/pt/blog'
  };

  const hubStrings = {
    es: {
      docTitle: 'OmniConverter Blog: Artículos y Guías de Medidas',
      metaDesc: 'Explore tablas de medidas de cocina, guías de cambio de divisas, fórmulas de presión y tecnología de conversión en OmniConverter.',
      h1: 'Artículos y Guías de OmniConverter',
      subtitle: 'Guías de referencia de conversión, medidas culinarias, cálculos de divisas y actualizaciones tecnológicas.',
      searchPlaceholder: 'Buscar artículos por palabra clave o categoría...',
      noArticlesTitle: 'No se encontraron artículos',
      noArticlesDesc: 'No hay artículos que coincidan con su búsqueda. ¡Vuelva pronto para nuevas guías de conversión!',
      returnBtn: 'Volver al Inicio &rarr;',
      prevBtn: '&larr; Anterior',
      nextBtn: 'Siguiente &rarr;',
      readBtn: 'Leer Artículo',
      showingText: (start, end, total) => `Mostrando ${start}-${end} de ${total} artículos`,
      showingZero: 'Mostrando 0 artículos',
      categories: [
        { key: 'All', label: 'Todos los Artículos' },
        { key: 'Kitchen & Culinary', label: 'Cocina y Culinaria' },
        { key: 'Currency & Forex', label: 'Divisas y Forex' },
        { key: 'Weight & Mass', label: 'Peso y Masa' },
        { key: 'Temperature & Cooking', label: 'Temperatura y Cocina' },
        { key: 'Time & Timezones', label: 'Tiempo y Zonas Horarias' },
        { key: 'File & Media Tools', label: 'Archivos y Herramientas' },
        { key: 'Volume & Geometry', label: 'Volumen y Geometría' },
        { key: 'Product & Tech', label: 'Tecnología y Datos' }
      ],
      eduTitle: 'Blog Educativo y Guías de Conversión de OmniConverter',
      eduP1: 'Bienvenido al repositorio oficial de artículos educativos de OmniConverter. Nuestro equipo editorial publica diariamente completas guías de medición, tablas de conversión para repostería, análisis del mercado de divisas, fórmulas de presión y novedades tecnológicas.',
      eduP2: 'Navegar entre estándares de medición internacionales requiere comprender tanto las definiciones físicas como las costumbres regionales. Ya sea que necesite adaptar una receta internacional de gramos a tazas, comparar galones líquidos con litros imperiales, convertir bar a PSI para el mantenimiento de neumáticos o calcular temperaturas entre Celsius y Fahrenheit, nuestras guías detalladas ofrecen explicaciones matemáticas paso a paso.',
      eduFeaturedTitle: 'Categorías Destacadas de Guías',
      eduBullets: [
        '<strong>Medidas de Cocina y Repostería:</strong> Conversiones volumétricas exactas de tazas, cucharaditas, cucharadas, gramos y mililitros para harina, azúcar y líquidos.',
        '<strong>Temperatura y Termodinámica:</strong> Fórmulas exactas para escalas Celsius, Fahrenheit, Kelvin y Rankine.',
        '<strong>Peso, Masa y Geometría:</strong> Tablas completas de kilogramos, libras, piedras (stone), onzas, metros cuadrados y hectáreas.',
        '<strong>Seguridad de Archivos y Medios:</strong> Conversión de formatos de imagen directamente en el navegador (PNG, JPEG, WebP) sin subir datos a servidores.'
      ],
      dirTitle: 'Directorio Completo de Guías de Conversión (50 Guías)'
    },
    de: {
      docTitle: 'OmniConverter Blog: Ratgeber & Umrechnungsanleitungen',
      metaDesc: 'Küchenmaße, Währungskurse, Druckformeln und technische Umrechnungen im OmniConverter Ratgeber.',
      h1: 'OmniConverter Ratgeber & Fachartikel',
      subtitle: 'Umrechnungsleitfäden, Back- und Küchenmaße, Währungsberechnungen und technische Dokumentationen.',
      searchPlaceholder: 'Artikel nach Stichwort oder Kategorie durchsuchen...',
      noArticlesTitle: 'Keine Artikel gefunden',
      noArticlesDesc: 'Es wurden keine Artikel gefunden, die Ihren Kriterien entsprechen. Schauen Sie bald wieder vorbei!',
      returnBtn: 'Zur Startseite &rarr;',
      prevBtn: '&larr; Zurück',
      nextBtn: 'Weiter &rarr;',
      readBtn: 'Ratgeber lesen',
      showingText: (start, end, total) => `Zeige ${start}-${end} von ${total} Artikeln`,
      showingZero: 'Zeige 0 Artikel',
      categories: [
        { key: 'All', label: 'Alle Artikel' },
        { key: 'Kitchen & Culinary', label: 'Küche & Kulinarik' },
        { key: 'Currency & Forex', label: 'Währung & Devisen' },
        { key: 'Weight & Mass', label: 'Gewicht & Masse' },
        { key: 'Temperature & Cooking', label: 'Temperatur & Kochen' },
        { key: 'Time & Timezones', label: 'Zeit & Zeitzonen' },
        { key: 'File & Media Tools', label: 'Dateien & Medien' },
        { key: 'Volume & Geometry', label: 'Volumen & Geometrie' },
        { key: 'Product & Tech', label: 'Technologie & Daten' }
      ],
      eduTitle: 'OmniConverter Bildungs-Blog & Umrechnungsratgeber',
      eduP1: 'Willkommen im offiziellen Bildungs- und Fachartikel-Bereich von OmniConverter. Unsere Redaktion veröffentlicht täglich fundierte Leitfäden zu Maßeinheiten, Back- und Küchenumrechnungen, internationalen Währungsanalysen, Druckformeln und technologischen Updates.',
      eduP2: 'Die Orientierung zwischen internationalen Einheitensystemen erfordert das Verständnis physikalischer Konstanten sowie regionaler Gepflogenheiten. Ob Sie Rezepte von Tassen in Gramm umrechnen, US-Gallonen mit Litern vergleichen, Bar in PSI für Reifendruck berechnen oder Celsius in Fahrenheit umwandeln – unsere detaillierten Ratgeber bieten präzise, verifizierte Formeln.',
      eduFeaturedTitle: 'Wichtige Themenbereiche im Überblick',
      eduBullets: [
        '<strong>Küche &amp; Kulinarik:</strong> Genaue Tassen-, Teelöffel-, Esslöffel-, Gramm- und Milliliter-Umrechnungen für Mehl, Zucker und Flüssigkeiten.',
        '<strong>Temperatur &amp; Thermodynamik:</strong> Exakte Formeln für Celsius, Fahrenheit, Kelvin und Rankine.',
        '<strong>Gewicht, Masse &amp; Geometrie:</strong> Tabellen für Kilogramm, Pfund (lbs), Stone, Unzen, Quadratmeter und Hektar.',
        '<strong>Dateien &amp; Datenschutz:</strong> Lokale Bildformat-Konvertierung (PNG, JPEG, WebP) direkt im Browser ohne Datenübertragung.'
      ],
      dirTitle: 'Vollständiges Verzeichnis aller Umrechnungsratgeber (50 Ratgeber)'
    },
    pt: {
      docTitle: 'OmniConverter Blog: Artigos e Guias de Conversão',
      metaDesc: 'Tabelas de culinária, taxas de câmbio, fórmulas de pressão e ferramentas de arquivo no OmniConverter.',
      h1: 'Artigos e Guias de Conversão do OmniConverter',
      subtitle: 'Guias de referência de conversão, medidas culinárias, cálculos de moedas e atualizações de tecnologia.',
      searchPlaceholder: 'Pesquisar artigos por palavra-chave ou categoria...',
      noArticlesTitle: 'Nenhum artigo encontrado',
      noArticlesDesc: 'Não encontramos artigos correspondentes à sua busca. Volte em breve para novos guias de conversão!',
      returnBtn: 'Voltar ao Início &rarr;',
      prevBtn: '&larr; Anterior',
      nextBtn: 'Próximo &rarr;',
      readBtn: 'Ler Post',
      showingText: (start, end, total) => `Mostrando ${start}-${end} de ${total} artigos`,
      showingZero: 'Mostrando 0 artigos',
      categories: [
        { key: 'All', label: 'Todos os Artigos' },
        { key: 'Kitchen & Culinary', label: 'Culinária & Cozinha' },
        { key: 'Currency & Forex', label: 'Moedas & Câmbio' },
        { key: 'Weight & Mass', label: 'Peso & Massa' },
        { key: 'Temperature & Cooking', label: 'Temperatura & Culinária' },
        { key: 'Time & Timezones', label: 'Tempo & Fusos Horários' },
        { key: 'File & Media Tools', label: 'Arquivos & Ferramentas' },
        { key: 'Volume & Geometry', label: 'Volume & Geometria' },
        { key: 'Product & Tech', label: 'Tecnologia & Dados' }
      ],
      eduTitle: 'Blog Educativo e Guias de Conversão do OmniConverter',
      eduP1: 'Bem-vindo ao repositório oficial de artigos educativos do OmniConverter. Nossa equipe editorial publica diariamente guias abrangentes de medição, tabelas de conversão culinária, análises do mercado de câmbio, fórmulas de pressão e tutoriais práticos de tecnologia.',
      eduP2: 'Compreender os padrões internacionais de unidades exige conhecer tanto as definições do Sistema Internacional quanto os costumes regionais. Seja para adaptar uma receita culinária de xícaras para gramas, comparar galões líquidos com litros, converter bar em PSI para calibragem de pneus ou calcular variações de temperatura entre Celsius e Fahrenheit, nossos guias fornecem cálculos matemáticos passo a passo.',
      eduFeaturedTitle: 'Categorias de Guias em Destaque',
      eduBullets: [
        '<strong>Medidas de Culinária &amp; Cozinha:</strong> Conversões volumétricas exatas de xícaras, colheres de chá, colheres de sopa, gramas e mililitros para farinha, açúcar e líquidos.',
        '<strong>Temperatura &amp; Termodinâmica:</strong> Fórmulas exatas para escalas Celsius, Fahrenheit, Kelvin e Rankine.',
        '<strong>Peso, Massa &amp; Geometria:</strong> Tabelas completas de quilos, libras, stones, onças, metros quadrados e hectares.',
        '<strong>Arquivos &amp; Mídia Segura:</strong> Conversão nativa de formatos de imagem (PNG, JPEG, WebP) diretamente no navegador, com total privacidade.'
      ],
      dirTitle: 'Diretório Completo de Guias de Conversão (50 Guias)'
    }
  }[lang];

  // Category Pills HTML
  const pillsHtml = hubStrings.categories.map((c, i) => {
    const cls = i === 0 ? 'category-pill active' : 'category-pill';
    return `        <button type="button" class="${cls}" data-category="${c.key}">${c.label}</button>`;
  }).join('\n');

  // Directory List HTML (50 Guides)
  const dirListHtml = TOPICS_DATA.map(t => {
    const item = t[lang];
    return `        <li><a href="/${lang}/blog/${item.slug}" style="color:var(--primary-600); font-weight:600;">${item.title}</a></li>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4766868021895107" crossorigin="anonymous"></script>
  <meta name="google-adsense-account" content="ca-pub-4766868021895107">
  <script src="/ahrefs-analytics.js" data-key="i4l/B5Lec0bODmBnYEF+kw" async></script>
  <meta name="msvalidate.01" content="25038A8801D42437BBC34723A41AC6C4" />
  <meta name="google-site-verification" content="Cpl786DxZO0l5hjxd_D5KE5RGWKFuJ9EVSh5n6Msm7M" />
  <meta name="google-site-verification" content="aoZ6vOmLyc0slj01NK1N91iwSnk2of6HUO_JjMskszE" />
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-0KPY6T7PFD"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-0KPY6T7PFD');
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${hubStrings.docTitle}</title>
  <meta name="description" content="${hubStrings.metaDesc}">
  <link rel="canonical" href="https://www.omniconverter.co.uk/${lang}/blog">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="stylesheet" href="/styles.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "${hubStrings.h1}",
    "url": "https://www.omniconverter.co.uk/${lang}/blog",
    "description": "${hubStrings.metaDesc}",
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

  <!-- Schema.org BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.omniconverter.co.uk/${lang}/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.omniconverter.co.uk/${lang}/blog"
      }
    ]
  }
  </script>

  <!-- OpenGraph & Social Cards -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.omniconverter.co.uk/${lang}/blog">
  <meta property="og:title" content="${hubStrings.docTitle}">
  <meta property="og:description" content="${hubStrings.metaDesc}">
  <meta property="og:site_name" content="OmniConverter">
  <meta property="og:image" content="https://www.omniconverter.co.uk/logo.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${hubStrings.docTitle}">
  <meta name="twitter:description" content="${hubStrings.metaDesc}">
  <meta name="twitter:image" content="https://www.omniconverter.co.uk/logo.png">

${makeHreflangTags(paths)}
</head>
<body>
${makeHeader(lang, 'blog', paths)}

  <main style="max-width: 1200px; margin: 1.5rem auto;">
    <!-- Compact Title Header -->
    <section style="text-align: center; margin-bottom: 1.25rem; padding: 0 1rem;">
      <h1 style="font-size: 1.8rem; font-weight: 900; margin-bottom: 0.35rem; letter-spacing: -0.025em; color: var(--text-main);">${hubStrings.h1}</h1>
      <p style="color: var(--text-muted); font-size: 0.95rem;">${hubStrings.subtitle}</p>
    </section>

    <!-- Blog Search Bar & Single-Line Category Filter Pills -->
    <section class="blog-controls-wrapper">
      <div class="blog-search-box">
        <svg class="blog-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="blogSearchInput" class="blog-search-input" placeholder="${hubStrings.searchPlaceholder}">
      </div>

      <div class="category-filter-bar" id="categoryFilterBar">
${pillsHtml}
      </div>
    </section>

    <!-- Dynamic Articles Grid -->
    <section class="blog-cards-grid" id="blogGrid">
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--radius-xl);">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">📝</div>
        <h2 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-main);">${hubStrings.noArticlesTitle}</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">${hubStrings.noArticlesDesc}</p>
        <a href="/${lang}/" class="btn-convert" style="display: inline-block; text-decoration: none; padding: 0.65rem 1.5rem; font-weight: 700;">${hubStrings.returnBtn}</a>
      </div>
    </section>

    <!-- Pagination Controls Bar -->
    <section class="pagination-wrapper" id="paginationWrapper" style="display: none;">
      <div class="page-info" id="pageInfo">${hubStrings.showingZero}</div>
      <div class="pagination-controls">
        <button type="button" class="btn-page" id="prevPageBtn" disabled>${hubStrings.prevBtn}</button>
        <div class="page-numbers" id="pageNumbers"></div>
        <button type="button" class="btn-page" id="nextPageBtn" disabled>${hubStrings.nextBtn}</button>
      </div>
    </section>

    <!-- Educational Content Section -->
    <article class="content-section" style="margin-top:2rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem;">${hubStrings.eduTitle}</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1rem;">
        ${hubStrings.eduP1}
      </p>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1rem;">
        ${hubStrings.eduP2}
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0;">${hubStrings.eduFeaturedTitle}</h3>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem; margin-bottom:1.5rem;">
        <li>${hubStrings.eduBullets[0]}</li>
        <li>${hubStrings.eduBullets[1]}</li>
        <li>${hubStrings.eduBullets[2]}</li>
        <li>${hubStrings.eduBullets[3]}</li>
      </ul>
    </article>

    <!-- Complete Directory Block (50 Guides) -->
    <section class="content-section" style="margin-top:2rem;">
      <h2 style="font-size:1.2rem; font-weight:800; margin-bottom:1rem;">${hubStrings.dirTitle}</h2>
      <ul style="line-height:1.9; color:var(--text-muted); padding-left:1.5rem; display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:0.4rem;">
${dirListHtml}
      </ul>
    </section>
  </main>

${makeFooter(lang)}

  <!-- Localized Script Loader & Pagination Controller -->
  <script src="/${lang}/blog-data.js"></script>
  <script type="module">
    const BLOG_POSTS = window.BLOG_POSTS || [];
    const blogArticles = window.blogArticles || [];

    document.addEventListener('DOMContentLoaded', () => {
      const blogGrid = document.getElementById('blogGrid');
      const searchInput = document.getElementById('blogSearchInput');
      const categoryPills = document.querySelectorAll('.category-pill');
      const paginationWrapper = document.getElementById('paginationWrapper');
      const prevPageBtn = document.getElementById('prevPageBtn');
      const nextPageBtn = document.getElementById('nextPageBtn');
      const pageInfo = document.getElementById('pageInfo');
      const pageNumbers = document.getElementById('pageNumbers');

      let currentCategory = 'All';
      let currentQuery = '';
      let currentPage = 1;
      const itemsPerPage = 6;

      function getSourceArticles() {
        if (typeof blogArticles !== 'undefined' && Array.isArray(blogArticles) && blogArticles.length > 0) {
          return blogArticles;
        }
        if (typeof BLOG_POSTS !== 'undefined' && Array.isArray(BLOG_POSTS) && BLOG_POSTS.length > 0) {
          return BLOG_POSTS;
        }
        if (typeof window !== 'undefined' && Array.isArray(window.BLOG_POSTS)) {
          return window.BLOG_POSTS;
        }
        return [];
      }

      function getFilteredArticles() {
        const source = getSourceArticles();
        return source.filter(item => {
          let matchesCategory = false;
          if (currentCategory === 'All') {
            matchesCategory = true;
          } else {
            const itemCatKey = (item.categoryKey || item.category || '').toLowerCase();
            const itemCat = (item.category || '').toLowerCase();
            const itemTitle = (item.title || '').toLowerCase();
            const itemSlug = (item.slug || '').toLowerCase();
            const combined = \`\${itemCatKey} \${itemCat} \${itemTitle} \${itemSlug}\`;
            const targetCat = currentCategory.toLowerCase();

            if (itemCatKey === targetCat || itemCat === targetCat) {
              matchesCategory = true;
            } else if (targetCat.includes('kitchen') || targetCat.includes('culinary')) {
              matchesCategory = itemCatKey.includes('kitchen') || itemCatKey.includes('culinary') ||
                /\\b(cup|cups|tsp|tbsp|milk|baking|tablespoon|teaspoon|grams?|taza|tasse|xicara|colher|leche|milch|farine)\\b/i.test(combined);
            } else if (targetCat.includes('currency') || targetCat.includes('forex')) {
              matchesCategory = itemCatKey.includes('currency') || itemCatKey.includes('forex') ||
                /\\b(usd|aud|vnd|won|gbp|cu|currency|forex|dollar|euro|exchange|money|rate|divisa|moeda|waehrung|cambo)\\b/i.test(combined);
            } else if (targetCat.includes('weight') || targetCat.includes('mass')) {
              matchesCategory = itemCatKey.includes('weight') || itemCatKey.includes('mass') ||
                /\\b(kg|lbs|stone|gram|grams|mass|weight|pound|pounds|ounce|ounces|peso|massa|gewicht)\\b/i.test(combined);
            } else if (targetCat.includes('temperature') || targetCat.includes('cooking')) {
              matchesCategory = itemCatKey.includes('temperature') || itemCatKey.includes('cooking') ||
                /\\b(temperature|celsius|fahrenheit|kelvin|degrees?|temperatura|temperatur)\\b/i.test(combined);
            } else if (targetCat.includes('volume') || targetCat.includes('geometry')) {
              matchesCategory = itemCatKey.includes('volume') || itemCatKey.includes('geometry') ||
                /\\b(volume|capacity|gallon|gallons|litres?|liters?|ml|milliliters?|psi|bar|galao|galon)\\b/i.test(combined);
            } else if (targetCat.includes('file') || targetCat.includes('media')) {
              matchesCategory = itemCatKey.includes('file') || itemCatKey.includes('media') ||
                /\\b(file|format|media|convert|extension|archivo|datei|arquivo)\\b/i.test(combined);
            } else if (targetCat.includes('product') || targetCat.includes('tech') || targetCat.includes('speed')) {
              matchesCategory = itemCatKey.includes('product') || itemCatKey.includes('tech') || itemCatKey.includes('speed') ||
                /\\b(speed|mph|kmh|km\\/h|velocity|velocidad|geschwind)\\b/i.test(combined);
            } else if (targetCat.includes('time') || targetCat.includes('timezones')) {
              matchesCategory = itemCatKey.includes('time') ||
                /\\b(time|timezone|hour|hours|minute|minutes|duration|tempo|tiempo|zeit)\\b/i.test(combined);
            } else {
              matchesCategory = combined.includes(targetCat);
            }
          }

          const matchesQuery = !currentQuery || 
            (item.title && item.title.toLowerCase().includes(currentQuery)) || 
            (item.summary && item.summary.toLowerCase().includes(currentQuery)) ||
            (item.category && item.category.toLowerCase().includes(currentQuery));
          return matchesCategory && matchesQuery;
        }).sort((a, b) => {
          const dateA = new Date(a.publicationDate || a.date || '1970-01-01').getTime();
          const dateB = new Date(b.publicationDate || b.date || '1970-01-01').getTime();
          return dateB - dateA; // Newest first
        });
      }

      function renderArticles() {
        const filtered = getFilteredArticles();
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

        if (paginationWrapper) {
          paginationWrapper.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageArticles = filtered.slice(startIndex, endIndex);

        blogGrid.innerHTML = '';

        if (totalItems === 0) {
          blogGrid.innerHTML = \`
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--radius-xl);">
              <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">📝</div>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-main);">${hubStrings.noArticlesTitle}</h3>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">${hubStrings.noArticlesDesc}</p>
              <a href="/${lang}/" class="btn-convert" style="display: inline-block; text-decoration: none; padding: 0.65rem 1.5rem; font-weight: 700;">${hubStrings.returnBtn}</a>
            </div>
          \`;
          if (pageInfo) pageInfo.textContent = '${hubStrings.showingZero}';
          if (prevPageBtn) prevPageBtn.disabled = true;
          if (nextPageBtn) nextPageBtn.disabled = true;
          if (pageNumbers) pageNumbers.innerHTML = '';
          return;
        }

        // Render Grid Articles
        pageArticles.forEach(item => {
          const card = document.createElement('article');
          card.className = 'blog-card';
          card.style.padding = '1.25rem';
          const targetUrl = item.slug.startsWith('/') ? item.slug : \`/${lang}/blog/\${item.slug}\`;
          card.innerHTML = \`
            <div>
              \${item.image ? \`<a href="\${targetUrl}"><img src="\${item.image}" alt="\${item.title}" style="width: 100%; height: 160px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: 0.85rem; border: 1px solid var(--card-border);" loading="lazy"></a>\` : ''}
              <div class="blog-card-header" style="margin-bottom: 0.6rem; display:flex; justify-content:space-between; align-items:center;">
                <span class="blog-card-tag">\${item.category}</span>
                <span class="blog-card-icon" style="font-size: 1.25rem;">\${item.icon || '📄'}</span>
              </div>
              <h3 class="blog-card-title" style="font-size: 1.1rem; margin-bottom: 0.5rem; line-height: 1.35;">
                <a href="\${targetUrl}">\${item.title}</a>
              </h3>
              <p class="blog-card-summary" style="font-size: 0.88rem; line-height: 1.5; margin-bottom: 1rem;">\${item.summary}</p>
            </div>
            <div class="blog-card-footer" style="padding-top: 0.75rem; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">\${item.date || '2026-09-15'}</span>
              <a href="\${targetUrl}" class="blog-btn-read" style="font-size: 0.85rem;">${hubStrings.readBtn} &rarr;</a>
            </div>
          \`;
          blogGrid.appendChild(card);
        });

        // Update Pagination Controls
        if (pageInfo) {
          const textFn = ${hubStrings.showingText.toString()};
          pageInfo.textContent = textFn(startIndex + 1, endIndex, totalItems);
        }
        if (prevPageBtn) prevPageBtn.disabled = (currentPage === 1);
        if (nextPageBtn) nextPageBtn.disabled = (currentPage === totalPages);

        // Render Page Numbers
        if (pageNumbers) {
          pageNumbers.innerHTML = '';
          for (let i = 1; i <= totalPages; i++) {
            const numBtn = document.createElement('button');
            numBtn.className = \`page-btn \${i === currentPage ? 'active' : ''}\`;
            numBtn.style.padding = '0.35rem 0.75rem';
            numBtn.style.fontSize = '0.85rem';
            numBtn.textContent = i;
            numBtn.addEventListener('click', () => {
              currentPage = i;
              renderArticles();
              window.scrollTo({ top: 250, behavior: 'smooth' });
            });
            pageNumbers.appendChild(numBtn);
          }
        }
      }

      // Filter Pill Handlers
      categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
          categoryPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          currentCategory = pill.getAttribute('data-category');
          currentPage = 1;
          renderArticles();
        });
      });

      // Search Handler
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          currentQuery = e.target.value.trim().toLowerCase();
          currentPage = 1;
          renderArticles();
        });
      }

      // Prev / Next Handlers
      if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            renderArticles();
            window.scrollTo({ top: 250, behavior: 'smooth' });
          }
        });
      }

      if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
          const filtered = getFilteredArticles();
          const totalPages = Math.ceil(filtered.length / itemsPerPage);
          if (currentPage < totalPages) {
            currentPage++;
            renderArticles();
            window.scrollTo({ top: 250, behavior: 'smooth' });
          }
        });
      }

      // Initial Render
      renderArticles();
    });
  </script>
</body>
</html>`;
}

fs.writeFileSync(path.join(esDir, 'blog.html'), generateBlogHubPage('es'), 'utf8');
fs.writeFileSync(path.join(deDir, 'blog.html'), generateBlogHubPage('de'), 'utf8');
fs.writeFileSync(path.join(ptDir, 'blog.html'), generateBlogHubPage('pt'), 'utf8');
console.log('[OK] es/blog.html, de/blog.html, and pt/blog.html generated matching blog.html pagination, cards, and structure!');


// =========================================================================
// STEP 3: REBUILD ALL 50 LOCALIZED ARTICLES FOR ES, DE, PT (100% PURE LANGUAGE + DATES + HERO IMAGES)
// =========================================================================
console.log('Regenerating all 150 localized blog articles (50 ES, 50 DE, 50 PT)...');

function generateArticlePage(lang, topic) {
  const l = topic[lang];
  const enPost = enPostsMap.get(topic.enSlug) || {};
  const pubDate = enPost.date || enPost.publicationDate || '2026-09-17';
  const heroImage = enPost.image || 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1200&q=80';
  const formattedDate = formatLocalizedDate(pubDate, lang);

  const paths = {
    en: `/blog/${topic.enSlug}`,
    es: `/es/blog/${topic.es.slug}`,
    de: `/de/blog/${topic.de.slug}`,
    pt: `/pt/blog/${topic.pt.slug}`
  };

  const ui = {
    es: {
      titleSuffix: 'Fórmula y Calculadora',
      descPrefix: 'Guía oficial para',
      descSuffix: 'Fórmulas matemáticas certificadas, tablas de cálculo rápido y convertidor en línea.',
      author: 'Equipo Editorial OmniConverter',
      readTime: '4 min de lectura',
      badge: `Guía Oficial de Conversión: ${l.title}`,
      leadP: `Conversión y cálculo de <strong>${l.title}</strong> con máxima precisión matemática según los estándares internacionales oficiales.`,
      quickAnsTitle: 'Respuesta Rápida Resumida',
      formTitle: 'Fórmula Matemática Certificada',
      formExpl: 'Esta fórmula aplica los factores certificados por estándares internacionales (NIST y SI).',
      tableTitle: 'Tabla de Conversión Rápida',
      tableSubtitle: 'Valores de referencia rápidos para aplicaciones prácticas y cotidianas:',
      thRef: 'Valor de Referencia',
      thRes: 'Resultado Exacto',
      rowStandard: 'Valor Estándar',
      rowDouble: 'Valor Duplicado (2x)',
      rowDoubleRes: 'Resultado duplicado según la fórmula',
      rowHalf: 'Mitad del Valor (0.5x)',
      rowHalfRes: 'Mitad del valor inicial',
      calloutTitle: 'Suite de Herramientas Universales OmniConverter',
      calloutDesc: 'Realice conversiones instantáneas de peso, volumen, temperatura, longitud y divisas sin anuncios ni rastreo.',
      calloutBtn: 'Explorar Herramientas &rarr;',
      relatedTitle: 'Calculadoras y Guías Relacionadas',
      link1: 'Convertidor Principal',
      link2: 'Blog de Conversión'
    },
    de: {
      titleSuffix: 'Formel & Rechner',
      descPrefix: 'Genaue Anleitung für',
      descSuffix: 'Mathematische Formeln, Referenztabellen und Umrechnungsrechner.',
      author: 'OmniConverter Redaktionsteam',
      readTime: '4 Min. Lesezeit',
      badge: `Offizieller Umrechnungsratgeber: ${l.title}`,
      leadP: `Umrechnung und Berechnung von <strong>${l.title}</strong> mit höchster mathematischer Genauigkeit nach internationalen Standards.`,
      quickAnsTitle: 'Schnelle Zusammenfassung',
      formTitle: 'Zertifizierte Mathematische Formel',
      formExpl: 'Diese Formel basiert auf den offiziellen NIST- und SI-Umrechnungsstandards.',
      tableTitle: 'Schnelle Referenztabelle',
      tableSubtitle: 'Schnelle Orientierungswerte für typische Alltags- und Praxiswerte:',
      thRef: 'Referenzwert',
      thRes: 'Genaues Ergebnis',
      rowStandard: 'Standardwert',
      rowDouble: 'Doppelter Wert (2x)',
      rowDoubleRes: 'Zweifaches Rechenergebnis gemäß Formel',
      rowHalf: 'Halber Wert (0.5x)',
      rowHalfRes: 'Hälfte des Ausgangswerts',
      calloutTitle: 'OmniConverter Werkzeug-Suite',
      calloutDesc: 'Führen Sie präzise Umrechnungen für Gewicht, Volumen, Temperatur, Länge und Währungen durch – ohne Tracking.',
      calloutBtn: 'Alle Umrechner entdecken &rarr;',
      relatedTitle: 'Verwandte Umrechnungstools und Ratgeber',
      link1: 'Haupt-Umrechner',
      link2: 'Ratgeber-Übersicht'
    },
    pt: {
      titleSuffix: 'Fórmula e Conversor',
      descPrefix: 'Guia completo para',
      descSuffix: 'Fórmulas matemáticas certificadas, tabelas de referência e conversor online.',
      author: 'Equipe Editorial OmniConverter',
      readTime: '4 min de leitura',
      badge: `Guia Oficial de Conversão: ${l.title}`,
      leadP: `Conversão e cálculo de <strong>${l.title}</strong> com máxima precisão matemática de acordo com os padrões internacionais oficiais.`,
      quickAnsTitle: 'Resposta Rápida Resumida',
      formTitle: 'Fórmula Matemática Certificada',
      formExpl: 'Esta fórmula utiliza fatores oficiais estabelecidos pelos padrões internacionais (SI e NIST).',
      tableTitle: 'Tabela de Conversão Rápida',
      tableSubtitle: 'Valores de referência rápidos para aplicações práticas e cotidianas:',
      thRef: 'Valor de Referência',
      thRes: 'Resultado Exato',
      rowStandard: 'Valor Padrão',
      rowDouble: 'Valor Dobrado (2x)',
      rowDoubleRes: 'Resultado duplicado conforme a fórmula',
      rowHalf: 'Metade do Valor (0.5x)',
      rowHalfRes: 'Metade do valor inicial',
      calloutTitle: 'Conjunto Universal de Ferramentas OmniConverter',
      calloutDesc: 'Realize conversões instantâneas de peso, volume, temperatura, duração e moedas com privacidade garantida.',
      calloutBtn: 'Explorar Conversores &rarr;',
      relatedTitle: 'Calculadoras e Guias Relacionados',
      link1: 'Conversor Principal',
      link2: 'Blog de Conversões'
    }
  }[lang];

  // Specific Deep Content for AUD to VND
  let deepAudVndContent = '';
  if (topic.enSlug === '1-aud-to-vnd') {
    if (lang === 'pt') {
      deepAudVndContent = `
      <h2>Fatores Econômicos que Influenciam a Cotação AUD/VND</h2>
      <p>A taxa de câmbio entre o Dólar Australiano e o Dong Vietnamita reflete o equilíbrio comercial entre a economia australiana, baseada na exportação de minérios e commodities, e o modelo exportador manufatureiro do Vietnã.</p>
      <ul>
        <li><strong>Preços de Commodities e RBA:</strong> O Dólar Australiano é historicamente uma moeda atrelada a commodities. Quando os preços globais de minério de ferro, carvão e gás natural liquefeito sobem, a demanda por AUD aumenta no mercado cambial global.</li>
        <li><strong>Regime Cambial do SBV no Vietnã:</strong> O Banco Estatal do Vietnã (SBV) opera sob um regime de flutuação administrada diária em relação ao Dólar Americano (USD). Variações no par AUD/USD impactam diretamente o valor do AUD em Dongs.</li>
        <li><strong>Remessas Familiares e Turismo:</strong> O fluxo constante de remessas enviadas pela diáspora vietnamita na Austrália gera grande demanda sazonal pela troca de AUD para VND, especialmente no período do Ano Novo Lunar (Tet).</li>
      </ul>

      <h2>Tabela Prática de Câmbio: AUD para VND</h2>
      <p>Abaixo estão valores representativos de conversão baseados em uma taxa média de referência de <strong>1 AUD ≈ 16.300 VND</strong>:</p>
      <div class="table-wrapper">
        <table class="conversion-table">
          <thead>
            <tr>
              <th>Dólares Australianos (AUD)</th>
              <th>Valor Estimado em Dong (VND)</th>
              <th>Contexto Prático no Vietnã</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><strong>1 AUD</strong></td><td>16.300 VND</td><td>Café vietnamita tradicional (Cà phê sữa đá) ou água mineral</td></tr>
            <tr><td><strong>5 AUD</strong></td><td>81.500 VND</td><td>Uma refeição local clássica (Pho ou Cơm tấm)</td></tr>
            <tr><td><strong>10 AUD</strong></td><td>163.000 VND</td><td>Corrida média de aplicativo de transporte em Ho Chi Minh</td></tr>
            <tr><td><strong>50 AUD</strong></td><td>815.000 VND</td><td>Jantar completo para duas pessoas em restaurante agradável</td></tr>
            <tr><td><strong>100 AUD</strong></td><td>1.630.000 VND</td><td>Diária em hotel boutique confortável em Hanói ou Da Nang</td></tr>
            <tr><td><strong>500 AUD</strong></td><td>8.150.000 VND</td><td>Passagens aéreas internas e passeios regionais por uma semana</td></tr>
            <tr><td><strong>1.000 AUD</strong></td><td>16.300.000 VND</td><td>Aluguel mensal de apartamento moderno ou remessa comercial</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Melhores Métodos para Converter AUD para VND</h2>
      <p>A escolha da forma de conversão impacta diretamente quanto dinheiro chega ao destino final:</p>
      <ol>
        <li><strong>Especialistas Digitais de Câmbio (Wise, Remitly, OFX):</strong> Operam com taxas médias de mercado interbancário e margens reduzidas (0,3% a 1%), proporcionando o maior valor líquido por AUD transferido para contas bancárias vietnamitas.</li>
        <li><strong>Bancos Tradicionais (SWIFT):</strong> Grandes bancos cobram taxas de transferência externa fixas somadas a spreads cambiais de 3% a 5%, tornando transferências pequenas desfavoráveis.</li>
        <li><strong>Casas de Câmbio em Aeroportos:</strong> Cobram as margens mais altas (frequentemente 8% a 12%). Troque apenas pequenas quantias emergenciais no aeroporto e busque estabelecimentos credenciados nos centros urbanos para o restante.</li>
        <li><strong>Saques em Caixas Eletrônicos (ATMs) no Vietnã:</strong> Permitem obter dinheiro vivo localmente, mas lembre-se de escolher sempre a opção de cobrança em moeda local (VND) na tela do terminal para evitar taxas abusivas de Conversão Dinâmica de Moeda (DCC).</li>
      </ol>
      `;
    } else if (lang === 'es') {
      deepAudVndContent = `
      <h2>Factores Económicos que Influyen en el Tipo de Cambio AUD/VND</h2>
      <p>La relación entre el Dólar Australiano y el Dong Vietnamita está determinada por los flujos comerciales y las políticas de los bancos centrales:</p>
      <ul>
        <li><strong>Precios de Materias Primas:</strong> El AUD es una divisa vinculada a las exportaciones de minerales, energía y agricultura de Australia.</li>
        <li><strong>Política del Banco Estatal de Vietnam (SBV):</strong> El dong opera bajo una flotación administrada con bandas diarias respecto al USD.</li>
        <li><strong>Turismo y Remesas:</strong> Los flujos continuos de viajes y remesas generan un volumen significativo de intercambio monetario.</li>
      </ul>

      <h2>Tabla Práctica de Conversión: AUD a VND</h2>
      <div class="table-wrapper">
        <table class="conversion-table">
          <thead>
            <tr>
              <th>Dólares Australianos (AUD)</th>
              <th>Dong Vietnamita Estimado (VND)</th>
              <th>Contexto Cotidiano en Vietnam</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><strong>1 AUD</strong></td><td>16,300 VND</td><td>Café vietnamita con leche o agua embotellada</td></tr>
            <tr><td><strong>5 AUD</strong></td><td>81,500 VND</td><td>Tazón de sopa Pho tradicional</td></tr>
            <tr><td><strong>10 AUD</strong></td><td>163,000 VND</td><td>Trayecto en taxi por el centro de la ciudad</td></tr>
            <tr><td><strong>50 AUD</strong></td><td>815,000 VND</td><td>Cena para dos personas en restaurante local</td></tr>
            <tr><td><strong>100 AUD</strong></td><td>1,630,000 VND</td><td>Noche de hotel confortable en Hanói o Da Nang</td></tr>
          </tbody>
        </table>
      </div>
      `;
    } else if (lang === 'de') {
      deepAudVndContent = `
      <h2>Wirtschaftliche Faktoren für den Wechselkurs AUD/VND</h2>
      <p>Der Wechselkurs zwischen Australischem Dollar und Vietnamesischem Dong spiegelt die Wirtschaftsbeziehungen und Rohstoffexporte wider:</p>
      <ul>
        <li><strong>Australische Rohstoffexporte:</strong> Hohe Nachfrage nach Eisenerz und Gas stärkt den AUD auf den internationalen Devisenmärkten.</li>
        <li><strong>Geldpolitik der State Bank of Vietnam:</strong> Der Dong wird über einen kontrollierten Referenzkurs gegenüber dem US-Dollar gesteuert.</li>
        <li><strong>Geldtransfers & Tourismus:</strong> Saisonal hohe Überweisungen und Reiseaktivitäten schaffen beständige Umrechnungsvolumina.</li>
      </ul>
      `;
    }
  }

  const articleHtml = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4766868021895107" crossorigin="anonymous"></script>
  <meta name="google-adsense-account" content="ca-pub-4766868021895107">
  <script src="/ahrefs-analytics.js" data-key="i4l/B5Lec0bODmBnYEF+kw" async></script>
  <meta name="msvalidate.01" content="25038A8801D42437BBC34723A41AC6C4" />
  <meta name="google-site-verification" content="Cpl786DxZO0l5hjxd_D5KE5RGWKFuJ9EVSh5n6Msm7M" />
  <meta name="google-site-verification" content="aoZ6vOmLyc0slj01NK1N91iwSnk2of6HUO_JjMskszE" />
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-0KPY6T7PFD"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-0KPY6T7PFD');
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${l.title}: ${ui.titleSuffix} | OmniConverter</title>
  <meta name="description" content="${ui.descPrefix} ${l.title}. ${ui.descSuffix}">
  <link rel="canonical" href="https://www.omniconverter.co.uk/${lang}/blog/${l.slug}">
  <meta name="article:published_time" content="${pubDate}">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="stylesheet" href="/styles.css">

  <!-- Schema.org BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.omniconverter.co.uk/${lang}/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.omniconverter.co.uk/${lang}/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "${l.title}",
        "item": "https://www.omniconverter.co.uk/${lang}/blog/${l.slug}"
      }
    ]
  }
  </script>

  <!-- Schema.org Article -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${l.title}",
    "description": "${ui.descPrefix} ${l.title}. ${ui.descSuffix}",
    "inLanguage": "${lang}",
    "url": "https://www.omniconverter.co.uk/${lang}/blog/${l.slug}",
    "image": "${heroImage}",
    "datePublished": "${pubDate}",
    "dateModified": "${pubDate}",
    "author": {
      "@type": "Organization",
      "name": "${ui.author}"
    },
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

  <!-- OpenGraph & Social Cards -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://www.omniconverter.co.uk/${lang}/blog/${l.slug}">
  <meta property="og:title" content="${l.title}: ${ui.titleSuffix} | OmniConverter">
  <meta property="og:description" content="${l.ans}">
  <meta property="og:site_name" content="OmniConverter">
  <meta property="og:image" content="${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${l.title}: ${ui.titleSuffix} | OmniConverter">
  <meta name="twitter:description" content="${l.ans}">
  <meta name="twitter:image" content="${heroImage}">

${makeHreflangTags(paths)}
</head>
<body>
${makeHeader(lang, 'blog', paths)}

  <main style="max-width: 950px; width: 100%;">
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/${lang}/">OmniConverter</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <a href="/${lang}/blog">Blog</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">${l.title}</span>
    </nav>

    <article class="content-section" style="margin-top:0.75rem;">
      <span class="formula-badge">${ui.badge}</span>
      <h1 style="font-size:2.1rem; font-weight:800; margin:0.75rem 0 0.5rem 0;">${l.title}</h1>
      
      <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.25rem; display:flex; gap:1.25rem; flex-wrap:wrap; align-items:center;">
        <span>📅 ${lang === 'pt' ? 'Publicado em' : (lang === 'es' ? 'Publicado el' : 'Veröffentlicht am')}: ${formattedDate}</span>
        <span>✍️ ${ui.author}</span>
        <span>⏱️ ${ui.readTime}</span>
      </div>

      <img src="${heroImage}" alt="${l.title}" style="width:100%; max-height:360px; object-fit:cover; border-radius:var(--radius-xl); margin:0.5rem 0 1.5rem 0; border:1px solid var(--card-border);" loading="eager">

      <p>${ui.leadP}</p>

      <div style="background:var(--bg-elevated); border-left:4px solid var(--primary-600); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
        <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; color:var(--text-main);">${ui.quickAnsTitle}</h3>
        <p style="margin:0; font-size:1.25rem; font-weight:800; color:var(--primary-600);">${l.ans}</p>
      </div>

      <!-- Relevant Interactive Converter Callout Box -->
      <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.08)); border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; margin: 1.75rem 0; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
        <div style="max-width: 650px;">
          <h3 style="margin: 0 0 0.35rem 0; font-size: 1.15rem; color: var(--text-main); font-weight: 800;">${ui.calloutTitle}</h3>
          <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted); line-height: 1.5;">${ui.calloutDesc}</p>
        </div>
        <a href="/${lang}/" class="tab-btn active" style="text-decoration: none; padding: 0.65rem 1.25rem; font-weight: 700; white-space: nowrap;">${ui.calloutBtn}</a>
      </div>

      <h2>${ui.formTitle}</h2>
      <div style="background:var(--bg-elevated); padding:1rem 1.25rem; border-radius:var(--radius-md); font-family:monospace; margin:1rem 0; font-size:1.05rem;">
        ${l.form}
      </div>
      <p style="color:var(--text-muted);">${ui.formExpl}</p>

      ${deepAudVndContent}

      <h2>${ui.tableTitle}</h2>
      <p>${ui.tableSubtitle}</p>
      <div class="table-wrapper">
        <table class="conversion-table">
          <thead>
            <tr><th>${ui.thRef}</th><th>${ui.thRes}</th></tr>
          </thead>
          <tbody>
            <tr><td>${ui.rowStandard}</td><td>${l.ans}</td></tr>
            <tr><td>${ui.rowDouble}</td><td>${ui.rowDoubleRes}</td></tr>
            <tr><td>${ui.rowHalf}</td><td>${ui.rowHalfRes}</td></tr>
          </tbody>
        </table>
      </div>
    </article>

    <section class="related-guides-section" style="margin:2.5rem 0 1.5rem 0; padding:1.5rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl);">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; font-weight:800; color:var(--text-main);">
        📖 ${ui.relatedTitle}
      </h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:0.85rem; margin-top:1rem;">
        <a href="/${lang}/" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600;">
          <span>${ui.link1}</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
        <a href="/${lang}/blog" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600;">
          <span>${ui.link2}</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
      </div>
    </section>
  </main>

${makeFooter(lang)}
</body>
</html>`;

  return articleHtml;
}

for (const topic of TOPICS_DATA) {
  // Spanish
  fs.writeFileSync(path.join(esBlogDir, `${topic.es.slug}.html`), generateArticlePage('es', topic), 'utf8');
  // German
  fs.writeFileSync(path.join(deBlogDir, `${topic.de.slug}.html`), generateArticlePage('de', topic), 'utf8');
  // Portuguese
  fs.writeFileSync(path.join(ptBlogDir, `${topic.pt.slug}.html`), generateArticlePage('pt', topic), 'utf8');
}
console.log('[OK] All 150 localized blog articles regenerated in 100% pure target languages with dates and Unsplash images!');


// =========================================================================
// STEP 4: UPDATE ENGLISH ARTICLES WITH VISIBLE PUBLICATION BYLINE (IF NOT PRESENT)
// =========================================================================
console.log('Ensuring visible publication date in English blog articles...');
let enUpdatedCount = 0;
const enBlogFiles = fs.readdirSync(path.join(rootDir, 'blog')).filter(f => f.endsWith('.html'));

for (const file of enBlogFiles) {
  const filePath = path.join(rootDir, 'blog', file);
  let content = fs.readFileSync(filePath, 'utf8');
  const slug = file.replace('.html', '');
  const enPost = enPostsMap.get(slug);

  if (enPost && !content.includes('Published:')) {
    const pubDate = enPost.date || enPost.publicationDate || '2026-09-17';
    const formattedDate = formatLocalizedDate(pubDate, 'en');
    const byline = `      <div style="font-size:0.85rem; color:var(--text-muted); margin:0.5rem 0 1.25rem 0; display:flex; gap:1.25rem; flex-wrap:wrap; align-items:center;">
        <span>📅 Published: ${formattedDate}</span>
        <span>✍️ OmniConverter Editorial Team</span>
        <span>⏱️ 4 min read</span>
      </div>`;

    // Insert right after the hero image if present, or right after H1
    if (content.includes('loading="eager">')) {
      content = content.replace('loading="eager">', `loading="eager">\n${byline}`);
      fs.writeFileSync(filePath, content, 'utf8');
      enUpdatedCount++;
    } else if (content.includes('</h1>')) {
      content = content.replace('</h1>', `</h1>\n${byline}`);
      fs.writeFileSync(filePath, content, 'utf8');
      enUpdatedCount++;
    }
  }
}
console.log(`[OK] Added visible publication date byline to ${enUpdatedCount} English articles!`);
console.log('ALL TASKS COMPLETED SUCCESSFULLY!');
