/**
 * fix-schema-all.js
 * Upgrades JSON-LD schema across all pages per structured data audit recommendations.
 * - Homepage: Organization + WebSite @graph, consistent titles
 * - Tool pages: WebPage + WebApplication + BreadcrumbList @graph
 * - About/Contact/Privacy/Terms: correct page type
 * - Blog.html: CollectionPage
 * - Footer: consistent "OmniConverter" (not "OmniConverter Suite")
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('.');
const TODAY = '2026-11-03';

// ─── Helper: strip all JSON-LD blocks from HTML ───────────────────────────────
function stripJsonLd(html) {
  return html.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '');
}

// ─── Helper: insert block just before </head> ─────────────────────────────────
function insertBeforeHead(html, block) {
  return html.replace(/<\/head>/i, block + '\n</head>');
}

// ─── Helper: fix meta titles ──────────────────────────────────────────────────
function fixTitle(html, newTitle) {
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${newTitle}</title>`);
  html = html.replace(/(<meta\s+property=["']og:title["']\s+content=["'])[^"']*(['"]\s*>)/i, `$1${newTitle}$2`);
  html = html.replace(/(<meta\s+name=["']twitter:title["']\s+content=["'])[^"']*(['"]\s*>)/i, `$1${newTitle}$2`);
  return html;
}

// ─── Helper: fix footer ───────────────────────────────────────────────────────
function fixFooter(html) {
  return html.replace(/OmniConverter Suite/g, 'OmniConverter');
}

// ─── SITEWIDE Organization + WebSite block (injected on every page) ──────────
const ORG_WEBSITE_SCHEMA = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.omniconverter.co.uk/#organization",
        "name": "OmniConverter",
        "alternateName": "Omni Converter",
        "url": "https://www.omniconverter.co.uk/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.omniconverter.co.uk/logo.png",
          "width": 512,
          "height": 512
        },
        "description": "Free online unit, currency, time zone and browser-based file converters.",
        "foundingDate": "2026",
        "sameAs": [
          "https://github.com/newskryptowahrung26-cell/OmniConverter-Suite",
          "https://www.pinterest.co.uk/omniconverter/"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": "info.omniconverter@gmail.com",
          "url": "https://www.omniconverter.co.uk/contact",
          "availableLanguage": ["en", "es", "de", "pt"]
        }
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

// ─── Tool pages config ────────────────────────────────────────────────────────
const TOOL_PAGES = {
  'temperature.html': {
    title: 'Temperature Converter: Celsius, Fahrenheit & Kelvin | OmniConverter',
    slug: 'temperature',
    name: 'OmniConverter Temperature Converter',
    breadcrumbName: 'Temperature Converter',
    featureList: 'Celsius, Fahrenheit, Kelvin and Rankine; live conversion formulas; runs entirely in-browser'
  },
  'weight-mass.html': {
    title: 'Weight & Mass Converter: kg, lbs, Stone, Grams | OmniConverter',
    slug: 'weight-mass',
    name: 'OmniConverter Weight & Mass Converter',
    breadcrumbName: 'Weight & Mass Converter',
    featureList: 'Kilograms, grams, pounds, ounces, stone and tola; live formulas; runs locally in the browser'
  },
  'length.html': {
    title: 'Length Converter: Meters, Feet, Inches, Miles | OmniConverter',
    slug: 'length',
    name: 'OmniConverter Length Converter',
    breadcrumbName: 'Length Converter',
    featureList: 'Meters, feet, inches, centimeters, miles and yards; live formulas; runs locally in the browser'
  },
  'currency.html': {
    title: 'Currency Converter: USD, GBP, EUR, AUD & More | OmniConverter',
    slug: 'currency',
    name: 'OmniConverter Currency Converter',
    breadcrumbName: 'Currency Converter',
    featureList: 'USD, GBP, EUR, AUD, JPY, INR and 10+ currencies; live exchange rate calculations'
  },
  'volume-capacity.html': {
    title: 'Volume & Capacity Converter: Liters, Cups, Gallons | OmniConverter',
    slug: 'volume-capacity',
    name: 'OmniConverter Volume & Capacity Converter',
    breadcrumbName: 'Volume & Capacity Converter',
    featureList: 'Liters, milliliters, cups, gallons, fluid ounces, tablespoons and teaspoons; live formulas'
  },
  'time-duration.html': {
    title: 'Time Duration Converter: Seconds, Minutes, Hours | OmniConverter',
    slug: 'time-duration',
    name: 'OmniConverter Time Duration Converter',
    breadcrumbName: 'Time Duration Converter',
    featureList: 'Seconds, minutes, hours, days and weeks; live calculator; runs locally in the browser'
  },
  'time-zone.html': {
    title: 'Time Zone Converter: World Clock & DST Guide | OmniConverter',
    slug: 'time-zone',
    name: 'OmniConverter Time Zone Converter',
    breadcrumbName: 'Time Zone Converter',
    featureList: 'World time zone converter with daylight saving support; live clock comparison'
  },
  'area.html': {
    title: 'Area Converter: m², ft², Acres, Hectares, Bigha | OmniConverter',
    slug: 'area',
    name: 'OmniConverter Area Converter',
    breadcrumbName: 'Area Converter',
    featureList: 'Square meters, square feet, acres, hectares, bigha, guntha and more; live formulas'
  },
  'speed.html': {
    title: 'Speed Converter: km/h, mph, m/s & Knots | OmniConverter',
    slug: 'speed',
    name: 'OmniConverter Speed Converter',
    breadcrumbName: 'Speed Converter',
    featureList: 'km/h, mph, m/s and knots; live speed converter'
  },
  'file-media.html': {
    title: 'File & Media Converter: PNG, JPEG, WebP, JSON | OmniConverter',
    slug: 'file-media',
    name: 'OmniConverter File & Media Converter',
    breadcrumbName: 'File & Media Converter',
    featureList: 'PNG, JPEG, WebP, JSON, CSV format conversion; runs entirely in browser; no upload to servers'
  },
  'indian-units.html': {
    title: 'Indian Unit Converter: Bigha, Tola, Crore, Lakh | OmniConverter',
    slug: 'indian-units',
    name: 'OmniConverter Indian Units Converter',
    breadcrumbName: 'Indian Units Converter',
    featureList: 'Bigha, guntha, gaj, tola, crore and lakh; traditional Indian measurement units'
  }
};

// ─── Fix tool pages ───────────────────────────────────────────────────────────
let count = 0;
Object.entries(TOOL_PAGES).forEach(([file, cfg]) => {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) { console.log('SKIP (not found):', file); return; }

  let html = fs.readFileSync(filePath, 'utf8');
  html = stripJsonLd(html);
  html = fixTitle(html, cfg.title);
  html = fixFooter(html);

  const schema = `  ${ORG_WEBSITE_SCHEMA}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.omniconverter.co.uk/${cfg.slug}#webpage",
        "url": "https://www.omniconverter.co.uk/${cfg.slug}",
        "name": "${cfg.breadcrumbName}",
        "isPartOf": { "@id": "https://www.omniconverter.co.uk/#website" },
        "mainEntity": { "@id": "https://www.omniconverter.co.uk/${cfg.slug}#app" },
        "inLanguage": "en-GB",
        "dateModified": "${TODAY}"
      },
      {
        "@type": "WebApplication",
        "@id": "https://www.omniconverter.co.uk/${cfg.slug}#app",
        "name": "${cfg.name}",
        "url": "https://www.omniconverter.co.uk/${cfg.slug}",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any (web browser)",
        "browserRequirements": "Requires JavaScript",
        "isAccessibleForFree": true,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" },
        "featureList": "${cfg.featureList}",
        "publisher": { "@id": "https://www.omniconverter.co.uk/#organization" }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.omniconverter.co.uk/${cfg.slug}#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.omniconverter.co.uk/" },
          { "@type": "ListItem", "position": 2, "name": "${cfg.breadcrumbName}" }
        ]
      }
    ]
  }
  </script>`;

  html = insertBeforeHead(html, schema);
  fs.writeFileSync(filePath, html, 'utf8');
  count++;
  console.log('Fixed tool page:', file);
});

// ─── Fix homepage ─────────────────────────────────────────────────────────────
{
  const filePath = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');
  html = stripJsonLd(html);
  html = fixTitle(html, 'OmniConverter: Free Unit, Currency & File Converter');
  html = fixFooter(html);
  html = insertBeforeHead(html, ORG_WEBSITE_SCHEMA);
  fs.writeFileSync(filePath, html, 'utf8');
  count++;
  console.log('Fixed: index.html');
}

// ─── Fix about.html ───────────────────────────────────────────────────────────
{
  const filePath = path.join(ROOT, 'about.html');
  let html = fs.readFileSync(filePath, 'utf8');
  html = stripJsonLd(html);
  html = fixFooter(html);
  const schema = `  ${ORG_WEBSITE_SCHEMA}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://www.omniconverter.co.uk/about#webpage",
        "url": "https://www.omniconverter.co.uk/about",
        "name": "About OmniConverter",
        "isPartOf": { "@id": "https://www.omniconverter.co.uk/#website" },
        "mainEntity": { "@id": "https://www.omniconverter.co.uk/#organization" },
        "inLanguage": "en-GB",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.omniconverter.co.uk/" },
            { "@type": "ListItem", "position": 2, "name": "About" }
          ]
        }
      }
    ]
  }
  </script>`;
  html = insertBeforeHead(html, schema);
  fs.writeFileSync(filePath, html, 'utf8');
  count++;
  console.log('Fixed: about.html');
}

// ─── Fix contact.html ─────────────────────────────────────────────────────────
{
  const filePath = path.join(ROOT, 'contact.html');
  let html = fs.readFileSync(filePath, 'utf8');
  html = stripJsonLd(html);
  html = fixFooter(html);
  const schema = `  ${ORG_WEBSITE_SCHEMA}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": "https://www.omniconverter.co.uk/contact#webpage",
        "url": "https://www.omniconverter.co.uk/contact",
        "name": "Contact OmniConverter",
        "isPartOf": { "@id": "https://www.omniconverter.co.uk/#website" },
        "inLanguage": "en-GB",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.omniconverter.co.uk/" },
            { "@type": "ListItem", "position": 2, "name": "Contact" }
          ]
        }
      }
    ]
  }
  </script>`;
  html = insertBeforeHead(html, schema);
  fs.writeFileSync(filePath, html, 'utf8');
  count++;
  console.log('Fixed: contact.html');
}

// ─── Fix privacy-policy.html & terms.html ────────────────────────────────────
['privacy-policy.html', 'terms.html'].forEach(file => {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  html = stripJsonLd(html);
  html = fixFooter(html);
  const pageName = file === 'privacy-policy.html' ? 'Privacy Policy' : 'Terms of Service';
  const slug = file === 'privacy-policy.html' ? 'privacy-policy' : 'terms';
  const schema = `  ${ORG_WEBSITE_SCHEMA}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "/@type": "WebPage",
    "@id": "https://www.omniconverter.co.uk/${slug}#webpage",
    "url": "https://www.omniconverter.co.uk/${slug}",
    "name": "${pageName} | OmniConverter",
    "isPartOf": { "@id": "https://www.omniconverter.co.uk/#website" },
    "inLanguage": "en-GB"
  }
  </script>`;
  html = insertBeforeHead(html, schema);
  fs.writeFileSync(filePath, html, 'utf8');
  count++;
  console.log('Fixed:', file);
});

// ─── Fix blog.html (CollectionPage) ──────────────────────────────────────────
{
  const filePath = path.join(ROOT, 'blog.html');
  let html = fs.readFileSync(filePath, 'utf8');
  html = stripJsonLd(html);
  html = fixFooter(html);
  const schema = `  ${ORG_WEBSITE_SCHEMA}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://www.omniconverter.co.uk/blog#webpage",
        "url": "https://www.omniconverter.co.uk/blog",
        "name": "Conversion Guides & Articles | OmniConverter",
        "isPartOf": { "@id": "https://www.omniconverter.co.uk/#website" },
        "inLanguage": "en-GB",
        "description": "Guides, formulas, and reference articles for unit conversions, currency exchange, and measurement calculations."
      }
    ]
  }
  </script>`;
  html = insertBeforeHead(html, schema);
  fs.writeFileSync(filePath, html, 'utf8');
  count++;
  console.log('Fixed: blog.html');
}

console.log('\n✅ Schema fix complete. Total files updated:', count);
