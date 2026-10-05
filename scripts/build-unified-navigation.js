const fs = require('fs');
const path = require('path');

const tabsConfig = {
  en: [
    { href: '/', label: 'Home' },
    { href: '/indian-units', label: 'Indian Units' },
    { href: '/time-zone', label: 'Time Zone' },
    { href: '/currency', label: 'Currency' },
    { href: '/length', label: 'Length' },
    { href: '/temperature', label: 'Temperature' },
    { href: '/weight-mass', label: 'Weight' },
    { href: '/volume-capacity', label: 'Volume' },
    { href: '/time-duration', label: 'Time' },
    { href: '/area', label: 'Area' },
    { href: '/speed', label: 'Speed' },
    { href: '/file-media', label: 'Files' },
    { href: '/blog', label: 'Blog' }
  ],
  es: [
    { href: '/es/', label: 'Inicio' },
    { href: '/indian-units', label: 'Unidades Indias' },
    { href: '/es/time-zone', label: 'Zonas Horarias' },
    { href: '/es/currency', label: 'Divisas' },
    { href: '/es/length', label: 'Longitud' },
    { href: '/es/temperature', label: 'Temperatura' },
    { href: '/es/weight-mass', label: 'Peso' },
    { href: '/es/volume-capacity', label: 'Volumen' },
    { href: '/es/time-duration', label: 'Tiempo' },
    { href: '/es/area', label: 'Área' },
    { href: '/es/speed', label: 'Velocidad' },
    { href: '/es/file-media', label: 'Archivos' },
    { href: '/es/blog', label: 'Blog' }
  ],
  de: [
    { href: '/de/', label: 'Startseite' },
    { href: '/indian-units', label: 'Indische Maße' },
    { href: '/de/time-zone', label: 'Zeitzonen' },
    { href: '/de/currency', label: 'Währung' },
    { href: '/de/length', label: 'Länge' },
    { href: '/de/temperature', label: 'Temperatur' },
    { href: '/de/weight-mass', label: 'Gewicht' },
    { href: '/de/volume-capacity', label: 'Volumen' },
    { href: '/de/time-duration', label: 'Zeit' },
    { href: '/de/area', label: 'Fläche' },
    { href: '/de/speed', label: 'Geschwindigkeit' },
    { href: '/de/file-media', label: 'Dateien' },
    { href: '/de/blog', label: 'Blog' }
  ],
  pt: [
    { href: '/pt/', label: 'Início' },
    { href: '/indian-units', label: 'Unidades Indianas' },
    { href: '/pt/time-zone', label: 'Fuso Horário' },
    { href: '/pt/currency', label: 'Moedas' },
    { href: '/pt/length', label: 'Comprimento' },
    { href: '/pt/temperature', label: 'Temperatura' },
    { href: '/pt/weight-mass', label: 'Peso' },
    { href: '/pt/volume-capacity', label: 'Volume' },
    { href: '/pt/time-duration', label: 'Tempo' },
    { href: '/pt/area', label: 'Área' },
    { href: '/pt/speed', label: 'Velocidade' },
    { href: '/pt/file-media', label: 'Arquivos' },
    { href: '/pt/blog', label: 'Blog' }
  ]
};

function getActiveHref(filePath) {
  const norm = filePath.replace(/\\/g, '/');
  // English
  if (norm === 'index.html') return '/';
  if (norm === 'indian-units.html') return '/indian-units';
  if (norm === 'time-zone.html') return '/time-zone';
  if (norm === 'currency.html') return '/currency';
  if (norm === 'length.html') return '/length';
  if (norm === 'temperature.html') return '/temperature';
  if (norm === 'weight-mass.html') return '/weight-mass';
  if (norm === 'volume-capacity.html') return '/volume-capacity';
  if (norm === 'time-duration.html') return '/time-duration';
  if (norm === 'area.html') return '/area';
  if (norm === 'speed.html') return '/speed';
  if (norm === 'file-media.html') return '/file-media';
  if (norm === 'blog.html' || norm.startsWith('blog/')) return '/blog';

  // Spanish
  if (norm === 'es/index.html') return '/es/';
  if (norm === 'es/time-zone.html') return '/es/time-zone';
  if (norm === 'es/currency.html') return '/es/currency';
  if (norm === 'es/length.html') return '/es/length';
  if (norm === 'es/temperature.html') return '/es/temperature';
  if (norm === 'es/weight-mass.html') return '/es/weight-mass';
  if (norm === 'es/volume-capacity.html') return '/es/volume-capacity';
  if (norm === 'es/time-duration.html') return '/es/time-duration';
  if (norm === 'es/area.html') return '/es/area';
  if (norm === 'es/speed.html') return '/es/speed';
  if (norm === 'es/file-media.html') return '/es/file-media';
  if (norm === 'es/blog.html' || norm.startsWith('es/blog/')) return '/es/blog';

  // German
  if (norm === 'de/index.html') return '/de/';
  if (norm === 'de/time-zone.html') return '/de/time-zone';
  if (norm === 'de/currency.html') return '/de/currency';
  if (norm === 'de/length.html') return '/de/length';
  if (norm === 'de/temperature.html') return '/de/temperature';
  if (norm === 'de/weight-mass.html') return '/de/weight-mass';
  if (norm === 'de/volume-capacity.html') return '/de/volume-capacity';
  if (norm === 'de/time-duration.html') return '/de/time-duration';
  if (norm === 'de/area.html') return '/de/area';
  if (norm === 'de/speed.html') return '/de/speed';
  if (norm === 'de/file-media.html') return '/de/file-media';
  if (norm === 'de/blog.html' || norm.startsWith('de/blog/')) return '/de/blog';

  // Portuguese
  if (norm === 'pt/index.html') return '/pt/';
  if (norm === 'pt/time-zone.html') return '/pt/time-zone';
  if (norm === 'pt/currency.html') return '/pt/currency';
  if (norm === 'pt/length.html') return '/pt/length';
  if (norm === 'pt/temperature.html') return '/pt/temperature';
  if (norm === 'pt/weight-mass.html') return '/pt/weight-mass';
  if (norm === 'pt/volume-capacity.html') return '/pt/volume-capacity';
  if (norm === 'pt/time-duration.html') return '/pt/time-duration';
  if (norm === 'pt/area.html') return '/pt/area';
  if (norm === 'pt/speed.html') return '/pt/speed';
  if (norm === 'pt/file-media.html') return '/pt/file-media';
  if (norm === 'pt/blog.html' || norm.startsWith('pt/blog/')) return '/pt/blog';

  return null;
}

function getFileLanguage(filePath) {
  const norm = filePath.replace(/\\/g, '/');
  if (norm.startsWith('es/')) return 'es';
  if (norm.startsWith('de/')) return 'de';
  if (norm.startsWith('pt/')) return 'pt';
  return 'en';
}

function buildNavTabs(lang, activeHref, indent = '      ') {
  const tabs = tabsConfig[lang];
  const lines = tabs.map(t => {
    const isActive = t.href === activeHref;
    const cls = isActive ? 'tab-btn active' : 'tab-btn';
    return `${indent}  <a href="${t.href}" class="${cls}">${t.label}</a>`;
  });

  return `${indent}<nav class="nav-tabs" aria-label="Converter category navigation">\n${lines.join('\n')}\n${indent}</nav>`;
}

function cleanLangSwitcher(content) {
  // Clean flag emojis inside lang-switcher
  return content
    .replace(/(<span[^>]*class="[^"]*active[^"]*"[^>]*>)\s*🇬🇧\s*EN(<\/span>)/g, '$1EN$2')
    .replace(/(<a[^>]*href="[^"]*"[^>]*title="[^"]*"[^>]*>)\s*🇬🇧\s*EN(<\/a>)/g, '$1EN$2')
    .replace(/(<span[^>]*class="[^"]*active[^"]*"[^>]*>)\s*🇪🇸\s*ES(<\/span>)/g, '$1ES$2')
    .replace(/(<a[^>]*href="[^"]*"[^>]*title="[^"]*"[^>]*>)\s*🇪🇸\s*ES(<\/a>)/g, '$1ES$2')
    .replace(/(<span[^>]*class="[^"]*active[^"]*"[^>]*>)\s*🇩🇪\s*DE(<\/span>)/g, '$1DE$2')
    .replace(/(<a[^>]*href="[^"]*"[^>]*title="[^"]*"[^>]*>)\s*🇩🇪\s*DE(<\/a>)/g, '$1DE$2')
    .replace(/(<span[^>]*class="[^"]*active[^"]*"[^>]*>)\s*🇧🇷\s*PT(<\/span>)/g, '$1PT$2')
    .replace(/(<a[^>]*href="[^"]*"[^>]*title="[^"]*"[^>]*>)\s*🇧🇷\s*PT(<\/a>)/g, '$1PT$2');
}

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(getAllHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const allFiles = getAllHtmlFiles('.');
let count = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const navRegex = /([ \t]*)<nav class="nav-tabs"[^>]*>[\s\S]*?<\/nav>/;
  const match = content.match(navRegex);

  if (match) {
    const indent = match[1] || '      ';
    const lang = getFileLanguage(file);
    const activeHref = getActiveHref(file);
    const newNav = buildNavTabs(lang, activeHref, indent);

    content = content.replace(navRegex, newNav);
    content = cleanLangSwitcher(content);

    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
});

console.log(`Successfully unified navigation and language switcher across ${count} HTML files!`);
