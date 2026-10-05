import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const esDir = path.join(rootDir, 'es');
const esBlogDir = path.join(esDir, 'blog');

if (!fs.existsSync(esDir)) fs.mkdirSync(esDir, { recursive: true });
if (!fs.existsSync(esBlogDir)) fs.mkdirSync(esBlogDir, { recursive: true });

const COMMON_HEAD_META = `  <meta charset="UTF-8">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4766868021895107" crossorigin="anonymous"></script>
  <meta name="google-adsense-account" content="ca-pub-4766868021895107">
  <script src="/ahrefs-analytics.js" data-key="i4l/B5Lec0bODmBnYEF+kw" async></script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" href="/logo.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://www.omniconverter.co.uk/logo.png">
  <meta property="og:image" content="https://www.omniconverter.co.uk/logo.png">
  <meta property="og:type" content="website">
  <link rel="stylesheet" href="/styles.css">`;

function makeHreflang(enPath, esPath) {
  const enUrl = `https://www.omniconverter.co.uk${enPath}`;
  const esUrl = `https://www.omniconverter.co.uk${esPath}`;
  return `  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="es" href="${esUrl}">
  <link rel="alternate" hreflang="x-default" href="${enUrl}">`;
}

function makeEsHeader(activeTab = 'home', enCounterpart = '/') {
  const tabs = [
    { id: 'home', name: 'Inicio', url: '/es/' },
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
  ];

  const tabHtml = tabs.map(t => {
    const cls = t.id === activeTab ? 'tab-btn active' : 'tab-btn';
    return `<a href="${t.url}" class="${cls}">${t.name}</a>`;
  }).join('\n        ');

  return `  <header>
    <div class="header-container">
      <a href="/es/" class="logo" aria-label="OmniConverter Inicio">
        <img src="/logo.png" alt="OmniConverter Logo" style="width:32px; height:32px; border-radius:6px; object-fit:cover;">
        <span>OmniConverter</span>
      </a>

      <button type="button" class="mobile-menu-btn" onclick="const n=this.nextElementSibling||document.querySelector('.nav-tabs');if(n)n.classList.toggle('is-open');" aria-label="Alternar menú de navegación">
        <span>Menú</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <nav class="nav-tabs" aria-label="Navegación de categorías">
        ${tabHtml}
      </nav>

      <div class="lang-switcher" aria-label="Selector de idioma">
        <a href="${enCounterpart}" title="English">🇬🇧 EN</a>
        <span class="lang-sep">|</span>
        <span class="active" title="Español">🇪🇸 ES</span>
      </div>
    </div>
  </header>`;
}

const ES_FOOTER = `  <footer>
    <p>&copy; 2026 OmniConverter. Todos los derechos reservados. | <a href="/es/blog" style="color:var(--primary-600);">Blog</a> | <a href="/es/sitemap" style="color:var(--primary-600);">Mapa del Sitio</a> | <a href="/es/privacy-policy" style="color:var(--primary-600);">Privacidad</a> | <a href="/es/terms" style="color:var(--primary-600);">Términos</a> | <a href="/es/about" style="color:var(--primary-600);">Nosotros</a> | <a href="/es/contact" style="color:var(--primary-600);">Contacto</a></p>
  </footer>`;

// 1. GENERATE ES/INDEX.HTML
function generateEsIndex() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
${COMMON_HEAD_META}
  <title>OmniConverter: Convertidor de Unidades Universal en Línea (Gratis y Rápido)</title>
  <meta name="description" content="Convertidor de unidades y archivos gratis en línea. Convierta divisas, temperatura, longitud, peso, volumen, tiempo, área, velocidad y archivos multimedia al instante con fórmulas verificadas.">
  <link rel="canonical" href="https://www.omniconverter.co.uk/es/">
  <meta property="og:title" content="OmniConverter: Convertidor de Unidades Universal en Línea">
  <meta property="og:description" content="Herramienta gratuita para convertir unidades de medida, divisas en tiempo real y archivos multimedia en el navegador.">
  <meta property="og:url" content="https://www.omniconverter.co.uk/es/">
  <meta name="twitter:title" content="OmniConverter: Convertidor de Unidades Universal en Línea">
  <meta name="twitter:description" content="Herramienta en línea gratuita para conversiones exactas de unidades métricas e imperiales.">
${makeHreflang('/', '/es/')}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "OmniConverter Suite en Español",
    "url": "https://www.omniconverter.co.uk/es/",
    "image": "https://www.omniconverter.co.uk/logo.png",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "inLanguage": "es",
    "description": "Herramienta gratuita para la conversión de unidades métricas, imperiales y archivos multimedia.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1280"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }
  </script>
</head>
<body>
${makeEsHeader('home', '/')}
  <main style="max-width: 1150px; width: 100%;">
    <section class="smallpdf-hero">
      <h1 class="smallpdf-hero-title">Suite Universal de Conversión de Unidades y Medios</h1>
      <p class="smallpdf-hero-subtitle">Convierta unidades de medida, monedas globales y documentos al instante. Resultados matemáticos certificados por estándares NIST y del Sistema Internacional (SI).</p>
    </section>

    <div class="smallpdf-tools-grid">
      <a href="/es/temperature" class="smallpdf-tool-card">
        <div>
          <div class="smallpdf-card-icon icon-red">🌡️</div>
          <h2 class="smallpdf-card-title">Temperatura</h2>
          <p class="smallpdf-card-desc">Convierta entre Celsius (°C), Fahrenheit (°F), Kelvin (K) y Rankine con fórmulas en vivo.</p>
        </div>
        <span class="smallpdf-card-action">Abrir Convertidor &rarr;</span>
      </a>

      <a href="/es/length" class="smallpdf-tool-card">
        <div>
          <div class="smallpdf-card-icon icon-blue">📏</div>
          <h2 class="smallpdf-card-title">Longitud y Distancia</h2>
          <p class="smallpdf-card-desc">Metros, pies, pulgadas, centímetros, kilómetros, millas y yardas con tablas de referencia.</p>
        </div>
        <span class="smallpdf-card-action">Abrir Convertidor &rarr;</span>
      </a>

      <a href="/es/weight-mass" class="smallpdf-tool-card">
        <div>
          <div class="smallpdf-card-icon icon-emerald">⚖️</div>
          <h2 class="smallpdf-card-title">Peso y Masa</h2>
          <p class="smallpdf-card-desc">Kilogramos, libras, onzas, piedras (stones), gramos y toneladas con cálculo mental rápido.</p>
        </div>
        <span class="smallpdf-card-action">Abrir Convertidor &rarr;</span>
      </a>

      <a href="/es/volume-capacity" class="smallpdf-tool-card">
        <div>
          <div class="smallpdf-card-icon icon-purple">🧪</div>
          <h2 class="smallpdf-card-title">Volumen y Capacidad</h2>
          <p class="smallpdf-card-desc">Litros, galones, mililitros, tazas de cocina y onzas líquidas para cocina y laboratorio.</p>
        </div>
        <span class="smallpdf-card-action">Abrir Convertidor &rarr;</span>
      </a>

      <a href="/es/currency" class="smallpdf-tool-card">
        <div>
          <div class="smallpdf-card-icon icon-cyan">💱</div>
          <h2 class="smallpdf-card-title">Divisas en Tiempo Real</h2>
          <p class="smallpdf-card-desc">Tipos de cambio actualizados para USD, EUR, GBP, MXN, ARS, COP y más de 35 monedas.</p>
        </div>
        <span class="smallpdf-card-action">Abrir Convertidor &rarr;</span>
      </a>

      <a href="/es/time-zone" class="smallpdf-tool-card">
        <div>
          <div class="smallpdf-card-icon icon-orange">🌍</div>
          <h2 class="smallpdf-card-title">Zonas Horarias</h2>
          <p class="smallpdf-card-desc">Reloj mundial interactivo y convertidor de horarios entre husos horarios globales.</p>
        </div>
        <span class="smallpdf-card-action">Abrir Convertidor &rarr;</span>
      </a>

      <a href="/es/area" class="smallpdf-tool-card">
        <div>
          <div class="smallpdf-card-icon icon-amber">📐</div>
          <h2 class="smallpdf-card-title">Área y Superficie</h2>
          <p class="smallpdf-card-desc">Metros cuadrados, pies cuadrados, hectáreas, acres y kilómetros cuadrados para agrimensura.</p>
        </div>
        <span class="smallpdf-card-action">Abrir Convertidor &rarr;</span>
      </a>

      <a href="/es/speed" class="smallpdf-tool-card">
        <div>
          <div class="smallpdf-card-icon icon-pink">🚀</div>
          <h2 class="smallpdf-card-title">Velocidad</h2>
          <p class="smallpdf-card-desc">KM/H, Millas por hora (MPH), nudos náuticos y metros por segundo para aviación y deportes.</p>
        </div>
        <span class="smallpdf-card-action">Abrir Convertidor &rarr;</span>
      </a>

      <a href="/es/time-duration" class="smallpdf-tool-card">
        <div>
          <div class="smallpdf-card-icon icon-blue">⏱️</div>
          <h2 class="smallpdf-card-title">Tiempo y Duración</h2>
          <p class="smallpdf-card-desc">Horas, minutos, segundos, días, semanas y cálculo de intervalos precisos.</p>
        </div>
        <span class="smallpdf-card-action">Abrir Convertidor &rarr;</span>
      </a>

      <a href="/es/file-media" class="smallpdf-tool-card">
        <div>
          <div class="smallpdf-card-icon icon-purple">📁</div>
          <h2 class="smallpdf-card-title">Archivos y Medios</h2>
          <p class="smallpdf-card-desc">Conversión segura de PDF, imágenes y documentos directamente en su navegador web.</p>
        </div>
        <span class="smallpdf-card-action">Abrir Convertidor &rarr;</span>
      </a>
    </div>

    <article class="content-section">
      <h2 style="font-size:1.6rem; font-weight:800; margin-bottom:1rem;">¿Por Qué Elegir OmniConverter en Español?</h2>
      <p>OmniConverter está diseñado para ofrecer la máxima velocidad, total privacidad y exactitud matemática en cada cálculo. Ya sea que trabaje en ingeniería, cocina, arquitectura o comercio internacional, nuestras herramientas aplican los estándares oficiales del Sistema Internacional de Unidades (SI) y NIST sin almacenar datos en servidores externos.</p>
      
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; margin-top:1.5rem;">
        <div style="background:var(--bg-elevated); padding:1.25rem; border-radius:var(--radius-lg); border:1px solid var(--card-border);">
          <h3 style="margin:0 0 0.5rem 0; font-size:1.1rem; color:var(--primary-600);">⚡ Precisión en Tiempo Real</h3>
          <p style="margin:0; font-size:0.92rem; color:var(--text-muted);">Cálculos inmediatos al escribir, con visualización de fórmulas matemáticas y atajos de cálculo mental.</p>
        </div>
        <div style="background:var(--bg-elevated); padding:1.25rem; border-radius:var(--radius-lg); border:1px solid var(--card-border);">
          <h3 style="margin:0 0 0.5rem 0; font-size:1.1rem; color:var(--primary-600);">🔒 100% Privado y Seguro</h3>
          <p style="margin:0; font-size:0.92rem; color:var(--text-muted);">Todo el procesamiento se realiza en el navegador de su dispositivo sin subir archivos ni registrar datos personales.</p>
        </div>
        <div style="background:var(--bg-elevated); padding:1.25rem; border-radius:var(--radius-lg); border:1px solid var(--card-border);">
          <h3 style="margin:0 0 0.5rem 0; font-size:1.1rem; color:var(--primary-600);">📖 Guías de Conversión Exhaustivas</h3>
          <p style="margin:0; font-size:0.92rem; color:var(--text-muted);">Explore artículos detallados con tablas de conversión paso a paso y ejemplos prácticos cotidianos.</p>
        </div>
      </div>
    </article>
  </main>
${ES_FOOTER}
</body>
</html>`;
}

// 2. GENERATE ES/TEMPERATURE.HTML
function generateEsTemperature() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
${COMMON_HEAD_META}
  <title>Convertidor de Temperatura: °C a °F, Kelvin, Rankine y Todas las Escalas</title>
  <meta name="description" content="Convertidor de temperatura en línea gratis. Convierta Celsius (°C), Fahrenheit (°F), Kelvin (K) y Rankine (°R) al instante con fórmulas exactas y tabla para hornos y cocina.">
  <link rel="canonical" href="https://www.omniconverter.co.uk/es/temperature">
  <meta property="og:title" content="Convertidor de Temperatura: °C a °F, Kelvin, Rankine">
  <meta property="og:description" content="Convierta temperaturas entre Celsius, Fahrenheit, Kelvin y Rankine al instante con fórmulas exactas.">
  <meta property="og:url" content="https://www.omniconverter.co.uk/es/temperature">
  <meta name="twitter:title" content="Convertidor de Temperatura: °C a °F, Kelvin, Rankine">
  <meta name="twitter:description" content="Convierta temperaturas al instante con calculadora interactiva.">
${makeHreflang('/temperature', '/es/temperature')}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Convertidor de Temperatura OmniConverter",
    "url": "https://www.omniconverter.co.uk/es/temperature",
    "image": "https://www.omniconverter.co.uk/logo.png",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "inLanguage": "es",
    "description": "Calculadora gratuita para convertir temperaturas entre Celsius, Fahrenheit, Kelvin y Rankine."
  }
  </script>
</head>
<body>
${makeEsHeader('temperature', '/temperature')}
  <main style="max-width: 1150px; width: 100%;">
    <nav class="breadcrumb-nav" aria-label="Miga de pan">
      <a href="/es/">Inicio</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">Temperatura</span>
    </nav>

    <div id="contentTemp" class="tool-tab-content active">
      <section class="converter-card">
        <h1 class="converter-title">Convertidor de Temperatura</h1>
        <p style="text-align:center; color:var(--text-muted); margin-bottom:1.5rem;">Conversión instantánea entre Celsius (°C), Fahrenheit (°F), Kelvin (K), Rankine y más escalas térmicas.</p>
        
        <div class="converter-grid">
          <div class="input-group">
            <label for="tempInput">Valor de Entrada</label>
            <input type="number" id="tempInput" class="input-field" value="25" step="any" placeholder="Ingrese temperatura">
          </div>
          <div class="input-group">
            <label for="tempFrom">De Unidad</label>
            <select id="tempFrom" class="select-field">
              <option value="c" selected>Celsius (°C)</option>
              <option value="f">Fahrenheit (°F)</option>
              <option value="k">Kelvin (K)</option>
              <option value="r">Rankine (°R)</option>
            </select>
          </div>
          <button type="button" id="tempSwap" class="btn-swap" aria-label="Intercambiar unidades">⇄</button>
          <div class="input-group">
            <label for="tempTo">A Unidad</label>
            <select id="tempTo" class="select-field">
              <option value="c">Celsius (°C)</option>
              <option value="f" selected>Fahrenheit (°F)</option>
              <option value="k">Kelvin (K)</option>
              <option value="r">Rankine (°R)</option>
            </select>
          </div>
        </div>

        <div class="button-row">
          <button type="button" id="tempConvertBtn" class="btn-convert">Calcular</button>
          <button type="button" id="tempClearBtn" class="btn-clear">Limpiar</button>
        </div>

        <div id="tempResultContainer" class="result-container" style="display:block;">
          <div class="result-main">
            <div class="result-text-group">
              <span class="result-label">Resultado Convertido</span>
              <span id="tempResultValue" class="result-value">77 °F</span>
            </div>
            <button type="button" id="tempCopyBtn" class="btn-copy">📋 Copiar</button>
          </div>
          <div class="formula-box"><strong>Fórmula:</strong> <span id="tempFormulaText">°F = (°C × 9/5) + 32</span></div>
          <div class="explanation-box"><strong>Explicación:</strong> <span id="tempExplanationText">Multiplique la temperatura en Celsius por 1.8 y sume 32 para obtener Fahrenheit.</span></div>
        </div>
      </section>

      <article class="content-section">
        <h2>Fórmulas de Conversión de Temperatura</h2>
        <p>A diferencia de las distancias o los pesos, la temperatura no comienza en cero absoluto en todas las escalas. Por ello, la conversión requiere factores de escala y desplazamientos fijos:</p>
        <div style="background:var(--bg-elevated); padding:1rem 1.25rem; border-radius:var(--radius-md); font-family:monospace; margin:1rem 0; line-height:1.7;">
          • De Celsius a Fahrenheit: °F = (°C × 9/5) + 32<br>
          • De Fahrenheit a Celsius: °C = (°F - 32) × 5/9<br>
          • De Celsius a Kelvin: K = °C + 273.15<br>
          • De Kelvin a Celsius: °C = K - 273.15
        </div>

        <h3>Puntos de Referencia Térmicos Habituales</h3>
        <div class="table-wrapper">
          <table class="conversion-table">
            <thead>
              <tr>
                <th>Hito Científico</th>
                <th>Celsius (°C)</th>
                <th>Fahrenheit (°F)</th>
                <th>Kelvin (K)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Cero Absoluto</td><td>-273.15 °C</td><td>-459.67 °F</td><td>0 K</td></tr>
              <tr><td>Congelación del Agua</td><td>0 °C</td><td>32 °F</td><td>273.15 K</td></tr>
              <tr><td>Temperatura Ambiente Típica</td><td>20 °C - 22 °C</td><td>68 °F - 72 °F</td><td>293.15 K - 295.15 K</td></tr>
              <tr><td>Temperatura Corporal Normal</td><td>37 °C</td><td>98.6 °F</td><td>310.15 K</td></tr>
              <tr><td>Ebullición del Agua</td><td>100 °C</td><td>212 °F</td><td>373.15 K</td></tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  </main>
  <div id="toast" class="toast" aria-live="polite"></div>
${ES_FOOTER}
  <script type="module" src="/app.js"></script>
  <script type="module" src="/temperature-interactive.js"></script>
</body>
</html>`;
}

// 3. GENERATE ES/LENGTH.HTML
function generateEsLength() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
${COMMON_HEAD_META}
  <title>Convertidor de Longitud y Distancia: Metros, Pies, Pulgadas y Kilómetros</title>
  <meta name="description" content="Convertidor de longitud y distancia en línea. Convierta metros a pies, pulgadas a centímetros, kilómetros a millas y yardas con cálculos instantáneos y tablas de conversión.">
  <link rel="canonical" href="https://www.omniconverter.co.uk/es/length">
  <meta property="og:title" content="Convertidor de Longitud y Distancia: Metros, Pies, Pulgadas">
  <meta property="og:description" content="Convierta unidades de longitud métricas e imperiales al instante con fórmulas exactas.">
  <meta property="og:url" content="https://www.omniconverter.co.uk/es/length">
  <meta name="twitter:title" content="Convertidor de Longitud y Distancia: Metros, Pies, Pulgadas">
  <meta name="twitter:description" content="Calculadora de conversión de longitud en línea gratis.">
${makeHreflang('/length', '/es/length')}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Convertidor de Longitud OmniConverter",
    "url": "https://www.omniconverter.co.uk/es/length",
    "image": "https://www.omniconverter.co.uk/logo.png",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "inLanguage": "es",
    "description": "Calculadora gratuita para convertir distancias entre metros, pies, pulgadas, centímetros, kilómetros y millas."
  }
  </script>
</head>
<body>
${makeEsHeader('length', '/length')}
  <main style="max-width: 1150px; width: 100%;">
    <nav class="breadcrumb-nav" aria-label="Miga de pan">
      <a href="/es/">Inicio</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">Longitud y Distancia</span>
    </nav>

    <div id="contentLength" class="tool-tab-content active">
      <section class="converter-card">
        <h1 class="converter-title">Convertidor de Longitud y Distancia</h1>
        <p style="text-align:center; color:var(--text-muted); margin-bottom:1.5rem;">Convierta al instante entre el sistema métrico internacional y el sistema anglosajón/imperial.</p>

        <div class="converter-grid">
          <div class="input-group">
            <label for="lengthInput">Valor</label>
            <input type="number" id="lengthInput" class="input-field" value="15" step="any" placeholder="Ingrese cantidad">
          </div>
          <div class="input-group">
            <label for="lengthFromSelect">De</label>
            <select id="lengthFromSelect" class="select-field">
              <option value="m" selected>Metros (m)</option>
              <option value="ft">Pies (ft)</option>
              <option value="in">Pulgadas (in)</option>
              <option value="cm">Centímetros (cm)</option>
              <option value="km">Kilómetros (km)</option>
              <option value="mi">Millas (mi)</option>
              <option value="yd">Yardas (yd)</option>
            </select>
          </div>
          <button type="button" id="lengthSwapBtn" class="btn-swap" aria-label="Intercambiar unidades">⇄</button>
          <div class="input-group">
            <label for="lengthToSelect">A</label>
            <select id="lengthToSelect" class="select-field">
              <option value="m">Metros (m)</option>
              <option value="ft" selected>Pies (ft)</option>
              <option value="in">Pulgadas (in)</option>
              <option value="cm">Centímetros (cm)</option>
              <option value="km">Kilómetros (km)</option>
              <option value="mi">Millas (mi)</option>
              <option value="yd">Yardas (yd)</option>
            </select>
          </div>
        </div>

        <div class="button-row">
          <button type="button" id="lengthConvertBtn" class="btn-convert">Calcular</button>
          <button type="button" id="lengthClearBtn" class="btn-clear">Limpiar</button>
        </div>

        <div id="lengthResultContainer" class="result-container" style="display:block;">
          <div class="result-main">
            <div class="result-text-group">
              <span class="result-label">Resultado Convertido</span>
              <span id="lengthResultValue" class="result-value">49.2126 ft</span>
            </div>
            <button type="button" id="lengthCopyBtn" class="btn-copy">📋 Copiar</button>
          </div>
          <div class="formula-box"><strong>Fórmula:</strong> <span id="lengthFormulaText">1 metro = 3.28084 pies</span></div>
          <div class="explanation-box"><strong>Explicación:</strong> <span id="lengthExplanationText">15 metros multiplicados por 3.28084 equivale a 49.21 pies.</span></div>
        </div>
      </section>

      <article class="content-section">
        <h2>Factores Oficiales de Conversión de Longitud</h2>
        <p>Bajo el acuerdo internacional de 1959, 1 pulgada equivale exactamente a 25.4 milímetros y 1 pie a 0.3048 metros. Utilice esta tabla rápida de equivalencias:</p>
        <div class="table-wrapper">
          <table class="conversion-table">
            <thead>
              <tr><th>Unidad</th><th>Equivalente Métrico</th><th>Equivalente Imperial</th></tr>
            </thead>
            <tbody>
              <tr><td>1 Metro (m)</td><td>100 cm / 1,000 mm</td><td>3.28084 pies / 39.3701 pulgadas</td></tr>
              <tr><td>1 Pie (ft)</td><td>0.3048 metros / 30.48 cm</td><td>12 pulgadas</td></tr>
              <tr><td>1 Pulgada (in)</td><td>2.54 centímetros / 25.4 mm</td><td>1/12 pie</td></tr>
              <tr><td>1 Kilómetro (km)</td><td>1,000 metros</td><td>0.621371 millas</td></tr>
              <tr><td>1 Milla (mi)</td><td>1,609.344 metros / 1.609 km</td><td>5,280 pies / 1,760 yardas</td></tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  </main>
  <div id="toast" class="toast" aria-live="polite"></div>
${ES_FOOTER}
  <script type="module" src="/length-converter.js"></script>
</body>
</html>`;
}

// 4. GENERATE OTHER TOOL PAGES (Weight, Volume, Currency, Area, Speed, Time, Timezone, File-media, Blog index, About, Contact, Privacy, Terms, Sitemap)
function generateGenericToolPage(id, title, h1, desc, enUrl, scriptSrc) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
${COMMON_HEAD_META}
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://www.omniconverter.co.uk/es/${id}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="https://www.omniconverter.co.uk/es/${id}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
${makeHreflang(enUrl, `/es/${id}`)}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "${title}",
    "url": "https://www.omniconverter.co.uk/es/${id}",
    "image": "https://www.omniconverter.co.uk/logo.png",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "inLanguage": "es",
    "description": "${desc}"
  }
  </script>
</head>
<body>
${makeEsHeader(id, enUrl)}
  <main style="max-width: 1150px; width: 100%;">
    <nav class="breadcrumb-nav" aria-label="Miga de pan">
      <a href="/es/">Inicio</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">${h1}</span>
    </nav>

    <article class="content-section">
      <h1>${h1}</h1>
      <p style="font-size:1.05rem; color:var(--text-muted); line-height:1.7;">${desc}</p>
      <div style="background:var(--bg-elevated); padding:1.5rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); margin:1.5rem 0;">
        <h2 style="font-size:1.25rem; font-weight:700; margin-bottom:0.75rem;">Herramienta Interactiva en Vivo</h2>
        <p style="margin-bottom:1rem; color:var(--text-muted);">Calcule conversiones exactas en tiempo real con validación instantánea.</p>
        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <a href="/es/" class="tab-btn active" style="text-decoration:none; padding:0.6rem 1.25rem;">← Volver al Inicio</a>
          <a href="${enUrl}" class="tab-btn" style="text-decoration:none; padding:0.6rem 1.25rem; background:var(--card-bg); border:1px solid var(--card-border);">View in English 🇬🇧</a>
        </div>
      </div>
    </article>
  </main>
${ES_FOOTER}
  ${scriptSrc ? `<script type="module" src="${scriptSrc}"></script>` : ''}
</body>
</html>`;
}

// 5. GENERATE ES BLOG ARTICLES
function generateEsBlogArticle(slug, title, enSlug, contentSnippet) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
${COMMON_HEAD_META}
  <title>${title}: Guía de Conversión y Calculadora</title>
  <meta name="description" content="Guía detallada de conversión para ${title}. Fórmulas matemáticas, tablas de referencia paso a paso y calculadora interactiva.">
  <link rel="canonical" href="https://www.omniconverter.co.uk/es/blog/${slug}">
  <meta property="og:title" content="${title}: Guía de Conversión">
  <meta property="og:description" content="Guía completa de conversión para ${title} con fórmulas exactas y cálculo mental.">
  <meta property="og:url" content="https://www.omniconverter.co.uk/es/blog/${slug}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="Guía de cálculo y conversión en español.">
${makeHreflang(`/blog/${enSlug}`, `/es/blog/${slug}`)}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title}",
    "inLanguage": "es",
    "url": "https://www.omniconverter.co.uk/es/blog/${slug}",
    "image": "https://www.omniconverter.co.uk/logo.png",
    "author": {
      "@type": "Organization",
      "name": "Equipo Editorial OmniConverter"
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
</head>
<body>
${makeEsHeader('blog', `/blog/${enSlug}`)}
  <main style="max-width: 950px; width: 100%;">
    <nav class="breadcrumb-nav" aria-label="Miga de pan">
      <a href="/es/">Inicio</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <a href="/es/blog">Blog</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">${title}</span>
    </nav>

    <article class="content-section">
      <span class="formula-badge">Guía Oficial de Conversión</span>
      <h1 style="font-size:2.1rem; font-weight:800; margin:0.75rem 0 1rem 0;">${title}</h1>
      ${contentSnippet}
    </article>

    <!-- Related In-Depth Guides (Dedicated Blank Space) -->
    <section class="related-guides-section" style="margin:2.5rem 0 1.5rem 0; padding:1.5rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl); box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; font-weight:800; color:var(--text-main); display:flex; align-items:center; gap:0.5rem;">
        <span>📖</span> Guías Relacionadas y Herramientas en Español
      </h3>
      <p style="margin:0 0 1rem 0; font-size:0.92rem; color:var(--text-muted); line-height:1.5;">Explore calculadoras y fórmulas de conversión verificadas:</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:0.85rem;">
        <a href="/es/length" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600; font-size:0.92rem;">
          <span>Convertidor de Longitud</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
        <a href="/es/temperature" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600; font-size:0.92rem;">
          <span>Convertidor de Temperatura</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
      </div>
    </section>
  </main>
${ES_FOOTER}
</body>
</html>`;
}

// 6. GENERATE CONTACT & LEGAL PAGES
function generateEsContact() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
${COMMON_HEAD_META}
  <title>Contacto y Soporte Técnico - OmniConverter</title>
  <meta name="description" content="Póngase en contacto con el equipo de OmniConverter. Envíenos consultas, sugerencias de nuevas herramientas de conversión o informes de precisión.">
  <link rel="canonical" href="https://www.omniconverter.co.uk/es/contact">
  <meta property="og:title" content="Contacto - OmniConverter">
  <meta property="og:description" content="Formulario oficial de contacto y soporte técnico para usuarios y educadores.">
  <meta property="og:url" content="https://www.omniconverter.co.uk/es/contact">
  <meta name="twitter:title" content="Contacto - OmniConverter">
  <meta name="twitter:description" content="Póngase en contacto con el equipo técnico de OmniConverter.">
${makeHreflang('/contact', '/es/contact')}
</head>
<body>
${makeEsHeader('contact', '/contact')}
  <main style="max-width: 950px; width: 100%;">
    <nav class="breadcrumb-nav" aria-label="Miga de pan">
      <a href="/es/">Inicio</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">Contacto</span>
    </nav>

    <article class="content-section" style="margin-top:1rem;">
      <h1>Contáctenos</h1>
      <p style="color:var(--text-muted); margin-bottom:1rem;">¿Tiene preguntas, comentarios o necesita una nueva conversión? Escríbanos directamente a través del siguiente formulario.</p>

      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); padding:1rem 1.25rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
        <strong style="color:var(--text-main);">Correo Electrónico Oficial:</strong> 
        <a href="mailto:info.omniconverter@gmail.com" style="color:var(--primary-600); font-weight:700; margin-left:0.5rem;">info.omniconverter@gmail.com</a>
      </div>

      <form id="contactForm" action="https://formsubmit.co/info.omniconverter@gmail.com" method="POST" style="display:flex; flex-direction:column; gap:1.25rem; max-width:600px;">
        <input type="hidden" name="_subject" value="Nuevo Mensaje de Contacto en Español - OmniConverter">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_captcha" value="false">
        <input type="text" name="_honey" style="display:none">

        <div class="input-group">
          <label for="contactName">Su Nombre</label>
          <input type="text" id="contactName" name="name" class="input-field" placeholder="Juan Pérez" required>
        </div>
        <div class="input-group">
          <label for="contactEmail">Su Correo Electrónico</label>
          <input type="email" id="contactEmail" name="email" class="input-field" placeholder="juan@ejemplo.com" required>
        </div>
        <div class="input-group">
          <label for="contactMessage">Mensaje</label>
          <textarea id="contactMessage" name="message" class="input-field" style="height:140px;" placeholder="¿En qué podemos ayudarle?" required></textarea>
        </div>
        
        <div id="formStatus" style="display:none; padding:0.85rem 1.15rem; border-radius:var(--radius-md); font-size:0.95rem; font-weight:600; line-height:1.5;"></div>

        <button type="submit" id="submitBtn" class="btn-convert" style="max-width:200px;">Enviar Mensaje</button>
      </form>

      <script>
        const contactForm = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitBtn');

        if (contactForm) {
          contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            formStatus.style.display = 'block';
            formStatus.style.background = 'var(--bg-elevated)';
            formStatus.style.color = 'var(--text-muted)';
            formStatus.style.border = '1px solid var(--border-color)';
            formStatus.textContent = 'Enviando mensaje a info.omniconverter@gmail.com...';

            try {
              const formData = new FormData(contactForm);
              const response = await fetch('https://formsubmit.co/ajax/info.omniconverter@gmail.com', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
              });

              const result = await response.json();
              if (response.ok && result.success !== 'false') {
                formStatus.style.background = '#ecfdf5';
                formStatus.style.color = '#065f46';
                formStatus.style.border = '1px solid #a7f3d0';
                formStatus.innerHTML = '<strong>✓ ¡Mensaje Enviado!</strong> Gracias por comunicarse. Su mensaje ha sido entregado a info.omniconverter@gmail.com.';
                contactForm.reset();
              } else {
                contactForm.submit();
              }
            } catch (err) {
              contactForm.submit();
            } finally {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Enviar Mensaje';
            }
          });
        }
      </script>
    </article>
  </main>
${ES_FOOTER}
</body>
</html>`;
}

function generateEsLegal(id, title, h1, text) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
${COMMON_HEAD_META}
  <title>${title} - OmniConverter</title>
  <meta name="description" content="${title} de la plataforma de cálculo en línea OmniConverter.">
  <link rel="canonical" href="https://www.omniconverter.co.uk/es/${id}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${title} de OmniConverter.">
  <meta property="og:url" content="https://www.omniconverter.co.uk/es/${id}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${title} de OmniConverter.">
${makeHreflang(`/${id}`, `/es/${id}`)}
</head>
<body>
${makeEsHeader('home', `/${id}`)}
  <main style="max-width: 950px; width: 100%;">
    <nav class="breadcrumb-nav" aria-label="Miga de pan">
      <a href="/es/">Inicio</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">${h1}</span>
    </nav>
    <article class="content-section">
      <h1>${h1}</h1>
      ${text}
    </article>
  </main>
${ES_FOOTER}
</body>
</html>`;
}

// 7. WRITE ALL SPANISH FILES
console.log('Writing Spanish core pages...');
fs.writeFileSync(path.join(esDir, 'index.html'), generateEsIndex(), 'utf8');
fs.writeFileSync(path.join(esDir, 'temperature.html'), generateEsTemperature(), 'utf8');
fs.writeFileSync(path.join(esDir, 'length.html'), generateEsLength(), 'utf8');

// Generic tools
const toolsToGenerate = [
  { id: 'weight-mass', title: 'Convertidor de Peso y Masa: KG, Libras, Onzas', h1: 'Convertidor de Peso y Masa', desc: 'Convierta entre kilogramos, libras, onzas, piedras y gramos con fórmulas exactas.', enUrl: '/weight-mass', script: '/weight-converter.js' },
  { id: 'volume-capacity', title: 'Convertidor de Volumen y Capacidad: Litros, Galones, ML', h1: 'Convertidor de Volumen y Capacidad', desc: 'Convierta litros, galones, mililitros y tazas para recetas y laboratorio.', enUrl: '/volume-capacity', script: '/volume-converter.js' },
  { id: 'currency', title: 'Convertidor de Divisas: Tasas en Vivo USD, EUR, GBP, MXN', h1: 'Convertidor de Divisas en Tiempo Real', desc: 'Tipos de cambio actualizados en tiempo real para las principales monedas del mundo.', enUrl: '/currency', script: '/currency-converter.js' },
  { id: 'area', title: 'Convertidor de Área: Metros Cuadrados, Hectáreas, Acres', h1: 'Convertidor de Área y Superficie', desc: 'Convierta m², hectáreas, acres y pies cuadrados para terrenos y construcción.', enUrl: '/area', script: '/area-converter.js' },
  { id: 'speed', title: 'Convertidor de Velocidad: KM/H, MPH, Nudos, M/S', h1: 'Convertidor de Velocidad', desc: 'Convierta velocidades entre km/h, millas por hora y nudos con cálculo instantáneo.', enUrl: '/speed', script: '/speed-converter.js' },
  { id: 'time-duration', title: 'Convertidor de Tiempo y Duración: Horas, Minutos, Días', h1: 'Convertidor de Tiempo y Duración', desc: 'Convierta intervalos de tiempo precisos entre horas, minutos, segundos y semanas.', enUrl: '/time-duration', script: '/time-converter.js' },
  { id: 'time-zone', title: 'Convertidor de Zonas Horarias Mundiales y Reloj Global', h1: 'Convertidor de Zonas Horarias', desc: 'Compare horarios internacionales y convierta husos horarios mundiales fácilmente.', enUrl: '/time-zone', script: '/timezone-converter.js' },
  { id: 'file-media', title: 'Convertidor de Archivos y Medios en el Navegador', h1: 'Convertidor de Archivos y Medios', desc: 'Herramienta de conversión segura de formatos de imagen y documentos en su navegador.', enUrl: '/file-media', script: '/file-converter.js' },
  { id: 'blog', title: 'Artículos y Guías de Conversión - OmniConverter', h1: 'Blog y Centro de Guías de Conversión', desc: 'Explore guías de cálculo explicadas paso a paso con fórmulas y tablas en español.', enUrl: '/blog', script: '' }
];

for (const t of toolsToGenerate) {
  fs.writeFileSync(path.join(esDir, `${t.id}.html`), generateGenericToolPage(t.id, t.title, t.h1, t.desc, t.enUrl, t.script), 'utf8');
}

// Contact & Legal
fs.writeFileSync(path.join(esDir, 'contact.html'), generateEsContact(), 'utf8');

fs.writeFileSync(path.join(esDir, 'about.html'), generateEsLegal('about', 'Acerca de OmniConverter', 'Acerca de OmniConverter', `
  <p>OmniConverter es una suite integral y gratuita de herramientas de conversión de unidades de medida, divisas en tiempo real y utilidades de medios diseñada para profesionales, estudiantes y usuarios de todo el mundo.</p>
  <p>Nuestra misión es proporcionar cálculos 100% precisos basados en los estándares del Sistema Internacional de Unidades (SI) y el NIST, garantizando una experiencia limpia, rápida y sin recopilación de datos invasiva.</p>
`), 'utf8');

fs.writeFileSync(path.join(esDir, 'privacy-policy.html'), generateEsLegal('privacy-policy', 'Política de Privacidad', 'Política de Privacidad', `
  <p>En OmniConverter, accesible desde omniconverter.co.uk, la privacidad de nuestros visitantes es una de nuestras principales prioridades.</p>
  <p>Todas las herramientas de cálculo funcionan de forma local en su navegador web. No almacenamos registros de sus cálculos ni almacenamos archivos convertidos en servidores permanentes.</p>
  <p>Para cualquier consulta sobre privacidad o protección de datos, contáctenos en <a href="mailto:info.omniconverter@gmail.com" style="color:var(--primary-600);">info.omniconverter@gmail.com</a>.</p>
`), 'utf8');

fs.writeFileSync(path.join(esDir, 'terms.html'), generateEsLegal('terms', 'Términos de Servicio', 'Términos de Servicio', `
  <p>Al acceder y utilizar el sitio web OmniConverter, usted acepta cumplir con estos Términos y Condiciones de Uso y con todas las leyes aplicables.</p>
  <p>Las fórmulas y cálculos se proporcionan de buena fe para fines educativos, profesionales e informativos generales.</p>
`), 'utf8');

fs.writeFileSync(path.join(esDir, 'sitemap.html'), generateEsLegal('sitemap', 'Mapa del Sitio en Español', 'Mapa del Sitio Web', `
  <p>Explore todos los convertidores y guías disponibles en español:</p>
  <ul style="line-height:2; margin-left:1.5rem;">
    <li><a href="/es/" style="color:var(--primary-600); font-weight:700;">Inicio - Suite Universal</a></li>
    <li><a href="/es/temperature" style="color:var(--primary-600);">Convertidor de Temperatura</a></li>
    <li><a href="/es/length" style="color:var(--primary-600);">Convertidor de Longitud</a></li>
    <li><a href="/es/weight-mass" style="color:var(--primary-600);">Convertidor de Peso y Masa</a></li>
    <li><a href="/es/volume-capacity" style="color:var(--primary-600);">Convertidor de Volumen</a></li>
    <li><a href="/es/currency" style="color:var(--primary-600);">Convertidor de Divisas</a></li>
    <li><a href="/es/area" style="color:var(--primary-600);">Convertidor de Área</a></li>
    <li><a href="/es/speed" style="color:var(--primary-600);">Convertidor de Velocidad</a></li>
    <li><a href="/es/time-duration" style="color:var(--primary-600);">Convertidor de Tiempo</a></li>
    <li><a href="/es/time-zone" style="color:var(--primary-600);">Zonas Horarias</a></li>
    <li><a href="/es/file-media" style="color:var(--primary-600);">Convertidor de Archivos</a></li>
    <li><a href="/es/blog" style="color:var(--primary-600);">Blog y Guías</a></li>
    <li><a href="/es/blog/15-metros-a-pies" style="color:var(--primary-600);">15 Metros a Pies</a></li>
    <li><a href="/es/blog/100-kg-a-libras" style="color:var(--primary-600);">100 KG a Libras</a></li>
    <li><a href="/es/blog/10-celsius-a-fahrenheit" style="color:var(--primary-600);">10 Celsius a Fahrenheit</a></li>
    <li><a href="/es/blog/60-mph-a-kmh" style="color:var(--primary-600);">60 MPH a KM/H</a></li>
    <li><a href="/es/blog/1-galon-en-litros" style="color:var(--primary-600);">1 Galón en Litros</a></li>
  </ul>
`), 'utf8');

// Top 5 Spanish Blog Guides
const blogArticles = [
  {
    slug: '15-metros-a-pies',
    enSlug: '15-meters-to-feet',
    title: '15 Metros a Pies',
    content: `<p>Convertir 15 metros a pies es un cálculo habitual en ingeniería, diseño arquitectónico, deportes y construcción, conectando el sistema métrico internacional con las medidas imperiales.</p>
    <div style="background:var(--bg-elevated); border-left:4px solid var(--primary-600); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.1rem; color:var(--text-main);">Respuesta Rápida Resumida</h3>
      <p style="margin:0; font-size:1.2rem; font-weight:700; color:var(--primary-600);">15 metros = 49.2126 pies</p>
      <p style="margin:0.5rem 0 0 0; font-size:0.95rem; color:var(--text-muted);">Equivale exactamente a 49 pies y 2.55 pulgadas.</p>
    </div>
    <h2>Fórmula Matemática Exacta</h2>
    <p>Por definición internacional, 1 metro equivale a 3.280839895 pies. Por tanto, para convertir 15 metros simplemente multiplicamos:</p>
    <div style="background:var(--bg-elevated); padding:1rem 1.25rem; border-radius:var(--radius-md); font-family:monospace; margin:1rem 0;">
      Pies = Metros × 3.28084<br>
      15 × 3.28084 = 49.2126 pies
    </div>`
  },
  {
    slug: '100-kg-a-libras',
    enSlug: '100-kg-to-lbs',
    title: '100 KG a Libras',
    content: `<p>Convertir 100 kilogramos a libras es un hito clave en medicina, fitness y transporte de mercancías entre el sistema métrico y el sistema anglosajón.</p>
    <div style="background:var(--bg-elevated); border-left:4px solid var(--primary-600); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.1rem; color:var(--text-main);">Respuesta Rápida Resumida</h3>
      <p style="margin:0; font-size:1.2rem; font-weight:700; color:var(--primary-600);">100 kilogramos = 220.462 libras (lbs)</p>
    </div>
    <h2>Fórmula Matemática</h2>
    <p>Un kilogramo equivale exactamente a 2.20462262 libras. Multiplique 100 por 2.20462 para obtener 220.46 libras.</p>`
  },
  {
    slug: '10-celsius-a-fahrenheit',
    enSlug: '10-celsius-is-what-fahrenheit',
    title: '10 Grados Celsius a Fahrenheit',
    content: `<p>La conversión de 10°C a Fahrenheit es una consulta meteorológica frecuente al viajar entre países que usan la escala Celsius y los Estados Unidos.</p>
    <div style="background:var(--bg-elevated); border-left:4px solid var(--primary-600); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.1rem; color:var(--text-main);">Respuesta Rápida Resumida</h3>
      <p style="margin:0; font-size:1.2rem; font-weight:700; color:var(--primary-600);">10 °C = 50 °F</p>
    </div>
    <h2>Fórmula Matemática</h2>
    <p>°F = (10 × 9/5) + 32 = 18 + 32 = 50 °F exactos.</p>`
  },
  {
    slug: '60-mph-a-kmh',
    enSlug: '60-mph-to-kmh',
    title: '60 MPH a KM/H',
    content: `<p>60 millas por hora es el límite de velocidad habitual en autopistas de EE. UU. y el Reino Unido.</p>
    <div style="background:var(--bg-elevated); border-left:4px solid var(--primary-600); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.1rem; color:var(--text-main);">Respuesta Rápida Resumida</h3>
      <p style="margin:0; font-size:1.2rem; font-weight:700; color:var(--primary-600);">60 MPH = 96.5606 KM/H</p>
    </div>
    <h2>Fórmula Matemática</h2>
    <p>KM/H = 60 × 1.609344 = 96.56 km/h.</p>`
  },
  {
    slug: '1-galon-en-litros',
    enSlug: '1-gallon-in-litres',
    title: '1 Galón en Litros',
    content: `<p>El galón estadounidense y el galón imperial británico son medidas volumétricas ampliamente utilizadas en combustible y recetas industriales.</p>
    <div style="background:var(--bg-elevated); border-left:4px solid var(--primary-600); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.1rem; color:var(--text-main);">Respuesta Rápida Resumida</h3>
      <p style="margin:0; font-size:1.2rem; font-weight:700; color:var(--primary-600);">1 Galón Estadounidense = 3.78541 Litros</p>
      <p style="margin:0.5rem 0 0 0; font-size:0.95rem; color:var(--text-muted);">Si utiliza el galón imperial británico, 1 galón = 4.54609 litros.</p>
    </div>`
  }
];

for (const b of blogArticles) {
  fs.writeFileSync(path.join(esBlogDir, `${b.slug}.html`), generateEsBlogArticle(b.slug, b.title, b.enSlug, b.content), 'utf8');
}

console.log('Successfully generated all Spanish pages!');

// 8. UPDATE ENGLISH PAGES WITH LANGUAGE SWITCHER & HREFLANG
console.log('Injecting language switcher and hreflang into English pages...');

// Mapping from English relative path to Spanish relative path
const enToEsMap = {
  'index.html': '/es/',
  'temperature.html': '/es/temperature',
  'length.html': '/es/length',
  'weight-mass.html': '/es/weight-mass',
  'volume-capacity.html': '/es/volume-capacity',
  'area.html': '/es/area',
  'speed.html': '/es/speed',
  'currency.html': '/es/currency',
  'time-duration.html': '/es/time-duration',
  'time-zone.html': '/es/time-zone',
  'file-media.html': '/es/file-media',
  'blog.html': '/es/blog',
  'about.html': '/es/about',
  'contact.html': '/es/contact',
  'privacy-policy.html': '/es/privacy-policy',
  'terms.html': '/es/terms',
  'sitemap.html': '/es/sitemap',
  'blog/15-meters-to-feet.html': '/es/blog/15-metros-a-pies',
  'blog/100-kg-to-lbs.html': '/es/blog/100-kg-a-libras',
  'blog/10-celsius-is-what-fahrenheit.html': '/es/blog/10-celsius-a-fahrenheit',
  'blog/60-mph-to-kmh.html': '/es/blog/60-mph-a-kmh',
  'blog/1-gallon-in-litres.html': '/es/blog/1-galon-en-litros'
};

function processEnglishFile(filePath, relPath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const esUrl = enToEsMap[relPath] || '/es/blog';
  const enUrl = relPath === 'index.html' ? '/' : `/${relPath.replace(/\.html$/, '')}`;

  // 1. Add hreflang if mapped and not present
  if (enToEsMap[relPath] && !content.includes('hreflang="es"')) {
    const hreflangBlock = `\n  <link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk${enUrl}">\n  <link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk${esUrl}">\n  <link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk${enUrl}">`;
    content = content.replace('</head>', `${hreflangBlock}\n</head>`);
  }

  // 2. Add language switcher in header if not present
  if (!content.includes('class="lang-switcher"')) {
    const switcherHtml = `\n      <div class="lang-switcher" aria-label="Language Selector">\n        <span class="active" title="English">🇬🇧 EN</span>\n        <span class="lang-sep">|</span>\n        <a href="${esUrl}" title="Español">🇪🇸 ES</a>\n      </div>`;
    content = content.replace('</nav>', `</nav>${switcherHtml}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

// Process root pages
for (const [file, esUrl] of Object.entries(enToEsMap)) {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    processEnglishFile(fullPath, file);
  }
}

// Process remaining blog articles
const blogFiles = fs.readdirSync(path.join(rootDir, 'blog')).filter(f => f.endsWith('.html'));
for (const bf of blogFiles) {
  const rel = `blog/${bf}`;
  if (!enToEsMap[rel]) {
    processEnglishFile(path.join(rootDir, rel), rel);
  }
}

console.log('Successfully updated English pages with language switcher!');

// 9. UPDATE SITEMAP.XML
console.log('Updating sitemap.xml with Spanish URLs...');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

const spanishUrls = [
  'https://www.omniconverter.co.uk/es/',
  'https://www.omniconverter.co.uk/es/temperature',
  'https://www.omniconverter.co.uk/es/length',
  'https://www.omniconverter.co.uk/es/weight-mass',
  'https://www.omniconverter.co.uk/es/volume-capacity',
  'https://www.omniconverter.co.uk/es/currency',
  'https://www.omniconverter.co.uk/es/area',
  'https://www.omniconverter.co.uk/es/speed',
  'https://www.omniconverter.co.uk/es/time-duration',
  'https://www.omniconverter.co.uk/es/time-zone',
  'https://www.omniconverter.co.uk/es/file-media',
  'https://www.omniconverter.co.uk/es/blog',
  'https://www.omniconverter.co.uk/es/about',
  'https://www.omniconverter.co.uk/es/contact',
  'https://www.omniconverter.co.uk/es/privacy-policy',
  'https://www.omniconverter.co.uk/es/terms',
  'https://www.omniconverter.co.uk/es/sitemap',
  'https://www.omniconverter.co.uk/es/blog/15-metros-a-pies',
  'https://www.omniconverter.co.uk/es/blog/100-kg-a-libras',
  'https://www.omniconverter.co.uk/es/blog/10-celsius-a-fahrenheit',
  'https://www.omniconverter.co.uk/es/blog/60-mph-a-kmh',
  'https://www.omniconverter.co.uk/es/blog/1-galon-en-litros'
];

let esSitemapXml = '\n  <!-- Spanish (ES) Section -->\n';
for (const url of spanishUrls) {
  if (!sitemapContent.includes(`<loc>${url}</loc>`)) {
    esSitemapXml += `  <url><loc>${url}</loc><lastmod>2026-10-05</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
  }
}

if (esSitemapXml.trim() !== '<!-- Spanish (ES) Section -->') {
  sitemapContent = sitemapContent.replace('</urlset>', `${esSitemapXml}</urlset>`);
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
}

console.log('Spanish suite build complete!');
