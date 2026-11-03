/**
 * fix-multilingual-schema.js
 * Applies schema, footer, and blog index upgrades to ES, DE, PT language versions.
 * Mirrors what was done for EN in fix-schema-all.js and fix-blog-schema.js.
 */

const fs = require('fs');
const path = require('path');
const TODAY = '2026-11-03';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function stripJsonLd(html) {
  return html.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '');
}
function insertBeforeHead(html, block) {
  return html.replace(/<\/head>/i, block + '\n</head>');
}
function fixFooter(html) {
  return html.replace(/OmniConverter Suite/g, 'OmniConverter');
}
function addMethodologyLink(html, lang) {
  if (html.includes(`/${lang}/methodology`) || html.includes('/methodology')) return html;
  // Add to footer before privacy link
  html = html.replace(
    /(<a href=["']\/privacy-policy["'][^>]*>Privacy(?:\s+Policy)?<\/a>)/gi,
    `<a href="/${lang}/methodology" style="color:var(--primary-600);">Methodology</a> | $1`
  );
  return html;
}

// ─── Language config ──────────────────────────────────────────────────────────
const LANG_CONFIG = {
  es: {
    locale: 'es',
    inLanguage: 'es',
    orgName: 'OmniConverter',
    websiteName: 'OmniConverter',
    baseUrl: 'https://www.omniconverter.co.uk/es',
    tools: {
      'temperature.html':    { title: 'Convertidor de Temperatura: Celsius, Fahrenheit y Kelvin | OmniConverter', slug:'temperature', name:'OmniConverter Convertidor de Temperatura', breadcrumb:'Convertidor de Temperatura', featureList:'Celsius, Fahrenheit, Kelvin y Rankine; fórmulas en vivo; funciona en el navegador' },
      'weight-mass.html':    { title: 'Convertidor de Peso y Masa: kg, lbs, Piedras | OmniConverter', slug:'weight-mass', name:'OmniConverter Convertidor de Peso y Masa', breadcrumb:'Convertidor de Peso', featureList:'Kilogramos, gramos, libras, onzas, piedras y tola; fórmulas en vivo' },
      'length.html':         { title: 'Convertidor de Longitud: Metros, Pies, Pulgadas | OmniConverter', slug:'length', name:'OmniConverter Convertidor de Longitud', breadcrumb:'Convertidor de Longitud', featureList:'Metros, pies, pulgadas, centímetros, millas y yardas' },
      'currency.html':       { title: 'Convertidor de Divisas: USD, GBP, EUR, AUD | OmniConverter', slug:'currency', name:'OmniConverter Convertidor de Divisas', breadcrumb:'Convertidor de Divisas', featureList:'USD, GBP, EUR, AUD, JPY, INR y más de 10 divisas' },
      'volume-capacity.html':{ title: 'Convertidor de Volumen: Litros, Tazas, Galones | OmniConverter', slug:'volume-capacity', name:'OmniConverter Convertidor de Volumen', breadcrumb:'Convertidor de Volumen', featureList:'Litros, mililitros, tazas, galones, onzas líquidas, cucharadas' },
      'time-duration.html':  { title: 'Convertidor de Tiempo: Segundos, Minutos, Horas | OmniConverter', slug:'time-duration', name:'OmniConverter Convertidor de Tiempo', breadcrumb:'Convertidor de Tiempo', featureList:'Segundos, minutos, horas, días y semanas' },
      'time-zone.html':      { title: 'Convertidor de Zona Horaria: Reloj Mundial | OmniConverter', slug:'time-zone', name:'OmniConverter Convertidor de Zona Horaria', breadcrumb:'Zona Horaria', featureList:'Convertidor mundial de zonas horarias con soporte de horario de verano' },
      'area.html':           { title: 'Convertidor de Área: m², ft², Acres, Hectáreas | OmniConverter', slug:'area', name:'OmniConverter Convertidor de Área', breadcrumb:'Convertidor de Área', featureList:'Metros cuadrados, pies cuadrados, acres, hectáreas y más' },
      'speed.html':          { title: 'Convertidor de Velocidad: km/h, mph, m/s | OmniConverter', slug:'speed', name:'OmniConverter Convertidor de Velocidad', breadcrumb:'Convertidor de Velocidad', featureList:'km/h, mph, m/s y nudos' },
      'file-media.html':     { title: 'Convertidor de Archivos: PNG, JPEG, WebP, JSON | OmniConverter', slug:'file-media', name:'OmniConverter Convertidor de Archivos', breadcrumb:'Convertidor de Archivos', featureList:'PNG, JPEG, WebP, JSON, CSV; funciona en el navegador sin subir archivos' },
    },
    blogTitle: 'Guías de Conversión y Artículos | OmniConverter',
    blogDesc: 'Guías detalladas de conversión de monedas, peso, temperatura, volumen, longitud y más.',
    aboutPage: 'Acerca de OmniConverter',
    contactPage: 'Contactar OmniConverter',
    methodologySlug: 'methodology',
  },
  de: {
    locale: 'de',
    inLanguage: 'de',
    orgName: 'OmniConverter',
    websiteName: 'OmniConverter',
    baseUrl: 'https://www.omniconverter.co.uk/de',
    tools: {
      'temperature.html':    { title: 'Temperaturrechner: Celsius, Fahrenheit, Kelvin | OmniConverter', slug:'temperature', name:'OmniConverter Temperaturrechner', breadcrumb:'Temperaturrechner', featureList:'Celsius, Fahrenheit, Kelvin und Rankine; Live-Formeln; läuft im Browser' },
      'weight-mass.html':    { title: 'Gewichtsrechner: kg, lbs, Stein, Gramm | OmniConverter', slug:'weight-mass', name:'OmniConverter Gewichtsrechner', breadcrumb:'Gewichtsrechner', featureList:'Kilogramm, Gramm, Pfund, Unzen, Stein und Tola; Live-Formeln' },
      'length.html':         { title: 'Längenrechner: Meter, Fuß, Zoll, Meilen | OmniConverter', slug:'length', name:'OmniConverter Längenrechner', breadcrumb:'Längenrechner', featureList:'Meter, Fuß, Zoll, Zentimeter, Meilen und Yards' },
      'currency.html':       { title: 'Währungsrechner: USD, GBP, EUR, AUD | OmniConverter', slug:'currency', name:'OmniConverter Währungsrechner', breadcrumb:'Währungsrechner', featureList:'USD, GBP, EUR, AUD, JPY, INR und 10+ Währungen' },
      'volume-capacity.html':{ title: 'Volumenrechner: Liter, Tassen, Gallonen | OmniConverter', slug:'volume-capacity', name:'OmniConverter Volumenrechner', breadcrumb:'Volumenrechner', featureList:'Liter, Milliliter, Tassen, Gallonen, Flüssigunzen, Esslöffel' },
      'time-duration.html':  { title: 'Zeitrechner: Sekunden, Minuten, Stunden | OmniConverter', slug:'time-duration', name:'OmniConverter Zeitrechner', breadcrumb:'Zeitrechner', featureList:'Sekunden, Minuten, Stunden, Tage und Wochen' },
      'time-zone.html':      { title: 'Zeitzonenrechner: Weltzeituhr | OmniConverter', slug:'time-zone', name:'OmniConverter Zeitzonenrechner', breadcrumb:'Zeitzone', featureList:'Weltweiter Zeitzonenrechner mit Sommerzeit-Unterstützung' },
      'area.html':           { title: 'Flächenrechner: m², ft², Acres, Hektar | OmniConverter', slug:'area', name:'OmniConverter Flächenrechner', breadcrumb:'Flächenrechner', featureList:'Quadratmeter, Quadratfuß, Acres, Hektar und mehr' },
      'speed.html':          { title: 'Geschwindigkeitsrechner: km/h, mph, m/s | OmniConverter', slug:'speed', name:'OmniConverter Geschwindigkeitsrechner', breadcrumb:'Geschwindigkeitsrechner', featureList:'km/h, mph, m/s und Knoten' },
      'file-media.html':     { title: 'Dateikonverter: PNG, JPEG, WebP, JSON | OmniConverter', slug:'file-media', name:'OmniConverter Dateikonverter', breadcrumb:'Dateikonverter', featureList:'PNG, JPEG, WebP, JSON, CSV; läuft im Browser ohne Datei-Upload' },
    },
    blogTitle: 'Umrechnungsanleitungen & Artikel | OmniConverter',
    blogDesc: 'Ausführliche Anleitungen zur Umrechnung von Währungen, Gewicht, Temperatur, Volumen, Länge und mehr.',
    aboutPage: 'Über OmniConverter',
    contactPage: 'Kontakt OmniConverter',
    methodologySlug: 'methodology',
  },
  pt: {
    locale: 'pt',
    inLanguage: 'pt',
    orgName: 'OmniConverter',
    websiteName: 'OmniConverter',
    baseUrl: 'https://www.omniconverter.co.uk/pt',
    tools: {
      'temperature.html':    { title: 'Conversor de Temperatura: Celsius, Fahrenheit, Kelvin | OmniConverter', slug:'temperature', name:'OmniConverter Conversor de Temperatura', breadcrumb:'Conversor de Temperatura', featureList:'Celsius, Fahrenheit, Kelvin e Rankine; fórmulas ao vivo; funciona no navegador' },
      'weight-mass.html':    { title: 'Conversor de Peso e Massa: kg, lbs, Pedras | OmniConverter', slug:'weight-mass', name:'OmniConverter Conversor de Peso e Massa', breadcrumb:'Conversor de Peso', featureList:'Quilogramas, gramas, libras, onças, pedras e tola; fórmulas ao vivo' },
      'length.html':         { title: 'Conversor de Comprimento: Metros, Pés, Polegadas | OmniConverter', slug:'length', name:'OmniConverter Conversor de Comprimento', breadcrumb:'Conversor de Comprimento', featureList:'Metros, pés, polegadas, centímetros, milhas e jardas' },
      'currency.html':       { title: 'Conversor de Moeda: USD, GBP, EUR, AUD | OmniConverter', slug:'currency', name:'OmniConverter Conversor de Moeda', breadcrumb:'Conversor de Moeda', featureList:'USD, GBP, EUR, AUD, JPY, INR e mais de 10 moedas' },
      'volume-capacity.html':{ title: 'Conversor de Volume: Litros, Xícaras, Galões | OmniConverter', slug:'volume-capacity', name:'OmniConverter Conversor de Volume', breadcrumb:'Conversor de Volume', featureList:'Litros, mililitros, xícaras, galões, onças líquidas, colheres de sopa' },
      'time-duration.html':  { title: 'Conversor de Tempo: Segundos, Minutos, Horas | OmniConverter', slug:'time-duration', name:'OmniConverter Conversor de Tempo', breadcrumb:'Conversor de Tempo', featureList:'Segundos, minutos, horas, dias e semanas' },
      'time-zone.html':      { title: 'Conversor de Fuso Horário: Relógio Mundial | OmniConverter', slug:'time-zone', name:'OmniConverter Conversor de Fuso Horário', breadcrumb:'Fuso Horário', featureList:'Conversor mundial de fusos horários com suporte a horário de verão' },
      'area.html':           { title: 'Conversor de Área: m², ft², Acres, Hectares | OmniConverter', slug:'area', name:'OmniConverter Conversor de Área', breadcrumb:'Conversor de Área', featureList:'Metros quadrados, pés quadrados, acres, hectares e mais' },
      'speed.html':          { title: 'Conversor de Velocidade: km/h, mph, m/s | OmniConverter', slug:'speed', name:'OmniConverter Conversor de Velocidade', breadcrumb:'Conversor de Velocidade', featureList:'km/h, mph, m/s e nós' },
      'file-media.html':     { title: 'Conversor de Arquivos: PNG, JPEG, WebP, JSON | OmniConverter', slug:'file-media', name:'OmniConverter Conversor de Arquivos', breadcrumb:'Conversor de Arquivos', featureList:'PNG, JPEG, WebP, JSON, CSV; funciona no navegador sem enviar arquivos' },
    },
    blogTitle: 'Guias de Conversão e Artigos | OmniConverter',
    blogDesc: 'Guias detalhados de conversão de moedas, peso, temperatura, volume, comprimento e mais.',
    aboutPage: 'Sobre o OmniConverter',
    contactPage: 'Contato OmniConverter',
    methodologySlug: 'methodology',
  }
};

// ─── Process each language ────────────────────────────────────────────────────
let totalFixed = 0;

Object.entries(LANG_CONFIG).forEach(([lang, cfg]) => {
  const langDir = path.join('.', lang);
  const blogDir = path.join(langDir, 'blog');

  // ── Org + WebSite block ──
  const ORG_BLOCK = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.omniconverter.co.uk/#organization",
        "name": "OmniConverter",
        "alternateName": "Omni Converter",
        "url": "https://www.omniconverter.co.uk/",
        "logo": { "@type": "ImageObject", "url": "https://www.omniconverter.co.uk/logo.png", "width": 512, "height": 512 },
        "description": "Free online unit, currency, time zone and browser-based file converters.",
        "sameAs": ["https://github.com/newskryptowahrung26-cell/OmniConverter-Suite"],
        "contactPoint": { "@type": "ContactPoint", "contactType": "customer support", "url": "https://www.omniconverter.co.uk/contact", "availableLanguage": ["en","es","de","pt"] }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.omniconverter.co.uk/#website",
        "url": "https://www.omniconverter.co.uk/",
        "name": "OmniConverter",
        "publisher": { "@id": "https://www.omniconverter.co.uk/#organization" },
        "inLanguage": "en-GB"
      }
    ]
  }
  </script>`;

  // ── 1. Tool pages ──
  Object.entries(cfg.tools).forEach(([file, t]) => {
    const fp = path.join(langDir, file);
    if (!fs.existsSync(fp)) return;
    let html = fs.readFileSync(fp, 'utf8');
    html = stripJsonLd(html);
    html = fixFooter(html);
    html = addMethodologyLink(html, lang);

    const schema = `${ORG_BLOCK}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "${cfg.baseUrl}/${t.slug}#webpage",
        "url": "${cfg.baseUrl}/${t.slug}",
        "name": "${t.breadcrumb}",
        "isPartOf": { "@id": "https://www.omniconverter.co.uk/#website" },
        "mainEntity": { "@id": "${cfg.baseUrl}/${t.slug}#app" },
        "inLanguage": "${cfg.inLanguage}",
        "dateModified": "${TODAY}"
      },
      {
        "@type": "WebApplication",
        "@id": "${cfg.baseUrl}/${t.slug}#app",
        "name": "${t.name}",
        "url": "${cfg.baseUrl}/${t.slug}",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any (web browser)",
        "browserRequirements": "Requires JavaScript",
        "isAccessibleForFree": true,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" },
        "featureList": "${t.featureList}",
        "publisher": { "@id": "https://www.omniconverter.co.uk/#organization" }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "${cfg.baseUrl}/${t.slug}#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "${cfg.baseUrl}/" },
          { "@type": "ListItem", "position": 2, "name": "${t.breadcrumb}" }
        ]
      }
    ]
  }
  </script>`;

    html = insertBeforeHead(html, schema);
    fs.writeFileSync(fp, html, 'utf8');
    totalFixed++;
  });

  // ── 2. index.html ──
  {
    const fp = path.join(langDir, 'index.html');
    if (fs.existsSync(fp)) {
      let html = fs.readFileSync(fp, 'utf8');
      html = stripJsonLd(html);
      html = fixFooter(html);
      html = addMethodologyLink(html, lang);
      html = insertBeforeHead(html, ORG_BLOCK);
      fs.writeFileSync(fp, html, 'utf8');
      totalFixed++;
    }
  }

  // ── 3. about.html ──
  {
    const fp = path.join(langDir, 'about.html');
    if (fs.existsSync(fp)) {
      let html = fs.readFileSync(fp, 'utf8');
      html = stripJsonLd(html);
      html = fixFooter(html);
      html = addMethodologyLink(html, lang);
      const schema = `${ORG_BLOCK}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "AboutPage",
      "@id": "${cfg.baseUrl}/about#webpage",
      "url": "${cfg.baseUrl}/about",
      "name": "${cfg.aboutPage}",
      "isPartOf": { "@id": "https://www.omniconverter.co.uk/#website" },
      "mainEntity": { "@id": "https://www.omniconverter.co.uk/#organization" },
      "inLanguage": "${cfg.inLanguage}"
    }]
  }
  </script>`;
      html = insertBeforeHead(html, schema);
      fs.writeFileSync(fp, html, 'utf8');
      totalFixed++;
    }
  }

  // ── 4. contact.html ──
  {
    const fp = path.join(langDir, 'contact.html');
    if (fs.existsSync(fp)) {
      let html = fs.readFileSync(fp, 'utf8');
      html = stripJsonLd(html);
      html = fixFooter(html);
      html = addMethodologyLink(html, lang);
      const schema = `${ORG_BLOCK}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "ContactPage",
      "@id": "${cfg.baseUrl}/contact#webpage",
      "url": "${cfg.baseUrl}/contact",
      "name": "${cfg.contactPage}",
      "isPartOf": { "@id": "https://www.omniconverter.co.uk/#website" },
      "inLanguage": "${cfg.inLanguage}"
    }]
  }
  </script>`;
      html = insertBeforeHead(html, schema);
      fs.writeFileSync(fp, html, 'utf8');
      totalFixed++;
    }
  }

  // ── 5. privacy-policy.html & terms.html ──
  ['privacy-policy.html', 'terms.html'].forEach(file => {
    const fp = path.join(langDir, file);
    if (!fs.existsSync(fp)) return;
    let html = fs.readFileSync(fp, 'utf8');
    html = stripJsonLd(html);
    html = fixFooter(html);
    html = addMethodologyLink(html, lang);
    html = insertBeforeHead(html, ORG_BLOCK);
    fs.writeFileSync(fp, html, 'utf8');
    totalFixed++;
  });

  // ── 6. sitemap.html ──
  {
    const fp = path.join(langDir, 'sitemap.html');
    if (fs.existsSync(fp)) {
      let html = fs.readFileSync(fp, 'utf8');
      html = fixFooter(html);
      html = addMethodologyLink(html, lang);
      fs.writeFileSync(fp, html, 'utf8');
      totalFixed++;
    }
  }

  // ── 7. blog.html (CollectionPage + full article index) ──
  {
    const fp = path.join(langDir, 'blog.html');
    if (!fs.existsSync(fp)) return;

    // Read all blog articles
    const articles = [];
    fs.readdirSync(blogDir).filter(f => f.endsWith('.html')).forEach(file => {
      const html = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
      const slug = file.replace('.html', '');
      const title = titleMatch ? titleMatch[1].replace(/ \| OmniConverter$/, '').replace(/&amp;/g,'&').trim() : slug;
      const desc = descMatch ? descMatch[1].replace(/&amp;/g,'&').trim() : '';
      articles.push({ slug, title, desc });
    });

    // Simple categorization by slug patterns
    const cats = { 'Moneda / Währung / Moeda': [], 'Peso y Masa': [], 'Temperatura': [], 'Volumen': [], 'Longitud': [], 'Área': [], 'Velocidad': [], 'Tiempo': [], 'Archivos': [], 'Otras Guías': [] };
    const catMap = {
      'Moneda / Währung / Moeda': ['usd','gbp','aud','eur','vnd','idr','won','krw','jpy','inr','lira','try','dollar','pound','rupiah','korean','rupee','mastercard','lakh','foreign','moneda','currency','währung','moeda','dolar','dollar','divisa'],
      'Peso y Masa': ['kg','lbs','stone','gram','ounce','kilo','pound','weight','libra','piedra'],
      'Temperatura': ['celsius','fahrenheit','kelvin','temperatura','temperature'],
      'Volumen': ['cup','ml','litre','gallon','oz','tbsp','tsp','volume','taza','xicara'],
      'Longitud': ['meter','feet','mile','inch','km','length','metro','pie','milla'],
      'Área': ['bigha','guntha','gaj','area','acre','sq-ft','square','quadrat'],
      'Velocidad': ['mph','kmh','speed','knot','velocidad','geschwindigkeit','velocidade'],
      'Tiempo': ['week','time','duration','hour','minute','tempo','tiempo'],
      'Archivos': ['file','pdf','format','file-changer','pwa','download','offline','archivo','datei'],
    };

    articles.forEach(a => {
      const s = a.slug.toLowerCase();
      let assigned = false;
      for (const [cat, patterns] of Object.entries(catMap)) {
        if (patterns.some(p => s.includes(p))) {
          cats[cat].push(a);
          assigned = true;
          break;
        }
      }
      if (!assigned) cats['Otras Guías'].push(a);
    });

    function buildGrid(arts) {
      if (!arts.length) return '';
      return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;margin-bottom:0.5rem;">\n${arts.map(a=>`    <a href="/${lang}/blog/${a.slug}" style="display:block;padding:1rem 1.1rem;background:#fff;border:1px solid var(--card-border);border-radius:var(--radius-md);text-decoration:none;color:inherit;">
      <div style="font-size:0.95rem;font-weight:700;color:var(--primary-600);margin-bottom:0.3rem;line-height:1.4;">${a.title.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
      ${a.desc?`<div style="font-size:0.82rem;color:var(--text-muted);line-height:1.4;">${a.desc.substring(0,100).replace(/</g,'&lt;').replace(/>/g,'&gt;')}${a.desc.length>100?'…':''}</div>`:''}
    </a>`).join('\n')}\n  </div>`;
    }

    const total = articles.length;
    const activeCats = Object.entries(cats).filter(([,a])=>a.length>0);

    let html = fs.readFileSync(fp, 'utf8');
    html = stripJsonLd(html);
    html = fixFooter(html);
    html = addMethodologyLink(html, lang);

    const collectionSchema = `${ORG_BLOCK}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "CollectionPage",
      "@id": "${cfg.baseUrl}/blog#webpage",
      "url": "${cfg.baseUrl}/blog",
      "name": "${cfg.blogTitle}",
      "isPartOf": { "@id": "https://www.omniconverter.co.uk/#website" },
      "inLanguage": "${cfg.inLanguage}",
      "description": "${cfg.blogDesc}"
    }]
  }
  </script>`;

    html = insertBeforeHead(html, collectionSchema);

    const newMain = `  <main>
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/${lang}/">Home</a>
      <span class="breadcrumb-separator">&rsaquo;</span>
      <span class="breadcrumb-current" aria-current="page">Blog</span>
    </nav>
    <section class="content-section" style="margin-top:1rem;">
      <h1>${cfg.blogTitle.replace(' | OmniConverter','')}</h1>
      <p style="font-size:1.05rem;color:var(--text-muted);margin-bottom:2rem;">${cfg.blogDesc} (${total} guides)</p>
      ${activeCats.map(([cat,arts])=>`
      <h2 style="font-size:1.3rem;font-weight:800;margin:2rem 0 0.75rem 0;padding-bottom:0.4rem;border-bottom:2px solid var(--primary-600);">${cat} <span style="font-size:0.9rem;font-weight:500;color:var(--text-muted);">(${arts.length})</span></h2>
      ${buildGrid(arts)}`).join('\n')}
    </section>
  </main>`;

    html = html.replace(/<main>[\s\S]*?<\/main>/i, newMain);
    fs.writeFileSync(fp, html, 'utf8');
    totalFixed++;
  }

  // ── 8. Blog articles ──
  const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
  blogFiles.forEach(file => {
    const fp = path.join(blogDir, file);
    let html = fs.readFileSync(fp, 'utf8');

    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    const dateMatch = html.match(/"datePublished"\s*:\s*"([^"]+)"/i);

    const slug = file.replace('.html', '');
    const fullUrl = `${cfg.baseUrl}/blog/${slug}`;
    const headline = (titleMatch ? titleMatch[1].replace(/ \| OmniConverter$/, '').replace(/&amp;/g,'&').trim() : slug).substring(0, 110);
    const description = descMatch ? descMatch[1].replace(/&amp;/g,'&').trim() : '';
    const datePublished = dateMatch ? dateMatch[1].substring(0, 10) : '2026-09-01';

    html = stripJsonLd(html);
    html = fixFooter(html);

    const schema = `${ORG_BLOCK}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": "${fullUrl}#article",
        "mainEntityOfPage": { "@id": "${fullUrl}#webpage" },
        "headline": ${JSON.stringify(headline)},
        "description": ${JSON.stringify(description)},
        "image": "https://www.omniconverter.co.uk/logo.png",
        "datePublished": "${datePublished}",
        "dateModified": "${TODAY}",
        "author": { "@type": "Organization", "@id": "https://www.omniconverter.co.uk/#organization", "name": "OmniConverter Editorial Team", "url": "https://www.omniconverter.co.uk/about" },
        "publisher": { "@id": "https://www.omniconverter.co.uk/#organization" },
        "inLanguage": "${cfg.inLanguage}"
      },
      {
        "@type": "WebPage",
        "@id": "${fullUrl}#webpage",
        "url": "${fullUrl}",
        "isPartOf": { "@id": "https://www.omniconverter.co.uk/#website" },
        "inLanguage": "${cfg.inLanguage}",
        "dateModified": "${TODAY}"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "${fullUrl}#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "${cfg.baseUrl}/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "${cfg.baseUrl}/blog" },
          { "@type": "ListItem", "position": 3, "name": ${JSON.stringify(headline)} }
        ]
      }
    ]
  }
  </script>`;

    html = insertBeforeHead(html, schema);
    fs.writeFileSync(fp, html, 'utf8');
    totalFixed++;
  });

  console.log(`✅ ${lang.toUpperCase()} done: ${10 + 1 + 1 + 1 + 2 + 1 + 1 + blogFiles.length} pages fixed`);
});

console.log(`\n✅ All multilingual schema upgrades complete. Total files: ${totalFixed}`);
