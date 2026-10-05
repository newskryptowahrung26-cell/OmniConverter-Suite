import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const esDir = path.join(rootDir, 'es');
const deDir = path.join(rootDir, 'de');
const ptDir = path.join(rootDir, 'pt');

// Shared Header & Footer generator
function makeHeader(lang, activeTab, toolName) {
  const tabs = {
    es: [
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
    ],
    de: [
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
    ],
    pt: [
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
  };

  const menuText = lang === 'de' ? 'Menü' : 'Menu';
  const tabList = tabs[lang].map(t => {
    const cls = t.id === activeTab ? 'tab-btn active' : 'tab-btn';
    return `<a href="${t.url}" class="${cls}">${t.name}</a>`;
  }).join('\n        ');

  const enUrl = toolName === 'index' ? '/' : `/${toolName}`;
  const esUrl = toolName === 'index' ? '/es/' : `/es/${toolName}`;
  const deUrl = toolName === 'index' ? '/de/' : `/de/${toolName}`;
  const ptUrl = toolName === 'index' ? '/pt/' : `/pt/${toolName}`;

  const enLink = lang === 'en' ? `<span class="active" title="English">🇬🇧 EN</span>` : `<a href="${enUrl}" title="English">🇬🇧 EN</a>`;
  const esLink = lang === 'es' ? `<span class="active" title="Español">🇪🇸 ES</span>` : `<a href="${esUrl}" title="Español">🇪🇸 ES</a>`;
  const deLink = lang === 'de' ? `<span class="active" title="Deutsch">🇩🇪 DE</span>` : `<a href="${deUrl}" title="Deutsch">🇩🇪 DE</a>`;
  const ptLink = lang === 'pt' ? `<span class="active" title="Português">🇧🇷 PT</span>` : `<a href="${ptUrl}" title="Português">🇧🇷 PT</a>`;

  return `  <header>
    <div class="header-container">
      <a href="/${lang}/" class="logo" aria-label="OmniConverter">
        <img src="/logo.png" alt="OmniConverter Logo" style="width:32px; height:32px; border-radius:6px; object-fit:cover;">
        <span>OmniConverter</span>
      </a>

      <button type="button" class="mobile-menu-btn" onclick="const n=this.nextElementSibling||document.querySelector('.nav-tabs');if(n)n.classList.toggle('is-open');" aria-label="Toggle navigation menu">
        <span>${menuText}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <nav class="nav-tabs" aria-label="Category navigation">
        ${tabList}
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
  return `  <footer>
    <p>&copy; 2026 OmniConverter. Todos los derechos reservados. | <a href="/es/blog" style="color:var(--primary-600);">Blog</a> | <a href="/es/sitemap" style="color:var(--primary-600);">Mapa del Sitio</a> | <a href="/es/privacy-policy" style="color:var(--primary-600);">Privacidad</a> | <a href="/es/terms" style="color:var(--primary-600);">Términos</a> | <a href="/es/about" style="color:var(--primary-600);">Nosotros</a> | <a href="/es/contact" style="color:var(--primary-600);">Contacto</a></p>
  </footer>`;
}

function makeHead(lang, title, desc, toolName) {
  const enUrl = toolName === 'index' ? '/' : `/${toolName}`;
  const esUrl = toolName === 'index' ? '/es/' : `/es/${toolName}`;
  const deUrl = toolName === 'index' ? '/de/' : `/de/${toolName}`;
  const ptUrl = toolName === 'index' ? '/pt/' : `/pt/${toolName}`;
  const canonical = `https://www.omniconverter.co.uk${lang === 'es' ? esUrl : (lang === 'de' ? deUrl : ptUrl)}`;

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
  <link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk${enUrl}">
  <link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk${esUrl}">
  <link rel="alternate" hreflang="de" href="https://www.omniconverter.co.uk${deUrl}">
  <link rel="alternate" hreflang="pt" href="https://www.omniconverter.co.uk${ptUrl}">
  <link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk${enUrl}">`;
}

// =========================================================================
// 3. TEMPERATURE CONVERTER (temperature.html)
// =========================================================================
function buildTemperaturePage(lang) {
  const meta = {
    es: {
      title: 'Convertidor de Temperatura: Celsius, Fahrenheit, Kelvin y Rankine',
      desc: 'Convierta grados Celsius a Fahrenheit, Kelvin y Rankine con fórmulas exactas y cálculo en tiempo real.',
      h1: 'Convertidor de Temperatura',
      sub: 'Convierta al instante entre Celsius (°C), Fahrenheit (°F), Kelvin (K) y Rankine (°R).',
      val: 'Valor de Temperatura',
      from: 'Escala de Origen',
      to: 'Escala de Destino',
      btnConvert: 'Convertir',
      btnClear: 'Limpiar',
      btnCopy: 'Copiar Resultado',
      allScalesTitle: 'Tabla Completa de Escalas de Temperatura',
      presetsTitle: 'Puntos de Referencia Clave de Temperatura'
    },
    de: {
      title: 'Temperatur-Umrechner: Celsius, Fahrenheit, Kelvin & Rankine',
      desc: 'Rechnen Sie Celsius in Fahrenheit, Kelvin und Rankine sekundenschnell um. Exakte wissenschaftliche Formeln.',
      h1: 'Temperatur-Umrechner',
      sub: 'Sekundenschnelle Umrechnung zwischen Celsius (°C), Fahrenheit (°F), Kelvin (K) und Rankine (°R).',
      val: 'Temperaturwert',
      from: 'Ausgangsskala',
      to: 'Zielskala',
      btnConvert: 'Umrechnen',
      btnClear: 'Zurücksetzen',
      btnCopy: 'Ergebnis kopieren',
      allScalesTitle: 'Vollständige Skalenübersicht',
      presetsTitle: 'Wichtige thermodynamische Referenzpunkte'
    },
    pt: {
      title: 'Conversor de Temperatura: Celsius, Fahrenheit, Kelvin e Rankine',
      desc: 'Converta Celsius para Fahrenheit, Kelvin e Rankine com fórmulas exatas e validação em tempo real.',
      h1: 'Conversor de Temperatura',
      sub: 'Conversão instantânea entre Celsius (°C), Fahrenheit (°F), Kelvin (K) e Rankine (°R).',
      val: 'Valor de Temperatura',
      from: 'Escala de Origem',
      to: 'Escala de Destino',
      btnConvert: 'Converter',
      btnClear: 'Limpar',
      btnCopy: 'Copiar Resultado',
      allScalesTitle: 'Tabela Completa de Escalas de Temperatura',
      presetsTitle: 'Pontos de Referência Importantes'
    }
  }[lang];

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${makeHead(lang, meta.title, meta.desc, 'temperature')}
</head>
<body>
${makeHeader(lang, 'temperature', 'temperature')}

  <main style="max-width: 1150px; width: 100%;">
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/${lang}/">OmniConverter</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">${meta.h1}</span>
    </nav>

    <div id="contentTemp" class="tool-tab-content active">
      <section class="converter-card" style="box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06);">
        <h1 class="converter-title">${meta.h1}</h1>
        <p style="text-align:center; color:var(--text-muted); margin:-0.5rem 0 1.5rem 0; font-size:0.95rem;">${meta.sub}</p>

        <div class="converter-grid">
          <div class="input-group">
            <label for="tempInput">${meta.val}</label>
            <input type="number" id="tempInput" class="input-field" placeholder="0" step="any" value="0">
          </div>
          <div class="input-group">
            <label for="fromSelect">${meta.from}</label>
            <select id="fromSelect" class="select-field" aria-label="From Temperature Scale"></select>
          </div>
          <button type="button" id="swapBtn" class="btn-swap" title="Swap Scales" aria-label="Swap Scales">⇄</button>
          <div class="input-group">
            <label for="toSelect">${meta.to}</label>
            <select id="toSelect" class="select-field" aria-label="To Temperature Scale"></select>
          </div>
        </div>

        <div class="button-row">
          <button type="button" id="convertBtn" class="btn-convert">${meta.btnConvert}</button>
          <button type="button" id="clearBtn" class="btn-clear">${meta.btnClear}</button>
        </div>

        <div id="resultContainer" class="result-container" style="display:block;">
          <div class="result-main">
            <div class="result-text-group">
              <span class="result-label">Result</span>
              <div id="resultValue" class="result-value">32.00 °F</div>
            </div>
            <button type="button" id="copyBtn" class="btn-copy">${meta.btnCopy}</button>
          </div>
          <div class="formula-box"><strong>Formula:</strong> <span id="formulaText">°F = (°C × 9/5) + 32</span></div>
          <div class="explanation-box"><strong>Explanation:</strong> <span id="explanationText">Multiply 0 by 1.8 and add 32.</span></div>
        </div>

        <!-- Presets -->
        <section class="content-section" style="margin-top:2rem;">
          <h2 style="font-size:1.25rem; font-weight:700; margin-bottom:1rem;">${meta.presetsTitle}</h2>
          <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:0.75rem;">
            <a href="#water-freeze" class="quick-card" onclick="setPreset(0, 'C', 'F'); return false;">
              <span>Water Freezes</span>
              <span style="color:var(--primary-600); display:block; font-size:0.85rem;">0 °C = 32 °F</span>
            </a>
            <a href="#room-temp" class="quick-card" onclick="setPreset(20, 'C', 'F'); return false;">
              <span>Room Temperature</span>
              <span style="color:var(--primary-600); display:block; font-size:0.85rem;">20 °C = 68 °F</span>
            </a>
            <a href="#body-temp" class="quick-card" onclick="setPreset(37, 'C', 'F'); return false;">
              <span>Human Body Temp</span>
              <span style="color:var(--primary-600); display:block; font-size:0.85rem;">37 °C = 98.6 °F</span>
            </a>
            <a href="#water-boil" class="quick-card" onclick="setPreset(100, 'C', 'F'); return false;">
              <span>Water Boils</span>
              <span style="color:var(--primary-600); display:block; font-size:0.85rem;">100 °C = 212 °F</span>
            </a>
          </div>
        </section>
      </section>
    </div>
  </main>

  <div id="toast" class="toast" aria-live="polite"></div>

${makeFooter(lang)}

  <script type="module" src="/app.js"></script>
  <script type="module" src="/temperature-interactive.js"></script>
</body>
</html>`;
}

// =========================================================================
// 4. LENGTH CONVERTER (length.html)
// =========================================================================
function buildLengthPage(lang) {
  const meta = {
    es: {
      title: 'Convertidor de Longitud y Distancia',
      desc: 'Convierta metros, pies, pulgadas, centímetros, yardas y kilómetros en tiempo real.',
      h1: 'Convertidor de Longitud y Distancia',
      sub: 'Conversor métrico e imperial instantáneo para metros, centímetros, pies, pulgadas y millas.',
      val: 'Valor de Longitud / Distancia',
      from: 'Unidad de Origen',
      to: 'Unidad de Destino',
      btnConvert: 'Convertir',
      btnClear: 'Limpiar / Restablecer',
      btnCopy: 'Copiar Resultado',
      presetsTitle: 'Conversiones Populares de Longitud'
    },
    de: {
      title: 'Längen- & Distanz-Umrechner | Meter, Fuß, Zoll, Kilometer',
      desc: 'Rechnen Sie Meter in Fuß, Zoll, Zentimeter, Meilen und Yards sekundenschnell um.',
      h1: 'Längen- & Distanz-Umrechner',
      sub: 'Metrische und imperiale Längeneinheiten sekundenschnell und exakt berechnen.',
      val: 'Längen- / Distanzwert',
      from: 'Ausgangseinheit',
      to: 'Zieleinheit',
      btnConvert: 'Umrechnen',
      btnClear: 'Zurücksetzen',
      btnCopy: 'Ergebnis kopieren',
      presetsTitle: 'Beliebte Längenumrechnungen'
    },
    pt: {
      title: 'Conversor de Comprimento e Distância: Metros, Pés, Polegadas',
      desc: 'Converta metros, pés, polegadas, centímetros, jardas e milhas com cálculo instantâneo.',
      h1: 'Conversor de Comprimento e Distância',
      sub: 'Conversão instantânea entre sistema métrico e imperial para medidas de comprimento.',
      val: 'Valor de Comprimento / Distância',
      from: 'Unidade de Origem',
      to: 'Unidade de Destino',
      btnConvert: 'Converter',
      btnClear: 'Limpar / Redefinir',
      btnCopy: 'Copiar Resultado',
      presetsTitle: 'Conversões Rápidas de Comprimento'
    }
  }[lang];

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${makeHead(lang, meta.title, meta.desc, 'length')}
</head>
<body>
${makeHeader(lang, 'length', 'length')}

  <main style="max-width: 1150px; width: 100%;">
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/${lang}/">OmniConverter</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">${meta.h1}</span>
    </nav>

    <div id="contentLength" class="tool-tab-content active">
      <section class="converter-card" style="box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06);">
        <h1 class="converter-title">${meta.h1}</h1>
        <p style="text-align:center; color:var(--text-muted); margin:-0.5rem 0 1.5rem 0; font-size:0.95rem;">${meta.sub}</p>

        <div class="converter-grid">
          <div class="input-group">
            <label for="lengthInput">${meta.val}</label>
            <input type="number" id="lengthInput" class="input-field" placeholder="1" step="any" value="1">
          </div>
          <div class="input-group">
            <label for="lengthFromSelect">${meta.from}</label>
            <select id="lengthFromSelect" class="select-field" aria-label="From Length Unit"></select>
          </div>
          <button type="button" id="lengthSwapBtn" class="btn-swap" title="Swap Units" aria-label="Swap Units">⇄</button>
          <div class="input-group">
            <label for="lengthToSelect">${meta.to}</label>
            <select id="lengthToSelect" class="select-field" aria-label="To Length Unit"></select>
          </div>
        </div>

        <div class="button-row">
          <button type="button" id="lengthConvertBtn" class="btn-convert">${meta.btnConvert}</button>
          <button type="button" id="lengthClearBtn" class="btn-clear">${meta.btnClear}</button>
        </div>

        <div id="lengthResultContainer" class="result-container" style="display:block;">
          <div class="result-main">
            <div class="result-text-group">
              <span class="result-label">Converted Result</span>
              <div id="lengthResultValue" class="result-value">3.28084 ft</div>
            </div>
            <button type="button" id="lengthCopyBtn" class="btn-copy">${meta.btnCopy}</button>
          </div>
          <div class="formula-box"><strong>Formula:</strong> <span id="lengthFormulaText">ft = m × 3.28084</span></div>
          <div class="explanation-box"><strong>Calculation Step:</strong> <span id="lengthExplanationText">Multiply 1 m by 3.28084 to get 3.28084 ft.</span></div>
        </div>

        <!-- Presets -->
        <section class="content-section" style="margin-top:2rem;">
          <h2 style="font-size:1.25rem; font-weight:700; margin-bottom:1rem;">${meta.presetsTitle}</h2>
          <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:0.75rem;">
            <a href="#1-m-to-ft" class="quick-card" onclick="setQuickConvert(1, 'm', 'ft'); return false;">
              <span>1 Meter to Feet</span>
              <span style="color:var(--primary-600); display:block; font-size:0.85rem;">= 3.28084 ft</span>
            </a>
            <a href="#10-cm-to-in" class="quick-card" onclick="setQuickConvert(10, 'cm', 'in'); return false;">
              <span>10 CM to Inches</span>
              <span style="color:var(--primary-600); display:block; font-size:0.85rem;">= 3.937 in</span>
            </a>
            <a href="#1-km-to-mi" class="quick-card" onclick="setQuickConvert(1, 'km', 'mi'); return false;">
              <span>1 Kilometer to Miles</span>
              <span style="color:var(--primary-600); display:block; font-size:0.85rem;">= 0.62137 mi</span>
            </a>
            <a href="#6-ft-to-cm" class="quick-card" onclick="setQuickConvert(6, 'ft', 'cm'); return false;">
              <span>6 Feet to CM</span>
              <span style="color:var(--primary-600); display:block; font-size:0.85rem;">= 182.88 cm</span>
            </a>
          </div>
        </section>
      </section>
    </div>
  </main>

  <div id="toast" class="toast" aria-live="polite"></div>

${makeFooter(lang)}

  <script type="module">
    import { convertLength, LENGTH_UNITS } from '/length-converter.js';

    document.addEventListener('DOMContentLoaded', () => {
      const lengthInput = document.getElementById('lengthInput');
      const lengthFromSelect = document.getElementById('lengthFromSelect');
      const lengthToSelect = document.getElementById('lengthToSelect');
      const lengthSwapBtn = document.getElementById('lengthSwapBtn');
      const lengthConvertBtn = document.getElementById('lengthConvertBtn');
      const lengthClearBtn = document.getElementById('lengthClearBtn');
      const lengthResultContainer = document.getElementById('lengthResultContainer');
      const lengthResultValue = document.getElementById('lengthResultValue');
      const lengthFormulaText = document.getElementById('lengthFormulaText');
      const lengthExplanationText = document.getElementById('lengthExplanationText');
      const lengthCopyBtn = document.getElementById('lengthCopyBtn');
      const toast = document.getElementById('toast');

      let currentCopyString = '';

      function populateSelects() {
        lengthFromSelect.innerHTML = '';
        lengthToSelect.innerHTML = '';
        Object.keys(LENGTH_UNITS).forEach(unitKey => {
          const u = LENGTH_UNITS[unitKey];
          const opt1 = document.createElement('option');
          opt1.value = unitKey;
          opt1.textContent = \`\${u.name} (\${u.symbol})\`;
          lengthFromSelect.appendChild(opt1);

          const opt2 = document.createElement('option');
          opt2.value = unitKey;
          opt2.textContent = \`\${u.name} (\${u.symbol})\`;
          lengthToSelect.appendChild(opt2);
        });
        lengthFromSelect.value = 'm';
        lengthToSelect.value = 'ft';
      }

      function performConversion() {
        const val = parseFloat(lengthInput.value);
        if (isNaN(val)) {
          lengthResultContainer.style.display = 'none';
          return;
        }
        const fromUnit = lengthFromSelect.value;
        const toUnit = lengthToSelect.value;
        const res = convertLength(val, fromUnit, toUnit);
        if (res.error) return;

        lengthResultValue.textContent = res.formattedResult;
        lengthFormulaText.textContent = res.formula;
        lengthExplanationText.textContent = res.explanation;
        currentCopyString = \`\${res.formattedInput} = \${res.formattedResult}\`;
        lengthResultContainer.style.display = 'block';
      }

      populateSelects();
      performConversion();

      lengthConvertBtn.addEventListener('click', performConversion);
      lengthInput.addEventListener('input', performConversion);
      lengthFromSelect.addEventListener('change', performConversion);
      lengthToSelect.addEventListener('change', performConversion);

      lengthSwapBtn.addEventListener('click', () => {
        const temp = lengthFromSelect.value;
        lengthFromSelect.value = lengthToSelect.value;
        lengthToSelect.value = temp;
        performConversion();
      });

      lengthClearBtn.addEventListener('click', () => {
        lengthInput.value = '1';
        lengthFromSelect.value = 'm';
        lengthToSelect.value = 'ft';
        performConversion();
      });

      lengthCopyBtn.addEventListener('click', async () => {
        if (currentCopyString && navigator.clipboard) {
          try {
            await navigator.clipboard.writeText(currentCopyString);
            if (toast) {
              toast.textContent = 'Copied to clipboard!';
              toast.classList.add('show');
              setTimeout(() => toast.classList.remove('show'), 2000);
            }
          } catch (e) {}
        }
      });

      window.setQuickConvert = function(val, from, to) {
        lengthInput.value = val;
        lengthFromSelect.value = from;
        lengthToSelect.value = to;
        performConversion();
        window.scrollTo({ top: 100, behavior: 'smooth' });
      };
    });
  </script>
</body>
</html>`;
}

// =========================================================================
// 5. GENERIC UNIT CONVERTER PAGE BUILDER (Weight, Volume, Time, Area, Speed)
// =========================================================================
function buildUnitPage(lang, toolKey, config) {
  const meta = config[lang];

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${makeHead(lang, meta.title, meta.desc, toolKey)}
</head>
<body>
${makeHeader(lang, toolKey, toolKey)}

  <main style="max-width: 1150px; width: 100%;">
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/${lang}/">OmniConverter</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">${meta.h1}</span>
    </nav>

    <div id="${config.contentId}" class="tool-tab-content active">
      <section class="converter-card" style="box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06);">
        <h1 class="converter-title">${meta.h1}</h1>
        <p style="text-align:center; color:var(--text-muted); margin:-0.5rem 0 1.5rem 0; font-size:0.95rem;">${meta.sub}</p>

        <div class="converter-grid">
          <div class="input-group">
            <label for="${config.inputId}">${meta.val}</label>
            <input type="number" id="${config.inputId}" class="input-field" placeholder="1" step="any" value="1">
          </div>
          <div class="input-group">
            <label for="${config.fromId}">${meta.from}</label>
            <select id="${config.fromId}" class="select-field" aria-label="From Unit"></select>
          </div>
          <button type="button" id="${config.swapId}" class="btn-swap" title="Swap Units" aria-label="Swap Units">⇄</button>
          <div class="input-group">
            <label for="${config.toId}">${meta.to}</label>
            <select id="${config.toId}" class="select-field" aria-label="To Unit"></select>
          </div>
        </div>

        <div class="button-row">
          <button type="button" id="${config.convertId}" class="btn-convert">${meta.btnConvert}</button>
          <button type="button" id="${config.clearId}" class="btn-clear">${meta.btnClear}</button>
        </div>

        <div id="${config.resultContainerId}" class="result-container" style="display:block;">
          <div class="result-main">
            <div class="result-text-group">
              <span class="result-label">Result</span>
              <div id="${config.resultValueId}" class="result-value">--</div>
            </div>
            <button type="button" id="${config.copyBtnId}" class="btn-copy">${meta.btnCopy}</button>
          </div>
          <div class="formula-box"><strong>Formula:</strong> <span id="${config.formulaTextId}">--</span></div>
          <div class="explanation-box"><strong>Explanation:</strong> <span id="${config.explanationTextId}">--</span></div>
        </div>
      </section>
    </div>
  </main>

  <div id="toast" class="toast" aria-live="polite"></div>

${makeFooter(lang)}

  <script type="module" src="/app.js"></script>
</body>
</html>`;
}

// =========================================================================
// 6. FILE MEDIA CONVERTER (file-media.html)
// =========================================================================
function buildFileMediaPage(lang) {
  const meta = {
    es: {
      title: 'Convertidor de Archivos, Imágenes y Documentos',
      desc: 'Convierta imágenes (PNG, JPG, WebP) y datos (JSON, CSV) de forma 100% privada en su navegador.',
      h1: 'Convertidor de Archivos y Medios',
      sub: 'Herramientas de conversión directa en el navegador: sin subir datos a servidores externos.',
      imgTitle: 'Convertidor de Formato de Imágenes',
      imgSelect: 'Seleccionar Archivo de Imagen (PNG, JPG, WebP, BMP)',
      imgTarget: 'Formato de Destino',
      btnImg: 'Convertir Imagen',
      docTitle: 'Convertidor de Formato de Documentos y Datos',
      docPaste: 'Pegar Contenido (JSON, CSV o Texto)',
      btnDoc: 'Generar Archivo Convertido'
    },
    de: {
      title: 'Datei-, Bild- & Dokument-Konverter | 100% Sicher im Browser',
      desc: 'Bilder (PNG, JPG, WebP) und Daten (JSON, CSV) sicher lokal im Browser umwandeln.',
      h1: 'Datei- & Medienkonverter',
      sub: 'Direkte, sichere Umwandlung im Browser ohne Server-Upload.',
      imgTitle: 'Bildformat-Konverter',
      imgSelect: 'Bilddatei auswählen (PNG, JPG, WebP, BMP)',
      imgTarget: 'Zielformat',
      btnImg: 'Bild umwandeln',
      docTitle: 'Dokument- & Datenformat-Konverter',
      docPaste: 'Inhalt einfügen (JSON, CSV oder Text)',
      btnDoc: 'Konvertierte Datei erzeugen'
    },
    pt: {
      title: 'Conversor de Arquivos, Imagens e Documentos | Seguro no Navegador',
      desc: 'Converta imagens (PNG, JPG, WebP) e dados (JSON, CSV) com privacidade total no navegador.',
      h1: 'Conversor de Arquivos e Mídia',
      sub: 'Ferramentas de conversão nativas no navegador sem envio de arquivos a servidores externos.',
      imgTitle: 'Conversor de Formatos de Imagem',
      imgSelect: 'Selecionar Arquivo de Imagem (PNG, JPG, WebP, BMP)',
      imgTarget: 'Formato de Destino',
      btnImg: 'Converter Imagem',
      docTitle: 'Conversor de Documentos e Dados',
      docPaste: 'Colar Conteúdo (JSON, CSV ou Texto)',
      btnDoc: 'Gerar Arquivo Convertido'
    }
  }[lang];

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${makeHead(lang, meta.title, meta.desc, 'file-media')}
</head>
<body>
${makeHeader(lang, 'file-media', 'file-media')}

  <main style="max-width: 1150px; width: 100%;">
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/${lang}/">OmniConverter</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">${meta.h1}</span>
    </nav>

    <div id="contentFiles" class="tool-tab-content active">
      <section class="converter-card" style="box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06); margin-bottom: 2rem;">
        <h1 class="converter-title">${meta.imgTitle}</h1>
        <p style="text-align:center; color:var(--text-muted); margin:-0.5rem 0 1.5rem 0; font-size:0.95rem;">${meta.sub}</p>

        <div class="input-group" style="margin-bottom: 1rem;">
          <label for="imageFileInput">${meta.imgSelect}</label>
          <input type="file" id="imageFileInput" class="input-field" accept="image/*">
        </div>

        <div class="input-group" style="margin-bottom: 1.5rem;">
          <label for="targetImageFormat">${meta.imgTarget}</label>
          <select id="targetImageFormat" class="select-field">
            <option value="image/png">PNG (.png)</option>
            <option value="image/jpeg">JPEG (.jpg)</option>
            <option value="image/webp">WebP (.webp)</option>
            <option value="image/bmp">BMP (.bmp)</option>
          </select>
        </div>

        <button type="button" id="convertImageBtn" class="btn-convert">${meta.btnImg}</button>
        <div id="imageResultArea"></div>
      </section>

      <section class="converter-card" style="box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06);">
        <h2 class="converter-title">${meta.docTitle}</h2>
        <div class="input-group" style="margin-bottom: 1rem;">
          <label for="docInputText">${meta.docPaste}</label>
          <textarea id="docInputText" class="input-field" style="height: 120px; font-family: monospace;" placeholder='[{"name":"John","age":30}]'></textarea>
        </div>
        <div class="input-group" style="margin-bottom: 1.5rem;">
          <label for="docConversionType">Conversion Type</label>
          <select id="docConversionType" class="select-field">
            <option value="json2csv">JSON to CSV (.csv)</option>
            <option value="csv2json">CSV to JSON (.json)</option>
          </select>
        </div>
        <button type="button" id="convertDocBtn" class="btn-convert">${meta.btnDoc}</button>
        <div id="docResultArea"></div>
      </section>
    </div>
  </main>

  <div id="toast" class="toast" aria-live="polite"></div>

${makeFooter(lang)}

  <script type="module" src="/app.js"></script>
</body>
</html>`;
}

// =========================================================================
// 7. HOME PAGE (index.html)
// =========================================================================
function buildHomePage(lang) {
  const meta = {
    es: {
      title: 'OmniConverter | Suite Universal de Conversión de Unidades y Divisas',
      desc: 'Todas las herramientas de conversión en un solo lugar: Divisas, Temperatura, Peso, Zonas Horarias, Longitud, Volumen y Archivos.',
      heroTitle: 'Hacemos que la conversión de unidades y archivos sea simple.',
      heroSub: 'Todas las herramientas para convertir divisas, temperatura, peso, volumen, tiempo, área, velocidad e imágenes en una suite rápida y 100% privada.'
    },
    de: {
      title: 'OmniConverter | Universelle Einheiten- & Währungsumrechnung',
      desc: 'Alle Umrechnungswerkzeuge an einem Ort: Währungen, Zeitzonen, Temperatur, Gewicht, Länge, Volumen und Dateien.',
      heroTitle: 'Wir machen Einheiten- & Dateiumwandlung einfach.',
      heroSub: 'Alle Werkzeuge zur Umrechnung von Währungen, Temperatur, Gewicht, Volumen, Zeit, Fläche, Geschwindigkeit und Bildern in einer schnellen, 100% privaten Suite.'
    },
    pt: {
      title: 'OmniConverter | Suíte Universal de Conversão de Unidades e Moedas',
      desc: 'Todas as ferramentas de conversão em um só lugar: Moedas, Fusos Horários, Temperatura, Peso, Comprimento, Volume e Arquivos.',
      heroTitle: 'Tornamos a conversão de unidades e arquivos simples.',
      heroSub: 'Todas as ferramentas necessárias para converter moedas, temperatura, peso, volume, tempo, área, velocidade e imagens em uma suíte rápida e 100% privada.'
    }
  }[lang];

  const tools = [
    { id: 'time-zone', icon: '🌍', name: lang === 'es' ? 'Zonas Horarias' : (lang === 'de' ? 'Zeitzonen' : 'Fuso Horário'), desc: lang === 'es' ? 'Compare horarios internacionales y reloj mundial.' : (lang === 'de' ? 'Uhrzeiten weltweit und 24h-Meetingplaner.' : 'Horários mundiais e planejador de reuniões.') },
    { id: 'currency', icon: '💱', name: lang === 'es' ? 'Divisas y Cripto' : (lang === 'de' ? 'Währungsrechner' : 'Moedas & Câmbio'), desc: lang === 'es' ? 'Tipos de cambio en tiempo real con comisiones bancarias.' : (lang === 'de' ? 'Live-Wechselkurse mit Gebührenrechner.' : 'Cotações em tempo real com tarifas bancárias.') },
    { id: 'length', icon: '📏', name: lang === 'es' ? 'Longitud y Distancia' : (lang === 'de' ? 'Länge & Distanz' : 'Comprimento'), desc: lang === 'es' ? 'Metros, pies, pulgadas, centímetros y millas.' : (lang === 'de' ? 'Meter, Fuß, Zoll, Zentimeter und Meilen.' : 'Metros, pés, polegadas e centímetros.') },
    { id: 'temperature', icon: '🌡️', name: lang === 'es' ? 'Temperatura' : (lang === 'de' ? 'Temperatur' : 'Temperatura'), desc: lang === 'es' ? 'Celsius, Fahrenheit, Kelvin y Rankine.' : (lang === 'de' ? 'Celsius, Fahrenheit, Kelvin und Rankine.' : 'Celsius, Fahrenheit, Kelvin e Rankine.') },
    { id: 'weight-mass', icon: '⚖️', name: lang === 'es' ? 'Peso y Masa' : (lang === 'de' ? 'Gewicht & Masse' : 'Peso e Massa'), desc: lang === 'es' ? 'Kilogramos, libras, stones, gramos y onzas.' : (lang === 'de' ? 'Kilogramm, Pfund, Stone, Gramm und Unzen.' : 'Quilos, libras, stones, gramas e onças.') },
    { id: 'volume-capacity', icon: '🧪', name: lang === 'es' ? 'Volumen y Capacidad' : (lang === 'de' ? 'Volumen & Hohlmaße' : 'Volume'), desc: lang === 'es' ? 'Litros, galones, tazas, mililitros y onzas líquidas.' : (lang === 'de' ? 'Liter, Gallonen, Tassen und Milliliter.' : 'Litros, galões, xícaras e mililitros.') },
    { id: 'time-duration', icon: '⏱️', name: lang === 'es' ? 'Tiempo y Duración' : (lang === 'de' ? 'Zeiteinheiten' : 'Tempo'), desc: lang === 'es' ? 'Horas, minutos, segundos, días y semanas.' : (lang === 'de' ? 'Stunden, Minuten, Sekunden und Tage.' : 'Horas, minutos, segundos e dias.') },
    { id: 'area', icon: '📐', name: lang === 'es' ? 'Área y Superficie' : (lang === 'de' ? 'Flächenmaße' : 'Área'), desc: lang === 'es' ? 'Metros cuadrados, pies cuadrados, acres y hectáreas.' : (lang === 'de' ? 'Quadratmeter, Quadratfuß, Hektar und Acres.' : 'Metros quadrados, pés quadrados e hectares.') },
    { id: 'speed', icon: '🚀', name: lang === 'es' ? 'Velocidad' : (lang === 'de' ? 'Geschwindigkeit' : 'Velocidade'), desc: lang === 'es' ? 'km/h, mph, m/s, nudos y Mach.' : (lang === 'de' ? 'km/h, mph, m/s, Knoten und Mach.' : 'km/h, mph, m/s e nós.') },
    { id: 'file-media', icon: '📁', name: lang === 'es' ? 'Archivos y Medios' : (lang === 'de' ? 'Dateien & Medien' : 'Arquivos'), desc: lang === 'es' ? 'Conversión de imágenes PNG, JPG, WebP y JSON/CSV.' : (lang === 'de' ? 'PNG, JPG, WebP und JSON/CSV lokal im Browser.' : 'Imagens PNG, JPG, WebP e JSON/CSV.') }
  ];

  const cardsHtml = tools.map(t => {
    return `      <a href="/${lang}/${t.id}" class="smallpdf-tool-card">
        <div>
          <div class="smallpdf-card-icon">${t.icon}</div>
          <div class="smallpdf-card-title">${t.name}</div>
          <div class="smallpdf-card-desc">${t.desc}</div>
        </div>
        <div class="smallpdf-card-action">&rarr;</div>
      </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${makeHead(lang, meta.title, meta.desc, 'index')}
</head>
<body>
${makeHeader(lang, 'home', 'index')}

  <main style="max-width: 1150px; width: 100%;">
    <section class="smallpdf-hero">
      <h1 class="smallpdf-hero-title">${meta.heroTitle}</h1>
      <p class="smallpdf-hero-subtitle">${meta.heroSub}</p>
    </section>

    <section class="smallpdf-tools-grid">
${cardsHtml}
    </section>
  </main>

${makeFooter(lang)}

  <script type="module" src="/app.js"></script>
</body>
</html>`;
}

// =========================================================================
// RUN THE FULL GENERATION FOR ES, DE, PT
// =========================================================================
console.log('Generating complete interactive suites for ES, DE, PT...');

const toolConfigs = {
  'weight-mass': {
    contentId: 'contentWeight',
    inputId: 'weightInput',
    fromId: 'weightFromSelect',
    toId: 'weightToSelect',
    swapId: 'weightSwapBtn',
    convertId: 'weightConvertBtn',
    clearId: 'weightClearBtn',
    resultContainerId: 'weightResultContainer',
    resultValueId: 'weightResultValue',
    formulaTextId: 'weightFormulaText',
    explanationTextId: 'weightExplanationText',
    copyBtnId: 'weightCopyBtn',
    es: { title: 'Convertidor de Peso y Masa: Kg, Libras, Stones', desc: 'Convierta kilogramos, libras, stones, gramos y onzas con fórmulas exactas.', h1: 'Convertidor de Peso y Masa', sub: 'Conversor métrico e imperial de masa corporal y peso.', val: 'Valor de Peso', from: 'Unidad de Origen', to: 'Unidad de Destino', btnConvert: 'Convertir', btnClear: 'Limpiar', btnCopy: 'Copiar' },
    de: { title: 'Gewichts- & Masse-Umrechner | kg, Pfund, Stone, Gramm', desc: 'Rechnen Sie Kilogramm in Pfund, Stone, Gramm und Unzen sekundenschnell um.', h1: 'Gewichts- & Masse-Umrechner', sub: 'Metrische und imperiale Gewichtseinheiten exakt berechnen.', val: 'Gewichtswert', from: 'Ausgangseinheit', to: 'Zieleinheit', btnConvert: 'Umrechnen', btnClear: 'Zurücksetzen', btnCopy: 'Kopieren' },
    pt: { title: 'Conversor de Peso e Massa: Quilos, Libras, Stones', desc: 'Converta quilos, libras, stones, gramas e onças com cálculo imediato.', h1: 'Conversor de Peso e Massa', sub: 'Conversão instantânea entre quilogramas, libras e stones.', val: 'Valor de Peso', from: 'Unidade de Origem', to: 'Unidade de Destino', btnConvert: 'Converter', btnClear: 'Limpar', btnCopy: 'Copiar' }
  },
  'volume-capacity': {
    contentId: 'contentVolume',
    inputId: 'volumeInput',
    fromId: 'volumeFromSelect',
    toId: 'volumeToSelect',
    swapId: 'volumeSwapBtn',
    convertId: 'volumeConvertBtn',
    clearId: 'volumeClearBtn',
    resultContainerId: 'volumeResultContainer',
    resultValueId: 'volumeResultValue',
    formulaTextId: 'volumeFormulaText',
    explanationTextId: 'volumeExplanationText',
    copyBtnId: 'volumeCopyBtn',
    es: { title: 'Convertidor de Volumen y Capacidad Líquida', desc: 'Convierta litros, galones, mililitros, tazas y onzas líquidas con cálculo instantáneo.', h1: 'Convertidor de Volumen y Capacidad', sub: 'Conversor de medidas de cocina y volumen líquido.', val: 'Valor de Volumen', from: 'Unidad de Origen', to: 'Unidad de Destino', btnConvert: 'Convertir', btnClear: 'Limpiar', btnCopy: 'Copiar' },
    de: { title: 'Volumen- & Hohlmaß-Umrechner | Liter, Gallonen, Milliliter', desc: 'Rechnen Sie Liter in Gallonen, Milliliter, Tassen und Flüssigunzen um.', h1: 'Volumen- & Hohlmaß-Umrechner', sub: 'Küchen- und Flüssigkeitsmaße sekundenschnell berechnen.', val: 'Volumenwert', from: 'Ausgangseinheit', to: 'Zieleinheit', btnConvert: 'Umrechnen', btnClear: 'Zurücksetzen', btnCopy: 'Kopieren' },
    pt: { title: 'Conversor de Volume e Capacidade Líquida', desc: 'Converta litros, galões, mililitros, xícaras e onças fluidas.', h1: 'Conversor de Volume e Capacidade', sub: 'Conversão instantânea de medidas líquidas e culinárias.', val: 'Valor de Volume', from: 'Unidade de Origem', to: 'Unidade de Destino', btnConvert: 'Converter', btnClear: 'Limpar', btnCopy: 'Copiar' }
  },
  'time-duration': {
    contentId: 'contentTime',
    inputId: 'timeInput',
    fromId: 'timeFromSelect',
    toId: 'timeToSelect',
    swapId: 'timeSwapBtn',
    convertId: 'timeConvertBtn',
    clearId: 'timeClearBtn',
    resultContainerId: 'timeResultContainer',
    resultValueId: 'timeResultValue',
    formulaTextId: 'timeFormulaText',
    explanationTextId: 'timeExplanationText',
    copyBtnId: 'timeCopyBtn',
    es: { title: 'Convertidor de Unidades de Tiempo y Duración', desc: 'Convierta horas, minutos, segundos, días y semanas al instante.', h1: 'Convertidor de Unidades de Tiempo', sub: 'Cálculo de intervalos de tiempo y duraciones.', val: 'Valor de Tiempo', from: 'Unidad de Origen', to: 'Unidad de Destino', btnConvert: 'Convertir', btnClear: 'Limpiar', btnCopy: 'Copiar' },
    de: { title: 'Zeiteinheiten- & Dauer-Umrechner | Stunden, Minuten, Tage', desc: 'Rechnen Sie Stunden, Minuten, Sekunden, Tage und Wochen um.', h1: 'Zeiteinheiten- & Dauer-Umrechner', sub: 'Zeitintervalle und Zeitspannen sekundenschnell berechnen.', val: 'Zeitwert', from: 'Ausgangseinheit', to: 'Zieleinheit', btnConvert: 'Umrechnen', btnClear: 'Zurücksetzen', btnCopy: 'Kopieren' },
    pt: { title: 'Conversor de Unidades de Tempo e Duração', desc: 'Converta horas, minutos, segundos, dias e semanas com exatidão.', h1: 'Conversor de Unidades de Tempo', sub: 'Cálculo de intervalos de tempo e durações.', val: 'Valor de Tempo', from: 'Unidade de Origem', to: 'Unidade de Destino', btnConvert: 'Converter', btnClear: 'Limpar', btnCopy: 'Copiar' }
  },
  'area': {
    contentId: 'contentArea',
    inputId: 'areaInput',
    fromId: 'areaFromSelect',
    toId: 'areaToSelect',
    swapId: 'areaSwapBtn',
    convertId: 'areaConvertBtn',
    clearId: 'areaClearBtn',
    resultContainerId: 'areaResultContainer',
    resultValueId: 'areaResultValue',
    formulaTextId: 'areaFormulaText',
    explanationTextId: 'areaExplanationText',
    copyBtnId: 'areaCopyBtn',
    es: { title: 'Convertidor de Área y Superficie Terrestre', desc: 'Convierta metros cuadrados, pies cuadrados, acres y hectáreas.', h1: 'Convertidor de Área y Superficie', sub: 'Cálculo de terrenos, parcelas e inmuebles.', val: 'Valor de Área', from: 'Unidad de Origen', to: 'Unidad de Destino', btnConvert: 'Convertir', btnClear: 'Limpiar', btnCopy: 'Copiar' },
    de: { title: 'Flächen- & Grundstücks-Umrechner | Quadratmeter, Hektar, Acres', desc: 'Rechnen Sie Quadratmeter in Quadratfuß, Hektar und Acres um.', h1: 'Flächen- & Grundstücks-Umrechner', sub: 'Immobilien- und Grundstücksflächen sekundenschnell berechnen.', val: 'Flächenwert', from: 'Ausgangseinheit', to: 'Zieleinheit', btnConvert: 'Umrechnen', btnClear: 'Zurücksetzen', btnCopy: 'Kopieren' },
    pt: { title: 'Conversor de Área e Superfície', desc: 'Converta metros quadrados, pés quadrados, acres e hectares.', h1: 'Conversor de Área e Superfície', sub: 'Cálculo de terrenos, imóveis e áreas agrícolas.', val: 'Valor de Área', from: 'Unidade de Origem', to: 'Unidade de Destino', btnConvert: 'Converter', btnClear: 'Limpar', btnCopy: 'Copiar' }
  },
  'speed': {
    contentId: 'contentSpeed',
    inputId: 'speedInput',
    fromId: 'speedFromSelect',
    toId: 'speedToSelect',
    swapId: 'speedSwapBtn',
    convertId: 'speedConvertBtn',
    clearId: 'speedClearBtn',
    resultContainerId: 'speedResultContainer',
    resultValueId: 'speedResultValue',
    formulaTextId: 'speedFormulaText',
    explanationTextId: 'speedExplanationText',
    copyBtnId: 'speedCopyBtn',
    es: { title: 'Convertidor de Velocidad: km/h, mph, m/s, Nudos', desc: 'Convierta kilómetros por hora, millas por hora, nudos y metros por segundo.', h1: 'Convertidor de Velocidad', sub: 'Conversor de velocidad terrestre, marítima y aérea.', val: 'Valor de Velocidad', from: 'Unidad de Origen', to: 'Unidad de Destino', btnConvert: 'Convertir', btnClear: 'Limpiar', btnCopy: 'Copiar' },
    de: { title: 'Geschwindigkeits-Umrechner: km/h, mph, m/s, Knoten', desc: 'Rechnen Sie km/h in mph, m/s, Knoten und Mach sekundenschnell um.', h1: 'Geschwindigkeits-Umrechner', sub: 'Geschwindigkeiten für Straße, Luftfahrt und Schifffahrt umrechnen.', val: 'Geschwindigkeitswert', from: 'Ausgangseinheit', to: 'Zieleinheit', btnConvert: 'Umrechnen', btnClear: 'Zurücksetzen', btnCopy: 'Kopieren' },
    pt: { title: 'Conversor de Velocidade: km/h, mph, m/s, Nós', desc: 'Converta km/h para mph, m/s e nós náuticos com fórmulas exatas.', h1: 'Conversor de Velocidade', sub: 'Conversão de velocidade para trânsito, aviação e navegação.', val: 'Valor de Velocidade', from: 'Unidade de Origem', to: 'Unidade de Destino', btnConvert: 'Converter', btnClear: 'Limpar', btnCopy: 'Copiar' }
  }
};

['es', 'de', 'pt'].forEach(lang => {
  const dir = lang === 'es' ? esDir : (lang === 'de' ? deDir : ptDir);

  // Home Page
  fs.writeFileSync(path.join(dir, 'index.html'), buildHomePage(lang), 'utf8');

  // Temperature & Length
  fs.writeFileSync(path.join(dir, 'temperature.html'), buildTemperaturePage(lang), 'utf8');
  fs.writeFileSync(path.join(dir, 'length.html'), buildLengthPage(lang), 'utf8');

  // Generic Tools (Weight, Volume, Time, Area, Speed)
  Object.keys(toolConfigs).forEach(toolKey => {
    fs.writeFileSync(path.join(dir, `${toolKey}.html`), buildUnitPage(lang, toolKey, toolConfigs[toolKey]), 'utf8');
  });

  // File & Media Tool
  fs.writeFileSync(path.join(dir, 'file-media.html'), buildFileMediaPage(lang), 'utf8');
});

console.log('All core tool pages in ES, DE, and PT successfully rebuilt with full interactive cards!');
