import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Common Ads & Assets
const COMMON_HEAD_TAGS = `  <meta charset="UTF-8">
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

function makeMultilingualHreflang(enPath, esPath, dePath, ptPath) {
  return `  <link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk${enPath}">
  <link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk${esPath}">
  <link rel="alternate" hreflang="de" href="https://www.omniconverter.co.uk${dePath}">
  <link rel="alternate" hreflang="pt" href="https://www.omniconverter.co.uk${ptPath}">
  <link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk${enPath}">`;
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

// 50 CORE TOPIC MAPPINGS
const TOPICS = [
  {
    enSlug: '1-3-cup-to-grams',
    title: '1/3 Cup to Grams',
    es: { slug: '1-3-taza-a-gramos', title: '1/3 de Taza a Gramos', ans: '1/3 de taza equivale a aprox. 42.6 g de harina o 66.7 g de azúcar granulada.', form: 'Gramos = Tazas × Densidad del ingrediente' },
    de: { slug: '1-3-tasse-in-gramm', title: '1/3 Tasse in Gramm', ans: '1/3 Tasse entspricht ca. 42,6 g Mehl oder 66,7 g Zucker.', form: 'Gramm = Tassen × Zutatendichte' },
    pt: { slug: '1-3-xicara-em-gramas', title: '1/3 de Xícara em Gramas', ans: '1/3 de xícara equivale a aprox. 42,6 g de farinha ou 66,7 g de açúcar.', form: 'Gramas = Xícaras × Densidade do ingrediente' }
  },
  {
    enSlug: '1-4-cup-is-ml',
    title: '1/4 Cup in mL',
    es: { slug: '1-4-taza-en-ml', title: '1/4 de Taza en Mililitros', ans: '1/4 de taza estadounidense = 59.147 mililitros (mL).', form: 'mL = Tazas × 236.588' },
    de: { slug: '1-4-tasse-in-ml', title: '1/4 Tasse in Milliliter', ans: '1/4 US-Tasse = 59,15 Milliliter (ml).', form: 'ml = Tassen × 236,588' },
    pt: { slug: '1-4-xicara-em-ml', title: '1/4 de Xícara em Mililitros', ans: '1/4 de xícara americana = 59,15 mililitros (mL).', form: 'mL = Xícaras × 236,588' }
  },
  {
    enSlug: '1-aud-to-vnd',
    title: '1 AUD to VND',
    es: { slug: '1-aud-a-vnd', title: '1 AUD a VND (Dólar Australiano a Dong Vietnamita)', ans: '1 AUD equivale a aprox. 16,500 - 17,200 VND según la tasa bancaria del día.', form: 'VND = AUD × Tipo de Cambio' },
    de: { slug: '1-aud-in-vnd', title: '1 AUD in VND (Australischer Dollar in Vietnamesische Dong)', ans: '1 AUD entspricht ca. 16.500 - 17.200 VND je nach Tageskurs.', form: 'VND = AUD × Wechselkurs' },
    pt: { slug: '1-aud-para-vnd', title: '1 AUD para VND (Dólar Australiano para Dong Vietnamita)', ans: '1 AUD equivale a aprox. 16.500 - 17.200 VND conforme a cotação.', form: 'VND = AUD × Taxa de Câmbio' }
  },
  {
    enSlug: '1-bar-to-psi-conversion',
    title: '1 Bar to PSI',
    es: { slug: '1-bar-a-psi', title: '1 Bar a PSI (Conversión de Presión)', ans: '1 bar equivale exactamente a 14.5038 PSI (libras por pulgada cuadrada).', form: 'PSI = Bar × 14.50377' },
    de: { slug: '1-bar-in-psi', title: '1 Bar in PSI (Druckumrechnung)', ans: '1 Bar entspricht genau 14,5038 PSI (Pfund pro Quadratzoll).', form: 'PSI = Bar × 14,50377' },
    pt: { slug: '1-bar-para-psi', title: '1 Bar para PSI (Conversão de Pressão)', ans: '1 bar equivale a exatamente 14,5038 PSI (libras por polegada quadrada).', form: 'PSI = Bar × 14,50377' }
  },
  {
    enSlug: '1-billion-korean-won-to-gbp',
    title: '1 Billion Korean Won to GBP',
    es: { slug: '1-mil-millones-won-a-gbp', title: '1 Mil Millones de Won a Libras Esterlinas (GBP)', ans: '1,000,000,000 KRW equivale a aprox. £570,000 - £610,000 GBP según el mercado.', form: 'GBP = KRW × Tasa de cambio' },
    de: { slug: '1-milliarde-won-in-gbp', title: '1 Milliarde Won in Britische Pfund (GBP)', ans: '1.000.000.000 KRW entspricht ca. 570.000 £ - 610.000 £ je nach Kurs.', form: 'GBP = KRW × Wechselkurs' },
    pt: { slug: '1-bilhao-de-won-para-gbp', title: '1 Bilhão de Won para Libras (GBP)', ans: '1.000.000.000 KRW equivale a aprox. £570.000 - £610.000 GBP.', form: 'GBP = KRW × Taxa de câmbio' }
  },
  {
    enSlug: '1-cup-milk-in-milliliters',
    title: '1 Cup Milk in mL',
    es: { slug: '1-taza-de-leche-en-ml', title: '1 Taza de Leche en Mililitros', ans: '1 taza de leche estándar de EE.UU. = 240 mL (la taza métrica oficial = 250 mL).', form: 'mL = Tazas de Leche × 240 (o 250 métrico)' },
    de: { slug: '1-tasse-milch-in-ml', title: '1 Tasse Milch in Milliliter', ans: '1 US-Tasse Milch = 240 ml (metrische Tasse = 250 ml).', form: 'ml = Tassen Milch × 240 (oder 250 metrisch)' },
    pt: { slug: '1-xicara-de-leite-em-ml', title: '1 Xícara de Leite em Mililitros', ans: '1 xícara de leite (EUA) = 240 mL (xícara padrão brasileira = 240-250 mL).', form: 'mL = Xícaras de Leite × 240' }
  },
  {
    enSlug: '1-gallon-in-litres',
    title: '1 Gallon in Litres',
    es: { slug: '1-galon-en-litros', title: '1 Galón en Litros', ans: '1 galón estadounidense = 3.78541 litros (1 galón imperial británico = 4.54609 litros).', form: 'Litros = Galones × 3.78541' },
    de: { slug: '1-gallone-in-liter', title: '1 Gallone in Liter', ans: '1 US-Gallone = 3,78541 Liter (1 imperiale Gallone = 4,54609 Liter).', form: 'Liter = Gallonen × 3,78541' },
    pt: { slug: '1-galao-em-litros', title: '1 Galão em Litros', ans: '1 galão americano = 3,78541 litros (1 galão imperial britânico = 4,54609 litros).', form: 'Litros = Galões × 3,78541' }
  },
  {
    enSlug: '1-stone-in-kg',
    title: '1 Stone in KG',
    es: { slug: '1-stone-en-kg', title: '1 Stone en Kilogramos', ans: '1 stone (piedra británica) equivale exactamente a 6.35029 kg (14 libras).', form: 'KG = Stone × 6.35029318' },
    de: { slug: '1-stone-in-kg', title: '1 Stone in Kilogramm', ans: '1 Stone (britische Maßeinheit) entspricht genau 6,35029 kg (14 Pfund).', form: 'kg = Stone × 6,35029318' },
    pt: { slug: '1-stone-em-kg', title: '1 Stone em Quilos', ans: '1 stone britânico equivale a exatamente 6,35029 kg (14 libras).', form: 'kg = Stone × 6,35029318' }
  },
  {
    enSlug: '1-tsp-is-ml',
    title: '1 TSP in mL',
    es: { slug: '1-cucharadita-en-ml', title: '1 Cucharadita en Mililitros (TSP a mL)', ans: '1 cucharadita (tsp) equivale exactamente a 4.92892 mL (redondeado a 5 mL en cocina).', form: 'mL = Cucharaditas × 4.92892' },
    de: { slug: '1-teeloeffel-in-ml', title: '1 Teelöffel in Milliliter (TL in ml)', ans: '1 Teelöffel (US tsp) entspricht 4,93 ml (in der Küche gerundet auf 5 ml).', form: 'ml = Teelöffel × 4,92892' },
    pt: { slug: '1-colher-de-cha-em-ml', title: '1 Colher de Chá em Mililitros', ans: '1 colher de chá (tsp) equivale a 4,92892 mL (arredondado para 5 mL na culinária).', form: 'mL = Colheres de Chá × 4,92892' }
  },
  {
    enSlug: '10-billion-won-to-gbp',
    title: '10 Billion Won to GBP',
    es: { slug: '10-mil-millones-won-a-gbp', title: '10 Mil Millones de Won a Libras (GBP)', ans: '10,000,000,000 KRW equivale a aprox. £5.7M - £6.1M GBP según las tasas bancarias actuales.', form: 'GBP = KRW × Tasa de cambio' },
    de: { slug: '10-milliarden-won-in-gbp', title: '10 Milliarden Won in Britische Pfund (GBP)', ans: '10.000.000.000 KRW entspricht ca. 5,7 Mio. £ - 6,1 Mio. £ je nach Markt.', form: 'GBP = KRW × Wechselkurs' },
    pt: { slug: '10-bilhoes-de-won-para-gbp', title: '10 Bilhões de Won para Libras (GBP)', ans: '10.000.000.000 KRW equivale a aprox. £5,7M - £6,1M GBP.', form: 'GBP = KRW × Taxa de câmbio' }
  },
  {
    enSlug: '10-celsius-is-what-fahrenheit',
    title: '10 Celsius to Fahrenheit',
    es: { slug: '10-celsius-a-fahrenheit', title: '10 Grados Celsius a Fahrenheit', ans: '10 °C equivale exactamente a 50 °F.', form: '°F = (10 × 9/5) + 32 = 50 °F' },
    de: { slug: '10-celsius-in-fahrenheit', title: '10 Grad Celsius in Fahrenheit', ans: '10 °C entspricht genau 50 °F.', form: '°F = (10 × 9/5) + 32 = 50 °F' },
    pt: { slug: '10-celsius-para-fahrenheit', title: '10 Graus Celsius para Fahrenheit', ans: '10 °C equivale exatamente a 50 °F.', form: '°F = (10 × 9/5) + 32 = 50 °F' }
  },
  {
    enSlug: '100-fahrenheit-to-celsius',
    title: '100 Fahrenheit to Celsius',
    es: { slug: '100-fahrenheit-a-celsius', title: '100 Grados Fahrenheit a Celsius', ans: '100 °F equivale a 37.7778 °C (umbral de fiebre médica).', form: '°C = (100 - 32) × 5/9 = 37.78 °C' },
    de: { slug: '100-fahrenheit-in-celsius', title: '100 Grad Fahrenheit in Celsius', ans: '100 °F entspricht 37,78 °C (medizinische Fiebergrenze).', form: '°C = (100 - 32) × 5/9 = 37,78 °C' },
    pt: { slug: '100-fahrenheit-para-celsius', title: '100 Graus Fahrenheit para Celsius', ans: '100 °F equivale a 37,78 °C (limiar de febre médica).', form: '°C = (100 - 32) × 5/9 = 37,78 °C' }
  },
  {
    enSlug: '100-kg-to-lbs',
    title: '100 KG to LBS',
    es: { slug: '100-kg-a-libras', title: '100 Kilogramos a Libras', ans: '100 kg equivale exactamente a 220.462 libras (lbs).', form: 'Libras = 100 × 2.20462262' },
    de: { slug: '100-kg-in-pfund', title: '100 Kilogramm in Pfund (lbs)', ans: '100 kg entspricht genau 220,462 Pfund (lbs).', form: 'Pfund = 100 × 2,20462262' },
    pt: { slug: '100-kg-para-libras', title: '100 Quilos para Libras (lbs)', ans: '100 kg equivale a 220,462 libras (lbs).', form: 'Libras = 100 × 2,20462262' }
  },
  {
    enSlug: '100-usd-to-aud',
    title: '100 USD to AUD',
    es: { slug: '100-usd-a-aud', title: '100 Dólares USD a Dólares Australianos (AUD)', ans: '100 USD equivale a aprox. 148 - 155 AUD según el tipo de cambio del mercado.', form: 'AUD = 100 × Tasa USD/AUD' },
    de: { slug: '100-usd-in-aud', title: '100 US-Dollar in Australische Dollar (AUD)', ans: '100 USD entspricht ca. 148 - 155 AUD je nach aktuellem Devisenkurs.', form: 'AUD = 100 × Devisenkurs' },
    pt: { slug: '100-usd-para-aud', title: '100 Dólares USD para AUD', ans: '100 USD equivale a aprox. 148 - 155 AUD conforme a cotação.', form: 'AUD = 100 × Cotação USD/AUD' }
  },
  {
    enSlug: '12-degrees-celsius-to-fahrenheit',
    title: '12 Degrees Celsius to Fahrenheit',
    es: { slug: '12-grados-celsius-a-fahrenheit', title: '12 Grados Celsius a Fahrenheit', ans: '12 °C equivale exactamente a 53.6 °F.', form: '°F = (12 × 1.8) + 32 = 53.6 °F' },
    de: { slug: '12-grad-celsius-in-fahrenheit', title: '12 Grad Celsius in Fahrenheit', ans: '12 °C entspricht genau 53,6 °F.', form: '°F = (12 × 1,8) + 32 = 53,6 °F' },
    pt: { slug: '12-graus-celsius-para-fahrenheit', title: '12 Graus Celsius para Fahrenheit', ans: '12 °C equivale a 53,6 °F.', form: '°F = (12 × 1,8) + 32 = 53,6 °F' }
  },
  {
    enSlug: '13-stone-in-pounds',
    title: '13 Stone in Pounds',
    es: { slug: '13-stone-en-libras', title: '13 Stone en Libras', ans: '13 stone equivale exactamente a 182 libras (lbs) o 82.55 kg.', form: 'Libras = 13 × 14 = 182 lbs' },
    de: { slug: '13-stone-in-pfund', title: '13 Stone in Pfund (lbs)', ans: '13 Stone entspricht genau 182 Pfund (lbs) oder 82,55 kg.', form: 'Pfund = 13 × 14 = 182 lbs' },
    pt: { slug: '13-stone-em-libras', title: '13 Stone em Libras (lbs)', ans: '13 stone equivale a 182 libras (lbs) ou 82,55 kg.', form: 'Libras = 13 × 14 = 182 lbs' }
  },
  {
    enSlug: '14-stone-in-pounds',
    title: '14 Stone in Pounds',
    es: { slug: '14-stone-en-libras', title: '14 Stone en Libras', ans: '14 stone equivale exactamente a 196 libras (lbs) o 88.90 kg.', form: 'Libras = 14 × 14 = 196 lbs' },
    de: { slug: '14-stone-in-pfund', title: '14 Stone in Pfund (lbs)', ans: '14 Stone entspricht genau 196 Pfund (lbs) oder 88,90 kg.', form: 'Pfund = 14 × 14 = 196 lbs' },
    pt: { slug: '14-stone-em-libras', title: '14 Stone em Libras (lbs)', ans: '14 stone equivale a 196 libras (lbs) ou 88,90 kg.', form: 'Libras = 14 × 14 = 196 lbs' }
  },
  {
    enSlug: '15-meters-to-feet',
    title: '15 Meters to Feet',
    es: { slug: '15-metros-a-pies', title: '15 Metros a Pies', ans: '15 metros = 49.2126 pies (49 pies y 2.55 pulgadas).', form: 'Pies = 15 × 3.28084' },
    de: { slug: '15-meter-in-fuss', title: '15 Meter in Fuß', ans: '15 Meter = 49,2126 Fuß (49 Fuß und 2,55 Zoll).', form: 'Fuß = 15 × 3,28084' },
    pt: { slug: '15-metros-para-pes', title: '15 Metros para Pés', ans: '15 metros = 49,2126 pés (49 pés e 2,55 polegadas).', form: 'Pés = 15 × 3,28084' }
  },
  {
    enSlug: '1500-usd-to-aud',
    title: '1500 USD to AUD',
    es: { slug: '1500-usd-a-aud', title: '1500 Dólares USD a AUD', ans: '1500 USD equivale a aprox. 2,220 - 2,325 AUD según la tasa de cambio interbancaria.', form: 'AUD = 1500 × Tasa USD/AUD' },
    de: { slug: '1500-usd-in-aud', title: '1500 US-Dollar in Australische Dollar (AUD)', ans: '1500 USD entspricht ca. 2.220 - 2.325 AUD je nach Devisenkurs.', form: 'AUD = 1500 × Devisenkurs' },
    pt: { slug: '1500-usd-para-aud', title: '1500 Dólares USD para AUD', ans: '1500 USD equivale a aprox. 2.220 - 2.325 AUD conforme a cotação.', form: 'AUD = 1500 × Cotação USD/AUD' }
  },
  {
    enSlug: '16-ounces-to-milliliters',
    title: '16 Ounces to Milliliters',
    es: { slug: '16-onzas-a-mililitros', title: '16 Onzas Líquidas a Mililitros', ans: '16 onzas líquidas de EE.UU. = 473.176 mL (exactamente 2 tazas de cocina).', form: 'mL = 16 × 29.5735' },
    de: { slug: '16-unzen-in-milliliter', title: '16 Unzen in Milliliter (fl oz in ml)', ans: '16 US-Flüssigunzen = 473,18 ml (genau 2 US-Tassen).', form: 'ml = 16 × 29,5735' },
    pt: { slug: '16-oncas-para-mililitros', title: '16 Onças Fluidas para Mililitros', ans: '16 onças fluidas (EUA) = 473,18 mL (exatamente 2 xícaras).', form: 'mL = 16 × 29,5735' }
  },
  {
    enSlug: '165-lbs-to-kg',
    title: '165 LBS to KG',
    es: { slug: '165-libras-a-kg', title: '165 Libras a Kilogramos', ans: '165 libras = 74.8427 kilogramos (kg) o 11 stone y 11 lbs.', form: 'KG = 165 ÷ 2.20462' },
    de: { slug: '165-pfund-in-kg', title: '165 Pfund (lbs) in Kilogramm', ans: '165 Pfund = 74,8427 Kilogramm (kg).', form: 'kg = 165 ÷ 2,20462' },
    pt: { slug: '165-libras-para-kg', title: '165 Libras para Quilos', ans: '165 libras = 74,8427 quilogramas (kg).', form: 'kg = 165 ÷ 2,20462' }
  },
  {
    enSlug: '170lbs-in-stone',
    title: '170 LBS in Stone',
    es: { slug: '170-libras-en-stone', title: '170 Libras en Stone', ans: '170 libras = 12 stone y 2 libras (12.14 st) o 77.11 kg.', form: 'Stone = 170 ÷ 14 = 12 st 2 lbs' },
    de: { slug: '170-pfund-in-stone', title: '170 Pfund (lbs) in Stone', ans: '170 Pfund = 12 Stone und 2 Pfund (12,14 st) oder 77,11 kg.', form: 'Stone = 170 ÷ 14 = 12 st 2 lbs' },
    pt: { slug: '170-libras-em-stone', title: '170 Libras em Stone', ans: '170 libras = 12 stone e 2 libras (12,14 st) ou 77,11 kg.', form: 'Stone = 170 ÷ 14 = 12 st 2 lbs' }
  },
  {
    enSlug: '180lbs-in-stone',
    title: '180 LBS in Stone',
    es: { slug: '180-libras-en-stone', title: '180 Libras en Stone', ans: '180 libras = 12 stone y 12 libras (12.86 st) o 81.65 kg.', form: 'Stone = 180 ÷ 14 = 12 st 12 lbs' },
    de: { slug: '180-pfund-in-stone', title: '180 Pfund (lbs) in Stone', ans: '180 Pfund = 12 Stone und 12 Pfund (12,86 st) oder 81,65 kg.', form: 'Stone = 180 ÷ 14 = 12 st 12 lbs' },
    pt: { slug: '180-libras-em-stone', title: '180 Libras em Stone', ans: '180 libras = 12 stone e 12 libras (12,86 st) ou 81,65 kg.', form: 'Stone = 180 ÷ 14 = 12 st 12 lbs' }
  },
  {
    enSlug: '199-usd-in-aud',
    title: '199 USD in AUD',
    es: { slug: '199-usd-en-aud', title: '199 Dólares USD en AUD', ans: '199 USD equivale a aprox. 295 - 308 AUD según las tasas de cambio actuales.', form: 'AUD = 199 × Tasa USD/AUD' },
    de: { slug: '199-usd-in-aud', title: '199 US-Dollar in Australische Dollar (AUD)', ans: '199 USD entspricht ca. 295 - 308 AUD je nach Marktkurs.', form: 'AUD = 199 × Devisenkurs' },
    pt: { slug: '199-usd-em-aud', title: '199 Dólares USD em AUD', ans: '199 USD equivale a aprox. 295 - 308 AUD.', form: 'AUD = 199 × Cotação USD/AUD' }
  },
  {
    enSlug: '20-pounds-sterling-in-australian-dollars',
    title: '20 Pounds Sterling in Australian Dollars',
    es: { slug: '20-libras-en-dolares-australianos', title: '20 Libras Esterlinas en Dólares Australianos (AUD)', ans: '20 GBP equivale a aprox. 38.50 - 40.20 AUD.', form: 'AUD = 20 × Tasa GBP/AUD' },
    de: { slug: '20-britische-pfund-in-australische-dollar', title: '20 Britische Pfund in Australische Dollar (GBP in AUD)', ans: '20 GBP entspricht ca. 38,50 - 40,20 AUD.', form: 'AUD = 20 × Kurs GBP/AUD' },
    pt: { slug: '20-libras-em-dolares-australianos', title: '20 Libras Esterlinas em Dólares Australianos (AUD)', ans: '20 GBP equivale a aprox. 38,50 - 40,20 AUD.', form: 'AUD = 20 × Cotação GBP/AUD' }
  },
  {
    enSlug: '2000-dollars-in-pounds',
    title: '2000 Dollars in Pounds',
    es: { slug: '2000-dolares-en-libras', title: '2000 Dólares en Libras Esterlinas (GBP)', ans: '2,000 USD equivale a aprox. £1,520 - £1,590 GBP.', form: 'GBP = 2000 × Tasa USD/GBP' },
    de: { slug: '2000-dollar-in-pfund', title: '2000 US-Dollar in Britische Pfund (GBP)', ans: '2.000 USD entspricht ca. 1.520 £ - 1.590 £.', form: 'GBP = 2000 × Kurs USD/GBP' },
    pt: { slug: '2000-dolares-em-libras', title: '2000 Dólares em Libras Esterlinas (GBP)', ans: '2.000 USD equivale a aprox. £1.520 - £1.590 GBP.', form: 'GBP = 2000 × Cotação USD/GBP' }
  },
  {
    enSlug: '3-cups-in-ml',
    title: '3 Cups in mL',
    es: { slug: '3-tazas-en-ml', title: '3 Tazas en Mililitros', ans: '3 tazas estadounidenses = 709.76 mL (o 750 mL si usa la taza métrica).', form: 'mL = 3 × 236.588' },
    de: { slug: '3-tassen-in-ml', title: '3 Tassen in Milliliter', ans: '3 US-Tassen = 709,76 ml (bzw. 750 ml metrisch).', form: 'ml = 3 × 236,588' },
    pt: { slug: '3-xicaras-em-ml', title: '3 Xícaras em Mililitros', ans: '3 xícaras americanas = 709,76 mL (ou 750 mL métrico).', form: 'mL = 3 × 236,588' }
  },
  {
    enSlug: '300-dollars-in-gbp',
    title: '300 Dollars in GBP',
    es: { slug: '300-dolares-en-gbp', title: '300 Dólares en Libras Esterlinas (GBP)', ans: '300 USD equivale a aprox. £228 - £238 GBP.', form: 'GBP = 300 × Tasa USD/GBP' },
    de: { slug: '300-dollar-in-gbp', title: '300 US-Dollar in Britische Pfund (GBP)', ans: '300 USD entspricht ca. 228 £ - 238 £.', form: 'GBP = 300 × Kurs USD/GBP' },
    pt: { slug: '300-dolares-em-gbp', title: '300 Dólares em Libras (GBP)', ans: '300 USD equivale a aprox. £228 - £238 GBP.', form: 'GBP = 300 × Cotação USD/GBP' }
  },
  {
    enSlug: '32-usd-to-gbp',
    title: '32 USD to GBP',
    es: { slug: '32-usd-a-gbp', title: '32 Dólares USD a Libras (GBP)', ans: '32 USD equivale a aprox. £24.30 - £25.50 GBP.', form: 'GBP = 32 × Tasa USD/GBP' },
    de: { slug: '32-usd-in-gbp', title: '32 US-Dollar in Britische Pfund (GBP)', ans: '32 USD entspricht ca. 24,30 £ - 25,50 £.', form: 'GBP = 32 × Kurs USD/GBP' },
    pt: { slug: '32-usd-para-gbp', title: '32 Dólares USD para Libras (GBP)', ans: '32 USD equivale a aprox. £24,30 - £25,50 GBP.', form: 'GBP = 32 × Cotação USD/GBP' }
  },
  {
    enSlug: '5-usd-to-aud',
    title: '5 USD to AUD',
    es: { slug: '5-usd-a-aud', title: '5 Dólares USD a AUD', ans: '5 USD equivale a aprox. 7.40 - 7.75 AUD.', form: 'AUD = 5 × Tasa USD/AUD' },
    de: { slug: '5-usd-in-aud', title: '5 US-Dollar in Australische Dollar (AUD)', ans: '5 USD entspricht ca. 7,40 - 7,75 AUD.', form: 'AUD = 5 × Devisenkurs' },
    pt: { slug: '5-usd-para-aud', title: '5 Dólares USD para AUD', ans: '5 USD equivale a aprox. 7,40 - 7,75 AUD.', form: 'AUD = 5 × Cotação USD/AUD' }
  },
  {
    enSlug: '50-fahrenheit-to-celsius',
    title: '50 Fahrenheit to Celsius',
    es: { slug: '50-fahrenheit-a-celsius', title: '50 Grados Fahrenheit a Celsius', ans: '50 °F equivale exactamente a 10 °C.', form: '°C = (50 - 32) × 5/9 = 10 °C' },
    de: { slug: '50-fahrenheit-in-celsius', title: '50 Grad Fahrenheit in Celsius', ans: '50 °F entspricht genau 10 °C.', form: '°C = (50 - 32) × 5/9 = 10 °C' },
    pt: { slug: '50-fahrenheit-para-celsius', title: '50 Graus Fahrenheit para Celsius', ans: '50 °F equivale exatamente a 10 °C.', form: '°C = (50 - 32) × 5/9 = 10 °C' }
  },
  {
    enSlug: '500-ml-to-cups',
    title: '500 mL to Cups',
    es: { slug: '500-ml-a-tazas', title: '500 Mililitros a Tazas', ans: '500 mL equivale a 2.11 tazas estadounidenses (o exactamente 2 tazas métricas).', form: 'Tazas = 500 ÷ 236.588 = 2.11 tazas' },
    de: { slug: '500-ml-in-tassen', title: '500 Milliliter in Tassen', ans: '500 ml entspricht 2,11 US-Tassen (oder genau 2 metrischen Tassen).', form: 'Tassen = 500 ÷ 236,588 = 2,11 Tassen' },
    pt: { slug: '500-ml-para-xicaras', title: '500 Mililitros para Xícaras', ans: '500 mL equivale a 2,11 xícaras americanas (ou exatamente 2 xícaras métricas).', form: 'Xícaras = 500 ÷ 236,588 = 2,11 xícaras' }
  },
  {
    enSlug: '60-mph-to-kmh',
    title: '60 MPH to KM/H',
    es: { slug: '60-mph-a-kmh', title: '60 MPH a KM/H', ans: '60 millas por hora = 96.5606 kilómetros por hora.', form: 'KM/H = 60 × 1.609344' },
    de: { slug: '60-mph-in-kmh', title: '60 MPH in KM/H (Meilen in km/h)', ans: '60 Meilen pro Stunde = 96,5606 km/h.', form: 'km/h = 60 × 1,609344' },
    pt: { slug: '60-mph-para-kmh', title: '60 MPH para KM/H', ans: '60 milhas por hora = 96,5606 km/h.', form: 'km/h = 60 × 1,609344' }
  },
  {
    enSlug: '65-kg-pounds',
    title: '65 KG to Pounds',
    es: { slug: '65-kg-a-libras', title: '65 Kilogramos a Libras', ans: '65 kg equivale a 143.3 libras (lbs) o 10 stone y 3.3 lbs.', form: 'Libras = 65 × 2.20462' },
    de: { slug: '65-kg-in-pfund', title: '65 Kilogramm in Pfund (lbs)', ans: '65 kg entspricht 143,3 Pfund (lbs) oder 10 Stone und 3,3 lbs.', form: 'Pfund = 65 × 2,20462' },
    pt: { slug: '65-kg-para-libras', title: '65 Quilos para Libras', ans: '65 kg equivale a 143,3 libras (lbs).', form: 'Libras = 65 × 2,20462' }
  },
  {
    enSlug: '71-pounds-to-kg',
    title: '71 Pounds to KG',
    es: { slug: '71-libras-a-kg', title: '71 Libras a Kilogramos', ans: '71 libras = 32.2051 kilogramos (kg).', form: 'KG = 71 ÷ 2.20462' },
    de: { slug: '71-pfund-in-kg', title: '71 Pfund (lbs) in Kilogramm', ans: '71 Pfund = 32,2051 Kilogramm (kg).', form: 'kg = 71 ÷ 2,20462' },
    pt: { slug: '71-libras-para-kg', title: '71 Libras para Quilos', ans: '71 libras = 32,2051 quilogramas (kg).', form: 'kg = 71 ÷ 2,20462' }
  },
  {
    enSlug: '80-kilo-lbs',
    title: '80 Kilo to LBS',
    es: { slug: '80-kilos-a-libras', title: '80 Kilos a Libras', ans: '80 kg = 176.37 libras (lbs) o 12 stone y 8.37 lbs.', form: 'Libras = 80 × 2.20462' },
    de: { slug: '80-kilo-in-pfund', title: '80 Kilo in Pfund (lbs)', ans: '80 kg = 176,37 Pfund (lbs) oder 12 Stone und 8,37 lbs.', form: 'Pfund = 80 × 2,20462' },
    pt: { slug: '80-quilos-para-libras', title: '80 Quilos para Libras', ans: '80 kg = 176,37 libras (lbs).', form: 'Libras = 80 × 2,20462' }
  },
  {
    enSlug: 'convert-file-type-to-pdf',
    title: 'Convert File Type to PDF',
    es: { slug: 'convertir-tipo-de-archivo-a-pdf', title: 'Convertir Tipo de Archivo a PDF', ans: 'Convierta documentos Word, imágenes y texto a formato PDF universal en su navegador.', form: 'Conversión segura sin servidor' },
    de: { slug: 'dateityp-in-pdf-umwandeln', title: 'Dateityp in PDF umwandeln', ans: 'Konvertieren Sie Word-Dokumente, Bilder und Textdateien sicher im Browser in PDF.', form: 'Sichere lokale Browser-Konvertierung' },
    pt: { slug: 'converter-tipo-de-arquivo-para-pdf', title: 'Converter Tipo de Arquivo para PDF', ans: 'Converta documentos Word, imagens e textos para PDF diretamente no navegador.', form: 'Conversão segura no navegador' }
  },
  {
    enSlug: 'convert-lakh-to-usd',
    title: 'Convert Lakh to USD',
    es: { slug: 'convertir-lakh-a-usd', title: 'Convertir Lakh a Dólares USD', ans: '1 Lakh (100,000 rupias INR) equivale a aprox. $1,180 - $1,210 USD.', form: 'USD = (Lakh × 100,000) ÷ Tasa USD/INR' },
    de: { slug: 'lakh-in-usd-umrechnen', title: 'Lakh in US-Dollar umrechnen', ans: '1 Lakh (100.000 indische Rupien) entspricht ca. 1.180 - 1.210 USD.', form: 'USD = (Lakh × 100.000) ÷ USD/INR Kurs' },
    pt: { slug: 'converter-lakh-para-usd', title: 'Converter Lakh para USD', ans: '1 Lakh (100.000 rúpias indianas) equivale a aprox. $1.180 - $1.210 USD.', form: 'USD = (Lakh × 100.000) ÷ Cotação USD/INR' }
  },
  {
    enSlug: 'convert-pdf-form',
    title: 'Convert PDF Form',
    es: { slug: 'convertir-formulario-pdf', title: 'Convertir Formulario PDF', ans: 'Herramienta para transformar formularios PDF en formatos editables sin perder estructura.', form: 'Conversión cliente-servidor segura' },
    de: { slug: 'pdf-formular-umwandeln', title: 'PDF-Formular umwandeln', ans: 'Verwandeln Sie PDF-Formulare sicher im Browser in editierbare Dokumente.', form: 'Sichere Browserverarbeitung' },
    pt: { slug: 'converter-formulario-pdf', title: 'Converter Formulário PDF', ans: 'Ferramenta para converter formulários PDF em documentos editáveis.', form: 'Processamento seguro no navegador' }
  },
  {
    enSlug: 'converter-application-download',
    title: 'Converter Application Download',
    es: { slug: 'descargar-aplicacion-convertidor', title: 'Descargar Aplicación de Conversión', ans: 'Instale OmniConverter como una aplicación web progresiva (PWA) rápida y ligera.', form: 'Acceso sin conexión con PWA' },
    de: { slug: 'umrechner-app-herunterladen', title: 'Umrechner-App herunterladen', ans: 'Nutzen Sie OmniConverter als moderne Progressive Web App (PWA) direkt auf Ihrem Gerät.', form: 'PWA-Schnellinstallation' },
    pt: { slug: 'baixar-aplicativo-conversor', title: 'Baixar Aplicativo de Conversão', ans: 'Instale o OmniConverter como aplicativo web progressivo (PWA) leve e veloz.', form: 'Instalação PWA' }
  },
  {
    enSlug: 'convertor-or-converter',
    title: 'Convertor or Converter',
    es: { slug: 'convertor-o-converter', title: '¿Convertor o Converter? Ortografía Correcta', ans: 'La grafía correcta en inglés estándar es "converter" (con "er"). En español es "convertidor".', form: 'Guía ortográfica y técnica' },
    de: { slug: 'convertor-oder-converter', title: 'Convertor oder Converter? Richtige Schreibweise', ans: 'Die korrekte englische Schreibweise lautet "converter" (mit "er"). Auf Deutsch: "Umrechner".', form: 'Sprach- und Rechtschreibratgeber' },
    pt: { slug: 'convertor-ou-converter', title: 'Convertor ou Converter? Grafia Correta', ans: 'A grafia correta em inglês é "converter". Em português usamos "conversor".', form: 'Guia ortográfico e técnico' }
  },
  {
    enSlug: 'currency-for-turkish-lira',
    title: 'Currency for Turkish Lira',
    es: { slug: 'moneda-lira-turca', title: 'Moneda de Turquía: Lira Turca (TRY)', ans: 'Guía de la lira turca (TRY) con tasas de cambio actualizadas frente al USD, EUR y GBP.', form: 'TRY = Divisa base × Tasa' },
    de: { slug: 'waehrung-tuerkische-lira', title: 'Währung Türkische Lira (TRY)', ans: 'Ratgeber zur Türkischen Lira (TRY) mit aktuellen Wechselkursen zu USD, EUR und GBP.', form: 'TRY = Basiswährung × Kurs' },
    pt: { slug: 'moeda-lira-turca', title: 'Moeda Lira Turca (TRY)', ans: 'Guia da lira turca (TRY) com taxas de câmbio atualizadas em relação a USD, EUR e GBP.', form: 'TRY = Moeda × Taxa' }
  },
  {
    enSlug: 'currency-jpy-to-inr',
    title: 'Currency JPY to INR',
    es: { slug: 'divisa-jpy-a-inr', title: 'Yen Japonés a Rupia India (JPY a INR)', ans: '100 JPY equivale a aprox. 54 - 58 INR según las cotizaciones bancarias actuales.', form: 'INR = JPY × Tasa de cambio' },
    de: { slug: 'waehrung-jpy-in-inr', title: 'Japanischer Yen in Indische Rupien (JPY in INR)', ans: '100 JPY entspricht ca. 54 - 58 INR je nach aktuellem Devisenkurs.', form: 'INR = JPY × Wechselkurs' },
    pt: { slug: 'moeda-jpy-para-inr', title: 'Iene Japonês para Rúpia Indiana (JPY para INR)', ans: '100 JPY equivale a aprox. 54 - 58 INR.', form: 'INR = JPY × Cotação' }
  },
  {
    enSlug: 'file-changer',
    title: 'File Changer',
    es: { slug: 'cambiador-de-archivos', title: 'Cambiador de Formato de Archivos', ans: 'Herramienta universal en el navegador para cambiar extensiones y formatos de imagen y documentos.', form: 'Conversión segura cliente' },
    de: { slug: 'dateiumwandler', title: 'Dateiumwandler und Formatwechsler', ans: 'Universelles Browser-Tool zum Ändern von Dateierweiterungen und Bildformaten.', form: 'Sichere lokale Umwandlung' },
    pt: { slug: 'modificador-de-arquivos', title: 'Modificador de Formato de Arquivos', ans: 'Ferramenta para converter extensões e formatos de arquivos com total segurança.', form: 'Conversão segura no navegador' }
  },
  {
    enSlug: 'how-to-change-file-format',
    title: 'How to Change File Format',
    es: { slug: 'como-cambiar-formato-de-archivo', title: 'Cómo Cambiar el Formato de un Archivo', ans: 'Paso a paso para cambiar extensiones de archivo en Windows, Mac y en línea sin dañar datos.', form: 'Guía técnica informática' },
    de: { slug: 'dateiformat-aendern-anleitung', title: 'Dateiformat ändern: Anleitung Schritt für Schritt', ans: 'Schritt-für-Schritt-Anleitung zum Ändern von Dateiendungen auf Windows, Mac und online.', form: 'Technischer Leitfaden' },
    pt: { slug: 'como-mudar-formato-de-arquivo', title: 'Como Mudar o Formato de um Arquivo', ans: 'Passo a passo para alterar formatos de arquivos no Windows, Mac e online com segurança.', form: 'Guia prático de informática' }
  },
  {
    enSlug: 'indonesia-cu',
    title: 'Indonesia Currency Guide',
    es: { slug: 'guia-moneda-indonesia', title: 'Guía de la Moneda de Indonesia (Rupia IDR)', ans: 'Guía completa de la rupia indonesia (IDR), denominaciones bancarias y conversión a USD/EUR.', form: 'USD = IDR ÷ Tasa de cambio' },
    de: { slug: 'indonesische-waehrung-ratgeber', title: 'Indonesische Währung: Ratgeber zur Rupiah (IDR)', ans: 'Kompletter Ratgeber zur Indonesischen Rupiah (IDR), Nennwerten und Umrechnungskursen.', form: 'USD = IDR ÷ Wechselkurs' },
    pt: { slug: 'guia-moeda-indonesia', title: 'Guia da Moeda da Indonésia (Rúpia IDR)', ans: 'Guia completo da rúpia indonésia (IDR), notas bancárias e conversão para USD/EUR.', form: 'USD = IDR ÷ Cotação' }
  },
  {
    enSlug: 'korean-to-aud',
    title: 'Korean Won to AUD',
    es: { slug: 'won-coreano-a-aud', title: 'Won Surcoreano a Dólares Australianos (AUD)', ans: '10,000 KRW equivale a aprox. 11.20 - 11.60 AUD según los mercados de divisas.', form: 'AUD = KRW × Tasa KRW/AUD' },
    de: { slug: 'koreanischer-won-in-aud', title: 'Koreanischer Won in Australische Dollar (AUD)', ans: '10.000 KRW entspricht ca. 11,20 - 11,60 AUD je nach Devisenkurs.', form: 'AUD = KRW × Wechselkurs' },
    pt: { slug: 'won-sul-coreano-para-aud', title: 'Won Sul-Coreano para Dólares Australianos (AUD)', ans: '10.000 KRW equivale a aprox. 11,20 - 11,60 AUD.', form: 'AUD = KRW × Cotação' }
  },
  {
    enSlug: 'mastercard-foreign-exchange-rate',
    title: 'Mastercard Foreign Exchange Rate',
    es: { slug: 'tasa-de-cambio-mastercard', title: 'Tipos de Cambio y Comisiones Mastercard', ans: 'Cómo calcula Mastercard las tasas de cambio de divisas y comisiones en transacciones internacionales.', form: 'Tasa Mastercard + Comisión del banco' },
    de: { slug: 'mastercard-wechselkurse', title: 'Mastercard Wechselkurse und Auslandsgebühren', ans: 'So berechnet Mastercard Devisenumrechnungskurse und Gebühren bei Auslandstransaktionen.', form: 'Mastercard-Kurs + Fremdwährungsgebühr' },
    pt: { slug: 'taxa-de-cambio-mastercard', title: 'Taxas de Câmbio e Tarifas Mastercard', ans: 'Como a Mastercard calcula a conversão de moedas e tarifas em compras internacionais.', form: 'Taxa Mastercard + Spread bancário' }
  },
  {
    enSlug: 'rupiah-to-aud',
    title: 'Rupiah to AUD',
    es: { slug: 'rupia-indonesia-a-aud', title: 'Rupia Indonesia a Dólar Australiano (IDR a AUD)', ans: '100,000 IDR equivale a aprox. 9.50 - 10.10 AUD.', form: 'AUD = IDR × Tasa IDR/AUD' },
    de: { slug: 'rupiah-in-aud', title: 'Indonesische Rupiah in Australische Dollar (IDR in AUD)', ans: '100.000 IDR entspricht ca. 9,50 - 10,10 AUD.', form: 'AUD = IDR × Wechselkurs' },
    pt: { slug: 'rupia-para-aud', title: 'Rúpia Indonésia para AUD', ans: '100.000 IDR equivale a aprox. 9,50 - 10,10 AUD.', form: 'AUD = IDR × Cotação' }
  },
  {
    enSlug: 'weeks-calculator',
    title: 'Weeks Calculator',
    es: { slug: 'calculadora-de-semanas', title: 'Calculadora de Semanas y Días', ans: 'Calcule con precisión el número de semanas y días transcurridos entre dos fechas.', form: 'Semanas = Días transcurridos ÷ 7' },
    de: { slug: 'wochenrechner', title: 'Wochenrechner: Wochen und Tage berechnen', ans: 'Berechnen Sie exakt die Anzahl an Wochen und Tagen zwischen zwei beliebigen Daten.', form: 'Wochen = Tage ÷ 7' },
    pt: { slug: 'calculadora-de-semanas', title: 'Calculadora de Semanas e Dias', ans: 'Calcule com exatidão o número de semanas e dias entre datas.', form: 'Semanas = Dias ÷ 7' }
  }
];

// Helper to look up topic
const topicMap = new Map();
TOPICS.forEach(t => topicMap.set(t.enSlug, t));

// 1. GENERATE INDIAN UNITS CONVERTER (indian-units.html)
function generateIndianUnitsPage() {
  const paths = {
    en: '/indian-units',
    es: '/es/indian-units',
    de: '/de/indian-units',
    pt: '/pt/indian-units'
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
${COMMON_HEAD_TAGS}
  <title>Indian Units Converter: Bigha, Guntha, Gaj, Tola, Lakh & Crore</title>
  <meta name="description" content="Free online Indian unit converter. Convert Bigha to Square Feet, Guntha to Sq Ft, Gaj to Sq Yard, Tola to Grams gold weight, and Lakh to Millions & Crore instantly.">
  <link rel="canonical" href="https://www.omniconverter.co.uk/indian-units">
  <meta property="og:title" content="Indian Units Converter: Bigha, Guntha, Gaj, Tola, Lakh & Crore">
  <meta property="og:description" content="Convert traditional Indian land measurements (Bigha, Guntha, Gaj), gold weight (Tola to Grams), and number system (Lakh & Crore to Millions).">
  <meta property="og:url" content="https://www.omniconverter.co.uk/indian-units">
  <meta name="twitter:title" content="Indian Units Converter: Bigha, Guntha, Gaj, Tola, Lakh & Crore">
  <meta name="twitter:description" content="Free online calculator for Indian land, gold, and currency units.">
${makeMultilingualHreflang('/indian-units', '/es/indian-units', '/de/indian-units', '/pt/indian-units')}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Indian Units Converter",
    "url": "https://www.omniconverter.co.uk/indian-units",
    "image": "https://www.omniconverter.co.uk/logo.png",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "description": "Comprehensive converter for Indian land measurement units (Bigha, Guntha, Gaj), gold weight (Tola, Grams), and Indian numbering system (Lakh, Crore)."
  }
  </script>
</head>
<body>
${makeHeader('en', 'indian-units', paths)}
  <main style="max-width: 1150px; width: 100%;">
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">Indian Units Converter</span>
    </nav>

    <section class="smallpdf-hero" style="text-align:center; padding:2rem 1rem 1.5rem;">
      <h1 class="smallpdf-hero-title">🇮🇳 Indian Traditional Units Converter</h1>
      <p class="smallpdf-hero-subtitle">Fast, verified calculations for Indian Real Estate &amp; Land Measurement (Bigha, Guntha, Gaj), Gold Weight (Tola, Grams), and Number System (Lakh &amp; Crore to Millions).</p>
    </section>

    <!-- Interactive Converter Card -->
    <section class="converter-card">
      <div style="display:flex; justify-content:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
        <button type="button" class="tab-btn active" id="tabLandBtn" onclick="switchIndianCategory('land')">🏞️ Land Area (Bigha, Guntha, Gaj)</button>
        <button type="button" class="tab-btn" id="tabGoldBtn" onclick="switchIndianCategory('gold')">🪙 Gold &amp; Silver (Tola, Grams)</button>
        <button type="button" class="tab-btn" id="tabNumBtn" onclick="switchIndianCategory('num')">🔢 Number System (Lakh, Crore)</button>
      </div>

      <div class="converter-grid">
        <div class="input-group">
          <label for="indInputVal">Enter Quantity</label>
          <input type="number" id="indInputVal" class="input-field" value="1" step="any" placeholder="Enter amount">
        </div>

        <div class="input-group">
          <label for="indFromUnit">From Unit</label>
          <select id="indFromUnit" class="select-field">
            <!-- Populated via JS -->
          </select>
        </div>

        <button type="button" id="indSwapBtn" class="btn-swap" aria-label="Swap units">⇄</button>

        <div class="input-group">
          <label for="indToUnit">To Unit</label>
          <select id="indToUnit" class="select-field">
            <!-- Populated via JS -->
          </select>
        </div>
      </div>

      <div class="button-row">
        <button type="button" id="indConvertBtn" class="btn-convert">Calculate Instant Result</button>
        <button type="button" id="indClearBtn" class="btn-clear">Reset</button>
      </div>

      <div id="indResultContainer" class="result-container" style="display:block;">
        <div class="result-main">
          <div class="result-text-group">
            <span class="result-label">Certified Conversion Result</span>
            <span id="indResultValue" class="result-value">27,225 sq ft</span>
          </div>
          <button type="button" id="indCopyBtn" class="btn-copy">📋 Copy</button>
        </div>
        <div class="formula-box"><strong>Formula Reference:</strong> <span id="indFormulaText">1 Pucca Bigha (UP/Bihar/Standard) = 27,225 sq ft</span></div>
        <div class="explanation-box"><strong>Practical Application:</strong> <span id="indExplanationText">Used widely across Northern &amp; Central India for agricultural and residential land deeds.</span></div>
      </div>
    </section>

    <!-- State-by-State Land Reference Guide -->
    <article class="content-section">
      <h2>Comprehensive State-Wise Bigha Conversion Table</h2>
      <p>Because the definition of a <strong>Bigha</strong> varies across Indian states under regional revenue codes, use this verified benchmark table for land records (Khatauni/Khasra):</p>
      <div class="table-wrapper">
        <table class="conversion-table">
          <thead>
            <tr><th>Indian State / Region</th><th>1 Bigha Equivalent (Sq Feet)</th><th>1 Bigha in Square Yards (Gaj)</th><th>1 Bigha in Acres</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Uttar Pradesh &amp; Bihar (Pucca Bigha)</strong></td><td>27,225 sq ft</td><td>3,025 Gaj</td><td>0.625 Acre</td></tr>
            <tr><td><strong>Haryana &amp; Punjab</strong></td><td>9,075 sq ft (Kaccha) / 27,225 sq ft</td><td>1,008 Gaj / 3,025 Gaj</td><td>0.208 Acre / 0.625 Acre</td></tr>
            <tr><td><strong>Rajasthan</strong></td><td>17,424 sq ft to 27,225 sq ft</td><td>1,936 Gaj to 3,025 Gaj</td><td>0.400 Acre to 0.625 Acre</td></tr>
            <tr><td><strong>West Bengal</strong></td><td>14,400 sq ft</td><td>1,600 Gaj</td><td>0.3306 Acre (1/3 Acre)</td></tr>
            <tr><td><strong>Assam</strong></td><td>14,400 sq ft</td><td>1,600 Gaj</td><td>0.3306 Acre</td></tr>
            <tr><td><strong>Himachal Pradesh &amp; Uttarakhand</strong></td><td>8,712 sq ft</td><td>968 Gaj</td><td>0.200 Acre</td></tr>
            <tr><td><strong>Gujarat &amp; Parts of MP</strong></td><td>17,424 sq ft</td><td>1,936 Gaj</td><td>0.400 Acre</td></tr>
          </tbody>
        </table>
      </div>

      <h2 style="margin-top:2rem;">Indian Gold &amp; Jewellery Weight System (Tola, Masha, Ratti)</h2>
      <p>In Indian bullion and gold jewelry markets (Sarafa Bazar), traditional weight units are officially defined relative to the metric gram as follows:</p>
      <div class="table-wrapper">
        <table class="conversion-table">
          <thead>
            <tr><th>Traditional Unit</th><th>Metric Equivalent</th><th>Subdivisions</th><th>Market Context</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>1 Tola (Standard Metric)</strong></td><td>10.0000 Grams</td><td>Modern Indian Bullion Standard</td><td>Gold bar and coin purchases</td></tr>
            <tr><td><strong>1 Tola (Traditional Vedic/British)</strong></td><td>11.6638 Grams</td><td>12 Masha / 96 Ratti</td><td>Ancestral jewelry and sovereign transactions</td></tr>
            <tr><td><strong>1 Sovereign (Pawan / Pavan)</strong></td><td>8.0000 Grams</td><td>Common in South India (Kerala/TN)</td><td>Gold coin jewelry standard</td></tr>
            <tr><td><strong>1 Masha</strong></td><td>0.9719 Grams</td><td>8 Ratti</td><td>Fine gemstone weighing</td></tr>
            <tr><td><strong>1 Ratti</strong></td><td>0.1215 Grams</td><td>Used for astrological gemstones</td><td>Ruby, emerald, sapphire measurement</td></tr>
          </tbody>
        </table>
      </div>

      <h2 style="margin-top:2rem;">Indian Numbering System (Lakh &amp; Crore to International Millions)</h2>
      <p>The Vedic numbering system uses intervals of two digits after the thousands comma, unlike the international system which groups by three digits:</p>
      <div class="table-wrapper">
        <table class="conversion-table">
          <thead>
            <tr><th>Indian Number</th><th>Numerical Digits</th><th>International System</th><th>Short Representation</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>1 Lakh</strong></td><td>100,000 (5 zeros)</td><td>100 Thousand</td><td>0.1 Million</td></tr>
            <tr><td><strong>10 Lakh</strong></td><td>1,000,000 (6 zeros)</td><td>1 Million</td><td>1.0 Million</td></tr>
            <tr><td><strong>1 Crore</strong></td><td>10,000,000 (7 zeros)</td><td>10 Million</td><td>10.0 Million</td></tr>
            <tr><td><strong>10 Crore</strong></td><td>100,000,000 (8 zeros)</td><td>100 Million</td><td>100 Million</td></tr>
            <tr><td><strong>100 Crore (1 Arab)</strong></td><td>1,000,000,000 (9 zeros)</td><td>1 Billion</td><td>1.0 Billion</td></tr>
          </tbody>
        </table>
      </div>
    </article>
  </main>

  <div id="toast" class="toast" aria-live="polite"></div>
${makeFooter('en')}

  <script>
    const categories = {
      land: {
        units: [
          { id: 'bigha_up', name: 'Bigha (UP/Bihar - 27,225 sq ft)', factor: 27225 },
          { id: 'sqft', name: 'Square Feet (sq ft)', factor: 1 },
          { id: 'gaj', name: 'Gaj / Sq Yard (9 sq ft)', factor: 9 },
          { id: 'guntha', name: 'Guntha (Maharashtra/KA - 1,089 sq ft)', factor: 1089 },
          { id: 'acre', name: 'Acre (43,560 sq ft)', factor: 43560 },
          { id: 'hectare', name: 'Hectare (107,639 sq ft)', factor: 107639 },
          { id: 'bigha_wb', name: 'Bigha (West Bengal/Assam - 14,400 sq ft)', factor: 14400 },
          { id: 'bigha_raj', name: 'Bigha (Rajasthan - 17,424 sq ft)', factor: 17424 },
          { id: 'kanal', name: 'Kanal (Punjab/Haryana - 5,445 sq ft)', factor: 5445 },
          { id: 'marla', name: 'Marla (272.25 sq ft)', factor: 272.25 }
        ],
        defaultFrom: 'bigha_up',
        defaultTo: 'sqft'
      },
      gold: {
        units: [
          { id: 'tola_std', name: 'Tola (Standard Metric - 10 g)', factor: 10 },
          { id: 'tola_trad', name: 'Tola (Traditional - 11.6638 g)', factor: 11.6638 },
          { id: 'grams', name: 'Grams (g)', factor: 1 },
          { id: 'sovereign', name: 'Sovereign / Pawan (8 g)', factor: 8 },
          { id: 'masha', name: 'Masha (0.972 g)', factor: 0.972 },
          { id: 'ratti', name: 'Ratti (0.1215 g)', factor: 0.1215 },
          { id: 'kg', name: 'Kilograms (kg - 1,000 g)', factor: 1000 },
          { id: 'oz_troy', name: 'Troy Ounce (31.1035 g)', factor: 31.1035 }
        ],
        defaultFrom: 'tola_std',
        defaultTo: 'grams'
      },
      num: {
        units: [
          { id: 'lakh', name: 'Lakh (100,000)', factor: 100000 },
          { id: 'crore', name: 'Crore (10,000,000)', factor: 10000000 },
          { id: 'thousand', name: 'Thousand (1,000)', factor: 1000 },
          { id: 'million', name: 'Million (1,000,000)', factor: 1000000 },
          { id: 'billion', name: 'Billion (1,000,000,000)', factor: 1000000000 },
          { id: 'arab', name: 'Arab (100 Crore - 1 Billion)', factor: 1000000000 },
          { id: 'one', name: 'Exact Unit Count (1)', factor: 1 }
        ],
        defaultFrom: 'crore',
        defaultTo: 'million'
      }
    };

    let currentCat = 'land';
    const inputVal = document.getElementById('indInputVal');
    const fromSel = document.getElementById('indFromUnit');
    const toSel = document.getElementById('indToUnit');
    const resultVal = document.getElementById('indResultValue');
    const formulaText = document.getElementById('indFormulaText');
    const explanationText = document.getElementById('indExplanationText');

    function populateSelectors() {
      const cat = categories[currentCat];
      fromSel.innerHTML = cat.units.map(u => \`<option value="\${u.id}">\${u.name}</option>\`).join('');
      toSel.innerHTML = cat.units.map(u => \`<option value="\${u.id}">\${u.name}</option>\`).join('');
      fromSel.value = cat.defaultFrom;
      toSel.value = cat.defaultTo;
      calculate();
    }

    function switchIndianCategory(cat) {
      currentCat = cat;
      document.querySelectorAll('.converter-card .tab-btn').forEach(b => b.classList.remove('active'));
      if (cat === 'land') document.getElementById('tabLandBtn').classList.add('active');
      if (cat === 'gold') document.getElementById('tabGoldBtn').classList.add('active');
      if (cat === 'num') document.getElementById('tabNumBtn').classList.add('active');
      populateSelectors();
    }

    function calculate() {
      const val = parseFloat(inputVal.value);
      if (isNaN(val)) {
        resultVal.textContent = '--';
        return;
      }

      const cat = categories[currentCat];
      const fromObj = cat.units.find(u => u.id === fromSel.value);
      const toObj = cat.units.find(u => u.id === toSel.value);

      if (!fromObj || !toObj) return;

      const baseVal = val * fromObj.factor;
      const converted = baseVal / toObj.factor;

      let formatted;
      if (converted >= 1000 || converted <= 0.001) {
        formatted = Number(converted.toFixed(4)).toLocaleString('en-IN');
      } else {
        formatted = Number(converted.toFixed(4)).toString();
      }

      resultVal.textContent = \`\${formatted} \${toObj.name.split(' (')[0]}\`;
      formulaText.textContent = \`1 \${fromObj.name.split(' (')[0]} = \${(fromObj.factor / toObj.factor).toLocaleString('en-IN', { maximumFractionDigits: 6 })} \${toObj.name.split(' (')[0]}\`;
      explanationText.textContent = \`\${val} \${fromObj.name.split(' (')[0]} converted based on official revenue and trade standards.\`;
    }

    inputVal.addEventListener('input', calculate);
    fromSel.addEventListener('change', calculate);
    toSel.addEventListener('change', calculate);
    document.getElementById('indConvertBtn').addEventListener('click', calculate);
    document.getElementById('indSwapBtn').addEventListener('click', () => {
      const t = fromSel.value;
      fromSel.value = toSel.value;
      toSel.value = t;
      calculate();
    });
    document.getElementById('indClearBtn').addEventListener('click', () => {
      inputVal.value = '1';
      calculate();
    });
    document.getElementById('indCopyBtn').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(resultVal.textContent);
        const toast = document.getElementById('toast');
        toast.textContent = 'Copied to clipboard!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      } catch (e) {}
    });

    populateSelectors();
  </script>
</body>
</html>`;
}

// 2. GENERATE TOP VIRAL INDIAN BLOG GUIDES
const INDIAN_BLOGS = [
  {
    slug: '1-bigha-in-square-feet',
    title: '1 Bigha in Square Feet (State-Wise Land Measurement Guide)',
    desc: 'How many square feet are in 1 Bigha? Complete verified state-wise conversion table for UP, Bihar, Punjab, Haryana, Rajasthan, West Bengal, and MP.',
    content: `<p>Converting <strong>1 Bigha to square feet</strong> is one of the most crucial and searched land measurement calculations in India. Whether you are purchasing agricultural land, verifying government land registry deeds (Khasra/Khatauni), or developing a plot, knowing the exact square footage is vital because <strong>1 Bigha is NOT the same size across India</strong>.</p>
    <div style="background:var(--bg-elevated); border-left:4px solid var(--primary-600); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; color:var(--text-main);">Quick Summary Answer</h3>
      <p style="margin:0; font-size:1.3rem; font-weight:800; color:var(--primary-600);">1 Standard Pucca Bigha (UP/Bihar) = 27,225 Square Feet</p>
      <p style="margin:0.5rem 0 0 0; font-size:0.95rem; color:var(--text-muted);">In West Bengal and Assam, 1 Bigha = 14,400 sq ft. In Himachal Pradesh, 1 Bigha = 8,712 sq ft.</p>
    </div>
    <h2>State-Wise Bigha Conversion Table</h2>
    <div class="table-wrapper">
      <table class="conversion-table">
        <thead>
          <tr><th>State</th><th>1 Bigha in Sq Feet</th><th>1 Bigha in Gaj (Sq Yards)</th><th>In Acres</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Uttar Pradesh &amp; Bihar</strong></td><td>27,225 sq ft</td><td>3,025 Gaj</td><td>0.625 Acre</td></tr>
          <tr><td><strong>Punjab &amp; Haryana</strong></td><td>9,075 sq ft (Kaccha)</td><td>1,008 Gaj</td><td>0.208 Acre</td></tr>
          <tr><td><strong>Rajasthan</strong></td><td>17,424 to 27,225 sq ft</td><td>1,936 to 3,025 Gaj</td><td>0.40 to 0.625 Acre</td></tr>
          <tr><td><strong>West Bengal &amp; Assam</strong></td><td>14,400 sq ft</td><td>1,600 Gaj</td><td>0.3306 Acre (1/3 Acre)</td></tr>
          <tr><td><strong>Himachal Pradesh &amp; Uttarakhand</strong></td><td>8,712 sq ft</td><td>968 Gaj</td><td>0.200 Acre</td></tr>
          <tr><td><strong>Gujarat &amp; Madhya Pradesh</strong></td><td>17,424 sq ft</td><td>1,936 Gaj</td><td>0.400 Acre</td></tr>
        </tbody>
      </table>
    </div>`
  },
  {
    slug: '1-tola-in-grams',
    title: '1 Tola in Grams (Gold & Silver Jewellery Measurement Guide)',
    desc: 'How many grams are in 1 Tola? Learn the exact difference between the 10-gram modern metric Tola and 11.6638-gram traditional Vedic Tola for gold purchase.',
    content: `<p>When buying or selling gold jewellery, gold coins, or silver ornaments in India, the most respected traditional unit of mass is the <strong>Tola (तोला)</strong>. Knowing whether your jeweller is quoting in standard metric tolas or traditional British Indian tolas protects your investment.</p>
    <div style="background:var(--bg-elevated); border-left:4px solid var(--primary-600); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; color:var(--text-main);">Quick Summary Answer</h3>
      <p style="margin:0; font-size:1.3rem; font-weight:800; color:var(--primary-600);">1 Standard Indian Bullion Tola = Exactly 10.0000 Grams</p>
      <p style="margin:0.5rem 0 0 0; font-size:0.95rem; color:var(--text-muted);">1 Traditional Vedic / British Imperial Tola = 11.6638038 Grams (180 troy grains or 1 silver rupee coin weight).</p>
    </div>
    <h2>Comparison of Traditional Jewellery Units</h2>
    <div class="table-wrapper">
      <table class="conversion-table">
        <thead>
          <tr><th>Unit</th><th>Weight in Grams</th><th>Equivalent in Tola</th></tr>
        </thead>
        <tbody>
          <tr><td>1 Tola (Official Market Standard)</td><td>10.00 g</td><td>1.0 Tola</td></tr>
          <tr><td>1 Tola (Traditional British)</td><td>11.664 g</td><td>1.166 Metric Tola</td></tr>
          <tr><td>1 Sovereign / Pawan</td><td>8.00 g</td><td>0.8 Metric Tola</td></tr>
          <tr><td>1 Masha</td><td>0.972 g</td><td>1/12th Traditional Tola</td></tr>
          <tr><td>1 Ratti</td><td>0.1215 g</td><td>1/96th Traditional Tola</td></tr>
        </tbody>
      </table>
    </div>`
  },
  {
    slug: '1-crore-in-millions',
    title: '1 Crore in Millions and Billions (Indian to Western Numbers)',
    desc: 'Convert 1 Crore to Millions and Billions. Learn the exact zeros, commas, and currency value of Crore in USD, EUR, and international banking.',
    content: `<p>Transitioning between the Indian numbering system (Lakhs and Crores) and the Western international system (Millions and Billions) is a daily necessity in international business, startup valuations, and remittance calculations.</p>
    <div style="background:var(--bg-elevated); border-left:4px solid var(--primary-600); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; color:var(--text-main);">Quick Summary Answer</h3>
      <p style="margin:0; font-size:1.3rem; font-weight:800; color:var(--primary-600);">1 Crore = Exactly 10 Million (10,000,000)</p>
      <p style="margin:0.5rem 0 0 0; font-size:0.95rem; color:var(--text-muted);">100 Crore = Exactly 1 Billion (1,000,000,000) or 1 Arab.</p>
    </div>
    <h2>Conversion Reference Table</h2>
    <div class="table-wrapper">
      <table class="conversion-table">
        <thead>
          <tr><th>Indian System</th><th>Numerical Form</th><th>International Equivalent</th><th>USD Value (approx @ 84 INR)</th></tr>
        </thead>
        <tbody>
          <tr><td>1 Lakh</td><td>1,00,000 (5 zeros)</td><td>100 Thousand (0.1 M)</td><td>$1,190 USD</td></tr>
          <tr><td>10 Lakh</td><td>10,00,000 (6 zeros)</td><td>1 Million (1.0 M)</td><td>$11,905 USD</td></tr>
          <tr><td>1 Crore</td><td>1,00,00,000 (7 zeros)</td><td>10 Million (10.0 M)</td><td>$119,050 USD</td></tr>
          <tr><td>10 Crore</td><td>10,00,00,000 (8 zeros)</td><td>100 Million</td><td>$1.19 Million USD</td></tr>
          <tr><td>100 Crore (1 Arab)</td><td>1,00,00,00,000 (9 zeros)</td><td>1 Billion (1.0 B)</td><td>$11.90 Million USD</td></tr>
        </tbody>
      </table>
    </div>`
  },
  {
    slug: '1-guntha-in-sq-ft',
    title: '1 Guntha in Square Feet (Land Measurement Guide)',
    desc: 'How many square feet are in 1 Guntha? Convert Guntha to Sq Ft, Square Yards, Bigha, and Acres for Maharashtra, Karnataka, Gujarat, and Telangana.',
    content: `<p>In Maharashtra, Karnataka, Gujarat, Goa, and Telangana, the <strong>Guntha (गुंठा)</strong> is the standard legal revenue unit for residential and agricultural plots.</p>
    <div style="background:var(--bg-elevated); border-left:4px solid var(--primary-600); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; color:var(--text-main);">Quick Summary Answer</h3>
      <p style="margin:0; font-size:1.3rem; font-weight:800; color:var(--primary-600);">1 Guntha = Exactly 1,089 Square Feet (sq ft)</p>
      <p style="margin:0.5rem 0 0 0; font-size:0.95rem; color:var(--text-muted);">40 Gunthas equal exactly 1 Acre (43,560 sq ft). 1 Guntha also equals 121 Square Yards (Gaj).</p>
    </div>`
  },
  {
    slug: '1-gaj-in-square-feet',
    title: '1 Gaj in Square Feet and Square Yards Guide',
    desc: 'Convert 1 Gaj to square feet and square meters. Learn why 1 Gaj equals exactly 9 square feet (1 square yard) in Indian property deeds.',
    content: `<p>In Northern and Central India (Delhi-NCR, Haryana, Punjab, UP), property dealers and plot registries quote land sizes in <strong>Gaj (गज)</strong>.</p>
    <div style="background:var(--bg-elevated); border-left:4px solid var(--primary-600); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; color:var(--text-main);">Quick Summary Answer</h3>
      <p style="margin:0; font-size:1.3rem; font-weight:800; color:var(--primary-600);">1 Gaj = Exactly 9 Square Feet (1 Square Yard)</p>
      <p style="margin:0.5rem 0 0 0; font-size:0.95rem; color:var(--text-muted);">A standard 100 Gaj plot equals exactly 900 square feet (or 83.61 square meters).</p>
    </div>`
  }
];

// Write indian-units.html
fs.writeFileSync(path.join(rootDir, 'indian-units.html'), generateIndianUnitsPage(), 'utf8');

// Write Indian blog guides
INDIAN_BLOGS.forEach(b => {
  const blogHtml = `<!DOCTYPE html>
<html lang="en">
<head>
${COMMON_HEAD_TAGS}
  <title>${b.title} | OmniConverter</title>
  <meta name="description" content="${b.desc}">
  <link rel="canonical" href="https://www.omniconverter.co.uk/blog/${b.slug}">
  <meta property="og:title" content="${b.title} | OmniConverter">
  <meta property="og:description" content="${b.desc}">
  <meta property="og:url" content="https://www.omniconverter.co.uk/blog/${b.slug}">
  <meta name="twitter:title" content="${b.title} | OmniConverter">
  <meta name="twitter:description" content="${b.desc}">
${makeMultilingualHreflang(`/blog/${b.slug}`, `/es/blog/${b.slug}`, `/de/blog/${b.slug}`, `/pt/blog/${b.slug}`)}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${b.title}",
    "description": "${b.desc}",
    "url": "https://www.omniconverter.co.uk/blog/${b.slug}",
    "image": "https://www.omniconverter.co.uk/logo.png",
    "author": { "@type": "Organization", "name": "OmniConverter Editorial Team" },
    "publisher": { "@type": "Organization", "name": "OmniConverter", "logo": { "@type": "ImageObject", "url": "https://www.omniconverter.co.uk/logo.png" } }
  }
  </script>
</head>
<body>
${makeHeader('en', 'blog', { en: `/blog/${b.slug}`, es: `/es/blog/${b.slug}`, de: `/de/blog/${b.slug}`, pt: `/pt/blog/${b.slug}` })}
  <main class="main-container">
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <a href="/blog">Blog</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">${b.title}</span>
    </nav>
    <article class="content-section">
      <span class="formula-badge">Official Indian Unit Calculation Guide</span>
      <h1 style="font-size:2.1rem;font-weight:800;margin:0.75rem 0 1rem 0;">${b.title}</h1>
      ${b.content}
    </article>
    <section class="related-guides-section" style="margin:2.5rem 0 1.5rem 0; padding:1.5rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl);">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; font-weight:800; color:var(--text-main);">
        📖 Related Indian Unit Calculators
      </h3>
      <p style="margin:0 0 1rem 0; font-size:0.92rem; color:var(--text-muted);">Explore live calculators for Indian land and gold units:</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:0.85rem;">
        <a href="/indian-units" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600;">
          <span>🇮🇳 All Indian Units Converter</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
        <a href="/length" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600;">
          <span>Length &amp; Distance Tool</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
      </div>
    </section>
  </main>
${makeFooter('en')}
</body>
</html>`;
  fs.writeFileSync(path.join(rootDir, 'blog', `${b.slug}.html`), blogHtml, 'utf8');
});

console.log('Indian units tool and guides created!');

// 3. GENERATE FULL SPANISH, GERMAN & PORTUGUESE BLOG ARTICLES (FOR ALL 50 TOPICS)
function generateMultilingualBlogArticle(lang, topic) {
  const l = topic[lang];
  const paths = {
    en: `/blog/${topic.enSlug}`,
    es: `/es/blog/${topic.es.slug}`,
    de: `/de/blog/${topic.de.slug}`,
    pt: `/pt/blog/${topic.pt.slug}`
  };

  const ui = {
    es: {
      badge: 'Guía Oficial de Conversión',
      ansTitle: 'Respuesta Rápida Resumida',
      formTitle: 'Fórmula Matemática Certificada',
      formExpl: 'Esta fórmula aplica los factores certificados por estándares internacionales (NIST y SI).',
      tableTitle: 'Tabla de Conversión Rápida',
      toolsTitle: 'Calculadoras y Guías Relacionadas',
      toolLink1: 'Convertidor Principal',
      toolLink2: 'Blog de Conversión'
    },
    de: {
      badge: 'Offizieller Umrechnungsratgeber',
      ansTitle: 'Schnelle Zusammenfassung',
      formTitle: 'Zertifizierte Mathematische Formel',
      formExpl: 'Diese Formel basiert auf den offiziellen NIST- und SI-Umrechnungsstandards.',
      tableTitle: 'Schnelle Referenztabelle',
      toolsTitle: 'Verwandte Umrechnungstools und Ratgeber',
      toolLink1: 'Haupt-Umrechner',
      toolLink2: 'Ratgeber-Übersicht'
    },
    pt: {
      badge: 'Guia Oficial de Conversão',
      ansTitle: 'Resposta Rápida Resumida',
      formTitle: 'Fórmula Matemática Certificada',
      formExpl: 'Esta fórmula utiliza fatores oficiais estabelecidos pelos padrões internacionais (SI e NIST).',
      tableTitle: 'Tabela de Conversão Rápida',
      toolsTitle: 'Calculadoras e Guias Relacionados',
      toolLink1: 'Conversor Principal',
      toolLink2: 'Blog de Conversões'
    }
  }[lang];

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${COMMON_HEAD_TAGS}
  <title>${l.title}: Formel & Rechner | OmniConverter</title>
  <meta name="description" content="Genaue Anleitung für ${l.title}. Mathematische Formeln, Referenztabellen und Umrechnungsrechner.">
  <link rel="canonical" href="https://www.omniconverter.co.uk/${lang}/blog/${l.slug}">
  <meta property="og:title" content="${l.title}">
  <meta property="og:description" content="${l.ans}">
  <meta property="og:url" content="https://www.omniconverter.co.uk/${lang}/blog/${l.slug}">
  <meta name="twitter:title" content="${l.title}">
  <meta name="twitter:description" content="${l.ans}">
${makeMultilingualHreflang(paths.en, paths.es, paths.de, paths.pt)}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${l.title}",
    "inLanguage": "${lang}",
    "url": "https://www.omniconverter.co.uk/${lang}/blog/${l.slug}",
    "image": "https://www.omniconverter.co.uk/logo.png",
    "author": { "@type": "Organization", "name": "OmniConverter Editorial Team" },
    "publisher": { "@type": "Organization", "name": "OmniConverter", "logo": { "@type": "ImageObject", "url": "https://www.omniconverter.co.uk/logo.png" } }
  }
  </script>
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
    <article class="content-section">
      <span class="formula-badge">${ui.badge}</span>
      <h1 style="font-size:2.1rem; font-weight:800; margin:0.75rem 0 1rem 0;">${l.title}</h1>
      <p>Umrechnung und Berechnung von <strong>${l.title}</strong> mit höchster mathematischer Genauigkeit nach internationalen Standards.</p>
      
      <div style="background:var(--bg-elevated); border-left:4px solid var(--primary-600); padding:1.25rem 1.5rem; border-radius:var(--radius-lg); margin:1.5rem 0;">
        <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; color:var(--text-main);">${ui.ansTitle}</h3>
        <p style="margin:0; font-size:1.25rem; font-weight:800; color:var(--primary-600);">${l.ans}</p>
      </div>

      <h2>${ui.formTitle}</h2>
      <div style="background:var(--bg-elevated); padding:1rem 1.25rem; border-radius:var(--radius-md); font-family:monospace; margin:1rem 0; font-size:1.05rem;">
        ${l.form}
      </div>
      <p style="color:var(--text-muted);">${ui.formExpl}</p>

      <h2>${ui.tableTitle}</h2>
      <p>Schnelle Orientierungswerte für typische Alltags- und Praxiswerte:</p>
      <div class="table-wrapper">
        <table class="conversion-table">
          <thead>
            <tr><th>Referenzwert</th><th>Genaues Ergebnis</th></tr>
          </thead>
          <tbody>
            <tr><td>Standardwert</td><td>${l.ans}</td></tr>
            <tr><td>Doppelter Wert (2x)</td><td>Zweifaches Rechenergebnis gemäß Formel</td></tr>
            <tr><td>Halber Wert (0.5x)</td><td>Hälfte des Ausgangswerts</td></tr>
          </tbody>
        </table>
      </div>
    </article>

    <section class="related-guides-section" style="margin:2.5rem 0 1.5rem 0; padding:1.5rem; background:var(--bg-elevated); border:1px solid var(--card-border); border-left:4px solid var(--primary-600); border-radius:var(--radius-xl);">
      <h3 style="margin:0 0 0.5rem 0; font-size:1.15rem; font-weight:800; color:var(--text-main);">
        📖 ${ui.toolsTitle}
      </h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:0.85rem; margin-top:1rem;">
        <a href="/${lang}/" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600;">
          <span>${ui.toolLink1}</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
        <a href="/${lang}/blog" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600;">
          <span>${ui.toolLink2}</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>
      </div>
    </section>
  </main>
${makeFooter(lang)}
</body>
</html>`;
}

// Generate for all 50 topics in Spanish, German, and Portuguese
console.log('Generating 150 multilingual blog articles (50 ES, 50 DE, 50 PT)...');
for (const topic of TOPICS) {
  // Spanish
  fs.writeFileSync(path.join(esBlogDir, `${topic.es.slug}.html`), generateMultilingualBlogArticle('es', topic), 'utf8');
  // German
  fs.writeFileSync(path.join(deBlogDir, `${topic.de.slug}.html`), generateMultilingualBlogArticle('de', topic), 'utf8');
  // Portuguese
  fs.writeFileSync(path.join(ptBlogDir, `${topic.pt.slug}.html`), generateMultilingualBlogArticle('pt', topic), 'utf8');
}
console.log('All 150 blog articles successfully generated!');

// 4. GENERATE GERMAN & PORTUGUESE CORE TOOLS (Index, Temperature, Length, etc.)
const CORE_TOOLS = [
  { id: 'index', enUrl: '/', esUrl: '/es/', deUrl: '/de/', ptUrl: '/pt/' },
  { id: 'temperature', enUrl: '/temperature', esUrl: '/es/temperature', deUrl: '/de/temperature', ptUrl: '/pt/temperature', script: '/temperature-interactive.js' },
  { id: 'length', enUrl: '/length', esUrl: '/es/length', deUrl: '/de/length', ptUrl: '/pt/length', script: '/length-converter.js' },
  { id: 'weight-mass', enUrl: '/weight-mass', esUrl: '/es/weight-mass', deUrl: '/de/weight-mass', ptUrl: '/pt/weight-mass', script: '/weight-converter.js' },
  { id: 'volume-capacity', enUrl: '/volume-capacity', esUrl: '/es/volume-capacity', deUrl: '/de/volume-capacity', ptUrl: '/pt/volume-capacity', script: '/volume-converter.js' },
  { id: 'currency', enUrl: '/currency', esUrl: '/es/currency', deUrl: '/de/currency', ptUrl: '/pt/currency', script: '/currency-converter.js' },
  { id: 'area', enUrl: '/area', esUrl: '/es/area', deUrl: '/de/area', ptUrl: '/pt/area', script: '/area-converter.js' },
  { id: 'speed', enUrl: '/speed', esUrl: '/es/speed', deUrl: '/de/speed', ptUrl: '/pt/speed', script: '/speed-converter.js' },
  { id: 'time-duration', enUrl: '/time-duration', esUrl: '/es/time-duration', deUrl: '/de/time-duration', ptUrl: '/pt/time-duration', script: '/time-converter.js' },
  { id: 'time-zone', enUrl: '/time-zone', esUrl: '/es/time-zone', deUrl: '/de/time-zone', ptUrl: '/pt/time-zone', script: '/timezone-converter.js' },
  { id: 'file-media', enUrl: '/file-media', esUrl: '/es/file-media', deUrl: '/de/file-media', ptUrl: '/pt/file-media', script: '/file-converter.js' },
  { id: 'blog', enUrl: '/blog', esUrl: '/es/blog', deUrl: '/de/blog', ptUrl: '/pt/blog' },
  { id: 'about', enUrl: '/about', esUrl: '/es/about', deUrl: '/de/about', ptUrl: '/pt/about' },
  { id: 'contact', enUrl: '/contact', esUrl: '/es/contact', deUrl: '/de/contact', ptUrl: '/pt/contact' },
  { id: 'privacy-policy', enUrl: '/privacy-policy', esUrl: '/es/privacy-policy', deUrl: '/de/privacy-policy', ptUrl: '/pt/privacy-policy' },
  { id: 'terms', enUrl: '/terms', esUrl: '/es/terms', deUrl: '/de/terms', ptUrl: '/pt/terms' },
  { id: 'sitemap', enUrl: '/sitemap', esUrl: '/es/sitemap', deUrl: '/de/sitemap', ptUrl: '/pt/sitemap' }
];

function generateCorePage(lang, tool) {
  const titles = {
    de: {
      index: 'OmniConverter auf Deutsch: Universeller Einheiten- & Dateiumrechner',
      temperature: 'Temperatur-Umrechner: Celsius, Fahrenheit, Kelvin & Rankine',
      length: 'Längen- und Distanzumrechner: Meter, Fuß, Zoll, Kilometer',
      'weight-mass': 'Gewichts- und Massenumrechner: Kilogramm, Pfund, Unzen',
      'volume-capacity': 'Volumen- und Raummaßumrechner: Liter, Gallonen, Milliliter',
      currency: 'Währungsrechner in Echtzeit: EUR, USD, GBP, CHF',
      area: 'Flächenumrechner: Quadratmeter, Hektar, Quadratfuß, Acres',
      speed: 'Geschwindigkeitsumrechner: KM/H, MPH, Knoten, M/S',
      'time-duration': 'Zeitumrechner: Stunden, Minuten, Sekunden, Tage',
      'time-zone': 'Weltzeituhr & Zeitzonen-Umrechner',
      'file-media': 'Datei- und Medienumrechner im Browser',
      blog: 'Blog & Ratgeber für Maßeinheiten und Berechnungen',
      about: 'Über OmniConverter',
      contact: 'Kontakt & Technischer Support',
      'privacy-policy': 'Datenschutzerklärung',
      terms: 'Nutzungsbedingungen',
      sitemap: 'HTML-Sitemap auf Deutsch'
    },
    pt: {
      index: 'OmniConverter em Português: Conversor Universal de Unidades',
      temperature: 'Conversor de Temperatura: Celsius, Fahrenheit, Kelvin & Rankine',
      length: 'Conversor de Comprimento e Distância: Metros, Pés, Polegadas',
      'weight-mass': 'Conversor de Peso e Massa: Quilos, Libras, Onças',
      'volume-capacity': 'Conversor de Volume e Capacidade: Litros, Galões, ML',
      currency: 'Conversor de Moedas em Tempo Real: BRL, USD, EUR, GBP',
      area: 'Conversor de Área: Metros Quadrados, Hectares, Alqueires',
      speed: 'Conversor de Velocidade: KM/H, MPH, Nós, M/S',
      'time-duration': 'Conversor de Tempo e Duração: Horas, Minutos, Segundos',
      'time-zone': 'Fuso Horário Mundial e Relógio Global',
      'file-media': 'Conversor de Arquivos e Mídia no Navegador',
      blog: 'Blog e Guias de Conversão de Medidas',
      about: 'Sobre o OmniConverter',
      contact: 'Contato e Suporte Técnico',
      'privacy-policy': 'Política de Privacidade',
      terms: 'Termos de Serviço',
      sitemap: 'Mapa do Site em Português'
    }
  };

  const tTitle = titles[lang][tool.id];
  const paths = {
    en: tool.enUrl,
    es: tool.esUrl,
    de: tool.deUrl,
    pt: tool.ptUrl
  };

  const canonical = `https://www.omniconverter.co.uk${paths[lang]}`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${COMMON_HEAD_TAGS}
  <title>${tTitle} | OmniConverter</title>
  <meta name="description" content="${tTitle}. Schnelle und genaue Online-Berechnungen mit geprüften Formeln.">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${tTitle}">
  <meta property="og:description" content="${tTitle} bei OmniConverter.">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:title" content="${tTitle}">
  <meta name="twitter:description" content="${tTitle}">
${makeMultilingualHreflang(paths.en, paths.es, paths.de, paths.pt)}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "${tTitle}",
    "url": "${canonical}",
    "image": "https://www.omniconverter.co.uk/logo.png",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "inLanguage": "${lang}",
    "description": "${tTitle}"
  }
  </script>
</head>
<body>
${makeHeader(lang, tool.id === 'index' ? 'home' : tool.id, paths)}
  <main style="max-width: 1150px; width: 100%;">
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/${lang}/">OmniConverter</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">${tTitle}</span>
    </nav>
    <article class="content-section">
      <h1>${tTitle}</h1>
      <p style="font-size:1.05rem; color:var(--text-muted); line-height:1.7;">Verifizierte Umrechnungen und interaktive Rechner für Alltag, Handwerk, Wissenschaft und internationale Reisen.</p>
      <div style="background:var(--bg-elevated); padding:1.5rem; border-radius:var(--radius-lg); border:1px solid var(--card-border); margin:1.5rem 0;">
        <h2 style="font-size:1.2rem; font-weight:700; margin-bottom:0.75rem;">⚡ Interaktive Anwendung</h2>
        <p style="margin-bottom:1rem; color:var(--text-muted);">Nutzen Sie unsere zertifizierten Umrechnungsmodule für sekundenschnelle Resultate.</p>
        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <a href="/${lang}/" class="tab-btn active" style="text-decoration:none; padding:0.6rem 1.25rem;">← Startseite</a>
          <a href="/${lang}/blog" class="tab-btn" style="text-decoration:none; padding:0.6rem 1.25rem; background:var(--card-bg); border:1px solid var(--card-border);">Alle Ratgeber</a>
        </div>
      </div>
    </article>
  </main>
${makeFooter(lang)}
  ${tool.script ? `<script type="module" src="${tool.script}"></script>` : ''}
</body>
</html>`;
}

console.log('Writing German and Portuguese core tool pages...');
for (const tool of CORE_TOOLS) {
  const fileName = tool.id === 'index' ? 'index.html' : `${tool.id}.html`;
  // German
  fs.writeFileSync(path.join(deDir, fileName), generateCorePage('de', tool), 'utf8');
  // Portuguese
  fs.writeFileSync(path.join(ptDir, fileName), generateCorePage('pt', tool), 'utf8');
}
console.log('Core pages written for DE and PT!');

// 5. UPDATE ALL ENGLISH FILES WITH UPDATED 4-WAY LANGUAGE SWITCHER AND HREFLANG
console.log('Updating language switchers and hreflang in all English files...');
function updateEnglishHeadersAndHreflang(filePath, relPath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let topic = null;
  if (relPath.startsWith('blog/')) {
    const slug = relPath.replace('blog/', '').replace('.html', '');
    topic = topicMap.get(slug);
  }

  const enPath = relPath === 'index.html' ? '/' : `/${relPath.replace(/\.html$/, '')}`;
  let esPath = '/es/blog';
  let dePath = '/de/blog';
  let ptPath = '/pt/blog';

  if (topic) {
    esPath = `/es/blog/${topic.es.slug}`;
    dePath = `/de/blog/${topic.de.slug}`;
    ptPath = `/pt/blog/${topic.pt.slug}`;
  } else {
    const matchTool = CORE_TOOLS.find(t => t.enUrl === enPath);
    if (matchTool) {
      esPath = matchTool.esUrl;
      dePath = matchTool.deUrl;
      ptPath = matchTool.ptUrl;
    }
  }

  // Update or insert lang-switcher
  const newSwitcher = `<div class="lang-switcher" aria-label="Language Selector">
        <span class="active" title="English">🇬🇧 EN</span>
        <span class="lang-sep">|</span>
        <a href="${esPath}" title="Español">🇪🇸 ES</a>
        <span class="lang-sep">|</span>
        <a href="${dePath}" title="Deutsch">🇩🇪 DE</a>
        <span class="lang-sep">|</span>
        <a href="${ptPath}" title="Português">🇧🇷 PT</a>
      </div>`;

  if (content.includes('class="lang-switcher"')) {
    content = content.replace(/<div class="lang-switcher"[\s\S]*?<\/div>/, newSwitcher);
  } else {
    content = content.replace('</nav>', `</nav>\n      ${newSwitcher}`);
  }

  // Update hreflang
  const hreflangBlock = makeMultilingualHreflang(enPath, esPath, dePath, ptPath);
  if (content.includes('hreflang="en"')) {
    content = content.replace(/<link rel="alternate" hreflang="[\s\S]*?href="https:\/\/www\.omniconverter\.co\.uk[^"]*">/g, '');
    content = content.replace('</head>', `${hreflangBlock}\n</head>`);
  } else {
    content = content.replace('</head>', `${hreflangBlock}\n</head>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

// Update all root files
const rootHtmls = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
for (const rf of rootHtmls) {
  updateEnglishHeadersAndHreflang(path.join(rootDir, rf), rf);
}

// Update all English blog files
const allEnBlog = fs.readdirSync(path.join(rootDir, 'blog')).filter(f => f.endsWith('.html'));
for (const bf of allEnBlog) {
  updateEnglishHeadersAndHreflang(path.join(rootDir, 'blog', bf), `blog/${bf}`);
}

console.log('All English files updated with 4-way language switcher and hreflang!');

// 6. UPDATE SITEMAP.XML WITH ALL NEW MULTILINGUAL & INDIAN URLS
console.log('Rebuilding clean sitemap.xml...');
const sitemapUrls = new Set();

// Add root tools
rootHtmls.forEach(f => {
  const p = f === 'index.html' ? '/' : `/${f.replace('.html', '')}`;
  sitemapUrls.add(`https://www.omniconverter.co.uk${p}`);
});

// Add all English blog articles
allEnBlog.forEach(f => {
  sitemapUrls.add(`https://www.omniconverter.co.uk/blog/${f.replace('.html', '')}`);
});

// Add all Spanish pages
CORE_TOOLS.forEach(t => sitemapUrls.add(`https://www.omniconverter.co.uk${t.esUrl}`));
TOPICS.forEach(t => sitemapUrls.add(`https://www.omniconverter.co.uk/es/blog/${t.es.slug}`));

// Add all German pages
CORE_TOOLS.forEach(t => sitemapUrls.add(`https://www.omniconverter.co.uk${t.deUrl}`));
TOPICS.forEach(t => sitemapUrls.add(`https://www.omniconverter.co.uk/de/blog/${t.de.slug}`));

// Add all Portuguese pages
CORE_TOOLS.forEach(t => sitemapUrls.add(`https://www.omniconverter.co.uk${t.ptUrl}`));
TOPICS.forEach(t => sitemapUrls.add(`https://www.omniconverter.co.uk/pt/blog/${t.pt.slug}`));

let newSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const u of sitemapUrls) {
  let prio = '0.8';
  let freq = 'weekly';
  if (u === 'https://www.omniconverter.co.uk/' || u === 'https://www.omniconverter.co.uk/es/' || u === 'https://www.omniconverter.co.uk/de/' || u === 'https://www.omniconverter.co.uk/pt/') {
    prio = '1.0';
    freq = 'daily';
  } else if (u.includes('/privacy-policy') || u.includes('/terms') || u.includes('/sitemap') || u.includes('/about') || u.includes('/contact')) {
    prio = '0.5';
    freq = 'monthly';
  }
  newSitemap += `  <url><loc>${u}</loc><lastmod>2026-10-05</lastmod><changefreq>${freq}</changefreq><priority>${prio}</priority></url>\n`;
}
newSitemap += `</urlset>\n`;

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), newSitemap, 'utf8');
console.log(`Sitemap generated with ${sitemapUrls.size} URLs!`);
