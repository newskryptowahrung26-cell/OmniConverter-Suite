/**
 * OmniConverter Eye-Catching Editorial Hero & OG Image Generator
 * - Strict Rule 1: ONLY the Article Title is shown (zero conversion rates, zero calculated answers, zero formula boxes).
 * - Strict Rule 2: Vibrant, eye-catching, article-specific 3D-style vector illustrations for every single article across EN, ES, DE, and PT.
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

function wrapTextLines(text, maxCharsPerLine, maxLines = 3) {
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
    if (remaining.length > maxCharsPerLine + 5) {
      lines.push(remaining.slice(0, maxCharsPerLine + 2).trim() + '...');
    } else {
      lines.push(remaining);
    }
  }
  return lines.slice(0, maxLines);
}

// 12 Vibrant, High-Contrast Eye-Catching Gradients (No dull black backgrounds)
const THEMES = [
  { name: 'electric-sapphire', bg1: '#0F2557', bg2: '#1E40AF', bg3: '#0284C7', accent: '#38BDF8', accent2: '#FDE047', glow: '#60A5FA', cardBg: 'rgba(15, 23, 42, 0.45)' },
  { name: 'emerald-aurora',    bg1: '#064E3B', bg2: '#047857', bg3: '#0D9488', accent: '#34D399', accent2: '#FBBF24', glow: '#6EE7B7', cardBg: 'rgba(6, 46, 34, 0.45)' },
  { name: 'royal-amethyst',    bg1: '#2E1065', bg2: '#5B21B6', bg3: '#9333EA', accent: '#E879F9', accent2: '#38BDF8', glow: '#C084FC', cardBg: 'rgba(36, 12, 78, 0.45)' },
  { name: 'sunset-amber',      bg1: '#7C2D12', bg2: '#C2410C', bg3: '#D97706', accent: '#FDE047', accent2: '#FB7185', glow: '#FBBF24', cardBg: 'rgba(69, 24, 9, 0.45)' },
  { name: 'crimson-magenta',   bg1: '#881337', bg2: '#BE123C', bg3: '#DB2777', accent: '#FDA4AF', accent2: '#FDE047', glow: '#FB7185', cardBg: 'rgba(76, 11, 31, 0.45)' },
  { name: 'ocean-turquoise',   bg1: '#0F3443', bg2: '#0E7490', bg3: '#0284C7', accent: '#2DD4BF', accent2: '#FACC15', glow: '#22D3EE', cardBg: 'rgba(12, 42, 54, 0.45)' },
  { name: 'indigo-cyber',      bg1: '#1E1B4B', bg2: '#3730A3', bg3: '#4F46E5', accent: '#818CF8', accent2: '#34D399', glow: '#A5B4FC', cardBg: 'rgba(23, 21, 58, 0.45)' },
  { name: 'forest-lime',       bg1: '#14532D', bg2: '#15803D', bg3: '#059669', accent: '#A3E635', accent2: '#38BDF8', glow: '#4ADE80', cardBg: 'rgba(15, 58, 32, 0.45)' },
  { name: 'plum-coral',        bg1: '#4A044E', bg2: '#86198F', bg3: '#E11D48', accent: '#F472B6', accent2: '#FDE047', glow: '#F43F5E', cardBg: 'rgba(59, 6, 62, 0.45)' },
  { name: 'cobalt-violet',     bg1: '#172554', bg2: '#1D4ED8', bg3: '#6D28D9', accent: '#60A5FA', accent2: '#F472B6', glow: '#818CF8', cardBg: 'rgba(18, 29, 66, 0.45)' },
  { name: 'golden-copper',     bg1: '#451A03', bg2: '#92400E', bg3: '#B45309', accent: '#FBBF24', accent2: '#38BDF8', glow: '#F59E0B', cardBg: 'rgba(54, 21, 4, 0.45)' },
  { name: 'arctic-blue',       bg1: '#082F49', bg2: '#0369A1', bg3: '#2563EB', accent: '#7DD3FC', accent2: '#4ADE80', glow: '#38BDF8', cardBg: 'rgba(8, 38, 58, 0.45)' }
];

function hashSlug(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

// High-Detail Rectangular Flag SVG
function renderRectFlag(code, x, y, w = 110, h = 74, rx = 14) {
  const c = (code || '').toUpperCase();
  let inner = '';
  if (c === 'USD') {
    inner = `
      <rect width="${w}" height="${h}" fill="#B22234"/>
      <path d="M0,${h*0.154} H${w} M0,${h*0.308} H${w} M0,${h*0.462} H${w} M0,${h*0.615} H${w} M0,${h*0.769} H${w} M0,${h*0.923} H${w}" stroke="#FFFFFF" stroke-width="${h*0.077}"/>
      <rect width="${w*0.44}" height="${h*0.538}" fill="#3C3B6E"/>
      <g fill="#FFFFFF">
        <circle cx="${w*0.09}" cy="${h*0.12}" r="${h*0.032}"/><circle cx="${w*0.22}" cy="${h*0.12}" r="${h*0.032}"/><circle cx="${w*0.35}" cy="${h*0.12}" r="${h*0.032}"/>
        <circle cx="${w*0.155}" cy="${h*0.26}" r="${h*0.032}"/><circle cx="${w*0.285}" cy="${h*0.26}" r="${h*0.032}"/>
        <circle cx="${w*0.09}" cy="${h*0.40}" r="${h*0.032}"/><circle cx="${w*0.22}" cy="${h*0.40}" r="${h*0.032}"/><circle cx="${w*0.35}" cy="${h*0.40}" r="${h*0.032}"/>
      </g>
    `;
  } else if (c === 'GBP' || c === 'UK') {
    inner = `
      <rect width="${w}" height="${h}" fill="#012169"/>
      <path d="M0,0 L${w},${h} M${w},0 L0,${h}" stroke="#FFFFFF" stroke-width="${h*0.18}"/>
      <path d="M0,0 L${w},${h} M${w},0 L0,${h}" stroke="#C8102E" stroke-width="${h*0.08}"/>
      <path d="M${w/2},0 V${h} M0,${h/2} H${w}" stroke="#FFFFFF" stroke-width="${h*0.28}"/>
      <path d="M${w/2},0 V${h} M0,${h/2} H${w}" stroke="#C8102E" stroke-width="${h*0.16}"/>
    `;
  } else if (c === 'AUD') {
    inner = `
      <rect width="${w}" height="${h}" fill="#00008B"/>
      <rect width="${w*0.46}" height="${h*0.5}" fill="#012169"/>
      <path d="M0,0 L${w*0.46},${h*0.5} M${w*0.46},0 L0,${h*0.5}" stroke="#FFFFFF" stroke-width="${h*0.08}"/>
      <path d="M${w*0.23},0 V${h*0.5} M0,${h*0.25} H${w*0.46}" stroke="#FFFFFF" stroke-width="${h*0.14}"/>
      <path d="M${w*0.23},0 V${h*0.5} M0,${h*0.25} H${w*0.46}" stroke="#C8102E" stroke-width="${h*0.08}"/>
      <circle cx="${w*0.23}" cy="${h*0.76}" r="${h*0.09}" fill="#FFFFFF"/>
      <circle cx="${w*0.75}" cy="${h*0.22}" r="${h*0.05}" fill="#FFFFFF"/>
      <circle cx="${w*0.63}" cy="${h*0.45}" r="${h*0.05}" fill="#FFFFFF"/>
      <circle cx="${w*0.86}" cy="${h*0.40}" r="${h*0.05}" fill="#FFFFFF"/>
      <circle cx="${w*0.75}" cy="${h*0.78}" r="${h*0.06}" fill="#FFFFFF"/>
    `;
  } else if (c === 'INR') {
    inner = `
      <rect width="${w}" height="${h/3}" fill="#FF9933"/>
      <rect y="${h/3}" width="${w}" height="${h/3}" fill="#FFFFFF"/>
      <rect y="${(h*2)/3}" width="${w}" height="${h/3}" fill="#138808"/>
      <circle cx="${w/2}" cy="${h/2}" r="${h*0.13}" fill="none" stroke="#000080" stroke-width="2.5"/>
      <circle cx="${w/2}" cy="${h/2}" r="3" fill="#000080"/>
    `;
  } else if (c === 'KRW') {
    inner = `
      <rect width="${w}" height="${h}" fill="#FFFFFF"/>
      <circle cx="${w/2}" cy="${h/2}" r="${h*0.26}" fill="#CD2E3A"/>
      <path d="M${w/2 - h*0.26},${h/2} A${h*0.13},${h*0.13} 0 0,0 ${w/2},${h/2} A${h*0.13},${h*0.13} 0 0,1 ${w/2 + h*0.26},${h/2} A${h*0.26},${h*0.26} 0 0,1 ${w/2 - h*0.26},${h/2} Z" fill="#0047A0"/>
      <line x1="${w*0.20}" y1="${h*0.28}" x2="${w*0.28}" y2="${h*0.16}" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="${w*0.72}" y1="${h*0.16}" x2="${w*0.80}" y2="${h*0.28}" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="${w*0.20}" y1="${h*0.72}" x2="${w*0.28}" y2="${h*0.84}" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="${w*0.72}" y1="${h*0.84}" x2="${w*0.80}" y2="${h*0.72}" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round"/>
    `;
  } else if (c === 'JPY') {
    inner = `
      <rect width="${w}" height="${h}" fill="#FFFFFF"/>
      <circle cx="${w/2}" cy="${h/2}" r="${h*0.28}" fill="#BC002D"/>
    `;
  } else if (c === 'VND') {
    inner = `
      <rect width="${w}" height="${h}" fill="#DA251D"/>
      <polygon points="${w/2},${h*0.18} ${w*0.56},${h*0.40} ${w*0.74},${h*0.40} ${w*0.60},${h*0.54} ${w*0.65},${h*0.76} ${w/2},${h*0.62} ${w*0.35},${h*0.76} ${w*0.40},${h*0.54} ${w*0.26},${h*0.40} ${w*0.44},${h*0.40}" fill="#FFFF00"/>
    `;
  } else if (c === 'TRY') {
    inner = `
      <rect width="${w}" height="${h}" fill="#E30A17"/>
      <circle cx="${w*0.42}" cy="${h/2}" r="${h*0.25}" fill="#FFFFFF"/>
      <circle cx="${w*0.47}" cy="${h/2}" r="${h*0.20}" fill="#E30A17"/>
      <polygon points="${w*0.64},${h*0.38} ${w*0.67},${h*0.47} ${w*0.75},${h*0.47} ${w*0.69},${h*0.53} ${w*0.71},${h*0.62} ${w*0.64},${h*0.56} ${w*0.57},${h*0.62} ${w*0.59},${h*0.53} ${w*0.53},${h*0.47} ${w*0.61},${h*0.47}" fill="#FFFFFF"/>
    `;
  } else if (c === 'IDR') {
    inner = `
      <rect width="${w}" height="${h/2}" fill="#E70011"/>
      <rect y="${h/2}" width="${w}" height="${h/2}" fill="#FFFFFF"/>
    `;
  } else {
    inner = `
      <rect width="${w}" height="${h}" fill="#003399"/>
      <circle cx="${w/2}" cy="${h/2}" r="${h*0.28}" fill="none" stroke="#FFCC00" stroke-width="4" stroke-dasharray="5 5"/>
    `;
  }
  const clipId = `rflag_${c}_${Math.round(x)}_${Math.round(y)}`;
  return `
    <g transform="translate(${x}, ${y})">
      <rect x="4" y="8" width="${w}" height="${h}" rx="${rx}" fill="rgba(0,0,0,0.35)"/>
      <defs><clipPath id="${clipId}"><rect width="${w}" height="${h}" rx="${rx}"/></clipPath></defs>
      <g clip-path="url(#${clipId})">${inner}</g>
      <rect width="${w}" height="${h}" rx="${rx}" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-opacity="0.85"/>
    </g>
  `;
}

const CURRENCY_SYM = {
  USD: '$', GBP: '£', AUD: 'A$', INR: '₹', KRW: '₩', JPY: '¥', VND: '₫', TRY: '₺', IDR: 'Rp', EUR: '€'
};

// Analyze article purely for visual theme & illustration type (NO conversion rate numbers!)
function analyzeArticle(enSlug, localTitle, lang = 'en') {
  const s = enSlug.toLowerCase();
  const cleanH1 = String(localTitle || '').replace(/&amp;/g, '&').trim();
  const parts = cleanH1.split(':');
  const mainHeadline = parts[0].trim();
  const subHeadline = parts.slice(1).join(':').trim();

  // Special non-pattern slugs
  if (s === 'mastercard-foreign-exchange-rate') {
    return { type: 'card_fx', badge: 'CURRENCY & FOREX', mainHeadline, subHeadline, fromCurr: 'USD', toCurr: 'EUR' };
  }
  if (s === 'currency-for-turkish-lira') {
    return { type: 'currency', badge: 'CURRENCY & FOREX', mainHeadline, subHeadline, fromCurr: 'TRY', toCurr: 'USD' };
  }
  if (s === 'indonesia-cu') {
    return { type: 'currency', badge: 'CURRENCY & FOREX', mainHeadline, subHeadline, fromCurr: 'IDR', toCurr: 'USD' };
  }
  if (s === 'convert-lakh-to-usd') {
    return { type: 'currency', badge: 'CURRENCY & FOREX', mainHeadline, subHeadline, fromCurr: 'INR', toCurr: 'USD' };
  }
  if (s === 'currency-jpy-to-inr') {
    return { type: 'currency', badge: 'CURRENCY & FOREX', mainHeadline, subHeadline, fromCurr: 'JPY', toCurr: 'INR' };
  }
  if (s === 'korean-to-aud') {
    return { type: 'currency', badge: 'CURRENCY & FOREX', mainHeadline, subHeadline, fromCurr: 'KRW', toCurr: 'AUD' };
  }
  if (s === 'rupiah-to-aud') {
    return { type: 'currency', badge: 'CURRENCY & FOREX', mainHeadline, subHeadline, fromCurr: 'IDR', toCurr: 'AUD' };
  }
  if (s === '1-aud-to-vnd') {
    return { type: 'currency', badge: 'CURRENCY & FOREX', mainHeadline, subHeadline, fromCurr: 'AUD', toCurr: 'VND' };
  }
  if (s.includes('won-to-gbp')) {
    return { type: 'currency', badge: 'CURRENCY & FOREX', mainHeadline, subHeadline, fromCurr: 'KRW', toCurr: 'GBP' };
  }

  // Standard Currency Pairs
  const currMatch = s.match(/^(\d+)\s*-(usd|gbp|aud|eur|cad|jpy|inr|krw|vnd|dollars|pounds-sterling|pounds)-(?:(?:to|in|a|para)-)?(usd|gbp|aud|eur|cad|jpy|inr|krw|vnd|australian-dollars|australian|pounds)$/);
  if (currMatch) {
    const rawFrom = currMatch[2];
    const rawTo = currMatch[3];
    const fromCurr = (rawFrom === 'usd' || rawFrom === 'dollars') ? 'USD' : (rawFrom.startsWith('pound') || rawFrom === 'gbp') ? 'GBP' : 'AUD';
    const toCurr = (rawTo === 'gbp' || rawTo === 'pounds') ? 'GBP' : (rawTo.startsWith('aud') || rawTo.startsWith('australian')) ? 'AUD' : 'USD';
    return { type: 'currency', badge: 'CURRENCY & FOREX', mainHeadline, subHeadline, fromCurr, toCurr };
  }

  // Temperature
  if (s.includes('celsius') || s.includes('fahrenheit')) {
    const numMatch = s.match(/^(\d+)/);
    const num = numMatch ? parseInt(numMatch[1], 10) : 25;
    const isFever = (num >= 36 && num <= 39) || num >= 360;
    const isOven = num >= 150 && num <= 250;
    const fromScale = s.indexOf('celsius') < s.indexOf('fahrenheit') ? '°C' : '°F';
    const toScale = fromScale === '°C' ? '°F' : '°C';
    return {
      type: 'temperature',
      subType: isFever ? 'medical' : isOven ? 'oven' : 'weather',
      badge: 'TEMPERATURE & HEAT',
      mainHeadline,
      subHeadline,
      u1: fromScale,
      u2: toScale
    };
  }

  // Kitchen & Volume
  if (s === '1-cup-milk-in-milliliters') {
    return { type: 'kitchen', subType: 'milk', badge: 'KITCHEN & CULINARY', mainHeadline, subHeadline, u1: 'CUP', u2: 'ML' };
  }
  if (s === '1-3-cup-to-grams') {
    return { type: 'kitchen', subType: 'baking', badge: 'KITCHEN & CULINARY', mainHeadline, subHeadline, u1: 'CUP', u2: 'GRAMS' };
  }
  if (s === '1-tsp-is-ml') {
    return { type: 'kitchen', subType: 'spoon', badge: 'KITCHEN & CULINARY', mainHeadline, subHeadline, u1: 'TSP', u2: 'ML' };
  }
  if (s === '1-gallon-in-litres') {
    return { type: 'kitchen', subType: 'gallon', badge: 'VOLUME & CAPACITY', mainHeadline, subHeadline, u1: 'GAL', u2: 'LITRES' };
  }
  if (/(cup|ml|milliliter|liter|litre|gallon|ounces|oz|tsp)/.test(s)) {
    const u1 = s.includes('oz') || s.includes('ounce') ? 'FL OZ' : s.startsWith('500-ml') ? 'ML' : 'CUPS';
    const u2 = s.startsWith('500-ml') ? 'CUPS' : 'ML';
    return { type: 'kitchen', subType: 'beaker', badge: 'KITCHEN & VOLUME', mainHeadline, subHeadline, u1, u2 };
  }

  // Bullion / Gold
  if (s === '1-tola-in-grams') {
    return { type: 'gold', badge: 'BULLION & JEWELLERY', mainHeadline, subHeadline, u1: 'TOLA', u2: 'GRAMS' };
  }

  // Weight & Mass
  if (/(kg|kilo|lbs|pounds|stone)/.test(s)) {
    const hasStone = s.includes('stone');
    const u1 = s.startsWith('1-') || s.startsWith('13-') || s.startsWith('14-') ? (hasStone ? 'STONE' : 'LBS') : (s.includes('kg') && s.indexOf('kg') < 6 ? 'KG' : 'LBS');
    const u2 = hasStone && u1 !== 'STONE' ? 'STONE' : (u1 === 'KG' ? 'LBS' : 'KG');
    return { type: 'weight', subType: hasStone ? 'scale' : 'barbell', badge: 'WEIGHT & MASS', mainHeadline, subHeadline, u1, u2 };
  }

  // Speed & Pressure
  if (s === '60-mph-to-kmh') {
    return { type: 'speed', badge: 'SPEED & VELOCITY', mainHeadline, subHeadline, u1: 'MPH', u2: 'KM/H' };
  }
  if (s === '1-bar-to-psi-conversion') {
    return { type: 'pressure', badge: 'PRESSURE & ENGINEERING', mainHeadline, subHeadline, u1: 'BAR', u2: 'PSI' };
  }

  // Indian Land & Numbering
  if (s.includes('bigha') || s.includes('gaj') || s.includes('guntha')) {
    const u1 = s.includes('bigha') ? 'BIGHA' : s.includes('gaj') ? 'GAJ' : 'GUNTHA';
    return { type: 'land', badge: 'INDIAN LAND UNITS', mainHeadline, subHeadline, u1, u2: 'SQ FT' };
  }
  if (s === '1-crore-in-millions') {
    return { type: 'crore', badge: 'NUMBERING SYSTEM', mainHeadline, subHeadline, u1: 'CRORE', u2: 'MILLION' };
  }

  // Length
  if (s.includes('meters-to-feet') || s.includes('meter') || s.includes('feet')) {
    return { type: 'length', badge: 'LENGTH & DISTANCE', mainHeadline, subHeadline, u1: 'METERS', u2: 'FEET' };
  }

  // Time
  if (s === 'weeks-calculator') {
    return { type: 'time', badge: 'TIME & CALENDAR', mainHeadline, subHeadline, u1: 'WEEKS', u2: 'DAYS' };
  }

  // File / PDF / App / Spelling
  if (s.includes('pdf')) {
    return { type: 'pdf', badge: 'FILE & PDF TOOLS', mainHeadline, subHeadline, u1: 'FILE', u2: 'PDF' };
  }
  if (s === 'converter-application-download') {
    return { type: 'app', badge: 'WEB & MOBILE APP', mainHeadline, subHeadline, u1: 'PWA', u2: 'APP' };
  }
  if (s === 'convertor-or-converter') {
    return { type: 'grammar', badge: 'LANGUAGE & USAGE', mainHeadline, subHeadline, u1: '-ER', u2: '-OR' };
  }
  return { type: 'file', badge: 'FILE & FORMAT TOOLS', mainHeadline, subHeadline, u1: 'INPUT', u2: 'OUTPUT' };
}

// Render Eye-Catching Illustration on Right Side (x: 680..1160, y: 60..570)
function renderArtwork(info, theme, variantIdx) {
  const v = variantIdx % 4;

  // 1. CURRENCY & FOREX (4 distinct eye-catching layouts, ZERO conversion rates!)
  if (info.type === 'currency') {
    const f = info.fromCurr || 'USD';
    const t = info.toCurr || 'GBP';
    const sym1 = CURRENCY_SYM[f] || '$';
    const sym2 = CURRENCY_SYM[t] || '£';

    if (v === 0) {
      // Layout A: Overlapping Glowing Circular Glass Orbs + Big Flags + Gold Coins
      return `
        <g transform="translate(690, 65)">
          <circle cx="220" cy="250" r="215" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" stroke-width="2" stroke-dasharray="10 8"/>
          <circle cx="220" cy="250" r="165" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <!-- Top-Left Currency Orb -->
          <g transform="translate(20, 35)">
            <rect width="230" height="190" rx="34" fill="rgba(15,23,42,0.72)" stroke="${theme.accent}" stroke-width="3"/>
            ${renderRectFlag(f, 60, 26, 110, 74, 14)}
            <text x="115" y="152" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="38" font-weight="900" fill="#FFFFFF">${escXml(f)} <tspan fill="${theme.accent}">${escXml(sym1)}</tspan></text>
          </g>
          <!-- Bottom-Right Currency Orb -->
          <g transform="translate(190, 265)">
            <rect width="230" height="190" rx="34" fill="rgba(15,23,42,0.78)" stroke="${theme.accent2}" stroke-width="3"/>
            ${renderRectFlag(t, 60, 26, 110, 74, 14)}
            <text x="115" y="152" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="38" font-weight="900" fill="#FFFFFF">${escXml(t)} <tspan fill="${theme.accent2}">${escXml(sym2)}</tspan></text>
          </g>
          <!-- Center 3D Gold Exchange Badge -->
          <g transform="translate(165, 195)">
            <circle cx="55" cy="55" r="52" fill="${theme.accent2}" stroke="#FFFFFF" stroke-width="4"/>
            <path d="M35,42 H75 L63,30 M75,42 L63,54 M75,68 H35 L47,56 M35,68 L47,80" fill="none" stroke="#0F172A" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <!-- Floating Gold Coins -->
          <g transform="translate(310, 55)">
            <circle cx="48" cy="48" r="44" fill="#FBBF24" stroke="#FEF08A" stroke-width="3"/>
            <circle cx="48" cy="48" r="34" fill="none" stroke="#B45309" stroke-width="2" stroke-dasharray="4 4"/>
            <text x="48" y="62" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="900" fill="#78350F">${escXml(sym1)}</text>
          </g>
          <g transform="translate(35, 315)">
            <circle cx="48" cy="48" r="44" fill="#38BDF8" stroke="#E0F2FE" stroke-width="3"/>
            <circle cx="48" cy="48" r="34" fill="none" stroke="#0369A1" stroke-width="2" stroke-dasharray="4 4"/>
            <text x="48" y="62" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="900" fill="#0C4A6E">${escXml(sym2)}</text>
          </g>
        </g>
      `;
    } else if (v === 1) {
      // Layout B: Stylized Floating Banknotes + Twin Flag Shields + Rising Chart Wave
      return `
        <g transform="translate(690, 65)">
          <!-- Decorative Rising Forex Chart Backdrop -->
          <rect x="10" y="30" width="420" height="440" rx="36" fill="rgba(15,23,42,0.55)" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
          <path d="M35,390 Q120,340 185,360 T315,260 T400,190" fill="none" stroke="${theme.accent}" stroke-width="5" stroke-linecap="round" stroke-opacity="0.5"/>
          <!-- Left Flag Shield -->
          <g transform="translate(42, 70)">
            <rect width="155" height="205" rx="26" fill="rgba(15,23,42,0.85)" stroke="${theme.accent}" stroke-width="3"/>
            ${renderRectFlag(f, 22, 24, 110, 74, 12)}
            <circle cx="77" cy="148" r="32" fill="${theme.accent}" fill-opacity="0.2" stroke="${theme.accent}" stroke-width="2"/>
            <text x="77" y="160" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="32" font-weight="900" fill="${theme.accent}">${escXml(sym1)}</text>
          </g>
          <!-- Right Flag Shield -->
          <g transform="translate(242, 130)">
            <rect width="155" height="205" rx="26" fill="rgba(15,23,42,0.85)" stroke="${theme.accent2}" stroke-width="3"/>
            ${renderRectFlag(t, 22, 24, 110, 74, 12)}
            <circle cx="77" cy="148" r="32" fill="${theme.accent2}" fill-opacity="0.2" stroke="${theme.accent2}" stroke-width="2"/>
            <text x="77" y="160" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="32" font-weight="900" fill="${theme.accent2}">${escXml(sym2)}</text>
          </g>
          <!-- Center Swap Circle -->
          <circle cx="220" cy="200" r="36" fill="#FFFFFF" stroke="${theme.bg1}" stroke-width="4"/>
          <path d="M204,192 H236 L226,182 M236,208 H204 L214,218" fill="none" stroke="#0F172A" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Bottom Currency Pair Pill -->
          <rect x="65" y="372" width="310" height="64" rx="32" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
          <text x="220" y="414" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="30" font-weight="900" fill="#FFFFFF" letter-spacing="2">${escXml(f)}  ⇄  ${escXml(t)}</text>
        </g>
      `;
    } else if (v === 2) {
      // Layout C: Global Forex Wireframe Globe + Orbiting Flag Cards
      return `
        <g transform="translate(690, 65)">
          <!-- Wireframe Globe in Center -->
          <circle cx="220" cy="250" r="195" fill="rgba(15,23,42,0.5)" stroke="rgba(255,255,255,0.22)" stroke-width="2.5"/>
          <ellipse cx="220" cy="250" rx="105" ry="195" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
          <ellipse cx="220" cy="250" rx="195" ry="75" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
          <line x1="25" y1="250" x2="415" y2="250" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
          <line x1="220" y1="55" x2="220" y2="445" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
          <!-- Top Flag Banner -->
          <g transform="translate(45, 65)">
            <rect width="350" height="125" rx="28" fill="rgba(15,23,42,0.85)" stroke="${theme.accent}" stroke-width="3"/>
            ${renderRectFlag(f, 24, 25, 110, 74, 12)}
            <text x="156" y="68" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="42" font-weight="900" fill="#FFFFFF">${escXml(f)}</text>
            <text x="156" y="100" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="21" font-weight="800" fill="${theme.accent}">CURRENCY (${escXml(sym1)})</text>
          </g>
          <!-- Center Vertical Exchange Arrow -->
          <circle cx="220" cy="250" r="38" fill="${theme.accent2}" stroke="#FFFFFF" stroke-width="4"/>
          <path d="M208,236 L220,222 L232,236 M220,222 V278 M208,264 L220,278 L232,264" fill="none" stroke="#0F172A" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Bottom Flag Banner -->
          <g transform="translate(45, 310)">
            <rect width="350" height="125" rx="28" fill="rgba(15,23,42,0.85)" stroke="${theme.accent2}" stroke-width="3"/>
            ${renderRectFlag(t, 24, 25, 110, 74, 12)}
            <text x="156" y="68" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="42" font-weight="900" fill="#FFFFFF">${escXml(t)}</text>
            <text x="156" y="100" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="21" font-weight="800" fill="${theme.accent2}">CURRENCY (${escXml(sym2)})</text>
          </g>
        </g>
      `;
    } else {
      // Layout D: Dual Hexagonal / Diamond Medallion Cards + Gold Coin Stack
      return `
        <g transform="translate(690, 65)">
          <rect x="15" y="25" width="410" height="450" rx="40" fill="rgba(15,23,42,0.52)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
          <!-- Top Dual Flags Row -->
          <g transform="translate(45, 65)">
            ${renderRectFlag(f, 0, 0, 135, 92, 16)}
            <text x="67" y="132" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="34" font-weight="900" fill="#FFFFFF">${escXml(f)}</text>
          </g>
          <g transform="translate(260, 65)">
            ${renderRectFlag(t, 0, 0, 135, 92, 16)}
            <text x="67" y="132" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="34" font-weight="900" fill="#FFFFFF">${escXml(t)}</text>
          </g>
          <!-- Arrow Between Flags -->
          <path d="M195,110 H245 M232,96 L247,110 L232,124 M208,96 L193,110 L208,124" fill="none" stroke="${theme.accent2}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Lower Visual: Big Glowing Currency Symbols & Candlestick Bars -->
          <g transform="translate(45, 235)">
            <rect width="350" height="190" rx="28" fill="rgba(15,23,42,0.75)" stroke="${theme.accent}" stroke-width="2.5"/>
            <!-- Rising Candlesticks -->
            <rect x="40" y="110" width="22" height="50" rx="6" fill="${theme.accent}" fill-opacity="0.6"/>
            <rect x="82" y="85" width="22" height="75" rx="6" fill="${theme.accent}" fill-opacity="0.8"/>
            <rect x="124" y="55" width="22" height="105" rx="6" fill="${theme.accent}"/>
            <rect x="166" y="35" width="22" height="125" rx="6" fill="${theme.accent2}"/>
            <!-- Big Coin Badge -->
            <circle cx="272" cy="95" r="56" fill="${theme.accent2}" stroke="#FFFFFF" stroke-width="3.5"/>
            <text x="272" y="112" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="44" font-weight="900" fill="#0F172A">${escXml(sym1)}${escXml(sym2)}</text>
          </g>
        </g>
      `;
    }
  }

  // 2. MASTERCARD FX CARD ILLUSTRATION
  if (info.type === 'card_fx') {
    return `
      <g transform="translate(690, 90)">
        <!-- Tilted Background Card -->
        <g transform="translate(40, 20) rotate(-6)">
          <rect width="360" height="225" rx="24" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
        </g>
        <!-- Foreground 3D Credit Card -->
        <g transform="translate(25, 70)">
          <rect width="380" height="240" rx="26" fill="#0F172A" stroke="${theme.accent}" stroke-width="3"/>
          <!-- Gold EMV Chip -->
          <rect x="34" y="42" width="62" height="48" rx="10" fill="#FBBF24" stroke="#FEF08A" stroke-width="2"/>
          <line x1="34" y1="66" x2="96" y2="66" stroke="#92400E" stroke-width="2"/>
          <line x1="65" y1="42" x2="65" y2="90" stroke="#92400E" stroke-width="2"/>
          <!-- Interlocking Red & Amber Circles -->
          <circle cx="275" cy="172" r="38" fill="#EB001B"/>
          <circle cx="322" cy="172" r="38" fill="#F79E1B" fill-opacity="0.9"/>
          <!-- Currency Symbols Row -->
          <text x="34" y="155" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="34" font-weight="900" fill="#FFFFFF">$  •  €  •  £  •  ¥</text>
          <text x="34" y="195" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="18" font-weight="800" fill="${theme.accent}" letter-spacing="2">GLOBAL FX NETWORK</text>
        </g>
      </g>
    `;
  }

  // 3. TEMPERATURE & HEAT (Medical, Oven, Weather)
  if (info.type === 'temperature') {
    const badgeColor = info.subType === 'oven' ? '#FB923C' : info.subType === 'medical' ? '#F43F5E' : '#38BDF8';
    return `
      <g transform="translate(690, 65)">
        <circle cx="220" cy="250" r="210" fill="rgba(15,23,42,0.5)" stroke="rgba(255,255,255,0.2)" stroke-width="2.5"/>
        <!-- Giant Stylized 3D Thermometer -->
        <g transform="translate(155, 45)">
          <rect x="35" y="15" width="60" height="280" rx="30" fill="#0F172A" stroke="#FFFFFF" stroke-width="4"/>
          <rect x="47" y="85" width="36" height="215" rx="18" fill="${badgeColor}"/>
          <circle cx="65" cy="330" r="58" fill="${badgeColor}" stroke="#FFFFFF" stroke-width="5"/>
          <circle cx="48" cy="312" r="14" fill="rgba(255,255,255,0.45)"/>
          <!-- Scale Ticks -->
          <g stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round">
            <line x1="108" y1="60" x2="132" y2="60"/><line x1="108" y1="95" x2="124" y2="95"/>
            <line x1="108" y1="130" x2="132" y2="130"/><line x1="108" y1="165" x2="124" y2="165"/>
            <line x1="108" y1="200" x2="132" y2="200"/><line x1="108" y1="235" x2="124" y2="235"/>
          </g>
        </g>
        <!-- Left °C Badge -->
        <g transform="translate(20, 155)">
          <rect width="125" height="125" rx="28" fill="rgba(15,23,42,0.88)" stroke="${theme.accent}" stroke-width="3"/>
          <text x="62" y="82" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="54" font-weight="900" fill="${theme.accent}">${escXml(info.u1)}</text>
        </g>
        <!-- Right °F Badge -->
        <g transform="translate(300, 155)">
          <rect width="125" height="125" rx="28" fill="rgba(15,23,42,0.88)" stroke="${theme.accent2}" stroke-width="3"/>
          <text x="62" y="82" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="54" font-weight="900" fill="${theme.accent2}">${escXml(info.u2)}</text>
        </g>
      </g>
    `;
  }

  // 4. KITCHEN & VOLUME (Beaker, Milk, Baking, Gallon, Spoon)
  if (info.type === 'kitchen') {
    const liquidFill = info.subType === 'milk' ? '#F8FAFC' : theme.accent;
    return `
      <g transform="translate(690, 65)">
        <rect x="20" y="25" width="400" height="450" rx="38" fill="rgba(15,23,42,0.52)" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
        <!-- Large Graduated Kitchen Measuring Pitcher -->
        <g transform="translate(95, 55)">
          <path d="M25,30 L40,290 A28,28 0 0,0 68,318 H182 A28,28 0 0,0 210,290 L225,30 Z" fill="rgba(15,23,42,0.8)" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round"/>
          <!-- Pouring Lip & Handle -->
          <path d="M12,30 H238" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
          <path d="M222,65 H258 A22,22 0 0,1 280,87 V185 A22,22 0 0,1 258,207 H215" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
          <!-- Liquid Fill Wave -->
          <path d="M36,145 Q85,130 125,145 T214,145 L206,286 A22,22 0 0,1 184,308 H66 A22,22 0 0,1 44,286 Z" fill="${liquidFill}" fill-opacity="0.88"/>
          <!-- Measurement Lines -->
          <g stroke="${info.subType === 'milk' ? '#0F172A' : '#FFFFFF'}" stroke-width="3" stroke-linecap="round">
            <line x1="65" y1="90" x2="115" y2="90"/>
            <line x1="65" y1="135" x2="105" y2="135"/>
            <line x1="65" y1="180" x2="115" y2="180"/>
            <line x1="65" y1="225" x2="105" y2="225"/>
            <line x1="65" y1="270" x2="115" y2="270"/>
          </g>
        </g>
        <!-- Bottom Unit Pill -->
        <rect x="55" y="392" width="330" height="60" rx="30" fill="rgba(15,23,42,0.85)" stroke="${theme.accent2}" stroke-width="2.5"/>
        <text x="220" y="431" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" letter-spacing="1.5">${escXml(info.u1)}  ⇄  ${escXml(info.u2)}</text>
      </g>
    `;
  }

  // 5. GOLD BULLION (1 Tola in Grams)
  if (info.type === 'gold') {
    return `
      <g transform="translate(690, 65)">
        <circle cx="220" cy="250" r="210" fill="rgba(15,23,42,0.5)" stroke="#FBBF24" stroke-width="2.5"/>
        <!-- 3D Gold Bullion Bars Stack -->
        <g transform="translate(65, 115)">
          <polygon points="40,140 150,80 280,140 170,200" fill="#FDE047" stroke="#FFFFFF" stroke-width="2.5"/>
          <polygon points="40,140 170,200 155,245 25,185" fill="#F59E0B" stroke="#FFFFFF" stroke-width="2"/>
          <polygon points="170,200 280,140 295,185 155,245" fill="#D97706" stroke="#FFFFFF" stroke-width="2"/>
          <text x="160" y="152" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="900" fill="#78350F">999.9 GOLD</text>
        </g>
        <rect x="60" y="365" width="320" height="62" rx="31" fill="rgba(15,23,42,0.85)" stroke="#FDE047" stroke-width="2.5"/>
        <text x="220" y="405" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="28" font-weight="900" fill="#FDE047" letter-spacing="1.5">TOLA  ⇄  GRAMS</text>
      </g>
    `;
  }

  // 6. WEIGHT & MASS (Kettlebell / Barbell & Scale)
  if (info.type === 'weight') {
    return `
      <g transform="translate(690, 65)">
        <circle cx="220" cy="250" r="210" fill="rgba(15,23,42,0.52)" stroke="rgba(255,255,255,0.22)" stroke-width="2.5"/>
        <!-- Barbell & Gym Plates Illustration -->
        <g transform="translate(45, 115)">
          <rect x="10" y="88" width="330" height="24" rx="12" fill="#E2E8F0"/>
          <rect x="35" y="25" width="36" height="150" rx="12" fill="${theme.accent}" stroke="#FFFFFF" stroke-width="3"/>
          <rect x="78" y="45" width="28" height="110" rx="10" fill="${theme.accent2}" stroke="#FFFFFF" stroke-width="2.5"/>
          <rect x="244" y="45" width="28" height="110" rx="10" fill="${theme.accent2}" stroke="#FFFFFF" stroke-width="2.5"/>
          <rect x="279" y="25" width="36" height="150" rx="12" fill="${theme.accent}" stroke="#FFFFFF" stroke-width="3"/>
        </g>
        <!-- Unit Badges -->
        <rect x="60" y="345" width="320" height="68" rx="34" fill="rgba(15,23,42,0.88)" stroke="${theme.accent}" stroke-width="3"/>
        <text x="220" y="389" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="32" font-weight="900" fill="#FFFFFF" letter-spacing="2">${escXml(info.u1)}  ⇄  ${escXml(info.u2)}</text>
      </g>
    `;
  }

  // 7. SPEED & PRESSURE GAUGE
  if (info.type === 'speed' || info.type === 'pressure') {
    return `
      <g transform="translate(690, 65)">
        <circle cx="220" cy="250" r="210" fill="rgba(15,23,42,0.65)" stroke="rgba(255,255,255,0.25)" stroke-width="3"/>
        <path d="M85,335 A165,165 0 1,1 355,335" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="26" stroke-linecap="round"/>
        <path d="M85,335 A165,165 0 1,1 325,130" fill="none" stroke="${theme.accent}" stroke-width="26" stroke-linecap="round"/>
        <!-- Needle -->
        <line x1="220" y1="250" x2="310" y2="145" stroke="${theme.accent2}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="220" cy="250" r="22" fill="#FFFFFF"/>
        <rect x="65" y="365" width="310" height="62" rx="31" fill="rgba(15,23,42,0.9)" stroke="${theme.accent2}" stroke-width="2.5"/>
        <text x="220" y="405" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" letter-spacing="1.5">${escXml(info.u1)}  ⇄  ${escXml(info.u2)}</text>
      </g>
    `;
  }

  // 8. INDIAN LAND & CRORE
  if (info.type === 'land' || info.type === 'crore') {
    return `
      <g transform="translate(690, 65)">
        <rect x="20" y="25" width="400" height="450" rx="38" fill="rgba(15,23,42,0.58)" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
        ${renderRectFlag('INR', 165, 55, 110, 74, 14)}
        <!-- Isometric Land / Grid Graphic -->
        <g transform="translate(70, 155)">
          <polygon points="150,15 285,85 150,155 15,85" fill="${theme.accent}" fill-opacity="0.35" stroke="${theme.accent}" stroke-width="4"/>
          <line x1="82" y1="50" x2="217" y2="120" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6 6"/>
          <line x1="217" y1="50" x2="82" y2="120" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6 6"/>
          <circle cx="150" cy="85" r="14" fill="${theme.accent2}" stroke="#FFFFFF" stroke-width="3"/>
        </g>
        <rect x="55" y="365" width="330" height="64" rx="32" fill="rgba(15,23,42,0.88)" stroke="${theme.accent2}" stroke-width="2.5"/>
        <text x="220" y="407" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="27" font-weight="900" fill="#FFFFFF" letter-spacing="1.5">${escXml(info.u1)}  ⇄  ${escXml(info.u2)}</text>
      </g>
    `;
  }

  // 9. LENGTH, TIME, PDF, APP & FILE TOOLS
  return `
    <g transform="translate(690, 65)">
      <rect x="20" y="25" width="400" height="450" rx="38" fill="rgba(15,23,42,0.55)" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
      <!-- Stylized 3D Layered Icon Cards -->
      <g transform="translate(65, 75)">
        <rect x="0" y="20" width="145" height="175" rx="24" fill="rgba(15,23,42,0.88)" stroke="${theme.accent}" stroke-width="3"/>
        <text x="72" y="120" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="32" font-weight="900" fill="${theme.accent}">${escXml(info.u1)}</text>
        <rect x="165" y="60" width="145" height="175" rx="24" fill="rgba(15,23,42,0.88)" stroke="${theme.accent2}" stroke-width="3"/>
        <text x="237" y="160" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="32" font-weight="900" fill="${theme.accent2}">${escXml(info.u2)}</text>
        <circle cx="155" cy="128" r="32" fill="#FFFFFF" stroke="#0F172A" stroke-width="4"/>
        <path d="M142,128 H168 M158,118 L168,128 L158,138" fill="none" stroke="#0F172A" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <rect x="55" y="370" width="330" height="62" rx="31" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
      <text x="220" y="410" text-anchor="middle" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="26" font-weight="900" fill="#FFFFFF" letter-spacing="1.5">${escXml(info.u1)}  ⇄  ${escXml(info.u2)}</text>
    </g>
  `;
}

const LOCALIZED_BADGES = {
  es: {
    'CURRENCY & FOREX': 'DIVISAS Y FOREX',
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
    'NUMBERING SYSTEM': 'SISTEMA NUMÉRICO',
    'TIME & CALENDAR': 'TIEMPO Y CALENDARIO',
    'FILE & PDF TOOLS': 'ARCHIVOS Y PDF',
    'FILE & FORMAT TOOLS': 'ARCHIVOS Y FORMATOS',
    'WEB & MOBILE APP': 'APLICACIÓN WEB PWA',
    'LANGUAGE & USAGE': 'GUÍA TÉCNICA'
  },
  de: {
    'CURRENCY & FOREX': 'WÄHRUNG & DEVISEN',
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
    'NUMBERING SYSTEM': 'ZAHLENSYSTEM',
    'TIME & CALENDAR': 'ZEIT & KALENDER',
    'FILE & PDF TOOLS': 'DATEIEN & PDF',
    'FILE & FORMAT TOOLS': 'DATEIFORMAT-TOOLS',
    'WEB & MOBILE APP': 'OFFLINE WEB-APP',
    'LANGUAGE & USAGE': 'FACHRATGEBER'
  },
  pt: {
    'CURRENCY & FOREX': 'MOEDAS E CÂMBIO',
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
    'NUMBERING SYSTEM': 'SISTEMA NUMÉRICO',
    'TIME & CALENDAR': 'TEMPO E CALENDÁRIO',
    'FILE & PDF TOOLS': 'ARQUIVOS E PDF',
    'FILE & FORMAT TOOLS': 'ARQUIVOS E FORMATOS',
    'WEB & MOBILE APP': 'APLICATIVO WEB PWA',
    'LANGUAGE & USAGE': 'GUIA TÉCNICO'
  }
};

async function generateArticleHeroImage({ enSlug, localSlug, title, lang = 'en', outFile, themeIndexOverride = null }) {
  const info = analyzeArticle(enSlug, title, lang);
  const idx = themeIndexOverride !== null ? (themeIndexOverride % THEMES.length) : (hashSlug(enSlug) % THEMES.length);
  const theme = THEMES[idx];

  const badgeText = (LOCALIZED_BADGES[lang] && LOCALIZED_BADGES[lang][info.badge]) || info.badge;

  // Title ONLY on the left side — large, bold, super legible at any thumbnail size
  const headlineLines = wrapTextLines(info.mainHeadline, 17, 3);
  const headlineFontSize = headlineLines.length === 1
    ? (info.mainHeadline.length > 14 ? 64 : 74)
    : headlineLines.length === 2
    ? (info.mainHeadline.length > 26 ? 54 : 60)
    : 46;

  const subLines = info.subHeadline ? wrapTextLines(info.subHeadline, 34, 2) : [];

  // Calculate vertical centering for the title block
  const startY = headlineLines.length === 1 ? 245 : headlineLines.length === 2 ? 215 : 195;
  const lineStep = Math.round(headlineFontSize * 1.18);

  let titleSvg = '';
  headlineLines.forEach((line, i) => {
    const fill = i === headlineLines.length - 1 && headlineLines.length > 1 ? theme.accent2 : '#FFFFFF';
    titleSvg += `<text x="68" y="${startY + i * lineStep}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="${headlineFontSize}" font-weight="900" fill="${fill}" letter-spacing="-1">${escXml(line)}</text>\n`;
  });

  const subStartY = startY + (headlineLines.length - 1) * lineStep + 62;
  subLines.forEach((sLine, j) => {
    titleSvg += `<text x="68" y="${subStartY + j * 38}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="27" font-weight="700" fill="rgba(255,255,255,0.88)">${escXml(sLine)}</text>\n`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bg1}"/>
        <stop offset="50%" stop-color="${theme.bg2}"/>
        <stop offset="100%" stop-color="${theme.bg3}"/>
      </linearGradient>
      <radialGradient id="glowRight" cx="78%" cy="45%" r="48%">
        <stop offset="0%" stop-color="${theme.glow}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${theme.glow}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glowLeft" cx="15%" cy="20%" r="45%">
        <stop offset="0%" stop-color="${theme.accent2}" stop-opacity="0.20"/>
        <stop offset="100%" stop-color="${theme.accent2}" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- Vibrant Multi-Stop Background -->
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect width="1200" height="630" fill="url(#glowRight)"/>
    <rect width="1200" height="630" fill="url(#glowLeft)"/>

    <!-- Subtle Decorative Waves -->
    <path d="M0,530 Q340,460 680,530 T1200,490" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3"/>
    <circle cx="910" cy="315" r="275" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="2"/>

    <!-- Top Category Badge -->
    <g transform="translate(68, 72)">
      <rect width="${Math.max(245, badgeText.length * 12.5 + 58)}" height="46" rx="23" fill="rgba(15, 23, 42, 0.55)" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
      <circle cx="26" cy="23" r="7" fill="${theme.accent2}"/>
      <text x="46" y="29" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="15" font-weight="800" fill="#FFFFFF" letter-spacing="1.6">${escXml(badgeText)}</text>
    </g>

    <!-- ONLY the Article Title (No conversion rates or numbers!) -->
    ${titleSvg}

    <!-- Bottom Brand Footer -->
    <g transform="translate(68, 515)">
      <rect width="38" height="38" rx="10" fill="#FFFFFF"/>
      <text x="19" y="27" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="900" fill="${theme.bg1}">O</text>
      <text x="52" y="27" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="22" font-weight="800" fill="#FFFFFF">OmniConverter</text>
    </g>

    <!-- Article-Specific Eye-Catching Illustration -->
    ${renderArtwork(info, theme, idx)}
  </svg>`;

  const dir = path.dirname(outFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const pngBuffer = await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toBuffer();
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      if (fs.existsSync(outFile)) {
        try { fs.unlinkSync(outFile); } catch (_) {}
      }
      fs.writeFileSync(outFile, pngBuffer);
      break;
    } catch (err) {
      if (attempt === 7) throw err;
      await new Promise(r => setTimeout(r, 120 * (attempt + 1)));
    }
  }
}

module.exports = {
  generateArticleHeroImage,
  analyzeArticle
};
