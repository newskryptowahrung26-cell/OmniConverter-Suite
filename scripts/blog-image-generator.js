/**
 * OmniConverter Bespoke Hero & OG Image Generator
 * Generates 100% unique, title-specific 1200x630 PNG images for every blog article
 * across EN, ES, DE, and PT, and exports generateArticleHeroImage() for vertex-publisher.js.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function escXml(str) {
  return String(str || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapTextLines(text, maxCharsPerLine, maxLines = 2) {
  const words = String(text || '').trim().split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur) {
      cur = w;
    } else if ((cur + ' ' + w).length <= maxCharsPerLine) {
      cur += ' ' + w;
    } else {
      lines.push(cur);
      cur = w;
      if (lines.length >= maxLines - 1) break;
    }
  }
  const usedWords = lines.join(' ').split(/\s+/).filter(Boolean).length;
  const remaining = words.slice(usedWords).join(' ');
  if (remaining) {
    if (remaining.length > maxCharsPerLine + 4) {
      lines.push(remaining.slice(0, maxCharsPerLine + 1).trim() + '...');
    } else {
      lines.push(remaining);
    }
  }
  return lines.slice(0, maxLines);
}

// 12 Rich, Distinct Color Palettes
const THEMES = [
  { name: 'royal-cyan', bg1: '#070B14', bg2: '#0F1C36', bg3: '#0C2D48', accent: '#38BDF8', accent2: '#818CF8', badgeBg: 'rgba(56,189,248,0.15)', badgeBorder: 'rgba(56,189,248,0.45)', cardBg1: '#162238', cardBg2: '#0B1324' },
  { name: 'emerald-gold', bg1: '#05120E', bg2: '#0A261E', bg3: '#0F382C', accent: '#34D399', accent2: '#FBBF24', badgeBg: 'rgba(52,211,153,0.15)', badgeBorder: 'rgba(52,211,153,0.45)', cardBg1: '#112A22', cardBg2: '#081712' },
  { name: 'indigo-rose', bg1: '#0D081B', bg2: '#1B1136', bg3: '#2B1644', accent: '#A78BFA', accent2: '#F472B6', badgeBg: 'rgba(167,139,250,0.16)', badgeBorder: 'rgba(167,139,250,0.45)', cardBg1: '#21163B', cardBg2: '#110B22' },
  { name: 'amber-obsidian', bg1: '#140E06', bg2: '#281B0B', bg3: '#38240E', accent: '#FBBF24', accent2: '#FB923C', badgeBg: 'rgba(251,191,36,0.15)', badgeBorder: 'rgba(251,191,36,0.45)', cardBg1: '#2D2010', cardBg2: '#171007' },
  { name: 'crimson-slate', bg1: '#16070C', bg2: '#2C0F19', bg3: '#3B1422', accent: '#FB7185', accent2: '#FBBF24', badgeBg: 'rgba(251,113,133,0.15)', badgeBorder: 'rgba(251,113,133,0.45)', cardBg1: '#31131E', cardBg2: '#19090F' },
  { name: 'teal-lime', bg1: '#051316', bg2: '#0B272D', bg3: '#10373F', accent: '#2DD4BF', accent2: '#A3E635', badgeBg: 'rgba(45,212,191,0.15)', badgeBorder: 'rgba(45,212,191,0.45)', cardBg1: '#112B31', cardBg2: '#081619' },
  { name: 'sunset-plum', bg1: '#150B1A', bg2: '#281431', bg3: '#3A1C35', accent: '#FB923C', accent2: '#E879F9', badgeBg: 'rgba(251,146,60,0.15)', badgeBorder: 'rgba(251,146,60,0.45)', cardBg1: '#2D1833', cardBg2: '#170B1B' },
  { name: 'cobalt-ice', bg1: '#070F1E', bg2: '#0E203E', bg3: '#15315B', accent: '#60A5FA', accent2: '#2DD4BF', badgeBg: 'rgba(96,165,250,0.15)', badgeBorder: 'rgba(96,165,250,0.45)', cardBg1: '#142646', cardBg2: '#0A1426' },
  { name: 'jade-forest', bg1: '#06140D', bg2: '#0D291B', bg3: '#143B27', accent: '#4ADE80', accent2: '#38BDF8', badgeBg: 'rgba(74,222,128,0.15)', badgeBorder: 'rgba(74,222,128,0.45)', cardBg1: '#122E20', cardBg2: '#091810' },
  { name: 'magenta-electric', bg1: '#140818', bg2: '#271030', bg3: '#1D1640', accent: '#E879F9', accent2: '#38BDF8', badgeBg: 'rgba(232,121,249,0.15)', badgeBorder: 'rgba(232,121,249,0.45)', cardBg1: '#251436', cardBg2: '#13091D' },
  { name: 'copper-bronze', bg1: '#170D08', bg2: '#2C1910', bg3: '#3C2316', accent: '#F97316', accent2: '#FACC15', badgeBg: 'rgba(249,115,22,0.15)', badgeBorder: 'rgba(249,115,22,0.45)', cardBg1: '#301C13', cardBg2: '#180E09' },
  { name: 'steel-coral', bg1: '#0A0F1A', bg2: '#162035', bg3: '#212B44', accent: '#F87171', accent2: '#60A5FA', badgeBg: 'rgba(248,113,113,0.15)', badgeBorder: 'rgba(248,113,113,0.45)', cardBg1: '#1C263D', cardBg2: '#0E1422' }
];

function hashSlug(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

// Vector Flag Renderer
function renderFlagSvg(code, x, y, w = 58, h = 40) {
  const c = (code || '').toUpperCase();
  const r = 6;
  let inner = '';
  if (c === 'USD') {
    inner = `
      <rect width="${w}" height="${h}" fill="#B22234"/>
      <path d="M0,${h*0.15} H${w} M0,${h*0.31} H${w} M0,${h*0.46} H${w} M0,${h*0.62} H${w} M0,${h*0.77} H${w} M0,${h*0.92} H${w}" stroke="#fff" stroke-width="${h*0.077}"/>
      <rect width="${w*0.44}" height="${h*0.54}" fill="#3C3B6E"/>
      <circle cx="${w*0.1}" cy="${h*0.14}" r="1.5" fill="#fff"/><circle cx="${w*0.22}" cy="${h*0.14}" r="1.5" fill="#fff"/><circle cx="${w*0.34}" cy="${h*0.14}" r="1.5" fill="#fff"/>
      <circle cx="${w*0.16}" cy="${h*0.27}" r="1.5" fill="#fff"/><circle cx="${w*0.28}" cy="${h*0.27}" r="1.5" fill="#fff"/>
      <circle cx="${w*0.1}" cy="${h*0.4}" r="1.5" fill="#fff"/><circle cx="${w*0.22}" cy="${h*0.4}" r="1.5" fill="#fff"/><circle cx="${w*0.34}" cy="${h*0.4}" r="1.5" fill="#fff"/>
    `;
  } else if (c === 'GBP' || c === 'UK') {
    inner = `
      <rect width="${w}" height="${h}" fill="#012169"/>
      <path d="M0,0 L${w},${h} M${w},0 L0,${h}" stroke="#fff" stroke-width="7"/>
      <path d="M0,0 L${w},${h} M${w},0 L0,${h}" stroke="#C8102E" stroke-width="3"/>
      <path d="M${w/2},0 V${h} M0,${h/2} H${w}" stroke="#fff" stroke-width="11"/>
      <path d="M${w/2},0 V${h} M0,${h/2} H${w}" stroke="#C8102E" stroke-width="6"/>
    `;
  } else if (c === 'AUD') {
    inner = `
      <rect width="${w}" height="${h}" fill="#00008B"/>
      <rect width="${w*0.45}" height="${h*0.5}" fill="#012169"/>
      <path d="M0,0 L${w*0.45},${h*0.5} M${w*0.45},0 L0,${h*0.5}" stroke="#fff" stroke-width="3.5"/>
      <path d="M${w*0.225},0 V${h*0.5} M0,${h*0.25} H${w*0.45}" stroke="#fff" stroke-width="5.5"/>
      <path d="M${w*0.225},0 V${h*0.5} M0,${h*0.25} H${w*0.45}" stroke="#C8102E" stroke-width="3"/>
      <circle cx="${w*0.225}" cy="${h*0.75}" r="3.8" fill="#fff"/>
      <circle cx="${w*0.75}" cy="${h*0.22}" r="2.2" fill="#fff"/>
      <circle cx="${w*0.64}" cy="${h*0.44}" r="2.2" fill="#fff"/>
      <circle cx="${w*0.86}" cy="${h*0.40}" r="2.2" fill="#fff"/>
      <circle cx="${w*0.75}" cy="${h*0.78}" r="2.6" fill="#fff"/>
    `;
  } else if (c === 'INR') {
    inner = `
      <rect width="${w}" height="${h/3}" fill="#FF9933"/>
      <rect y="${h/3}" width="${w}" height="${h/3}" fill="#FFFFFF"/>
      <rect y="${(h*2)/3}" width="${w}" height="${h/3}" fill="#138808"/>
      <circle cx="${w/2}" cy="${h/2}" r="${h*0.13}" fill="none" stroke="#000080" stroke-width="1.6"/>
      <circle cx="${w/2}" cy="${h/2}" r="1.5" fill="#000080"/>
    `;
  } else if (c === 'KRW') {
    inner = `
      <rect width="${w}" height="${h}" fill="#FFFFFF"/>
      <circle cx="${w/2}" cy="${h/2}" r="${h*0.25}" fill="#CD2E3A"/>
      <path d="M${w/2 - h*0.25},${h/2} A${h*0.125},${h*0.125} 0 0,0 ${w/2},${h/2} A${h*0.125},${h*0.125} 0 0,1 ${w/2 + h*0.25},${h/2} A${h*0.25},${h*0.25} 0 0,1 ${w/2 - h*0.25},${h/2} Z" fill="#0047A0"/>
      <line x1="${w*0.22}" y1="${h*0.28}" x2="${w*0.29}" y2="${h*0.18}" stroke="#000" stroke-width="2.2"/>
      <line x1="${w*0.71}" y1="${h*0.18}" x2="${w*0.78}" y2="${h*0.28}" stroke="#000" stroke-width="2.2"/>
      <line x1="${w*0.22}" y1="${h*0.72}" x2="${w*0.29}" y2="${h*0.82}" stroke="#000" stroke-width="2.2"/>
      <line x1="${w*0.71}" y1="${h*0.82}" x2="${w*0.78}" y2="${h*0.72}" stroke="#000" stroke-width="2.2"/>
    `;
  } else if (c === 'JPY') {
    inner = `
      <rect width="${w}" height="${h}" fill="#FFFFFF"/>
      <circle cx="${w/2}" cy="${h/2}" r="${h*0.28}" fill="#BC002D"/>
    `;
  } else if (c === 'VND') {
    inner = `
      <rect width="${w}" height="${h}" fill="#DA251D"/>
      <polygon points="${w/2},${h*0.20} ${w*0.56},${h*0.41} ${w*0.73},${h*0.41} ${w*0.59},${h*0.54} ${w*0.64},${h*0.75} ${w/2},${h*0.62} ${w*0.36},${h*0.75} ${w*0.41},${h*0.54} ${w*0.27},${h*0.41} ${w*0.44},${h*0.41}" fill="#FFFF00"/>
    `;
  } else if (c === 'TRY') {
    inner = `
      <rect width="${w}" height="${h}" fill="#E30A17"/>
      <circle cx="${w*0.42}" cy="${h/2}" r="${h*0.25}" fill="#fff"/>
      <circle cx="${w*0.47}" cy="${h/2}" r="${h*0.2}" fill="#E30A17"/>
      <polygon points="${w*0.64},${h*0.38} ${w*0.67},${h*0.47} ${w*0.75},${h*0.47} ${w*0.69},${h*0.53} ${w*0.71},${h*0.62} ${w*0.64},${h*0.56} ${w*0.57},${h*0.62} ${w*0.59},${h*0.53} ${w*0.53},${h*0.47} ${w*0.61},${h*0.47}" fill="#fff"/>
    `;
  } else if (c === 'IDR') {
    inner = `
      <rect width="${w}" height="${h/2}" fill="#E70011"/>
      <rect y="${h/2}" width="${w}" height="${h/2}" fill="#FFFFFF"/>
    `;
  } else {
    inner = `
      <rect width="${w}" height="${h}" fill="#003399"/>
      <circle cx="${w/2}" cy="${h/2}" r="${h*0.28}" fill="none" stroke="#FFCC00" stroke-width="3" stroke-dasharray="3.5 3.5"/>
    `;
  }
  const clipId = `flag_${c}_${x}_${y}`;
  return `
    <g transform="translate(${x}, ${y})">
      <defs><clipPath id="${clipId}"><rect width="${w}" height="${h}" rx="${r}"/></clipPath></defs>
      <g clip-path="url(#${clipId})">${inner}</g>
      <rect width="${w}" height="${h}" rx="${r}" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
    </g>
  `;
}

const CURRENCY_META = {
  USD: { name: 'US Dollar', sym: '$', rateFromUsd: 1 },
  GBP: { name: 'British Pound', sym: '£', rateFromUsd: 0.788 },
  AUD: { name: 'Australian Dollar', sym: 'A$', rateFromUsd: 1.53 },
  INR: { name: 'Indian Rupee', sym: '₹', rateFromUsd: 83.5 },
  KRW: { name: 'South Korean Won', sym: '₩', rateFromUsd: 1355 },
  JPY: { name: 'Japanese Yen', sym: '¥', rateFromUsd: 152 },
  VND: { name: 'Vietnamese Dong', sym: '₫', rateFromUsd: 25400 },
  TRY: { name: 'Turkish Lira', sym: '₺', rateFromUsd: 34.2 },
  IDR: { name: 'Indonesian Rupiah', sym: 'Rp ', rateFromUsd: 15650 },
  EUR: { name: 'Euro', sym: '€', rateFromUsd: 0.92 }
};

function fmtCurrencyVal(code, amount) {
  const meta = CURRENCY_META[code] || { sym: '' };
  if (amount >= 1e9) {
    return `${meta.sym}${(amount / 1e9).toFixed(0)} Billion`;
  }
  if (amount >= 1e6) {
    return `${meta.sym}${Math.round(amount).toLocaleString('en-US')}`;
  }
  if (amount >= 1000 && (code === 'VND' || code === 'IDR' || code === 'KRW' || code === 'JPY')) {
    return `${meta.sym}${Math.round(amount).toLocaleString('en-US')}`;
  }
  return `${meta.sym}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Extract structured conversion metadata for any article based on its canonical English slug & localized H1
function analyzeArticle(enSlug, localTitle, lang = 'en') {
  const s = enSlug.toLowerCase();
  const cleanH1 = String(localTitle || '').replace(/&amp;/g, '&').trim();
  const parts = cleanH1.split(':');
  const mainHeadline = parts[0].trim();
  const subHeadline = parts.slice(1).join(':').trim() || (
    lang === 'es' ? 'Fórmula Exacta, Tabla de Referencia y Calculadora' :
    lang === 'de' ? 'Exakte Formel, Referenztabelle & Live-Rechner' :
    lang === 'pt' ? 'Fórmula Exata, Tabela de Referência e Calculadora' :
    'Exact Formula, Reference Table & Live Calculator'
  );

  // Explicit per-article overrides for special slugs so every single one of the 71 articles is 100% spot-on
  const SPECIAL = {
    '1-3-cup-to-grams': {
      type: 'volume', badge: 'KITCHEN & CULINARY', headline: '1/3 Cup to Grams',
      fromLabel: 'VOLUME INPUT', fromUnit: '1/3 US Cup', fromVal: '78.9 mL',
      toLabel: 'WEIGHT IN GRAMS', toUnit: 'Water / Flour / Sugar', toVal: '78.9g / 40g / 66.7g',
      eq: '1/3 Cup = 78.9g (Water) • 66.7g (Sugar) • 40g (Flour)',
      formula: 'Grams = Cups × 236.59 mL × Ingredient Density (g/mL)',
      fillPct: 0.33
    },
    '1-4-cup-is-ml': {
      type: 'volume', badge: 'KITCHEN & VOLUME', headline: '1/4 Cup in mL',
      fromLabel: 'CUP VOLUME', fromUnit: '1/4 US Customary Cup', fromVal: '0.25 Cup',
      toLabel: 'MILLILITERS (mL)', toUnit: 'US vs Metric Cup', toVal: '59.15 mL / 62.5 mL',
      eq: '1/4 US Cup = 59.15 mL  •  1/4 Metric Cup = 62.50 mL',
      formula: 'mL = Cups × 236.588 mL (US)  |  Cups × 250 mL (Metric)',
      fillPct: 0.25
    },
    '1-cup-milk-in-milliliters': {
      type: 'volume', badge: 'KITCHEN & CULINARY', headline: '1 Cup Milk in mL',
      fromLabel: 'RECIPE MEASURE', fromUnit: '1 Cup Liquid Milk', fromVal: '1.00 Cup',
      toLabel: 'FLUID MILLILITERS', toUnit: 'US / Metric Volume', toVal: '236.59 mL / 250 mL',
      eq: '1 US Cup Milk = 236.59 mL  •  1 Metric Cup = 250 mL',
      formula: '1 US Cup = 236.588 mL  •  Weight ≈ 244g (at 1.03 g/mL)',
      fillPct: 0.72
    },
    '1-gallon-in-litres': {
      type: 'volume', badge: 'VOLUME & CAPACITY', headline: '1 Gallon in Litres',
      fromLabel: 'GALLON VOLUME', fromUnit: '1 Liquid Gallon (gal)', fromVal: '1.00 gal',
      toLabel: 'LITRES (L)', toUnit: 'US vs UK Imperial', toVal: '3.785 L / 4.546 L',
      eq: '1 US Gallon = 3.78541 Litres  •  1 UK Gallon = 4.54609 L',
      formula: 'Litres = US Gallons × 3.785411784',
      fillPct: 0.80
    },
    '1-tsp-is-ml': {
      type: 'volume', badge: 'KITCHEN & CULINARY', headline: '1 Teaspoon in mL',
      fromLabel: 'SPOON MEASURE', fromUnit: '1 Teaspoon (1 tsp)', fromVal: '1.00 tsp',
      toLabel: 'MILLILITERS (mL)', toUnit: 'Metric / US Standard', toVal: '5.00 mL / 4.93 mL',
      eq: '1 Metric/Nutrition tsp = 5.00 mL  •  1 US tsp = 4.929 mL',
      formula: 'mL = Teaspoons × 4.92892 (US)  |  Teaspoons × 5.0 (Metric)',
      fillPct: 0.22
    },
    '16-ounces-to-milliliters': {
      type: 'volume', badge: 'VOLUME & CAPACITY', headline: '16 oz to Milliliters',
      fromLabel: 'FLUID OUNCES', fromUnit: '16 US fl oz (1 Pint)', fromVal: '16 fl oz',
      toLabel: 'MILLILITERS (mL)', toUnit: 'Exact Fluid Volume', toVal: '473.18 mL',
      eq: '16 US fl oz = 473.18 mL  •  16 UK fl oz = 454.61 mL',
      formula: 'mL = US Fluid Ounces × 29.57353',
      fillPct: 0.65
    },
    '3-cups-in-ml': {
      type: 'volume', badge: 'KITCHEN & VOLUME', headline: '3 Cups in mL',
      fromLabel: 'CUP MEASURE', fromUnit: '3 Cups Volume', fromVal: '3.00 Cups',
      toLabel: 'MILLILITERS (mL)', toUnit: 'US vs Metric Cups', toVal: '709.76 mL / 750 mL',
      eq: '3 US Cups = 709.76 mL (≈710 mL)  •  3 Metric Cups = 750 mL',
      formula: 'mL = 3 × 236.588 mL = 709.76 mL (24 US fl oz)',
      fillPct: 0.75
    },
    '500-ml-to-cups': {
      type: 'volume', badge: 'KITCHEN & VOLUME', headline: '500 mL to Cups',
      fromLabel: 'MILLILITERS (mL)', fromUnit: 'Metric Liquid Volume', fromVal: '500 mL',
      toLabel: 'CUPS EQUIVALENT', toUnit: 'US vs Metric Cups', toVal: '2.11 US / 2.0 Metric',
      eq: '500 mL = 2.113 US Cups  •  Exactly 2.00 Metric Cups',
      formula: 'US Cups = 500 mL ÷ 236.588 = 2.1134 Cups',
      fillPct: 0.55
    },
    '1-bar-to-psi-conversion': {
      type: 'gauge', badge: 'PRESSURE & ENGINEERING', headline: '1 Bar to PSI',
      fromLabel: 'METRIC PRESSURE', fromUnit: 'Bar (100 kPa)', fromVal: '1.00 Bar',
      toLabel: 'IMPERIAL PRESSURE', toUnit: 'Pounds / Sq Inch', toVal: '14.5038 PSI',
      gaugeText: '14.50 PSI', gaugeSub: '1 Bar = 100 kPa',
      eq: '1 Bar = 14.5037738 PSI (Pounds per Square Inch)',
      formula: 'PSI = Bar × 14.5037738  •  1 atm = 1.01325 Bar'
    },
    '60-mph-to-kmh': {
      type: 'gauge', badge: 'SPEED & VELOCITY', headline: '60 MPH to KM/H',
      fromLabel: 'IMPERIAL SPEED', fromUnit: 'Miles Per Hour', fromVal: '60 MPH',
      toLabel: 'METRIC SPEED', toUnit: 'Kilometers Per Hour', toVal: '96.56 km/h',
      gaugeText: '96.56 km/h', gaugeSub: '60 MPH Highway Speed',
      eq: '60 MPH = 96.56064 km/h (26.82 Meters/Second)',
      formula: 'km/h = MPH × 1.609344'
    },
    '1-bigha-in-square-feet': {
      type: 'indian', badge: 'INDIAN LAND UNITS', headline: '1 Bigha in Sq Ft',
      fromLabel: 'TRADITIONAL UNIT', fromUnit: '1 Pucca Bigha', fromVal: '1 Bigha',
      toLabel: 'SQUARE FEET', toUnit: 'Standard Land Area', toVal: '27,225 sq ft',
      eq: '1 Standard Bigha = 27,225 sq ft (UP/Bihar/Rajasthan)',
      formula: '1 Bigha = 20 Biswa = 27,225 sq ft ≈ 0.625 Acres'
    },
    '1-gaj-in-square-feet': {
      type: 'indian', badge: 'INDIAN LAND UNITS', headline: '1 Gaj in Square Feet',
      fromLabel: 'PLOT MEASURE', fromUnit: '1 Square Gaj (Guz)', fromVal: '1 Gaj',
      toLabel: 'SQUARE FEET', toUnit: 'Exact Area Equivalent', toVal: '9.00 sq ft',
      eq: '1 Gaj (Square Yard) = Exactly 9 Square Feet (3 ft × 3 ft)',
      formula: 'Square Feet = Gaj × 9  •  100 Gaj Plot = 900 sq ft'
    },
    '1-guntha-in-sq-ft': {
      type: 'indian', badge: 'INDIAN LAND UNITS', headline: '1 Guntha in Sq Ft',
      fromLabel: 'REVENUE LAND UNIT', fromUnit: '1 Guntha (Maharashtra)', fromVal: '1 Guntha',
      toLabel: 'SQUARE FEET', toUnit: 'Exact Plot Area', toVal: '1,089 sq ft',
      eq: '1 Guntha = Exactly 1,089 Square Feet (33 ft × 33 ft)',
      formula: '40 Guntha = 1 Acre (43,560 sq ft)  •  1 Guntha = 101.17 m²'
    },
    '1-crore-in-millions': {
      type: 'indian', badge: 'INDIAN NUMBER SYSTEM', headline: '1 Crore in Millions',
      fromLabel: 'INDIAN NUMBERING', fromUnit: '1 Crore (1,00,00,000)', fromVal: '1 Crore',
      toLabel: 'WESTERN NUMBERING', toUnit: 'Millions Equivalent', toVal: '10 Million',
      eq: '1 Crore (1,00,00,000) = Exactly 10 Million (10,000,000)',
      formula: '1 Crore = 100 Lakhs = 10 Million = 10⁷'
    },
    '1-tola-in-grams': {
      type: 'weight', badge: 'BULLION & JEWELLERY', headline: '1 Tola in Grams',
      fromLabel: 'BULLION MEASURE', fromUnit: '1 Gold/Silver Tola', fromVal: '1.00 Tola',
      toLabel: 'METRIC MASS', toUnit: 'Bullion / British Tola', toVal: '10.00g / 11.66g',
      eq: '1 Modern Jewellery Tola = 10.00g  •  1 Historic Tola = 11.6638g',
      formula: 'Grams = Tola × 10.00g (Modern) or × 11.6638g (Troy)'
    },
    '15-meters-to-feet': {
      type: 'length', badge: 'LENGTH & DISTANCE', headline: '15 Meters to Feet',
      fromLabel: 'METRIC LENGTH', fromUnit: '15 Meters (m)', fromVal: '15.00 m',
      toLabel: 'IMPERIAL LENGTH', toUnit: 'Feet & Inches', toVal: '49.21 ft (49\' 2.5")',
      eq: '15 Meters = 49.2126 Feet (49 Feet 2.55 Inches)',
      formula: 'Feet = Meters × 3.2808399  •  15 × 3.28084 = 49.2126 ft'
    },
    '4-meters-to-feet': {
      type: 'length', badge: 'LENGTH & DISTANCE', headline: '4 Meters to Feet',
      fromLabel: 'METRIC LENGTH', fromUnit: '4 Meters (m)', fromVal: '4.00 m',
      toLabel: 'IMPERIAL LENGTH', toUnit: 'Feet & Inches', toVal: '13.12 ft (13\' 1.5")',
      eq: '4 Meters = 13.1234 Feet (13 Feet 1.48 Inches)',
      formula: 'Feet = Meters × 3.2808399  •  4 × 3.28084 = 13.1234 ft'
    },
    'weeks-calculator': {
      type: 'time', badge: 'TIME & DURATION', headline: 'Weeks Calculator',
      fromLabel: 'TIME UNIT', fromUnit: '1 Calendar Week', fromVal: '1 Week',
      toLabel: 'EXACT BREAKDOWN', toUnit: 'Days • Hours • Minutes', toVal: '7d • 168h • 10,080m',
      eq: '1 Week = 7 Days = 168 Hours = 10,080 Minutes',
      formula: 'Weeks = Days ÷ 7  •  1 Year = 52.143 Weeks (365 Days)'
    },
    'convert-file-type-to-pdf': {
      type: 'file', badge: 'FILE & PDF TOOLS', headline: 'Convert Any File to PDF',
      fromLabel: 'SOURCE FORMATS', fromUnit: 'DOCX • JPG • PNG • XLSX', fromVal: 'Input File',
      toLabel: 'UNIVERSAL OUTPUT', toUnit: 'ISO Standard Document', toVal: 'PDF Document',
      eq: 'Convert Word, Images & Spreadsheets to Universal PDF',
      formula: '100% Local Browser Processing • Preserves Vector Fonts & Layout'
    },
    'convert-pdf-form': {
      type: 'file', badge: 'FILE & PDF TOOLS', headline: 'Convert & Flatten PDF Forms',
      fromLabel: 'INTERACTIVE PDF', fromUnit: 'AcroForm / XFA Fields', fromVal: 'Fillable PDF',
      toLabel: 'LOCKED ARCHIVE', toUnit: 'Flattened Static Layer', toVal: 'Read-Only PDF',
      eq: 'Lock Fillable PDF Form Fields Into Permanent Static Text',
      formula: 'AcroForm / XFA ➔ Flattened Print-Ready PDF/A Document'
    },
    'converter-application-download': {
      type: 'file', badge: 'PRODUCT & PWA APP', headline: 'OmniConverter Web App',
      fromLabel: 'BROWSER ENGINE', fromUnit: 'iOS • Android • Desktop', fromVal: 'Web App',
      toLabel: 'OFFLINE CAPABLE', toUnit: 'Progressive Web App', toVal: 'Instant PWA',
      eq: 'Install OmniConverter PWA for 100% Offline Conversions',
      formula: 'Zero App Store Bloat • Works Offline via Service Worker'
    },
    'convertor-or-converter': {
      type: 'file', badge: 'TECHNICAL USAGE GUIDE', headline: 'Converter vs Convertor',
      fromLabel: 'STANDARD ENGLISH', fromUnit: '95% Global Usage', fromVal: 'Converter (-er)',
      toLabel: 'SPECIALIST VARIANT', toUnit: 'IEC / UK Electrical', toVal: 'Convertor (-or)',
      eq: '"Converter" = Standard English • "Convertor" = Technical Variant',
      formula: 'Latin "convertere" + "-er" Suffix = Standard Modern Spelling'
    },
    'file-changer': {
      type: 'file', badge: 'FILE & MEDIA TOOLS', headline: 'Online File Changer',
      fromLabel: 'SOURCE CONTAINER', fromUnit: 'PNG • WebP • JPG • SVG', fromVal: 'Original File',
      toLabel: 'TRUE TRANSCODING', toUnit: 'Re-Encoded Binary Header', toVal: 'Target Format',
      eq: 'True Container Transcoding vs Renaming File Extensions',
      formula: 'Canvas / WebAssembly Binary Re-Encoding in Browser'
    },
    'how-to-change-file-format': {
      type: 'file', badge: 'FILE & MEDIA TOOLS', headline: 'Change File Formats Safely',
      fromLabel: 'CROSS-PLATFORM', fromUnit: 'Windows • Mac • iOS • Android', fromVal: 'Source Format',
      toLabel: 'SAFE CONVERSION', toUnit: 'Verified MIME & Header', toVal: 'Converted File',
      eq: 'Safely Convert File Formats Across Windows, macOS & Mobile',
      formula: 'Export / Transcode Binary Stream Without Corrupting Headers'
    },
    'mastercard-foreign-exchange-rate': {
      type: 'currency', badge: 'CURRENCY & FOREX', headline: 'Mastercard FX Rates',
      fromCurr: 'USD', toCurr: 'EUR',
      fromLabel: 'NETWORK BASE RATE', fromUnit: 'Mastercard Wholesale FX', fromVal: '0.2% – 0.4% Spread',
      toLabel: 'ISSUER BANK FEE', toUnit: 'Foreign Transaction Fee', toVal: '0% vs 3.0% Markup',
      eq: 'Total Card Rate = Mastercard Base Rate + Bank FX Markup (0%–3%)',
      formula: 'Settlement Date Rate Applies (Not Transaction Authorization Time)'
    },
    'currency-for-turkish-lira': {
      type: 'currency', badge: 'CURRENCY & FOREX', headline: 'Turkish Lira (TRY / ₺)',
      fromCurr: 'USD', toCurr: 'TRY',
      fromLabel: 'MAJOR CURRENCY', fromUnit: 'USD ($) / EUR (€) / GBP (£)', fromVal: '$100.00 USD',
      toLabel: 'TURKISH LIRA (TRY)', toUnit: ' banknotes: ₺5 – ₺200', toVal: '≈ ₺3,420 TRY',
      eq: 'Official Currency of Turkey: Turkish Lira (TRY / Symbol: ₺)',
      formula: 'Always Pay in Local TRY (Avoid Dynamic Currency Conversion)'
    },
    'indonesia-cu': {
      type: 'currency', badge: 'CURRENCY & FOREX', headline: 'Indonesian Rupiah (IDR)',
      fromCurr: 'USD', toCurr: 'IDR',
      fromLabel: 'FOREIGN CURRENCY', fromUnit: 'USD ($) / AUD (A$)', fromVal: '$100.00 USD',
      toLabel: 'INDONESIAN RUPIAH', toUnit: 'IDR (Rp) Banknotes', toVal: 'Rp 1,565,000',
      eq: 'Official Currency of Indonesia: Indonesian Rupiah (IDR / Rp)',
      formula: 'Mental Math: Drop Last 4 Zeros (Rp 150,000 ≈ $10 USD)'
    },
    'convert-lakh-to-usd': {
      type: 'currency', badge: 'INDIAN FOREX GUIDE', headline: '1 Lakh INR to USD',
      fromCurr: 'INR', toCurr: 'USD',
      fromLabel: 'INDIAN RUPEES (INR)', fromUnit: '1 Lakh (₹1,00,000)', fromVal: '₹1,00,000',
      toLabel: 'US DOLLARS (USD)', toUnit: 'Mid-Market Equivalent', toVal: '≈ $1,197.60',
      eq: '1 Lakh INR (₹1,00,000) ≈ $1,198 USD (at 1 USD = ₹83.50)',
      formula: 'USD = ₹100,000 ÷ USD/INR Exchange Rate'
    },
    'currency-jpy-to-inr': {
      type: 'currency', badge: 'CURRENCY & FOREX', headline: 'JPY to INR Guide',
      fromCurr: 'JPY', toCurr: 'INR',
      fromLabel: 'JAPANESE YEN (JPY)', fromUnit: '¥1,000 Yen Benchmark', fromVal: '¥1,000 JPY',
      toLabel: 'INDIAN RUPEE (INR)', toUnit: 'Mid-Market Equivalent', toVal: '≈ ₹549.00 INR',
      eq: '100 Japanese Yen (¥100 JPY) ≈ ₹54.90 Indian Rupees (INR)',
      formula: 'INR = JPY × (JPY/INR Rate ≈ 0.549)'
    },
    'korean-to-aud': {
      type: 'currency', badge: 'CURRENCY & FOREX', headline: 'Korean Won to AUD',
      fromCurr: 'KRW', toCurr: 'AUD',
      fromLabel: 'SOUTH KOREAN WON', fromUnit: '₩100,000 KRW Note', fromVal: '₩100,000 KRW',
      toLabel: 'AUSTRALIAN DOLLAR', toUnit: 'AUD (A$) Equivalent', toVal: '≈ A$112.90 AUD',
      eq: '₩10,000 South Korean Won (KRW) ≈ A$11.29 AUD',
      formula: 'Shortcut: Drop 3 Zeros & Add 13% (₩10,000 ≈ A$11.30)'
    },
    'rupiah-to-aud': {
      type: 'currency', badge: 'CURRENCY & FOREX', headline: 'Rupiah to AUD (IDR/A$)',
      fromCurr: 'IDR', toCurr: 'AUD',
      fromLabel: 'INDONESIAN RUPIAH', fromUnit: 'Rp 100,000 IDR Note', fromVal: 'Rp 100,000',
      toLabel: 'AUSTRALIAN DOLLAR', toUnit: 'Bali Travel Equivalent', toVal: '≈ A$9.78 AUD',
      eq: 'Rp 100,000 Indonesian Rupiah (IDR) ≈ A$9.80 AUD',
      formula: 'Bali Shortcut: Drop 4 Zeros (Rp 100,000 ≈ A$10 AUD)'
    },
    '1-aud-to-vnd': {
      type: 'currency', badge: 'CURRENCY & FOREX', headline: '1 AUD to VND',
      fromCurr: 'AUD', toCurr: 'VND',
      fromLabel: 'AUSTRALIAN DOLLAR', fromUnit: 'AUD (A$) Base Unit', fromVal: 'A$1.00 AUD',
      toLabel: 'VIETNAMESE DONG', toUnit: 'VND (₫) Equivalent', toVal: '≈ 16,600 ₫',
      eq: '1 Australian Dollar (AUD) ≈ 16,600 Vietnamese Dong (VND)',
      formula: 'VND = AUD × 16,600  •  100,000 ₫ ≈ A$6.02 AUD'
    },
    '1-billion-korean-won-to-gbp': {
      type: 'currency', badge: 'CURRENCY & FOREX', headline: '1 Billion Won to GBP',
      fromCurr: 'KRW', toCurr: 'GBP',
      fromLabel: 'SOUTH KOREAN WON', fromUnit: '₩1,000,000,000 KRW', fromVal: '₩1 Billion',
      toLabel: 'BRITISH POUNDS (GBP)', toUnit: 'Sterling (£) Value', toVal: '≈ £581,500',
      eq: '₩1,000,000,000 KRW (1 Billion Won) ≈ £581,500 GBP',
      formula: 'GBP = KRW ÷ 1,720 (Mid-Market KRW/GBP Rate)'
    },
    '10-billion-won-to-gbp': {
      type: 'currency', badge: 'CURRENCY & FOREX', headline: '10 Billion Won to GBP',
      fromCurr: 'KRW', toCurr: 'GBP',
      fromLabel: 'SOUTH KOREAN WON', fromUnit: '₩10,000,000,000 KRW', fromVal: '₩10 Billion',
      toLabel: 'BRITISH POUNDS (GBP)', toUnit: 'Sterling (£) Value', toVal: '≈ £5.82 Million',
      eq: '₩10,000,000,000 KRW (10 Billion Won) ≈ £5,815,000 GBP',
      formula: 'GBP = KRW ÷ 1,720 (Mid-Market KRW/GBP Rate)'
    }
  };

  if (SPECIAL[s]) {
    const sp = { ...SPECIAL[s] };
    sp.displayHeadline = lang === 'en' ? sp.headline : mainHeadline;
    sp.subHeadline = subHeadline;
    return sp;
  }

  // Pattern 1: Currency conversion e.g. 1000-usd-to-gbp, 20-gbp-aud, 20-pounds-sterling-in-australian-dollars, 300-dollars-in-gbp, 700-pounds-to-aud
  const currMatch = s.match(/^(\d+)\s*-(usd|gbp|aud|eur|cad|jpy|inr|krw|vnd|dollars|pounds-sterling|pounds)-(?:(?:to|in|a|para)-)?(usd|gbp|aud|eur|cad|jpy|inr|krw|vnd|australian-dollars|australian|pounds)$/);
  if (currMatch) {
    const amt = parseFloat(currMatch[1]);
    const rawFrom = currMatch[2];
    const rawTo = currMatch[3];
    const fromCurr = (rawFrom === 'usd' || rawFrom === 'dollars') ? 'USD' : (rawFrom.startsWith('pound') || rawFrom === 'gbp') ? 'GBP' : 'AUD';
    const toCurr = (rawTo === 'gbp' || rawTo === 'pounds') ? 'GBP' : (rawTo.startsWith('aud') || rawTo.startsWith('australian')) ? 'AUD' : 'USD';
    const fromMeta = CURRENCY_META[fromCurr];
    const toMeta = CURRENCY_META[toCurr];
    const rate = +(toMeta.rateFromUsd / fromMeta.rateFromUsd).toFixed(4);
    const converted = amt * rate;
    return {
      type: 'currency',
      badge: 'CURRENCY & FOREX',
      displayHeadline: mainHeadline,
      subHeadline,
      fromCurr,
      toCurr,
      fromLabel: `FROM ${fromCurr}`,
      fromUnit: `${fromCurr} • ${fromMeta.name}`,
      fromVal: fmtCurrencyVal(fromCurr, amt),
      toLabel: `TO ${toCurr}`,
      toUnit: `${toCurr} • ${toMeta.name}`,
      toVal: `≈ ${fmtCurrencyVal(toCurr, converted)}`,
      rateText: `1 ${fromCurr} = ${rate.toFixed(4)} ${toCurr}`,
      eq: `${fmtCurrencyVal(fromCurr, amt)} ${fromCurr} ≈ ${fmtCurrencyVal(toCurr, converted)} ${toCurr}`,
      formula: `Formula: ${toCurr} = ${fromCurr} × Exchange Rate (≈ ${rate})`
    };
  }

  // Pattern 2: Temperature e.g. 10-celsius-is-what-fahrenheit, 12-degrees-celsius-to-fahrenheit, 50-fahrenheit-to-celsius, 100-fahrenheit-to-celsius
  const tempMatch = s.match(/^(\d+).*(celsius|fahrenheit).*(celsius|fahrenheit)$/);
  if (tempMatch) {
    const val = parseFloat(tempMatch[1]);
    const fromScale = tempMatch[2] === 'celsius' ? 'C' : 'F';
    const toScale = fromScale === 'C' ? 'F' : 'C';
    const res = fromScale === 'C' ? +((val * 9 / 5) + 32).toFixed(2) : +(((val - 32) * 5) / 9).toFixed(2);
    return {
      type: 'temperature',
      badge: 'TEMPERATURE & HEAT',
      displayHeadline: mainHeadline,
      subHeadline,
      fromLabel: fromScale === 'C' ? 'CELSIUS (°C)' : 'FAHRENHEIT (°F)',
      fromUnit: fromScale === 'C' ? 'Metric Scale' : 'Imperial Scale',
      fromVal: `${val}°${fromScale}`,
      toLabel: toScale === 'C' ? 'CELSIUS (°C)' : 'FAHRENHEIT (°F)',
      toUnit: 'Exact Equivalent',
      toVal: `${res}°${toScale}`,
      eq: `${val}°${fromScale} = Exactly ${res}°${toScale}`,
      formula: fromScale === 'C' ? `°F = (${val}°C × 9/5) + 32 = ${res}°F` : `°C = (${val}°F − 32) × 5/9 = ${res}°C`,
      tempC: fromScale === 'C' ? val : res
    };
  }

  // Pattern 3: Weight & Mass (kg, lbs, stone, pounds)
  const weightMatch = s.match(/^(\d+)\s*-?(kg|kilo|lbs|pounds|stone)/);
  if (weightMatch) {
    const val = parseFloat(weightMatch[1]);
    const u1 = weightMatch[2];
    const fromIsKg = u1 === 'kg' || u1 === 'kilo';
    const fromIsStone = u1 === 'stone';
    const toIsStone = s.includes('stone') && !fromIsStone;

    if (fromIsKg && toIsStone) {
      const totalLbs = val * 2.20462262;
      const st = Math.floor(totalLbs / 14);
      const remLbs = (totalLbs - st * 14).toFixed(1);
      return {
        type: 'weight', badge: 'WEIGHT & MASS', displayHeadline: mainHeadline, subHeadline,
        fromLabel: 'KILOGRAMS (kg)', fromUnit: 'SI Metric Mass', fromVal: `${val} kg`,
        toLabel: 'STONE & POUNDS', toUnit: `${(val / 6.350293).toFixed(2)} st (${totalLbs.toFixed(1)} lbs)`, toVal: `${st} st ${remLbs} lbs`,
        eq: `${val} kg = ${st} Stone ${remLbs} lbs (${totalLbs.toFixed(2)} lbs)`,
        formula: `Stone = kg ÷ 6.350293  •  Pounds = kg × 2.20462`
      };
    } else if (fromIsKg) {
      const lbs = (val * 2.20462262).toFixed(2);
      const st = Math.floor(val * 2.20462262 / 14);
      const rem = ((val * 2.20462262) - st * 14).toFixed(1);
      return {
        type: 'weight', badge: 'WEIGHT & MASS', displayHeadline: mainHeadline, subHeadline,
        fromLabel: 'KILOGRAMS (kg)', fromUnit: 'Metric Weight', fromVal: `${val} kg`,
        toLabel: 'POUNDS (lbs)', toUnit: `Also = ${st} st ${rem} lbs`, toVal: `${lbs} lbs`,
        eq: `${val} Kilograms (kg) = ${lbs} Pounds (lbs)`,
        formula: `lbs = ${val} kg × 2.20462262 = ${lbs} lbs`
      };
    } else if (fromIsStone && s.includes('kg')) {
      const kg = (val * 6.35029318).toFixed(2);
      return {
        type: 'weight', badge: 'WEIGHT & MASS', displayHeadline: mainHeadline, subHeadline,
        fromLabel: 'IMPERIAL STONE', fromUnit: `${val} Stone (${val * 14} lbs)`, fromVal: `${val} st`,
        toLabel: 'KILOGRAMS (kg)', toUnit: 'SI Metric Mass', toVal: `${kg} kg`,
        eq: `${val} Stone = ${kg} Kilograms (${val * 14} Pounds)`,
        formula: `kg = Stone × 6.35029318`
      };
    } else if (fromIsStone) {
      const lbs = val * 14;
      const kg = (val * 6.35029318).toFixed(2);
      return {
        type: 'weight', badge: 'WEIGHT & MASS', displayHeadline: mainHeadline, subHeadline,
        fromLabel: 'IMPERIAL STONE', fromUnit: `UK / Ireland Weight`, fromVal: `${val} Stone`,
        toLabel: 'POUNDS & KILOS', toUnit: `${kg} Kilograms (kg)`, toVal: `${lbs} lbs`,
        eq: `${val} Stone = Exactly ${lbs} Pounds (${kg} kg)`,
        formula: `Pounds = ${val} Stone × 14 = ${lbs} lbs`
      };
    } else if (toIsStone) {
      const st = Math.floor(val / 14);
      const rem = Math.round(val - st * 14);
      const kg = (val * 0.45359237).toFixed(2);
      return {
        type: 'weight', badge: 'WEIGHT & MASS', displayHeadline: mainHeadline, subHeadline,
        fromLabel: 'POUNDS (lbs)', fromUnit: `Also = ${kg} kg`, fromVal: `${val} lbs`,
        toLabel: 'STONE & POUNDS', toUnit: `${(val / 14).toFixed(2)} Stone Decimal`, toVal: `${st} st ${rem} lbs`,
        eq: `${val} Pounds = ${st} Stone ${rem} Pounds (${kg} kg)`,
        formula: `Stone = ${val} lbs ÷ 14 = ${st} st ${rem} lbs`
      };
    } else {
      const kg = (val * 0.45359237).toFixed(2);
      const st = Math.floor(val / 14);
      const rem = Math.round(val - st * 14);
      return {
        type: 'weight', badge: 'WEIGHT & MASS', displayHeadline: mainHeadline, subHeadline,
        fromLabel: 'POUNDS (lbs)', fromUnit: `Also = ${st} st ${rem} lbs`, fromVal: `${val} lbs`,
        toLabel: 'KILOGRAMS (kg)', toUnit: 'Exact Metric Mass', toVal: `${kg} kg`,
        eq: `${val} Pounds (lbs) = ${kg} Kilograms (kg)`,
        formula: `kg = ${val} lbs × 0.45359237 = ${kg} kg`
      };
    }
  }

  // Pattern 4: Dynamic Length (meters, feet, inches, cm, km, miles)
  const lenMatch = s.match(/^(\d+(?:\.\d+)?)\s*-(meters|meter|feet|foot|inches|inch|cm|km|miles|yards)-(?:to|in|a|para)-(meters|meter|feet|foot|inches|inch|cm|km|miles|yards)/);
  if (lenMatch) {
    const val = parseFloat(lenMatch[1]);
    const u1 = lenMatch[2];
    const u2 = lenMatch[3];
    const isMToFt = u1.startsWith('meter') && (u2.startsWith('feet') || u2.startsWith('foot'));
    const res = isMToFt ? (val * 3.28084).toFixed(2) + ' ft' : `${val} → ${u2.toUpperCase()}`;
    return {
      type: 'length', badge: 'LENGTH & DISTANCE', displayHeadline: mainHeadline, subHeadline,
      fromLabel: u1.toUpperCase(), fromUnit: 'Input Length', fromVal: `${val} ${u1}`,
      toLabel: u2.toUpperCase(), toUnit: 'Converted Length', toVal: res,
      eq: `${mainHeadline} — Exact SI & Imperial Conversion`,
      formula: isMToFt ? 'Feet = Meters × 3.2808399' : 'Exact International Length Standard (1 inch = 25.4 mm)'
    };
  }

  // Pattern 5: Dynamic Volume (ml, cups, liters, gallons, oz, tsp, tbsp)
  if (/(cup|ml|milliliter|liter|litre|gallon|oz|ounce|tsp|tbsp)/.test(s)) {
    return {
      type: 'volume', badge: 'KITCHEN & VOLUME', displayHeadline: mainHeadline, subHeadline,
      fromLabel: 'VOLUME INPUT', fromUnit: 'US & Metric Standard', fromVal: mainHeadline.split(/\s+(?:to|in|is|a|para|em)\s+/i)[0] || mainHeadline,
      toLabel: 'CONVERTED VOLUME', toUnit: 'Exact Fluid Equivalent', toVal: mainHeadline.split(/\s+(?:to|in|is|a|para|em)\s+/i)[1] || 'Exact Volume',
      eq: `${mainHeadline} — US Customary & Metric Reference`,
      formula: '1 US Cup = 236.59 mL • 1 Metric Cup = 250 mL • 1 US fl oz = 29.57 mL',
      fillPct: 0.62
    };
  }

  // Generic Fallback for future auto-published articles
  return {
    type: 'generic',
    badge: 'CONVERSION GUIDE',
    displayHeadline: mainHeadline,
    subHeadline,
    fromLabel: 'INPUT UNIT',
    fromUnit: 'Source Measurement',
    fromVal: mainHeadline.split(/\s+(?:to|in|a|para|em)\s+/i)[0] || 'Input',
    toLabel: 'CONVERTED OUTPUT',
    toUnit: 'Target Standard Unit',
    toVal: mainHeadline.split(/\s+(?:to|in|a|para|em)\s+/i)[1] || 'Result',
    eq: `${mainHeadline} — Exact Mathematical Reference`,
    formula: 'Verified Against NIST & SI International Measurement Standards'
  };
}

function renderRightPanel(info, theme) {
  if (info.type === 'currency') {
    const fCurr = info.fromCurr || 'USD';
    const tCurr = info.toCurr || 'GBP';
    const rateStr = info.rateText || 'Mid-Market Interbank Rate';
    return `
      <g transform="translate(715, 65)">
        <rect width="425" height="500" rx="28" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
        <!-- From Currency Card -->
        <g transform="translate(30, 32)">
          <rect width="365" height="132" rx="18" fill="rgba(7,11,20,0.75)" stroke="${theme.badgeBorder}" stroke-width="1.5"/>
          ${renderFlagSvg(fCurr, 22, 22, 58, 40)}
          <text x="96" y="38" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="13" font-weight="800" fill="#94A3B8" letter-spacing="1">${escXml(info.fromLabel)}</text>
          <text x="96" y="62" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">${escXml(info.fromUnit)}</text>
          <text x="22" y="110" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="33" font-weight="900" fill="${theme.accent}">${escXml(info.fromVal)}</text>
        </g>
        <!-- Swap Badge -->
        <g transform="translate(184, 174)">
          <circle cx="28" cy="28" r="25" fill="${theme.accent}"/>
          <path d="M20,22 L28,14 L36,22 M28,14 V38 M20,34 L28,42 L36,34" fill="none" stroke="#070B14" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <!-- To Currency Card -->
        <g transform="translate(30, 240)">
          <rect width="365" height="132" rx="18" fill="rgba(7,11,20,0.75)" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
          ${renderFlagSvg(tCurr, 22, 22, 58, 40)}
          <text x="96" y="38" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="13" font-weight="800" fill="#94A3B8" letter-spacing="1">${escXml(info.toLabel)}</text>
          <text x="96" y="62" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">${escXml(info.toUnit)}</text>
          <text x="22" y="110" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="33" font-weight="900" fill="${theme.accent2}">${escXml(info.toVal)}</text>
        </g>
        <!-- Sparkline Trend Bar -->
        <g transform="translate(30, 396)">
          <rect width="365" height="72" rx="16" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" stroke-width="1"/>
          <text x="20" y="28" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="12" font-weight="800" fill="${theme.accent}" letter-spacing="1">LIVE MID-MARKET BENCHMARK</text>
          <text x="20" y="52" font-family="Consolas, monospace" font-size="16" font-weight="700" fill="#FFFFFF">${escXml(rateStr)}</text>
          <path d="M235,52 L258,40 L282,45 L306,27 L328,33 L348,18" fill="none" stroke="#34D399" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="348" cy="18" r="5" fill="#34D399"/>
        </g>
      </g>
    `;
  }

  if (info.type === 'temperature') {
    const cVal = typeof info.tempC === 'number' ? info.tempC : 20;
    const clamped = Math.max(-10, Math.min(50, cVal));
    const fillH = Math.round(45 + ((clamped + 10) / 60) * 140);
    const fillY = 230 - fillH;
    return `
      <g transform="translate(715, 65)">
        <rect width="425" height="500" rx="28" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
        <!-- Thermometer Vector Illustration on Left of Card -->
        <g transform="translate(34, 45)">
          <rect x="0" y="0" width="105" height="410" rx="20" fill="rgba(7,11,20,0.65)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <!-- Tube -->
          <rect x="38" y="45" width="28" height="200" rx="14" fill="#0F172A" stroke="rgba(255,255,255,0.35)" stroke-width="2.5"/>
          <!-- Mercury Fill -->
          <rect x="43" y="${fillY}" width="18" height="${fillH + 30}" rx="9" fill="${theme.accent}"/>
          <!-- Bulb -->
          <circle cx="52" cy="265" r="28" fill="${theme.accent}" stroke="rgba(255,255,255,0.4)" stroke-width="2.5"/>
          <circle cx="44" cy="257" r="7" fill="rgba(255,255,255,0.45)"/>
          <!-- Ticks -->
          <g stroke="rgba(255,255,255,0.45)" stroke-width="2">
            <line x1="72" y1="65" x2="86" y2="65"/><line x1="72" y1="95" x2="82" y2="95"/>
            <line x1="72" y1="125" x2="86" y2="125"/><line x1="72" y1="155" x2="82" y2="155"/>
            <line x1="72" y1="185" x2="86" y2="185"/><line x1="72" y1="215" x2="82" y2="215"/>
          </g>
          <text x="52" y="345" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="800" fill="#94A3B8">°C ⇄ °F</text>
          <text x="52" y="372" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" fill="${theme.accent}">THERMAL</text>
        </g>
        <!-- Right Readout Stack -->
        <g transform="translate(158, 45)">
          <rect width="236" height="175" rx="20" fill="rgba(7,11,20,0.75)" stroke="${theme.badgeBorder}" stroke-width="1.5"/>
          <text x="22" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="800" fill="#94A3B8" letter-spacing="1">${escXml(info.fromLabel)}</text>
          <text x="22" y="64" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="700" fill="#CBD5E1">${escXml(info.fromUnit)}</text>
          <text x="22" y="132" font-family="Segoe UI, Arial, sans-serif" font-size="48" font-weight="900" fill="${theme.accent}">${escXml(info.fromVal)}</text>
        </g>
        <g transform="translate(158, 240)">
          <rect width="236" height="175" rx="20" fill="rgba(7,11,20,0.75)" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
          <text x="22" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="800" fill="#94A3B8" letter-spacing="1">${escXml(info.toLabel)}</text>
          <text x="22" y="64" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="700" fill="#CBD5E1">${escXml(info.toUnit)}</text>
          <text x="22" y="132" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="900" fill="${theme.accent2}">${escXml(info.toVal)}</text>
        </g>
        <text x="276" y="458" text-anchor="middle" font-family="Consolas, monospace" font-size="15" font-weight="700" fill="#94A3B8">0°C = 32°F • 100°C = 212°F</text>
      </g>
    `;
  }

  if (info.type === 'volume') {
    const pct = info.fillPct || 0.65;
    const beakerH = 220;
    const fillH = Math.round(beakerH * pct);
    const fillY = 60 + (beakerH - fillH);
    return `
      <g transform="translate(715, 65)">
        <rect width="425" height="500" rx="28" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
        <!-- Graduated Measuring Beaker Illustration -->
        <g transform="translate(32, 36)">
          <rect width="361" height="195" rx="18" fill="rgba(7,11,20,0.72)" stroke="${theme.badgeBorder}" stroke-width="1.5"/>
          <!-- Beaker Glass on Left -->
          <g transform="translate(26, 22)">
            <rect x="0" y="0" width="96" height="150" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.45)" stroke-width="2.5"/>
            <rect x="4" y="${Math.round(150 * (1 - pct))}" width="88" height="${Math.round(150 * pct) - 4}" rx="7" fill="${theme.accent}" fill-opacity="0.45"/>
            <line x1="62" y1="30" x2="88" y2="30" stroke="#fff" stroke-width="2" stroke-opacity="0.6"/>
            <line x1="68" y1="60" x2="88" y2="60" stroke="#fff" stroke-width="2" stroke-opacity="0.6"/>
            <line x1="62" y1="90" x2="88" y2="90" stroke="#fff" stroke-width="2" stroke-opacity="0.6"/>
            <line x1="68" y1="120" x2="88" y2="120" stroke="#fff" stroke-width="2" stroke-opacity="0.6"/>
          </g>
          <text x="144" y="48" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="800" fill="#94A3B8" letter-spacing="1">${escXml(info.fromLabel)}</text>
          <text x="144" y="76" font-family="Segoe UI, Arial, sans-serif" font-size="19" font-weight="700" fill="#FFFFFF">${escXml(info.fromUnit)}</text>
          <text x="144" y="138" font-family="Segoe UI, Arial, sans-serif" font-size="36" font-weight="900" fill="${theme.accent}">${escXml(info.fromVal)}</text>
        </g>
        <!-- Arrow Divider -->
        <g transform="translate(184, 240)">
          <circle cx="28" cy="24" r="22" fill="${theme.accent}"/>
          <path d="M20,20 L28,29 L36,20" fill="none" stroke="#070B14" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <!-- Converted Output Box -->
        <g transform="translate(32, 296)">
          <rect width="361" height="168" rx="18" fill="rgba(7,11,20,0.75)" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
          <text x="26" y="42" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="800" fill="#94A3B8" letter-spacing="1">${escXml(info.toLabel)}</text>
          <text x="26" y="70" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="700" fill="#FFFFFF">${escXml(info.toUnit)}</text>
          <text x="26" y="130" font-family="Segoe UI, Arial, sans-serif" font-size="${String(info.toVal || '').length > 16 ? 27 : 33}" font-weight="900" fill="${theme.accent2}">${escXml(info.toVal)}</text>
        </g>
      </g>
    `;
  }

  if (info.type === 'gauge') {
    return `
      <g transform="translate(715, 65)">
        <rect width="425" height="500" rx="28" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
        <!-- Circular Tachometer / Pressure Dial -->
        <g transform="translate(212, 165)">
          <circle cx="0" cy="0" r="114" fill="rgba(7,11,20,0.82)" stroke="rgba(255,255,255,0.14)" stroke-width="2.5"/>
          <circle cx="0" cy="0" r="92" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="14" stroke-dasharray="385 600" stroke-linecap="round" transform="rotate(150)"/>
          <circle cx="0" cy="0" r="92" fill="none" stroke="${theme.accent}" stroke-width="14" stroke-dasharray="285 600" stroke-linecap="round" transform="rotate(150)"/>
          <line x1="0" y1="0" x2="44" y2="-56" stroke="${theme.accent2}" stroke-width="5" stroke-linecap="round"/>
          <circle cx="0" cy="0" r="10" fill="#FFFFFF"/>
          <text x="0" y="42" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="25" font-weight="900" fill="#FFFFFF">${escXml(info.gaugeText || info.toVal)}</text>
          <text x="0" y="68" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" fill="#94A3B8">${escXml(info.gaugeSub || '')}</text>
        </g>
        <!-- Bottom Dual Cards -->
        <g transform="translate(30, 310)">
          <rect width="174" height="152" rx="18" fill="rgba(7,11,20,0.75)" stroke="${theme.badgeBorder}" stroke-width="1.5"/>
          <text x="18" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="11.5" font-weight="800" fill="#94A3B8">${escXml(info.fromLabel)}</text>
          <text x="18" y="64" font-family="Segoe UI, Arial, sans-serif" font-size="14.5" font-weight="700" fill="#CBD5E1">${escXml(info.fromUnit)}</text>
          <text x="18" y="116" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="900" fill="${theme.accent}">${escXml(info.fromVal)}</text>
        </g>
        <g transform="translate(220, 310)">
          <rect width="175" height="152" rx="18" fill="rgba(7,11,20,0.75)" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
          <text x="18" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="11.5" font-weight="800" fill="#94A3B8">${escXml(info.toLabel)}</text>
          <text x="18" y="64" font-family="Segoe UI, Arial, sans-serif" font-size="14.5" font-weight="700" fill="#CBD5E1">${escXml(info.toUnit)}</text>
          <text x="18" y="116" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="900" fill="${theme.accent2}">${escXml(info.toVal)}</text>
        </g>
      </g>
    `;
  }

  // Weight, Length, Indian Units, Time, File & Generic: Precision Dual Card + Visual Meter Bar
  const fromValSize = String(info.fromVal || '').length > 15 ? 28 : String(info.fromVal || '').length > 11 ? 33 : 38;
  const toValSize = String(info.toVal || '').length > 15 ? 27 : String(info.toVal || '').length > 11 ? 31 : 36;
  let topIconSvg = '';
  if (info.type === 'weight') {
    topIconSvg = `
      <g transform="translate(295, 22)">
        <rect x="0" y="14" width="12" height="36" rx="4" fill="${theme.accent}"/>
        <rect x="14" y="20" width="8" height="24" rx="3" fill="${theme.accent2}"/>
        <rect x="22" y="29" width="22" height="6" fill="#CBD5E1"/>
        <rect x="44" y="20" width="8" height="24" rx="3" fill="${theme.accent2}"/>
        <rect x="54" y="14" width="12" height="36" rx="4" fill="${theme.accent}"/>
      </g>`;
  } else if (info.type === 'indian') {
    topIconSvg = renderFlagSvg('INR', 285, 24, 56, 38);
  } else if (info.type === 'length') {
    topIconSvg = `
      <g transform="translate(275, 26)">
        <rect width="68" height="28" rx="5" fill="rgba(255,255,255,0.1)" stroke="${theme.accent}" stroke-width="2"/>
        <line x1="12" y1="0" x2="12" y2="12" stroke="${theme.accent}" stroke-width="2"/>
        <line x1="24" y1="0" x2="24" y2="8" stroke="${theme.accent}" stroke-width="2"/>
        <line x1="36" y1="0" x2="36" y2="12" stroke="${theme.accent}" stroke-width="2"/>
        <line x1="48" y1="0" x2="48" y2="8" stroke="${theme.accent}" stroke-width="2"/>
        <line x1="58" y1="0" x2="58" y2="12" stroke="${theme.accent}" stroke-width="2"/>
      </g>`;
  }

  return `
    <g transform="translate(715, 65)">
      <rect width="425" height="500" rx="28" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
      <!-- Input Box -->
      <g transform="translate(30, 32)">
        <rect width="365" height="145" rx="20" fill="rgba(7,11,20,0.75)" stroke="${theme.badgeBorder}" stroke-width="1.5"/>
        ${topIconSvg}
        <text x="26" y="40" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="13" font-weight="800" fill="#94A3B8" letter-spacing="1.2">${escXml(info.fromLabel)}</text>
        <text x="26" y="68" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="19" font-weight="700" fill="#CBD5E1">${escXml(info.fromUnit)}</text>
        <text x="26" y="122" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="${fromValSize}" font-weight="900" fill="${theme.accent}">${escXml(info.fromVal)}</text>
      </g>
      <!-- Swap Icon -->
      <g transform="translate(184, 187)">
        <circle cx="28" cy="28" r="25" fill="${theme.accent}"/>
        <path d="M20,22 L28,14 L36,22 M28,14 V38 M20,34 L28,42 L36,34" fill="none" stroke="#070B14" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <!-- Output Box -->
      <g transform="translate(30, 254)">
        <rect width="365" height="145" rx="20" fill="rgba(7,11,20,0.75)" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
        <text x="26" y="40" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="13" font-weight="800" fill="#94A3B8" letter-spacing="1.2">${escXml(info.toLabel)}</text>
        <text x="26" y="68" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="19" font-weight="700" fill="#CBD5E1">${escXml(info.toUnit)}</text>
        <text x="26" y="122" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="${toValSize}" font-weight="900" fill="${theme.accent2}">${escXml(info.toVal)}</text>
      </g>
      <!-- Precision Scale Bar -->
      <g transform="translate(30, 418)">
        <rect width="365" height="54" rx="14" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" stroke-width="1"/>
        <circle cx="26" cy="27" r="6" fill="#34D399"/>
        <text x="44" y="32" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">EXACT SI &amp; IMPERIAL PRECISION</text>
      </g>
    </g>
  `;
}

const LOCALIZED_BADGES = {
  es: {
    'CURRENCY & FOREX': 'DIVISAS Y FOREX',
    'INDIAN FOREX GUIDE': 'GUÍA DE DIVISAS',
    'WEIGHT & MASS': 'PESO Y MASA',
    'BULLION & JEWELLERY': 'ORO Y JOYERÍA',
    'TEMPERATURE & HEAT': 'TEMPERATURA',
    'KITCHEN & CULINARY': 'COCINA Y RECETAS',
    'KITCHEN & VOLUME': 'VOLUMEN Y COCINA',
    'VOLUME & CAPACITY': 'VOLUMEN Y CAPACIDAD',
    'LENGTH & DISTANCE': 'LONGITUD Y DISTANCIA',
    'SPEED & VELOCITY': 'VELOCIDAD',
    'PRESSURE & ENGINEERING': 'PRESIÓN E INGENIERÍA',
    'INDIAN LAND UNITS': 'UNIDADES DE TIERRA',
    'INDIAN NUMBER SYSTEM': 'SISTEMA NUMÉRICO',
    'TIME & DURATION': 'TIEMPO Y DURACIÓN',
    'FILE & PDF TOOLS': 'ARCHIVOS Y PDF',
    'FILE & MEDIA TOOLS': 'ARCHIVOS Y FORMATOS',
    'PRODUCT & PWA APP': 'APLICACIÓN WEB PWA',
    'TECHNICAL USAGE GUIDE': 'GUÍA TÉCNICA',
    'CONVERSION GUIDE': 'GUÍA DE CONVERSIÓN',
    refLabel: 'REFERENCIA DE CONVERSIÓN DIRECTA'
  },
  de: {
    'CURRENCY & FOREX': 'WÄHRUNG & DEVISEN',
    'INDIAN FOREX GUIDE': 'WÄHRUNGSRATGEBER',
    'WEIGHT & MASS': 'GEWICHT & MASSE',
    'BULLION & JEWELLERY': 'EDELMETALLE & GEWICHT',
    'TEMPERATURE & HEAT': 'TEMPERATUR',
    'KITCHEN & CULINARY': 'KÜCHE & BACKEN',
    'KITCHEN & VOLUME': 'VOLUMEN & KÜCHE',
    'VOLUME & CAPACITY': 'VOLUMEN & KAPAZITÄT',
    'LENGTH & DISTANCE': 'LÄNGE & DISTANZ',
    'SPEED & VELOCITY': 'GESCHWINDIGKEIT',
    'PRESSURE & ENGINEERING': 'DRUCK & TECHNIK',
    'INDIAN LAND UNITS': 'FLÄCHENMASSE',
    'INDIAN NUMBER SYSTEM': 'ZAHLENSYSTEM',
    'TIME & DURATION': 'ZEIT & DAUER',
    'FILE & PDF TOOLS': 'DATEIEN & PDF',
    'FILE & MEDIA TOOLS': 'DATEIFORMAT-TOOLS',
    'PRODUCT & PWA APP': 'OFFLINE WEB-APP',
    'TECHNICAL USAGE GUIDE': 'FACHRATGEBER',
    'CONVERSION GUIDE': 'UMRECHNUNGSRATGEBER',
    refLabel: 'DIREKTE UMRECHNUNGSREFERENZ'
  },
  pt: {
    'CURRENCY & FOREX': 'MOEDAS E CÂMBIO',
    'INDIAN FOREX GUIDE': 'GUIA DE CÂMBIO',
    'WEIGHT & MASS': 'PESO E MASSA',
    'BULLION & JEWELLERY': 'OURO E JOALHERIA',
    'TEMPERATURE & HEAT': 'TEMPERATURA',
    'KITCHEN & CULINARY': 'COZINHA E CULINÁRIA',
    'KITCHEN & VOLUME': 'VOLUME E COZINHA',
    'VOLUME & CAPACITY': 'VOLUME E CAPACIDADE',
    'LENGTH & DISTANCE': 'COMPRIMENTO E DISTÂNCIA',
    'SPEED & VELOCITY': 'VELOCIDADE',
    'PRESSURE & ENGINEERING': 'PRESSÃO E ENGENHARIA',
    'INDIAN LAND UNITS': 'MEDIDAS DE TERRA',
    'INDIAN NUMBER SYSTEM': 'SISTEMA NUMÉRICO',
    'TIME & DURATION': 'TEMPO E DURAÇÃO',
    'FILE & PDF TOOLS': 'ARQUIVOS E PDF',
    'FILE & MEDIA TOOLS': 'ARQUIVOS E FORMATOS',
    'PRODUCT & PWA APP': 'APLICATIVO WEB PWA',
    'TECHNICAL USAGE GUIDE': 'GUIA TÉCNICO',
    'CONVERSION GUIDE': 'GUIA DE CONVERSÃO',
    refLabel: 'REFERÊNCIA DE CONVERSÃO DIRETA'
  }
};

async function generateArticleHeroImage({ enSlug, localSlug, title, lang = 'en', outFile, themeIndexOverride = null }) {
  const info = analyzeArticle(enSlug, title, lang);
  const idx = themeIndexOverride !== null ? (themeIndexOverride % THEMES.length) : (hashSlug(enSlug) % THEMES.length);
  const theme = THEMES[idx];

  const badgeText = (LOCALIZED_BADGES[lang] && LOCALIZED_BADGES[lang][info.badge]) || info.badge;
  const refLabelText = (LOCALIZED_BADGES[lang] && LOCALIZED_BADGES[lang].refLabel) || 'DIRECT CONVERSION REFERENCE';

  const headlineLines = wrapTextLines(info.displayHeadline, 20, 2);
  const headlineFontSize = headlineLines.length === 1
    ? (info.displayHeadline.length > 16 ? 54 : 62)
    : 45;

  const subLines = wrapTextLines(info.subHeadline, 42, 2);
  const eqLines = wrapTextLines(info.eq, 42, 2);

  // Decorative background pattern varies by idx % 3
  const bgDecor = (idx % 3 === 0)
    ? `<circle cx="960" cy="140" r="260" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="2"/>
       <circle cx="960" cy="140" r="360" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1.5"/>`
    : (idx % 3 === 1)
    ? `<path d="M0,520 Q360,430 720,520 T1200,490" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2.5"/>
       <path d="M0,560 Q360,470 720,560 T1200,530" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="2"/>`
    : `<line x1="0" y1="630" x2="630" y2="0" stroke="rgba(255,255,255,0.03)" stroke-width="2"/>
       <line x1="200" y1="630" x2="830" y2="0" stroke="rgba(255,255,255,0.03)" stroke-width="2"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bg1}"/>
        <stop offset="52%" stop-color="${theme.bg2}"/>
        <stop offset="100%" stop-color="${theme.bg3}"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.cardBg1}" stop-opacity="0.94"/>
        <stop offset="100%" stop-color="${theme.cardBg2}" stop-opacity="0.97"/>
      </linearGradient>
      <radialGradient id="glow1" cx="82%" cy="28%" r="46%">
        <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glow2" cx="18%" cy="78%" r="44%">
        <stop offset="0%" stop-color="${theme.accent2}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="${theme.accent2}" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect width="1200" height="630" fill="url(#glow1)"/>
    <rect width="1200" height="630" fill="url(#glow2)"/>

    <!-- Subtle Technical Grid -->
    <g stroke="rgba(255,255,255,0.035)" stroke-width="1">
      <line x1="0" y1="90" x2="1200" y2="90"/><line x1="0" y1="180" x2="1200" y2="180"/><line x1="0" y1="270" x2="1200" y2="270"/>
      <line x1="0" y1="360" x2="1200" y2="360"/><line x1="0" y1="450" x2="1200" y2="450"/><line x1="0" y1="540" x2="1200" y2="540"/>
      <line x1="150" y1="0" x2="150" y2="630"/><line x1="300" y1="0" x2="300" y2="630"/><line x1="450" y1="0" x2="450" y2="630"/>
      <line x1="600" y1="0" x2="600" y2="630"/><line x1="750" y1="0" x2="750" y2="630"/><line x1="900" y1="0" x2="900" y2="630"/><line x1="1050" y1="0" x2="1050" y2="630"/>
    </g>
    ${bgDecor}

    <!-- Category Badge -->
    <g transform="translate(64, 68)">
      <rect width="${Math.max(230, badgeText.length * 11 + 56)}" height="38" rx="19" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" stroke-width="1.5"/>
      <circle cx="24" cy="19" r="6" fill="${theme.accent}"/>
      <text x="42" y="24" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="13.5" font-weight="800" fill="${theme.accent}" letter-spacing="1.5">${escXml(badgeText)}</text>
    </g>

    <!-- Main Conversion Title -->
    ${headlineLines.length === 1 ? `
      <text x="64" y="184" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="${headlineFontSize}" font-weight="900" fill="#FFFFFF" letter-spacing="-0.8">${escXml(headlineLines[0])}</text>
      <text x="64" y="236" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="24.5" font-weight="600" fill="#CBD5E1">${escXml(subLines[0] || '')}</text>
      ${subLines[1] ? `<text x="64" y="268" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="21.5" font-weight="500" fill="#94A3B8">${escXml(subLines[1])}</text>` : ''}
    ` : `
      <text x="64" y="164" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="${headlineFontSize}" font-weight="900" fill="#FFFFFF" letter-spacing="-0.8">${escXml(headlineLines[0])}</text>
      <text x="64" y="218" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="${headlineFontSize}" font-weight="900" fill="${theme.accent}" letter-spacing="-0.8">${escXml(headlineLines[1])}</text>
      <text x="64" y="266" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="22.5" font-weight="600" fill="#CBD5E1">${escXml(subLines[0] || '')}</text>
    `}

    <!-- Formula & Direct Answer Box -->
    <g transform="translate(64, 326)">
      <rect width="612" height="164" rx="22" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.14)" stroke-width="1.5"/>
      <rect x="0" y="26" width="6" height="112" rx="3" fill="${theme.accent}"/>
      <text x="30" y="42" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="12.5" font-weight="800" fill="${theme.accent}" letter-spacing="1.5">${escXml(refLabelText)}</text>
      ${eqLines.length === 1 ? `
        <text x="30" y="88" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="26.5" font-weight="800" fill="#FFFFFF">${escXml(eqLines[0])}</text>
      ` : `
        <text x="30" y="76" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="22.5" font-weight="800" fill="#FFFFFF">${escXml(eqLines[0])}</text>
        <text x="30" y="105" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="21.5" font-weight="700" fill="#E2E8F0">${escXml(eqLines[1])}</text>
      `}
      <text x="30" y="138" font-family="Consolas, monospace" font-size="16" font-weight="600" fill="#94A3B8">${escXml(info.formula)}</text>
    </g>

    <!-- Bottom Brand Footer -->
    <g transform="translate(64, 520)">
      <rect width="30" height="30" rx="8" fill="${theme.accent}"/>
      <text x="15" y="21" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="900" fill="#070B14">O</text>
      <text x="42" y="21" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="18.5" font-weight="800" fill="#E2E8F0">OmniConverter</text>
      <text x="190" y="21" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="16.5" font-weight="600" fill="#64748B">•  omniconverter.co.uk</text>
    </g>

    <!-- Right Visual Illustration Panel -->
    ${renderRightPanel(info, theme)}
  </svg>`;

  const dir = path.dirname(outFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await sharp(Buffer.from(svg))
    .png({ palette: true, quality: 95, compressionLevel: 9 })
    .toFile(outFile);
}

module.exports = {
  generateArticleHeroImage,
  analyzeArticle
};
