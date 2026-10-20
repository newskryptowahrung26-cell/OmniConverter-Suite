const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', 'scripts']);

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!SKIP.has(f)) walk(full, out);
    } else if (f.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

const rel = p => path.relative(ROOT, p).replace(/\\/g, '/');

function slugTitle(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function topicFromSlug(slug) {
  const s = slug.toLowerCase();
  const has = (...k) => k.some(x => s.includes(x));
  if (has('usd', 'gbp', 'aud', 'eur', 'vnd', 'inr', 'jpy', 'won', 'rupiah', 'rupia', 'lira', 'dollar', 'dolar', 'pounds-sterling', 'pfund-in-australische', 'libras-en-dolares', 'libras-em-dolares', 'britische-pfund', 'currency', 'moneda', 'moeda', 'waehrung', 'divisa', 'mastercard', 'lakh', 'crore', 'exchange', 'indonesia')) {
    if (!has('stone', '-kg', 'kg-', 'kilo', 'quilos')) return 'currency';
  }
  if (has('fahrenheit', 'celsius', 'grad-celsius', 'graus', 'grados')) return 'temperature';
  if (has('cup', 'taza', 'tasse', 'xicara', 'ml', 'litre', 'liter', 'litro', 'gallon', 'galon', 'galao', 'gallone', 'tsp', 'cucharadita', 'teeloeffel', 'colher', 'ounces-to-milli', 'onzas', 'unzen', 'oncas')) return 'volume';
  if (has('stone', 'kg', 'kilo', 'quilos', 'lbs', 'pound', 'libras', 'pfund', 'tola', 'gram')) return 'weight';
  if (has('bigha', 'gaj', 'guntha', 'square', 'sq-ft')) return 'area';
  if (has('meter', 'metro', 'feet', 'pies', 'fuss', 'pes')) return 'length';
  if (has('psi', 'bar-')) return 'pressure';
  if (has('mph', 'kmh')) return 'speed';
  if (has('week', 'semana', 'woche')) return 'time';
  if (has('file', 'pdf', 'archivo', 'arquivo', 'datei', 'convertor', 'converter-app', 'aplicacion', 'aplicativo', 'app-herunter')) return 'file';
  return 'unknown';
}

function calcType(html) {
  const sel = html.match(/id="liveToolFromUnit"[^>]*>([\s\S]*?)<\/select>/);
  if (!sel) return null;
  const vals = [...sel[1].matchAll(/value="([^"]+)"/g)].map(m => m[1]);
  const v = new Set(vals.map(x => x.toLowerCase()));
  if (v.has('usd') || v.has('gbp') || v.has('eur')) return 'currency';
  if (v.has('f') && v.has('c')) return 'temperature';
  if (v.has('ml') || v.has('cup') || v.has('cups') || v.has('cup_us') || v.has('cup_metric') || v.has('l') || v.has('gal') || v.has('tsp')) return 'volume';
  if (v.has('kg') || v.has('lb') || v.has('st') || (v.has('g') && v.has('oz'))) return 'weight';
  if (v.has('sqft') || v.has('sqm') || v.has('acre') || v.has('bigha_std') || v.has('guntha') || v.has('gaj')) return 'area';
  if (v.has('m') || v.has('ft') || v.has('km') || v.has('in')) return 'length';
  if (v.has('psi') || v.has('bar')) return 'pressure';
  if (v.has('mph') || v.has('kmh')) return 'speed';
  if (v.has('week') || v.has('day') || v.has('hr') || v.has('min') || v.has('sec')) return 'time';
  if (v.has('kb') || v.has('mb') || v.has('gb') || v.has('tb')) return 'file';
  return 'other:' + vals.slice(0, 4).join(',');
}

// Specific human-crafted titles and descriptions for all SLUG_TITLE, SLUG_DESC, and overlapping pages
const titleDescMap = {
  'blog/1-aud-to-vnd.html': {
    title: '1 AUD to VND: Australian Dollar to Vietnamese Dong Exchange Rate & Travel Guide | OmniConverter',
    h1: '1 AUD to VND: Australian Dollar to Vietnamese Dong Exchange Rate & Travel Guide',
    desc: 'Convert 1 AUD to VND (~16,650 Vietnamese Dong) with our live exchange rate calculator, travel cash reference table, ATM withdrawal tips, and VND mental math shortcuts.'
  },
  'blog/1-billion-korean-won-to-gbp.html': {
    title: '1 Billion Korean Won to GBP (KRW to £): How Much Is ₩1,000,000,000 in Pounds? | OmniConverter',
    h1: '1 Billion Korean Won to GBP (KRW to £): How Much Is ₩1,000,000,000 in British Pounds?',
    desc: 'Find out exactly how much 1 Billion South Korean Won (₩1,000,000,000 KRW) is worth in British Pounds (£572,460 GBP), with K-drama cultural context and wire transfer breakdowns.'
  },
  'blog/10-billion-won-to-gbp.html': {
    title: '10 Billion Won to GBP (₩10B KRW to £): Korean Won to British Pounds Conversion | OmniConverter',
    h1: '10 Billion Won to GBP (₩10,000,000,000 KRW to £): Korean Won to British Pounds Guide',
    desc: 'Convert 10 Billion South Korean Won (₩10,000,000,000 KRW) to British Pounds (~£5.72 Million GBP). Includes corporate FX transfer tables, KRW/GBP formulas, and purchasing power context.'
  },
  'blog/104-kg-pounds.html': {
    title: '104 kg to lbs: How Many Pounds Is 104 Kilograms? (229.28 lbs & 16 st 5 lb) | OmniConverter',
    h1: '104 kg to lbs: Convert 104 Kilograms to Pounds (229.28 lbs) & Stone',
    desc: '104 kilograms equals 229.28 pounds (229 lbs 4.5 oz or 16 stone 5.3 lbs). View the exact 104 kg to lbs formula, fractional stone breakdown, and gym weight conversion chart.'
  },
  'blog/12-degrees-celsius-to-fahrenheit.html': {
    title: '12°C to °F: What Is 12 Degrees Celsius in Fahrenheit? (53.6°F Weather Guide) | OmniConverter',
    h1: '12°C to °F: What Is 12 Degrees Celsius in Fahrenheit? (Exact 53.6°F)',
    desc: '12 degrees Celsius equals exactly 53.6 degrees Fahrenheit (53.6°F). Learn the step-by-step °C to °F formula, what to wear in 12°C weather, and view our temperature reference chart.'
  },
  'blog/14-stone-in-pounds.html': {
    title: '14 Stone in Pounds & kg: How Much Is 14 st in lbs? (196 lbs / 88.90 kg) | OmniConverter',
    h1: '14 Stone in Pounds & Kilograms: Exact Conversion (196 lbs / 88.90 kg)',
    desc: '14 stone equals exactly 196 pounds (196 lbs) or 88.90 kilograms (88.9 kg). Explore the complete 14 st 0 lb to 14 st 13 lb body weight conversion chart and formula.'
  },
  'blog/15-meters-to-feet.html': {
    title: '15 Meters to Feet (15 m to ft): Exact Conversion (49.21 ft / 49 ft 2.55 in) | OmniConverter',
    h1: '15 Meters to Feet (15 m to ft): Exact Conversion (49.21 Feet)',
    desc: '15 meters equals 49.2126 feet (49 feet 2.55 inches). Learn how to convert 15 m to ft using the official 3.28084 multiplier, with architectural and pool length comparisons.'
  },
  'blog/1500-usd-to-aud.html': {
    title: '1500 USD to AUD: Convert $1,500 US Dollars to Australian Dollars | OmniConverter',
    h1: '1500 USD to AUD: Convert $1,500 US Dollars to Australian Dollars',
    desc: 'Convert $1,500 USD to AUD (~A$2,287.50 Australian Dollars) with our interactive FX calculator, bank wire markup comparison table, and USD/AUD exchange rate guide.'
  },
  'blog/1500-usd-to-gbp.html': {
    title: '1500 USD to GBP: Convert $1,500 US Dollars to British Pounds (£1,185 Guide) | OmniConverter',
    h1: '1500 USD to GBP: Convert $1,500 US Dollars to British Pounds (£)',
    desc: 'Convert $1,500 USD to GBP (~£1,185 British Pounds). Compare mid-market exchange rates against bank transfer spreads, card markups, and USD to GBP conversion tables.'
  },
  'blog/16-ounces-to-milliliters.html': {
    title: '16 oz to mL: How Many Milliliters in 16 Fluid Ounces? (473.18 mL / 1 US Pint) | OmniConverter',
    h1: '16 oz to mL: How Many Milliliters Are in 16 Fluid Ounces? (473.18 mL)',
    desc: '16 US fluid ounces equals 473.18 milliliters (1 US liquid pint), while 16 UK Imperial fluid ounces equals 454.61 mL. View the full oz to mL drinkware and kitchen conversion chart.'
  },
  'blog/165-lbs-to-kg.html': {
    title: '165 lbs to kg: How Many Kilograms Is 165 Pounds? (Exact 74.84 kg) | OmniConverter',
    h1: '165 lbs to kg: Convert 165 Pounds to Kilograms (74.84 kg)',
    desc: '165 pounds equals 74.8427 kilograms (74.84 kg or 11 stone 11 lbs). Use our interactive 165 lbs to kg converter, step-by-step division formula, and fitness weight chart.'
  },
  'blog/170lbs-in-stone.html': {
    title: '170 lbs in Stone & kg: What Is 170 Pounds in Stone? (12 st 2 lb / 77.11 kg) | OmniConverter',
    h1: '170 lbs in Stone & Kilograms: Exact Conversion (12 Stone 2 Pounds)',
    desc: '170 pounds equals 12 stone 2 pounds (12.14 stone) or 77.11 kilograms. See the complete 170 lbs to stone and kg formula, remainder math, and UK/US body weight table.'
  },
  'blog/199-usd-in-aud.html': {
    title: '199 USD to AUD: How Much Is $199 US Dollars in Australian Dollars? | OmniConverter',
    h1: '199 USD to AUD: Convert $199 US Dollars to Australian Dollars (SaaS & Shopping Guide)',
    desc: 'Convert $199 USD to AUD (~A$303.48 Australian Dollars). Ideal for Australians calculating the true AUD cost of $199 USD software subscriptions, gadgets, and foreign card fees.'
  },
  'blog/20-pounds-sterling-in-australian-dollars.html': {
    title: '£20 Pounds Sterling in Australian Dollars (GBP to AUD Purchasing Power & Chart) | OmniConverter',
    h1: '£20 Pounds Sterling in Australian Dollars: GBP to AUD Cash & Card Guide',
    desc: 'Find out how much £20 British Pounds Sterling is worth in Australian Dollars (~A$38.61 AUD), including UK-to-Australia gift remittances, tourist card spreads, and banknote equivalents.'
  },
  'blog/20-gbp-aud.html': {
    title: '20 GBP to AUD Exchange Rate: Live £20 British Pound to Australian Dollar Calculator | OmniConverter',
    h1: '20 GBP to AUD Exchange Rate: Convert £20 GBP to AUD Instantly',
    desc: 'Live 20 GBP to AUD currency conversion calculator (~A$38.61 AUD). Check mid-market GBP/AUD exchange rates, historical volatility ranges, and quick conversion increments.'
  },
  'blog/100-usd-to-aud.html': {
    title: '100 USD to AUD Exchange Rate: Convert $100 US Dollars to Australian Dollars | OmniConverter',
    h1: '100 USD to AUD Exchange Rate: Convert $100 USD to AUD Instantly',
    desc: 'Convert 100 USD to AUD (~A$152.50 AUD) using mid-market foreign exchange rates. Includes a complete USD to AUD reference table, formula, and historical rate guide.'
  },
  'blog/100-usd-in-australian.html': {
    title: '$100 USD in Australian Dollars: Travel Cash, Credit Card Fees & ATM Guide | OmniConverter',
    h1: '$100 USD in Australian Dollars: What You Actually Receive After Bank & ATM Fees',
    desc: 'See how much $100 US Dollars is worth in Australian Dollars after airport kiosk spreads, 3% credit card foreign transaction fees, and Australian ATM withdrawals.'
  },
  'blog/2000-usd-to-aud.html': {
    title: '2000 USD to AUD: Convert $2,000 US Dollars to Australian Dollars | OmniConverter',
    h1: '2000 USD to AUD: Convert $2,000 US Dollars to Australian Dollars',
    desc: 'Convert $2,000 USD to AUD (~A$3,050 Australian Dollars). Compare international wire transfer fees, SWIFT vs fintech spreads, and full USD/AUD conversion tables.'
  },
  'blog/2000-usd-to-gbp.html': {
    title: '2000 USD to GBP Exchange Rate: Convert $2,000 US Dollars to British Pounds (£1,580) | OmniConverter',
    h1: '2000 USD to GBP Exchange Rate: Convert $2,000 USD to £ GBP Instantly',
    desc: 'Convert 2000 USD to GBP (~£1,580 British Pounds) with our interactive FX calculator, mid-market exchange rate formula, and incremental USD to GBP lookup table.'
  },
  'blog/2000-dollars-in-pounds.html': {
    title: '$2,000 Dollars in Pounds (£): UK Bank Wire Costs, Spreads & Purchasing Power | OmniConverter',
    h1: '$2,000 Dollars in Pounds (£): Real-World UK Value & Transfer Fee Breakdown',
    desc: 'How much is $2,000 dollars in pounds after bank fees? Compare what £1,580 GBP buys in the UK and how to avoid 3%–5% wire transfer markups when sending $2,000 to Britain.'
  },
  'blog/3-cups-in-ml.html': {
    title: '3 Cups in mL: How Many Milliliters Are in 3 Cups? (710 mL US / 750 mL Metric) | OmniConverter',
    h1: '3 Cups in mL: Exact US Customary (709.76 mL) vs Metric Cup (750 mL) Guide',
    desc: '3 US Customary cups equals 709.76 mL (commonly rounded to 710 mL), while 3 Metric cups equals 750 mL. Compare US, UK, Metric, and Legal cup conversions for baking and cooking.'
  },
  'blog/300-dollars-in-gbp.html': {
    title: '300 Dollars in GBP ($300 USD to £): Convert 300 US Dollars to British Pounds | OmniConverter',
    h1: '300 Dollars in GBP ($300 USD to £): Exact British Pound Conversion & Shopping Guide',
    desc: 'Convert $300 US Dollars to British Pounds (~£237 GBP). Includes UK customs VAT duty thresholds on $300 orders, card conversion fees, and a USD to GBP reference chart.'
  },
  'blog/4-meters-to-feet.html': {
    title: '4 Meters to Feet (4 m to ft): How Many Feet Is 4 Meters? (13 ft 1.48 in) | OmniConverter',
    h1: '4 Meters to Feet (4 m to ft): Exact Conversion (13.12 Feet / 13 ft 1.5 in)',
    desc: '4 meters equals 13.1234 feet (13 feet 1.48 inches). Learn the exact 4 m to ft multiplication formula, room dimension comparisons, and meters-to-feet conversion table.'
  },
  'blog/65-kg-pounds.html': {
    title: '65 kg to lbs: How Many Pounds Is 65 Kilograms? (143.30 lbs / 10 st 3 lb) | OmniConverter',
    h1: '65 kg to lbs: Convert 65 Kilograms to Pounds (143.30 lbs) & Stone',
    desc: '65 kilograms equals 143.30 pounds (143 lbs 4.8 oz or 10 stone 3.3 lbs). View the exact 65 kg to lbs formula, incremental 65.1–65.9 kg table, and fitness weight equivalents.'
  },
  'blog/700-pounds-to-aud.html': {
    title: '700 GBP to AUD: Convert £700 British Pounds to Australian Dollars | OmniConverter',
    h1: '700 GBP to AUD: Convert £700 British Pounds to Australian Dollars (A$)',
    desc: 'Convert £700 British Pounds Sterling to Australian Dollars (~A$1,351.27 AUD). Compare UK-to-Australia transfer spreads, travel money rates, and GBP/AUD conversion tables.'
  },
  'blog/70kg-in-stone.html': {
    title: '70 kg in Stone & Pounds: How Much Is 70 Kilograms in Stone? (11 st 0.3 lb) | OmniConverter',
    h1: '70 kg in Stone & Pounds: Exact Conversion (11 Stone 0.3 lbs / 154.32 lbs)',
    desc: '70 kilograms equals 11 stone 0.32 pounds (11.02 stone or 154.32 lbs). Learn how to convert 70 kg to stone and pounds with our interactive calculator and UK weight chart.'
  },
  'blog/71-pounds-to-kg.html': {
    title: '71 lbs to kg: How Many Kilograms Is 71 Pounds? (Exact 32.21 kg) | OmniConverter',
    h1: '71 lbs to kg: Convert 71 Pounds to Kilograms (32.21 kg)',
    desc: '71 pounds equals 32.2051 kilograms (32.21 kg or 5 stone 1 lb). Check the exact 71 lbs to kg formula, luggage and freight weight limits, and conversion table.'
  },
  'blog/80-kilo-lbs.html': {
    title: '80 kg to lbs: How Many Pounds Is 80 Kilos? (Exact 176.37 lbs / 12 st 8 lb) | OmniConverter',
    h1: '80 kg to lbs: Convert 80 Kilograms (Kilos) to Pounds (176.37 lbs)',
    desc: '80 kilos (80 kg) equals 176.37 pounds (176 lbs 5.9 oz or 12 stone 8.4 lbs). Use our live 80 kg to lbs converter, mental math trick, and gym plate conversion chart.'
  },
  'blog/95-usd-to-gbp.html': {
    title: '95 USD to GBP: Convert $95 US Dollars to British Pounds (£75.05 Guide) | OmniConverter',
    h1: '95 USD to GBP: Convert $95 US Dollars to British Pounds (£)',
    desc: 'Convert $95 USD to GBP (~£75.05 British Pounds). Ideal for checking UK e-commerce checkout totals, credit card FX fees, and exact USD to GBP exchange rates.'
  },
  'blog/convert-file-type-to-pdf.html': {
    title: 'How to Convert Any File Type to PDF: Images, Docs & Spreadsheets Guide | OmniConverter',
    h1: 'How to Convert Any File Type to PDF: Complete Document & Image Conversion Guide',
    desc: 'Learn how to convert Word documents, JPG/PNG images, spreadsheets, and text files into universally compatible PDF documents using built-in OS tools and browser converters.'
  },
  'blog/convert-lakh-to-usd.html': {
    title: 'Convert Lakh to USD: How Much Is 1 Lakh INR (₹1,00,000) in US Dollars? | OmniConverter',
    h1: 'Convert Lakh to USD: Indian Rupee (₹1,00,000 INR) to US Dollar Exchange Guide',
    desc: '1 Lakh Indian Rupees (₹1,00,000 INR) equals approximately $1,190 USD. Learn how the Indian numbering system (Lakhs and Crores) maps to thousands, millions, and US Dollars.'
  },
  'blog/convert-pdf-form.html': {
    title: 'How to Convert & Flatten Interactive PDF Forms for Printing and Archiving | OmniConverter',
    h1: 'How to Convert & Flatten Interactive PDF Forms Safely',
    desc: 'Step-by-step guide to converting fillable XFA and AcroForm PDF forms into flat, read-only PDFs or image formats while preserving entered form data and digital signatures.'
  },
  'blog/converter-application-download.html': {
    title: 'How to Install OmniConverter as an Offline Web App (PWA) on Phone & PC | OmniConverter',
    h1: 'How to Install the OmniConverter Offline Web Application (PWA) on Any Device',
    desc: 'Learn how to install OmniConverter as a lightweight Progressive Web App (PWA) on iOS, Android, Windows, and macOS for offline unit conversions and file size calculations.'
  },
  'blog/convertor-or-converter.html': {
    title: 'Convertor vs. Converter: Which Spelling Is Correct in English & Engineering? | OmniConverter',
    h1: 'Convertor vs. Converter: Spelling, Etymology & Technical Usage Guide',
    desc: 'Is it spelled converter or convertor? Discover why "converter" is the standard spelling across 95% of general English while "convertor" appears in specific UK electrical standards.'
  },
  'blog/currency-for-turkish-lira.html': {
    title: 'Turkish Lira (TRY / ₺) Currency Guide: Exchange Rates, Notes & Travel Tips | OmniConverter',
    h1: 'Turkish Lira (TRY / ₺) Currency Guide: Exchange Rates, Banknotes & Travel Money Tips',
    desc: 'Complete guide to Turkey\'s official currency, the Turkish Lira (TRY / ₺): banknote denominations, USD/EUR/GBP to TRY exchange rates, ATM tips, and paying in Istanbul.'
  },
  'blog/currency-jpy-to-inr.html': {
    title: 'JPY to INR Currency Guide: Convert Japanese Yen (¥) to Indian Rupees (₹) | OmniConverter',
    h1: 'JPY to INR Currency Guide: Japanese Yen (¥) to Indian Rupee (₹) Exchange Rates',
    desc: 'Convert Japanese Yen to Indian Rupees (1 JPY ≈ ₹0.54 INR / 1,000 JPY ≈ ₹544 INR). Includes a JPY to INR travel table, remittance tips, and live currency calculator.'
  },
  'blog/file-changer.html': {
    title: 'Online File Format & Extension Changer: Convert Images, Audio & Docs in Browser | OmniConverter',
    h1: 'Online File Format & Extension Changer: Why Renaming Extensions Corrupts Files',
    desc: 'Understand the difference between changing a file extension and true container transcoding. Convert images (WebP, PNG, JPG), audio, and documents locally in your browser.'
  },
  'blog/how-to-change-file-format.html': {
    title: 'How to Change a File Format on Windows, Mac, iPhone & Android | OmniConverter',
    h1: 'How to Change a File Format Safely Across Windows, macOS, iOS & Android',
    desc: 'Learn how to show file extensions on Windows File Explorer and macOS Finder, and how to properly convert image, audio, video, and document formats without corrupting data.'
  },
  'blog/korean-to-aud.html': {
    title: 'Korean Won to AUD (KRW to A$): Convert South Korean Won to Australian Dollars | OmniConverter',
    h1: 'Korean Won to AUD (KRW to A$): Exchange Rate, Travel Table & Calculator',
    desc: 'Convert South Korean Won (KRW / ₩) to Australian Dollars (AUD). 10,000 KRW equals ~A$11.05 AUD. Includes Seoul travel money tips, ATM advice, and KRW/AUD conversion tables.'
  },
  'blog/mastercard-foreign-exchange-rate.html': {
    title: 'Mastercard Foreign Exchange Rates Explained: How Card FX Markups Work | OmniConverter',
    h1: 'Mastercard Foreign Exchange Rates Explained: Network Base Rates vs Bank Fees',
    desc: 'Understand how Mastercard calculates foreign exchange rates, when transaction settlement dates lock in your rate, and how to avoid 3% bank foreign transaction fees and DCC.'
  },
  'blog/rupiah-to-aud.html': {
    title: 'Rupiah to AUD (IDR to A$): Bali & Indonesia Travel Money Conversion Guide | OmniConverter',
    h1: 'Rupiah to AUD (IDR to A$): Bali Travel Money Shortcut & Conversion Chart',
    desc: 'Convert Indonesian Rupiah (IDR) to Australian Dollars (AUD) using the 4-zero mental math shortcut (Rp 100,000 ≈ A$9.65 AUD). Includes Bali ATM and money changer tips.'
  },
  'blog/indonesian-rupiah-to-aud.html': {
    title: 'Indonesian Rupiah to AUD (IDR/AUD): Exchange Rates, Banknotes & Remittance Guide | OmniConverter',
    h1: 'Indonesian Rupiah to AUD (IDR/AUD): Live Exchange Rate & Denominations Guide',
    desc: 'Detailed IDR to AUD currency conversion guide for Australians: compare Rp 10,000 to Rp 10,000,000 in Australian Dollars, Bank Indonesia rules, and card fee comparisons.'
  },
  'blog/weeks-calculator.html': {
    title: 'Weeks Calculator: Convert Weeks to Days, Hours, Months & Years | OmniConverter',
    h1: 'Weeks Calculator: How Many Days, Hours & Months Are in Any Number of Weeks?',
    desc: 'Calculate exact time durations between weeks, days, hours, minutes, and calendar months (1 week = 7 days = 168 hours; 1 year = 52.1775 weeks) for pregnancy, payroll, and project planning.'
  },
  'de/blog/1500-usd-in-gbp.html': {
    title: '1500 USD in GBP umrechnen: 1.500 US-Dollar in Britische Pfund (£) | OmniConverter',
    h1: '1500 USD in GBP umrechnen: 1.500 US-Dollar in Britische Pfund (£)',
    desc: 'Rechnen Sie 1.500 US-Dollar (USD) in Britische Pfund (GBP) um (~1.185 £). Mit aktuellem Wechselkursrechner, Gebührenvergleich und Umrechnungstabelle.'
  },
  'de/blog/95-usd-in-gbp.html': {
    title: '95 USD in GBP umrechnen: Wie viel sind 95 US-Dollar in Britischen Pfund? | OmniConverter',
    h1: '95 USD in GBP umrechnen: 95 US-Dollar in Britische Pfund (£)',
    desc: '95 US-Dollar (USD) entsprechen rund 75,05 Britischen Pfund (GBP). Nutzen Sie unseren Live-Währungsrechner und die Umrechnungstabelle für USD in GBP.'
  },
  'es/blog/1500-usd-a-gbp.html': {
    title: '1500 USD a GBP: Convertir $1,500 Dólares a Libras Esterlinas (£) | OmniConverter',
    h1: '1500 USD a GBP: Convertir $1,500 Dólares Estadounidenses a Libras Esterlinas',
    desc: 'Convierta $1,500 dólares estadounidenses (USD) a libras esterlinas (GBP) (~£1,185 GBP) con nuestra calculadora de divisas, fórmula y tabla de referencia.'
  },
  'es/blog/4-metros-a-pies.html': {
    title: '4 Metros a Pies (4 m a ft): ¿Cuántos Pies Son 4 Metros? (13.12 Pies) | OmniConverter',
    h1: '4 Metros a Pies (4 m a ft): Conversión Exacta (13.12 Pies / 13 ft 1.5 in)',
    desc: '4 metros equivalen exactamente a 13.1234 pies (13 pies y 1.48 pulgadas). Consulte la fórmula paso a paso, calculadora interactiva y tabla de conversión de metros a pies.'
  },
  'es/blog/95-usd-a-gbp.html': {
    title: '95 USD a GBP: Convertir $95 Dólares a Libras Esterlinas (£75.05) | OmniConverter',
    h1: '95 USD a GBP: Convertir $95 Dólares Estadounidenses a Libras Esterlinas (£)',
    desc: 'Convierta $95 dólares (USD) a libras esterlinas (GBP) (~£75.05 GBP). Incluye calculadora interactiva de tipo de cambio, comisiones de tarjeta y tabla de referencia.'
  },
  'pt/blog/1500-usd-para-gbp.html': {
    title: '1500 USD para GBP: Converter $1.500 Dólares em Libras Esterlinas (£) | OmniConverter',
    h1: '1500 USD para GBP: Converter $1.500 Dólares Americanos em Libras Esterlinas',
    desc: 'Converta $1.500 dólares americanos (USD) para libras esterlinas (GBP) (~£1.185 GBP) com nossa calculadora de câmbio interativa, fórmula e tabela de conversão.'
  },
  'pt/blog/95-usd-para-gbp.html': {
    title: '95 USD para GBP: Converter $95 Dólares em Libras Esterlinas (£75,05) | OmniConverter',
    h1: '95 USD para GBP: Converter $95 Dólares Americanos em Libras Esterlinas (£)',
    desc: 'Converta $95 dólares (USD) para libras esterlinas (GBP) (~£75,05 GBP). Confira a taxa de câmbio comercial, calculadora ao vivo e tabela de referência.'
  }
};

// Build localized calculator HTML for any mismatched guide
function buildCalculatorHtml(lang, topic, slug) {
  const s = slug.toLowerCase();
  const labels = {
    en: { enter: 'Enter Value', from: 'From Unit', to: 'To Unit', swap: '⇄ Swap Units', res: 'Converted Result', copy: '📋 Copy Result', print: '🖨️ Print Cheat Sheet' },
    es: { enter: 'Ingrese Valor', from: 'De Unidad', to: 'A Unidad', swap: '⇄ Invertir', res: 'Resultado Convertido', copy: '📋 Copiar', print: '🖨️ Imprimir Tabla' },
    de: { enter: 'Wert eingeben', from: 'Von Einheit', to: 'In Einheit', swap: '⇄ Tauschen', res: 'Ergebnis', copy: '📋 Kopieren', print: '🖨️ Tabelle drucken' },
    pt: { enter: 'Digite o Valor', from: 'Da Unidade', to: 'Para Unidade', swap: '⇄ Inverter', res: 'Resultado Convertido', copy: '📋 Copiar', print: '🖨️ Imprimir Tabela' }
  }[lang] || { enter: 'Enter Value', from: 'From Unit', to: 'To Unit', swap: '⇄ Swap Units', res: 'Converted Result', copy: '📋 Copy Result', print: '🖨️ Print Cheat Sheet' };

  let heading = '⚡ Instant Live Conversion Calculator';
  let badge = 'Exact Formula';
  let sub = 'Enter any value below for instant conversion:';
  let val = '100';
  let fromOpts = '';
  let toOpts = '';
  let initRes = '';
  let initFormula = '';

  const optHtml = (list, selVal) => list.map(([v, t]) => `<option value="${v}"${v === selVal ? ' selected' : ''}>${t}</option>`).join('\n              ');

  if (topic === 'currency') {
    heading = lang === 'es' ? '⚡ Calculadora de Divisas y Tipo de Cambio' : lang === 'de' ? '⚡ Live-Währungsrechner & Wechselkurs' : lang === 'pt' ? '⚡ Calculadora de Câmbio e Moedas' : '⚡ Instant Foreign Exchange & Currency Calculator';
    badge = lang === 'es' ? 'Tasa Interbancaria' : lang === 'de' ? 'Devisenkurs' : lang === 'pt' ? 'Câmbio Comercial' : 'Mid-Market Rate';
    sub = lang === 'es' ? 'Ingrese un monto para convertir entre las principales monedas del mundo:' : lang === 'de' ? 'Geben Sie einen Betrag ein, um zwischen Weltwährungen umzurechnen:' : lang === 'pt' ? 'Digite um valor para converter entre as principais moedas globais:' : 'Enter an amount to convert between major global currencies:';
    const currList = [
      ['USD', 'USD - US Dollar ($)'],
      ['EUR', 'EUR - Euro (€)'],
      ['GBP', 'GBP - British Pound (£)'],
      ['AUD', 'AUD - Australian Dollar (A$)'],
      ['JPY', 'JPY - Japanese Yen (¥)'],
      ['INR', 'INR - Indian Rupee (₹)'],
      ['IDR', 'IDR - Indonesian Rupiah (Rp)'],
      ['KRW', 'KRW - South Korean Won (₩)'],
      ['TRY', 'TRY - Turkish Lira (₺)'],
      ['CAD', 'CAD - Canadian Dollar (C$)'],
      ['VND', 'VND - Vietnamese Dong (₫)']
    ];
    let fCur = 'USD', tCur = 'EUR';
    if (s.includes('jpy') && s.includes('inr')) { val = '1000'; fCur = 'JPY'; tCur = 'INR'; initRes = '543.69 INR'; initFormula = '1 JPY = 0.5437 INR'; }
    else if (s.includes('lira') || s.includes('turk') || s.includes('turca') || s.includes('tuerk')) { val = '100'; fCur = 'USD'; tCur = 'TRY'; initRes = '3420.00 TRY'; initFormula = '1 USD = 34.2000 TRY'; }
    else if (s.includes('indonesia') || s.includes('rupiah') || s.includes('rupia')) { val = '1000000'; fCur = 'IDR'; tCur = s.includes('aud') ? 'AUD' : 'USD'; initRes = tCur === 'AUD' ? '96.53 AUD' : '63.29 USD'; initFormula = tCur === 'AUD' ? '1 IDR = 0.00009653 AUD' : '1 IDR = 0.00006329 USD'; }
    else { val = '100'; fCur = 'USD'; tCur = 'EUR'; initRes = '92.00 EUR'; initFormula = '1 USD = 0.9200 EUR'; }
    fromOpts = optHtml(currList, fCur);
    toOpts = optHtml(currList, tCur);
  } else if (topic === 'weight') {
    heading = lang === 'es' ? '⚡ Calculadora de Peso y Masa en Vivo' : lang === 'de' ? '⚡ Live-Gewichts- & Massenrechner' : lang === 'pt' ? '⚡ Calculadora de Peso e Massa ao Vivo' : '⚡ Instant Weight & Mass Calculator';
    badge = 'NIST / SI Standard';
    sub = lang === 'es' ? 'Convierta al instante entre kilogramos (kg), libras (lbs), stone, gramos y onzas:' : lang === 'de' ? 'Rechnen Sie sofort zwischen Kilogramm (kg), Pfund (lbs), Stone, Gramm und Unzen um:' : lang === 'pt' ? 'Converta instantaneamente entre quilogramas (kg), libras (lbs), stone, gramas e onças:' : 'Convert instantly between kilograms (kg), pounds (lbs), stone, grams, and ounces:';
    const wList = [
      ['kg', 'Kilograms (kg)'],
      ['lb', 'Pounds (lbs)'],
      ['st', 'Stones (st)'],
      ['g', 'Grams (g)'],
      ['oz', 'Ounces (oz)']
    ];
    let fU = 'kg', tU = 'lb';
    if (s.includes('100-kg')) { val = '100'; fU = 'kg'; tU = 'lb'; initRes = '220.46 lb'; initFormula = '100 kg = 220.4623 lb'; }
    else if (s.includes('65-kg')) { val = '65'; fU = 'kg'; tU = 'lb'; initRes = '143.30 lb'; initFormula = '65 kg = 143.3005 lb'; }
    else if (s.includes('80-kilo') || s.includes('80-quilos')) { val = '80'; fU = 'kg'; tU = 'lb'; initRes = '176.37 lb'; initFormula = '80 kg = 176.3698 lb'; }
    else if (s.includes('13-stone')) { val = '13'; fU = 'st'; tU = 'lb'; initRes = '182 lb'; initFormula = '13 st = 182.0000 lb'; }
    else if (s.includes('14-stone')) { val = '14'; fU = 'st'; tU = 'lb'; initRes = '196 lb'; initFormula = '14 st = 196.0000 lb'; }
    else if (s.includes('165-')) { val = '165'; fU = 'lb'; tU = 'kg'; initRes = '74.8427 kg'; initFormula = '165 lb = 74.8427 kg'; }
    else if (s.includes('71-')) { val = '71'; fU = 'lb'; tU = 'kg'; initRes = '32.2051 kg'; initFormula = '71 lb = 32.2051 kg'; }
    else if (s.includes('170')) { val = '170'; fU = 'lb'; tU = 'st'; initRes = '12.1429 st'; initFormula = '170 lb = 12.1429 st'; }
    else if (s.includes('180')) { val = '180'; fU = 'lb'; tU = 'st'; initRes = '12.8571 st'; initFormula = '180 lb = 12.8571 st'; }
    else { val = '100'; fU = 'kg'; tU = 'lb'; initRes = '220.46 lb'; initFormula = '100 kg = 220.4623 lb'; }
    fromOpts = optHtml(wList, fU);
    toOpts = optHtml(wList, tU);
  } else if (topic === 'volume') {
    heading = lang === 'es' ? '⚡ Calculadora de Volumen y Cocina' : lang === 'de' ? '⚡ Küchenvolumen- & Flüssigkeitsrechner' : lang === 'pt' ? '⚡ Calculadora de Volume Culinário' : '⚡ Instant Kitchen Volume & Liquid Calculator';
    badge = 'Culinary Precision';
    sub = lang === 'es' ? 'Convierta entre tazas, mililitros (mL), cucharadas, onzas líquidas y litros:' : lang === 'de' ? 'Rechnen Sie zwischen Tassen, Millilitern (mL), Esslöffeln und Litern um:' : lang === 'pt' ? 'Converta entre xícaras, mililitros (mL), colheres de sopa e litros:' : 'Convert between cups, milliliters (mL), tablespoons, teaspoons, and fluid ounces:';
    const vList = [
      ['cup_us', 'US Customary Cups (236.59 mL)'],
      ['ml', 'Milliliters (mL)'],
      ['cup_metric', 'Metric Cups (250 mL)'],
      ['tbsp', 'Tablespoons (tbsp)'],
      ['tsp', 'Teaspoons (tsp)'],
      ['floz', 'US Fluid Ounces (fl oz)'],
      ['l', 'Liters (L)'],
      ['gal', 'US Gallons (gal)']
    ];
    val = '0.3333';
    fromOpts = optHtml(vList, 'cup_us');
    toOpts = optHtml(vList, 'ml');
    initRes = '78.8549 ml';
    initFormula = '0.3333 cup_us = 78.8549 ml';
  } else if (topic === 'pressure') {
    heading = lang === 'es' ? '⚡ Calculadora de Presión (Bar a PSI)' : lang === 'de' ? '⚡ Druckumrechner (Bar in PSI)' : lang === 'pt' ? '⚡ Calculadora de Pressão (Bar para PSI)' : '⚡ Instant Pressure Converter (Bar, PSI, kPa, atm)';
    badge = 'Engineering Standard';
    sub = lang === 'es' ? 'Convierta entre bar, PSI, kilopascales (kPa) y atmósferas:' : lang === 'de' ? 'Rechnen Sie zwischen Bar, PSI, Kilopascal (kPa) und Atmosphären um:' : lang === 'pt' ? 'Converta entre bar, PSI, quilopascals (kPa) e atmosferas:' : 'Enter any pressure value to convert between bar, PSI, kilopascals (kPa), and atmospheres (atm):';
    const pList = [
      ['bar', 'Bar (bar)'],
      ['psi', 'Pounds per Square Inch (PSI)'],
      ['kpa', 'Kilopascals (kPa)'],
      ['atm', 'Standard Atmospheres (atm)']
    ];
    val = '1';
    fromOpts = optHtml(pList, 'bar');
    toOpts = optHtml(pList, 'psi');
    initRes = '14.5038 psi';
    initFormula = '1 bar = 14.5038 psi';
  } else if (topic === 'speed') {
    heading = lang === 'es' ? '⚡ Calculadora de Velocidad (MPH a KM/H)' : lang === 'de' ? '⚡ Geschwindigkeitsrechner (MPH in KM/H)' : lang === 'pt' ? '⚡ Calculadora de Velocidade (MPH para KM/H)' : '⚡ Instant Speed & Velocity Calculator (MPH to KM/H)';
    badge = 'Exact Factor';
    sub = lang === 'es' ? 'Convierta entre millas por hora (mph), kilómetros por hora (km/h), m/s y nudos:' : lang === 'de' ? 'Rechnen Sie zwischen Meilen pro Stunde (mph), km/h, m/s und Knoten um:' : lang === 'pt' ? 'Converta entre milhas por hora (mph), km/h, m/s e nós:' : 'Convert between miles per hour (mph), kilometers per hour (km/h), meters per second (m/s), and knots:';
    const spList = [
      ['mph', 'Miles per Hour (mph)'],
      ['kmh', 'Kilometers per Hour (km/h)'],
      ['ms', 'Meters per Second (m/s)'],
      ['knot', 'Nautical Knots (kn)']
    ];
    val = '60';
    fromOpts = optHtml(spList, 'mph');
    toOpts = optHtml(spList, 'kmh');
    initRes = '96.5606 kmh';
    initFormula = '60 mph = 96.5606 kmh';
  } else if (topic === 'time') {
    heading = lang === 'es' ? '⚡ Calculadora de Semanas, Días y Horas' : lang === 'de' ? '⚡ Wochen-, Tage- & Stundenrechner' : lang === 'pt' ? '⚡ Calculadora de Semanas, Dias e Horas' : '⚡ Instant Weeks, Days & Time Duration Calculator';
    badge = 'Calendar & Time';
    sub = lang === 'es' ? 'Convierta semanas en días, horas, minutos y segundos:' : lang === 'de' ? 'Rechnen Sie Wochen in Tage, Stunden, Minuten und Sekunden um:' : lang === 'pt' ? 'Converta semanas em dias, horas, minutos e segundos:' : 'Convert instantly between weeks, days, hours, minutes, and seconds:';
    const tList = [
      ['week', 'Weeks (wk)'],
      ['day', 'Days (d)'],
      ['hr', 'Hours (hr)'],
      ['min', 'Minutes (min)'],
      ['sec', 'Seconds (s)']
    ];
    val = '4';
    fromOpts = optHtml(tList, 'week');
    toOpts = optHtml(tList, 'day');
    initRes = '28 day';
    initFormula = '4 week = 28.0000 day';
  } else if (topic === 'file') {
    heading = lang === 'es' ? '⚡ Calculadora de Tamaño de Archivo Digital' : lang === 'de' ? '⚡ Dateigrößen- & Speicherrechner' : lang === 'pt' ? '⚡ Calculadora de Tamanho de Arquivo Digital' : '⚡ Instant File Size & Digital Storage Calculator';
    badge = 'Binary (1024) Standard';
    sub = lang === 'es' ? 'Calcule equivalencias entre Megabytes (MB), Gigabytes (GB), Kilobytes (KB) y Terabytes (TB):' : lang === 'de' ? 'Rechnen Sie zwischen Megabyte (MB), Gigabyte (GB), Kilobyte (KB) und Terabyte (TB) um:' : lang === 'pt' ? 'Converta entre Megabytes (MB), Gigabytes (GB), Kilobytes (KB) e Terabytes (TB):' : 'Convert file sizes between Megabytes (MB), Gigabytes (GB), Kilobytes (KB), and Terabytes (TB):';
    const fList = [
      ['mb', 'Megabytes (MB)'],
      ['gb', 'Gigabytes (GB)'],
      ['kb', 'Kilobytes (KB)'],
      ['tb', 'Terabytes (TB)']
    ];
    val = '500';
    fromOpts = optHtml(fList, 'mb');
    toOpts = optHtml(fList, 'gb');
    initRes = '0.4883 gb';
    initFormula = '500 mb = 0.4883 gb';
  } else if (topic === 'length') {
    heading = lang === 'es' ? '⚡ Calculadora de Longitud y Distancia' : lang === 'de' ? '⚡ Längen- & Distanz-Umrechner' : lang === 'pt' ? '⚡ Calculadora de Comprimento e Distância' : '⚡ Instant Length & Distance Calculator';
    badge = 'SI Exact';
    sub = lang === 'es' ? 'Convierta metros en pies, pulgadas, centímetros y kilómetros al instante:' : lang === 'de' ? 'Rechnen Sie Meter in Fuß, Zoll, Zentimeter und Kilometer sofort um:' : lang === 'pt' ? 'Converta metros em pés, polegadas, centímetros e quilômetros instantaneamente:' : 'Convert between meters, feet, inches, centimeters, and kilometers instantly:';
    const lList = [
      ['m', 'Meters (m)'],
      ['ft', 'Feet (ft)'],
      ['in', 'Inches (in)'],
      ['cm', 'Centimeters (cm)'],
      ['km', 'Kilometers (km)'],
      ['mi', 'Miles (mi)']
    ];
    const numM = s.match(/^(\d+)/);
    val = numM ? numM[1] : '4';
    fromOpts = optHtml(lList, 'm');
    toOpts = optHtml(lList, 'ft');
    const resNum = (parseFloat(val) / 0.3048).toFixed(4);
    initRes = `${resNum} ft`;
    initFormula = `${val} m = ${resNum} ft`;
  } else if (topic === 'temperature') {
    heading = lang === 'es' ? '⚡ Calculadora de Escalas de Temperatura' : lang === 'de' ? '⚡ Temperatur-Umrechner' : lang === 'pt' ? '⚡ Calculadora de Temperatura' : '⚡ Instant Temperature Live Calculator';
    badge = 'Exact Formula';
    sub = lang === 'es' ? 'Convierta grados Fahrenheit, Celsius y Kelvin al instante:' : lang === 'de' ? 'Rechnen Sie zwischen Fahrenheit, Celsius und Kelvin um:' : lang === 'pt' ? 'Converta graus Fahrenheit, Celsius e Kelvin instantaneamente:' : 'Convert between Fahrenheit, Celsius, Kelvin, and Rankine instantly:';
    const tempList = [
      ['F', 'Fahrenheit (°F)'],
      ['C', 'Celsius (°C)'],
      ['K', 'Kelvin (K)'],
      ['R', 'Rankine (°R)']
    ];
    val = '50';
    fromOpts = optHtml(tempList, 'F');
    toOpts = optHtml(tempList, 'C');
    initRes = '10 °C';
    initFormula = '50 F = 10.00 C';
  }

  return `<!-- Embedded Live Interactive In-Page Calculator -->
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0; box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h3 style="margin:0; font-size:1.2rem; font-weight:800; color:var(--text-main);">${heading}</h3>
          <span style="font-size:0.8rem; background:rgba(99,102,241,0.12); color:var(--primary-600); padding:0.25rem 0.65rem; border-radius:999px; font-weight:700;">${badge}</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">${sub}</p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; align-items:flex-end;">
          <div>
            <label for="liveToolInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">${labels.enter}</label>
            <input type="number" id="liveToolInput" value="${val}" step="any" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1.1rem; font-weight:700; box-sizing:border-box;">
          </div>
          <div>
            <label for="liveToolFromUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">${labels.from}</label>
            <select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              ${fromOpts}
            </select>
          </div>
          <div style="display:flex; justify-content:center; align-items:center;">
            <button type="button" id="liveToolSwapBtn" title="Swap Units" style="width:100%; padding:0.75rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); cursor:pointer; font-weight:700;">${labels.swap}</button>
          </div>
          <div>
            <label for="liveToolToUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">${labels.to}</label>
            <select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              ${toOpts}
            </select>
          </div>
        </div>

        <div style="margin-top:1.25rem; padding:1.25rem; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">${labels.res}</div>
            <div id="liveToolResultVal" style="font-size:1.8rem; font-weight:800; color:var(--primary-600); margin-top:0.2rem;">${initRes}</div>
            <div id="liveToolFormulaText" style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">${initFormula}</div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button type="button" id="liveToolCopyBtn" class="tab-btn active" style="padding:0.6rem 1rem; font-weight:700; border:none; cursor:pointer;">${labels.copy}</button>
            <button type="button" class="printCheatSheetBtn tab-btn" onclick="window.print();" style="padding:0.6rem 1rem; font-weight:700; border:1px solid var(--card-border); background:var(--bg-elevated); cursor:pointer;" title="Print or save as PDF cheat sheet">${labels.print}</button>
          </div>
        </div>
      </div>`;
}

const universalCalcScript = `<script>
  (function() {
    var input = document.getElementById('liveToolInput');
    var fromSel = document.getElementById('liveToolFromUnit');
    var toSel = document.getElementById('liveToolToUnit');
    var swapBtn = document.getElementById('liveToolSwapBtn');
    var resVal = document.getElementById('liveToolResultVal');
    var formulaText = document.getElementById('liveToolFormulaText');
    var copyBtn = document.getElementById('liveToolCopyBtn');

    if (!input || !resVal || !fromSel || !toSel) return;

    var ratesInBase = {
      g: 1, kg: 1000, lb: 453.59237, oz: 28.349523125, st: 6350.29318, tola: 11.6638038,
      ml: 1, l: 1000, cup: 236.5882365, cup_us: 236.5882365, cup_metric: 250, gal: 3785.411784, floz: 29.5735295625, tbsp: 14.78676478125, tsp: 4.92892159375,
      m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, yd: 0.9144, mi: 1609.344,
      sqm: 1, sqft: 0.09290304, acre: 4046.8564224, ha: 10000, bigha_std: 2529.285264, guntha: 101.17, biswa: 126.46, kanal: 505.857, marla: 25.2929, gaj: 0.83612736,
      sec: 1, min: 60, hr: 3600, day: 86400, week: 604800,
      bar: 100000, psi: 6894.757293, kpa: 1000, atm: 101325,
      kmh: 1, mph: 1.609344, ms: 3.6, knot: 1.852,
      kb: 1, mb: 1024, gb: 1048576, tb: 1073741824
    };

    var fx = { USD: 1, AUD: 1.525, EUR: 0.92, GBP: 0.79, CAD: 1.38, JPY: 154.5, INR: 84.0, VND: 25400, IDR: 15800, KRW: 1380, TRY: 34.2 };

    function convertTemp(val, from, to) {
      var k;
      if (from === 'C') k = val + 273.15;
      else if (from === 'F') k = (val - 32) * 5/9 + 273.15;
      else if (from === 'K') k = val;
      else if (from === 'R') k = val * 5/9;
      if (to === 'C') return k - 273.15;
      if (to === 'F') return (k - 273.15) * 9/5 + 32;
      if (to === 'K') return k;
      if (to === 'R') return k * 9/5;
      return k;
    }

    function calculate() {
      var val = parseFloat(input.value);
      if (isNaN(val)) {
        resVal.textContent = '--';
        formulaText.textContent = 'Please enter a valid numeric value.';
        return;
      }
      var from = fromSel.value;
      var to = toSel.value;

      var result;
      if (['F','C','K','R'].indexOf(from) !== -1 && ['F','C','K','R'].indexOf(to) !== -1) {
        result = convertTemp(val, from, to);
        formulaText.textContent = val + ' ' + from + ' = ' + result.toFixed(2) + ' ' + to;
      } else if (fx[from] && fx[to]) {
        var rate = fx[to] / fx[from];
        result = val * rate;
        formulaText.textContent = '1 ' + from + ' = ' + (rate >= 1 ? rate.toFixed(4) : rate.toPrecision(4)) + ' ' + to;
      } else if (ratesInBase[from] && ratesInBase[to]) {
        var inBase = val * ratesInBase[from];
        result = inBase / ratesInBase[to];
        formulaText.textContent = val + ' ' + from + ' = ' + (Math.abs(result) > 1000 ? result.toLocaleString('en-US', {maximumFractionDigits:2}) : result.toFixed(4)) + ' ' + to;
      } else {
        result = val;
        formulaText.textContent = val + ' ' + from + ' = ' + result + ' ' + to;
      }

      var formatted = Math.abs(result % 1) < 1e-4 ? result.toFixed(0) : (Math.abs(result) > 100 ? result.toFixed(2) : result.toFixed(4));
      resVal.textContent = formatted + ' ' + to;
    }

    input.addEventListener('input', calculate);
    fromSel.addEventListener('change', calculate);
    toSel.addEventListener('change', calculate);

    if (swapBtn) {
      swapBtn.addEventListener('click', function() {
        var temp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = temp;
        calculate();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', async function() {
        try {
          await navigator.clipboard.writeText(resVal.textContent);
          var orig = copyBtn.textContent;
          copyBtn.textContent = '✓ Copied!';
          setTimeout(function() { copyBtn.textContent = orig; }, 2000);
        } catch(e) {}
      });
    }

    calculate();
  })();
  </script>`;

// Callout & Related Links per topic and language
function getCalloutData(lang, topic) {
  const pre = lang === 'en' ? '' : '/' + lang;
  const map = {
    currency: { url: `${pre}/currency`, h3: lang === 'es' ? 'Conversor de Divisas y Tipo de Cambio en Vivo' : lang === 'de' ? 'Interaktiver Live-Währungsrechner' : lang === 'pt' ? 'Conversor de Moedas e Câmbio ao Vivo' : 'Interactive Foreign Exchange & Currency Converter', p: lang === 'es' ? 'Compare tasas de cambio interbancarias en tiempo real entre más de 45 monedas.' : lang === 'de' ? 'Vergleichen Sie Wechselkurse in Echtzeit zwischen über 45 Weltwährungen.' : lang === 'pt' ? 'Compare taxas de câmbio em tempo real entre mais de 45 moedas globais.' : 'Compare live mid-market exchange rates across 45+ global currencies instantly.', btn: lang === 'es' ? 'Abrir Conversor de Divisas &rarr;' : lang === 'de' ? 'Währungsrechner öffnen &rarr;' : lang === 'pt' ? 'Abrir Conversor de Moedas &rarr;' : 'Open Currency Converter &rarr;' },
    weight: { url: `${pre}/weight-mass`, h3: lang === 'es' ? 'Conversor Interactivo de Peso y Masa' : lang === 'de' ? 'Interaktiver Gewichts- & Massenrechner' : lang === 'pt' ? 'Conversor Interativo de Peso e Massa' : 'Interactive Weight & Mass Converter', p: lang === 'es' ? 'Convierta entre kilogramos, libras, stone, gramos y onzas con precisión exacta.' : lang === 'de' ? 'Rechnen Sie präzise zwischen Kilogramm, Pfund, Stone, Gramm und Unzen um.' : lang === 'pt' ? 'Converta entre quilogramas, libras, stone, gramas e onças com precisão.' : 'Convert between kilograms, pounds, stone, grams, and ounces with exact SI precision.', btn: lang === 'es' ? 'Abrir Conversor de Peso &rarr;' : lang === 'de' ? 'Gewichtsrechner öffnen &rarr;' : lang === 'pt' ? 'Abrir Conversor de Peso &rarr;' : 'Open Weight Converter &rarr;' },
    volume: { url: `${pre}/volume-capacity`, h3: lang === 'es' ? 'Conversor de Volumen y Capacidad Culinaria' : lang === 'de' ? 'Interaktiver Volumen- & Küchenrechner' : lang === 'pt' ? 'Conversor de Volume e Capacidade Culinária' : 'Interactive Kitchen Volume & Capacity Converter', p: lang === 'es' ? 'Convierta entre tazas, mililitros, litros, galones y onzas líquidas al instante.' : lang === 'de' ? 'Rechnen Sie zwischen Tassen, Millilitern, Litern und Gallonen um.' : lang === 'pt' ? 'Converta entre xícaras, mililitros, litros, galões e colheres instantaneamente.' : 'Switch between cups, milliliters, liters, gallons, and fluid ounces instantly.', btn: lang === 'es' ? 'Abrir Conversor de Volumen &rarr;' : lang === 'de' ? 'Volumenrechner öffnen &rarr;' : lang === 'pt' ? 'Abrir Conversor de Volume &rarr;' : 'Open Volume Converter &rarr;' },
    temperature: { url: `${pre}/temperature`, h3: lang === 'es' ? 'Conversor de Escalas de Temperatura' : lang === 'de' ? 'Interaktiver Temperaturumrechner' : lang === 'pt' ? 'Conversor de Escalas de Temperatura' : 'Interactive Temperature Scale Converter', p: lang === 'es' ? 'Convierta entre grados Celsius, Fahrenheit, Kelvin y Rankine al instante.' : lang === 'de' ? 'Rechnen Sie sofort zwischen Celsius, Fahrenheit, Kelvin und Rankine um.' : lang === 'pt' ? 'Converta entre graus Celsius, Fahrenheit, Kelvin e Rankine instantaneamente.' : 'Convert between Celsius, Fahrenheit, Kelvin, and Rankine scales instantly.', btn: lang === 'es' ? 'Abrir Conversor de Temperatura &rarr;' : lang === 'de' ? 'Temperaturrechner öffnen &rarr;' : lang === 'pt' ? 'Abrir Conversor de Temperatura &rarr;' : 'Open Temperature Converter &rarr;' },
    length: { url: `${pre}/length`, h3: lang === 'es' ? 'Conversor de Longitud y Distancia' : lang === 'de' ? 'Interaktiver Längen- & Distanzrechner' : lang === 'pt' ? 'Conversor de Comprimento e Distância' : 'Interactive Length & Distance Converter', p: lang === 'es' ? 'Convierta entre metros, pies, pulgadas, kilómetros y millas con precisión.' : lang === 'de' ? 'Rechnen Sie zwischen Metern, Fuß, Zoll, Kilometern und Meilen um.' : lang === 'pt' ? 'Converta entre metros, pés, polegadas, quilômetros e milhas com precisão.' : 'Convert between meters, feet, inches, kilometers, and miles with exact precision.', btn: lang === 'es' ? 'Abrir Conversor de Longitud &rarr;' : lang === 'de' ? 'Längenrechner öffnen &rarr;' : lang === 'pt' ? 'Abrir Conversor de Comprimento &rarr;' : 'Open Length Converter &rarr;' },
    area: { url: `${pre}/area`, h3: 'Interactive Land & Area Measurement Converter', p: 'Convert between square feet, square meters, acres, hectares, Bigha, Gaj, and Guntha.', btn: 'Open Area Converter &rarr;' },
    speed: { url: `${pre}/speed`, h3: lang === 'es' ? 'Conversor de Velocidad (MPH, KM/H, Nudos)' : lang === 'de' ? 'Interaktiver Geschwindigkeitsrechner' : lang === 'pt' ? 'Conversor de Velocidade (MPH, KM/H, Nós)' : 'Interactive Speed & Velocity Converter', p: lang === 'es' ? 'Convierta entre mph, km/h, metros por segundo y nudos náuticos.' : lang === 'de' ? 'Rechnen Sie zwischen mph, km/h, m/s und Knoten um.' : lang === 'pt' ? 'Converta entre mph, km/h, m/s e nós náuticos.' : 'Convert between miles per hour (mph), km/h, meters per second (m/s), and knots.', btn: lang === 'es' ? 'Abrir Conversor de Velocidad &rarr;' : lang === 'de' ? 'Geschwindigkeitsrechner öffnen &rarr;' : lang === 'pt' ? 'Abrir Conversor de Velocidade &rarr;' : 'Open Speed Converter &rarr;' },
    time: { url: `${pre}/time-duration`, h3: lang === 'es' ? 'Conversor de Tiempo, Semanas y Duración' : lang === 'de' ? 'Interaktiver Zeit- & Dauerrechner' : lang === 'pt' ? 'Conversor de Tempo, Semanas e Duração' : 'Interactive Time & Duration Calculator', p: lang === 'es' ? 'Calcule semanas, días, horas, minutos y segundos al instante.' : lang === 'de' ? 'Berechnen Sie Wochen, Tage, Stunden, Minuten und Sekunden sofort.' : lang === 'pt' ? 'Calcule semanas, dias, horas, minutos e segundos instantaneamente.' : 'Convert between weeks, days, hours, minutes, and seconds instantly.', btn: lang === 'es' ? 'Abrir Conversor de Tiempo &rarr;' : lang === 'de' ? 'Zeitrechner öffnen &rarr;' : lang === 'pt' ? 'Abrir Conversor de Tempo &rarr;' : 'Open Time Converter &rarr;' },
    file: { url: `${pre}/file-media`, h3: lang === 'es' ? 'Conversor de Archivos, Imágenes y PDF en el Navegador' : lang === 'de' ? 'Lokaler Datei-, Bild- & PDF-Umwandler im Browser' : lang === 'pt' ? 'Conversor de Arquivos, Imagens e PDF no Navegador' : 'Interactive File, Image & PDF Format Converter', p: lang === 'es' ? 'Convierta imágenes, audio, documentos y calcule tamaños de archivo localmente.' : lang === 'de' ? 'Wandeln Sie Bilder, Audio und Dokumente lokal in Ihrem Browser um.' : lang === 'pt' ? 'Converta imagens, áudio, documentos e calcule tamanhos de arquivo localmente.' : 'Convert images, documents, audio, and calculate digital storage sizes locally in your browser.', btn: lang === 'es' ? 'Abrir Conversor de Archivos &rarr;' : lang === 'de' ? 'Dateiumwandler öffnen &rarr;' : lang === 'pt' ? 'Abrir Conversor de Arquivos &rarr;' : 'Open File & Media Converter &rarr;' }
  };
  return map[topic] || map.volume;
}

const files = walk(ROOT);
let modifiedCount = 0;

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');
  const orig = html;
  const r = rel(f);
  const slug = path.basename(r, '.html');
  const isGuide = /(^|\/)blog\//.test(r);
  const lang = r.startsWith('es/') ? 'es' : r.startsWith('de/') ? 'de' : r.startsWith('pt/') ? 'pt' : 'en';
  const topic = isGuide ? topicFromSlug(slug) : 'tool';

  // 0. Fix accidental $' splice in blog/2000-usd-to-aud.html (where '$' symbol was replaced with tail of document)
  if (/Both currencies share the same '[\s\S]*?<\/html> symbol/.test(html)) {
    html = html.replace(/Both currencies share the same '[\s\S]*?<\/html> symbol/, () => "Both currencies share the same '$' symbol");
  }

  // 1. Remove noindex from valid content pages
  if (isGuide && /<meta\s+name="robots"\s+content="noindex[^"]*"\s*\/?>/i.test(html)) {
    html = html.replace(/\s*<meta\s+name="robots"\s+content="noindex[^"]*"\s*\/?>/gi, '');
  }

  // 2. Fix blog/50-fahrenheit-to-celsius.html duplicate calculator
  if (r === 'blog/50-fahrenheit-to-celsius.html') {
    const dupCalcRegex = /<!-- Embedded Live Interactive Mini-Calculator -->[\s\S]*?<button type="button" id="liveCopyBtn"[\s\S]*?<\/div>\s*<\/div>/;
    const cleanTempCalc = `<!-- Embedded Live Interactive In-Page Calculator -->
      <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.5rem; margin:2rem 0; box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h3 style="margin:0; font-size:1.2rem; font-weight:800; color:var(--text-main);">⚡ Instant Temperature Live Calculator</h3>
          <span style="font-size:0.8rem; background:rgba(99,102,241,0.12); color:var(--primary-600); padding:0.25rem 0.65rem; border-radius:999px; font-weight:700;">Exact Formula</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0 0 1.25rem 0;">Enter any temperature degree value to convert between Fahrenheit, Celsius, Kelvin, and Rankine:</p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; align-items:flex-end;">
          <div>
            <label for="liveToolInput" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">Enter Value</label>
            <input type="number" id="liveToolInput" value="50" step="any" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1.1rem; font-weight:700; box-sizing:border-box;">
          </div>
          <div>
            <label for="liveToolFromUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">From Unit</label>
            <select id="liveToolFromUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="F" selected>Fahrenheit (°F)</option>
              <option value="C">Celsius (°C)</option>
              <option value="K">Kelvin (K)</option>
              <option value="R">Rankine (°R)</option>
            </select>
          </div>
          <div style="display:flex; justify-content:center; align-items:center;">
            <button type="button" id="liveToolSwapBtn" title="Swap Units" style="width:100%; padding:0.75rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); cursor:pointer; font-weight:700;">⇄ Swap Units</button>
          </div>
          <div>
            <label for="liveToolToUnit" style="display:block; font-size:0.85rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-muted);">To Unit</label>
            <select id="liveToolToUnit" style="width:100%; padding:0.75rem 1rem; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-main); font-size:1rem; font-weight:600; box-sizing:border-box;">
              <option value="C" selected>Celsius (°C)</option>
              <option value="F">Fahrenheit (°F)</option>
              <option value="K">Kelvin (K)</option>
              <option value="R">Rankine (°R)</option>
            </select>
          </div>
        </div>

        <div style="margin-top:1.25rem; padding:1.25rem; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted);">Converted Result</div>
            <div id="liveToolResultVal" style="font-size:1.8rem; font-weight:800; color:var(--primary-600); margin-top:0.2rem;">10 °C</div>
            <div id="liveToolFormulaText" style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">50 F = 10.00 C</div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button type="button" id="liveToolCopyBtn" class="tab-btn active" style="padding:0.6rem 1rem; font-weight:700; border:none; cursor:pointer;">📋 Copy Result</button>
            <button type="button" class="printCheatSheetBtn tab-btn" onclick="window.print();" style="padding:0.6rem 1rem; font-weight:700; border:1px solid var(--card-border); background:var(--bg-elevated); cursor:pointer;" title="Print or save as PDF cheat sheet">🖨️ Print Cheat Sheet</button>
          </div>
        </div>
      </div>`;
    html = html.replace(dupCalcRegex, () => cleanTempCalc);
    html = html.replace(/<!-- Live Calculator Logic[\s\S]*?<\/script>\s*(?=<script>)/, '');
  }

  // 3. Fix CALC_MISMATCH or missing calculator/script on any guide page
  if (isGuide && r !== 'pt/blog/2000-usd-to-gbp.html') {
    const currentCtype = calcType(html);
    if (currentCtype && topic !== 'unknown' && !currentCtype.startsWith(topic)) {
      const calcRegex = /<!-- Embedded Live Interactive In-Page Calculator -->[\s\S]*?(?:<button type="button" class="printCheatSheetBtn[\s\S]*?<\/div>\s*<\/div>\s*<\/div>|<button type="button" id="liveToolCopyBtn"[\s\S]*?<\/div>\s*<\/div>)/;
      if (calcRegex.test(html)) {
        html = html.replace(calcRegex, () => buildCalculatorHtml(lang, topic, slug));
      }
    } else if (!currentCtype && topic !== 'unknown') {
      // Missing calculator on guide page: inject after callout box, or after quick summary box, or before first <h2>
      const calloutEndRegex = /(<!-- Relevant Interactive Converter Callout Box -->\s*<div[^>]*>[\s\S]*?<\/a>\s*<\/div>)/;
      const summaryBoxRegex = /(<div style="background:var\(--bg-elevated\);\s*border-left:4px solid var\(--accent\);[\s\S]*?<\/div>)/;
      if (calloutEndRegex.test(html)) {
        html = html.replace(calloutEndRegex, (m) => `${m}\n\n      ${buildCalculatorHtml(lang, topic, slug)}`);
      } else if (summaryBoxRegex.test(html)) {
        html = html.replace(summaryBoxRegex, (m) => `${m}\n\n      ${buildCalculatorHtml(lang, topic, slug)}`);
      } else if (/<h2/i.test(html)) {
        html = html.replace(/<h2/i, () => `${buildCalculatorHtml(lang, topic, slug)}\n\n      <h2`);
      }
    }
    // Upgrade or inject inline calculator script on every guide page so all units & currencies work
    const scriptRegex = /<script>\s*\(function\(\)\s*\{\s*(?:var|const) input = document\.getElementById\('liveToolInput'\);[\s\S]*?<\/script>/;
    if (scriptRegex.test(html)) {
      html = html.replace(scriptRegex, () => universalCalcScript);
    } else if (html.includes('id="liveToolInput"')) {
      html = html.replace('</body>', () => `  ${universalCalcScript}\n</body>`);
    }

    // Update Callout Box if its link doesn't match the guide's topic
    const calloutRegex = /<!-- Relevant Interactive Converter Callout Box -->\s*<div[^>]*>[\s\S]*?<\/a>\s*<\/div>/;
    if (calloutRegex.test(html) && topic !== 'unknown' && topic !== 'pressure') {
      const cd = getCalloutData(lang, topic);
      const newCallout = `<!-- Relevant Interactive Converter Callout Box -->
      <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.08)); border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; margin: 1.75rem 0; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
        <div style="max-width: 680px;">
          <h3 style="margin: 0 0 0.35rem 0; font-size: 1.15rem; color: var(--text-main); font-weight: 800;">${cd.h3}</h3>
          <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted); line-height: 1.5;">${cd.p}</p>
        </div>
        <a href="${cd.url}" class="tab-btn active" style="text-decoration: none; padding: 0.65rem 1.25rem; font-weight: 700; white-space: nowrap;">${cd.btn}</a>
      </div>`;
      html = html.replace(calloutRegex, () => newCallout);
    }

    // Fix double 📖 emoji in related guides heading
    html = html.replace(/<span>📖<\/span>\s*📖\s*/g, '<span>📖</span> ');

    // Update related-guides-section so links match the guide's topic and language
    const relGuidesByLang = {
      en: {
        currency: [
          ['/currency', '💱 Multi-Currency Exchange Converter Tool'],
          ['/blog/100-usd-to-aud', '100 USD to AUD: US Dollar to Australian Dollar'],
          ['/blog/32-usd-to-gbp', '32 USD to GBP: Exchange Rate & Travel Guide'],
          ['/blog/indonesia-cu', 'Indonesia Currency Guide: Indonesian Rupiah (IDR)']
        ],
        weight: [
          ['/weight-mass', '⚖️ Full Weight & Mass Converter'],
          ['/blog/180lbs-in-stone', '180 lbs in Stone: 12 st 12 lb (81.65 kg)'],
          ['/blog/13-stone-in-pounds', '13 Stone in Pounds: 182 lbs (82.55 kg)'],
          ['/blog/100-kg-to-lbs', '100 kg to lbs: Kilograms to Pounds Guide']
        ],
        volume: [
          ['/volume-capacity', '🧪 Kitchen Volume & Capacity Converter'],
          ['/blog/500-ml-to-cups', '500 mL to Cups: Liquid Volume Conversion'],
          ['/blog/1-tsp-is-ml', 'How Many mL in a Teaspoon? (1 tsp to mL)'],
          ['/blog/1-3-cup-to-grams', '1/3 Cup to Grams: Baking Conversion Guide']
        ],
        temperature: [
          ['/temperature', '🌡️ Temperature Scale Converter'],
          ['/blog/100-fahrenheit-to-celsius', '100°F to °C: Fahrenheit to Celsius Guide'],
          ['/blog/50-fahrenheit-to-celsius', '50°F to °C: Exact 10°C Weather Guide'],
          ['/blog/12-degrees-celsius-to-fahrenheit', '12°C to °F: 53.6°F Temperature Guide']
        ],
        length: [
          ['/length', '📏 Length & Distance Converter'],
          ['/blog/4-meters-to-feet', '4 Meters to Feet (13.12 ft) Guide'],
          ['/blog/15-meters-to-feet', '15 Meters to Feet (49.21 ft) Guide'],
          ['/speed', '🚗 Speed & Velocity Converter']
        ],
        area: [
          ['/area', '📐 Global Area & Land Converter'],
          ['/indian-units', '🇮🇳 Indian Traditional Land & Gold Units'],
          ['/blog/1-bigha-in-square-feet', '1 Bigha in Square Feet Land Guide'],
          ['/blog/1-guntha-in-sq-ft', '1 Guntha in Square Feet Land Guide']
        ],
        speed: [
          ['/speed', '🚗 Speed & Velocity Converter (MPH to KM/H)'],
          ['/blog/60-mph-to-kmh', '60 MPH to KM/H (96.56 km/h) Speed Guide'],
          ['/length', '📏 Length & Distance Converter'],
          ['/time-duration', '⏱️ Time & Duration Calculator']
        ],
        time: [
          ['/time-duration', '⏱️ Time & Duration Calculator'],
          ['/time-zone', '🌍 World Time Zone Converter'],
          ['/blog/weeks-calculator', 'Weeks Calculator: Weeks to Days & Months'],
          ['/speed', '🚗 Speed & Velocity Converter']
        ],
        file: [
          ['/file-media', '📁 Local Browser File, Image & PDF Converter'],
          ['/blog/how-to-change-file-format', 'How to Change a File Format Safely'],
          ['/blog/convert-file-type-to-pdf', 'How to Convert Any File Type to PDF'],
          ['/blog/convert-pdf-form', 'How to Convert & Flatten Interactive PDF Forms']
        ]
      },
      es: {
        currency: [
          ['/es/currency', '💱 Conversor de Divisas y Tipo de Cambio'],
          ['/es/blog/100-usd-a-aud', '100 USD a AUD: Dólares a Dólares Australianos'],
          ['/es/blog/32-usd-a-gbp', '32 USD a GBP: Dólares a Libras Esterlinas'],
          ['/es/blog/guia-moneda-indonesia', 'Guía de la Moneda de Indonesia (Rupia IDR)']
        ],
        weight: [
          ['/es/weight-mass', '⚖️ Conversor de Peso y Masa'],
          ['/es/blog/100-kg-a-libras', '100 Kilogramos a Libras (220.46 lbs)'],
          ['/es/blog/65-kg-a-libras', '65 kg a Libras (143.30 lbs)'],
          ['/es/blog/80-kilos-a-libras', '80 Kilos a Libras (176.37 lbs)']
        ],
        volume: [
          ['/es/volume-capacity', '🧪 Conversor de Volumen y Capacidad'],
          ['/es/blog/500-ml-a-tazas', '500 mL a Tazas: Conversión de Volumen'],
          ['/es/blog/1-cucharadita-en-ml', '1 Cucharadita en Mililitros (5 mL)'],
          ['/es/blog/1-3-taza-a-gramos', '1/3 de Taza a Gramos: Guía de Cocina']
        ],
        temperature: [
          ['/es/temperature', '🌡️ Conversor de Temperatura'],
          ['/es/blog/100-fahrenheit-a-celsius', '100 Fahrenheit a Celsius (37.78°C)'],
          ['/es/blog/50-fahrenheit-a-celsius', '50 Fahrenheit a Celsius (10°C)'],
          ['/es/blog/12-grados-celsius-a-fahrenheit', '12 Grados Celsius a Fahrenheit (53.6°F)']
        ],
        length: [
          ['/es/length', '📏 Conversor de Longitud y Distancia'],
          ['/es/blog/4-metros-a-pies', '4 Metros a Pies (13.12 ft)'],
          ['/es/blog/15-metros-a-pies', '15 Metros a Pies (49.21 ft)'],
          ['/es/speed', '🚗 Conversor de Velocidad']
        ],
        speed: [
          ['/es/speed', '🚗 Conversor de Velocidad (MPH a KM/H)'],
          ['/es/blog/60-mph-a-kmh', '60 MPH a KM/H (96.56 km/h)'],
          ['/es/length', '📏 Conversor de Longitud y Distancia'],
          ['/es/time-duration', '⏱️ Conversor de Tiempo y Duración']
        ],
        time: [
          ['/es/time-duration', '⏱️ Conversor de Tiempo y Duración'],
          ['/es/time-zone', '🌍 Conversor de Zonas Horarias'],
          ['/es/blog/calculadora-de-semanas', 'Calculadora de Semanas y Días'],
          ['/es/speed', '🚗 Conversor de Velocidad']
        ],
        file: [
          ['/es/file-media', '📁 Conversor de Archivos, Imágenes y PDF'],
          ['/es/blog/como-cambiar-formato-de-archivo', 'Cómo Cambiar el Formato de un Archivo'],
          ['/es/blog/convertir-tipo-de-archivo-a-pdf', 'Convertir Tipo de Archivo a PDF'],
          ['/es/blog/convertir-formulario-pdf', 'Convertir Formulario PDF']
        ]
      },
      de: {
        currency: [
          ['/de/currency', '💱 Live-Währungsrechner & Wechselkurs'],
          ['/de/blog/100-usd-in-aud', '100 USD in AUD: US-Dollar in Australische Dollar'],
          ['/de/blog/32-usd-in-gbp', '32 USD in GBP: US-Dollar in Britische Pfund'],
          ['/de/blog/indonesische-waehrung-ratgeber', 'Indonesische Währung: Ratgeber zur Rupiah (IDR)']
        ],
        weight: [
          ['/de/weight-mass', '⚖️ Gewichts- & Massenrechner'],
          ['/de/blog/100-kg-in-pfund', '100 Kilogramm in Pfund (220,46 lbs)'],
          ['/de/blog/65-kg-in-pfund', '65 Kilogramm in Pfund (143,30 lbs)'],
          ['/de/blog/80-kilo-in-pfund', '80 Kilo in Pfund (176,37 lbs)']
        ],
        volume: [
          ['/de/volume-capacity', '🧪 Volumen- & Küchenrechner'],
          ['/de/blog/500-ml-in-tassen', '500 mL in Tassen umrechnen'],
          ['/de/blog/1-teeloeffel-in-ml', '1 Teelöffel in Milliliter (5 mL)'],
          ['/de/blog/1-3-tasse-in-gramm', '1/3 Tasse in Gramm umrechnen']
        ],
        temperature: [
          ['/de/temperature', '🌡️ Temperaturumrechner'],
          ['/de/blog/100-fahrenheit-in-celsius', '100 Fahrenheit in Celsius (37,78°C)'],
          ['/de/blog/50-fahrenheit-in-celsius', '50 Fahrenheit in Celsius (10°C)'],
          ['/de/blog/12-grad-celsius-in-fahrenheit', '12 Grad Celsius in Fahrenheit (53,6°F)']
        ],
        length: [
          ['/de/length', '📏 Längen- & Distanzrechner'],
          ['/de/blog/4-meter-in-fuss', '4 Meter in Fuß (13,12 ft)'],
          ['/de/blog/15-meter-in-fuss', '15 Meter in Fuß (49,21 ft)'],
          ['/de/speed', '🚗 Geschwindigkeitsrechner']
        ],
        speed: [
          ['/de/speed', '🚗 Geschwindigkeitsrechner (MPH in KM/H)'],
          ['/de/blog/60-mph-in-kmh', '60 MPH in KM/H (96,56 km/h)'],
          ['/de/length', '📏 Längen- & Distanzrechner'],
          ['/de/time-duration', '⏱️ Zeit- & Dauerrechner']
        ],
        time: [
          ['/de/time-duration', '⏱️ Zeit- & Dauerrechner'],
          ['/de/time-zone', '🌍 Zeitzonenrechner'],
          ['/de/blog/wochenrechner', 'Wochenrechner: Wochen und Tage berechnen'],
          ['/de/speed', '🚗 Geschwindigkeitsrechner']
        ],
        file: [
          ['/de/file-media', '📁 Datei-, Bild- & PDF-Umwandler'],
          ['/de/blog/dateiformat-aendern-anleitung', 'Dateiformat ändern: Anleitung'],
          ['/de/blog/dateityp-in-pdf-umwandeln', 'Dateityp in PDF umwandeln'],
          ['/de/blog/pdf-formular-umwandeln', 'PDF-Formular umwandeln']
        ]
      },
      pt: {
        currency: [
          ['/pt/currency', '💱 Conversor de Moedas e Câmbio ao Vivo'],
          ['/pt/blog/100-usd-para-aud', '100 USD para AUD: Dólares em Dólares Australianos'],
          ['/pt/blog/32-usd-para-gbp', '32 USD para GBP: Dólares em Libras Esterlinas'],
          ['/pt/blog/guia-moeda-indonesia', 'Guia da Moeda da Indonésia (Rúpia IDR)']
        ],
        weight: [
          ['/pt/weight-mass', '⚖️ Conversor de Peso e Massa'],
          ['/pt/blog/100-kg-para-libras', '100 Quilos para Libras (220,46 lbs)'],
          ['/pt/blog/65-kg-para-libras', '65 Quilos para Libras (143,30 lbs)'],
          ['/pt/blog/80-quilos-para-libras', '80 Quilos para Libras (176,37 lbs)']
        ],
        volume: [
          ['/pt/volume-capacity', '🧪 Conversor de Volume e Capacidade'],
          ['/pt/blog/500-ml-para-xicaras', '500 mL para Xícaras'],
          ['/pt/blog/1-colher-de-cha-em-ml', '1 Colher de Chá em mL (5 mL)'],
          ['/pt/blog/1-3-xicara-em-gramas', '1/3 de Xícara em Gramas']
        ],
        temperature: [
          ['/pt/temperature', '🌡️ Conversor de Temperatura'],
          ['/pt/blog/100-fahrenheit-para-celsius', '100 Fahrenheit para Celsius (37,78°C)'],
          ['/pt/blog/50-fahrenheit-para-celsius', '50 Fahrenheit para Celsius (10°C)'],
          ['/pt/blog/12-graus-celsius-para-fahrenheit', '12 Graus Celsius para Fahrenheit (53,6°F)']
        ],
        length: [
          ['/pt/length', '📏 Conversor de Comprimento e Distância'],
          ['/pt/blog/4-metros-para-pes', '4 Metros para Pés (13,12 ft)'],
          ['/pt/blog/15-metros-para-pes', '15 Metros para Pés (49,21 ft)'],
          ['/pt/speed', '🚗 Conversor de Velocidade']
        ],
        speed: [
          ['/pt/speed', '🚗 Conversor de Velocidade (MPH para KM/H)'],
          ['/pt/blog/60-mph-para-kmh', '60 MPH para KM/H (96,56 km/h)'],
          ['/pt/length', '📏 Conversor de Comprimento e Distância'],
          ['/pt/time-duration', '⏱️ Conversor de Tempo e Duração']
        ],
        time: [
          ['/pt/time-duration', '⏱️ Conversor de Tempo e Duração'],
          ['/pt/time-zone', '🌍 Conversor de Fuso Horário'],
          ['/pt/blog/calculadora-de-semanas', 'Calculadora de Semanas e Dias'],
          ['/pt/speed', '🚗 Conversor de Velocidade']
        ],
        file: [
          ['/pt/file-media', '📁 Conversor de Arquivos, Imagens e PDF'],
          ['/pt/blog/como-mudar-formato-de-arquivo', 'Como Mudar o Formato de um Arquivo'],
          ['/pt/blog/converter-tipo-de-arquivo-para-pdf', 'Converter Tipo de Arquivo para PDF'],
          ['/pt/blog/converter-formulario-pdf', 'Converter Formulário PDF']
        ]
      }
    };

    const langGuides = (relGuidesByLang[lang] && relGuidesByLang[lang][topic]) || (relGuidesByLang[lang] && relGuidesByLang[lang].volume);
    if (langGuides && /<section class="related-guides-section"[\s\S]*?<\/section>/.test(html)) {
      const curPath = '/' + r.replace(/\.html$/, '');
      const cards = langGuides.filter(([u]) => u !== curPath).slice(0, 4).map(([u, t]) => `        <a href="${u}" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-md); text-decoration:none; color:var(--text-main); font-weight:600; font-size:0.92rem; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <span>${t}</span>
          <span style="color:var(--primary-600); font-weight:700;">&rarr;</span>
        </a>`).join('\n');
      html = html.replace(/(<section class="related-guides-section"[\s\S]*?<div style="display:grid;[^>]*>)[\s\S]*?(<\/div>\s*<\/section>)/, (_, p1, p2) => `${p1}\n${cards}\n      ${p2}`);
    }

    // Clean up raw slug anchors in CROSS_LINKS_BLOCK
    html = html.replace(/>1 Aud To Vnd</g, '>1 AUD to VND Exchange Guide<');
    html = html.replace(/>1 Billion Korean Won To Gbp</g, '>1 Billion Korean Won to GBP<');
    html = html.replace(/>10 Billion Won To Gbp</g, '>10 Billion Won to GBP<');
  }

  // 4. Fix SLUG_TITLE, SLUG_DESC, and overlapping titles/descriptions
  if (titleDescMap[r]) {
    const { title, h1, desc } = titleDescMap[r];
    const cleanHeadline = title.split('|')[0].trim();
    html = html.replace(/<title>[^<]*<\/title>/i, () => `<title>${title.replace(/&/g, '&amp;')}</title>`);
    html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, () => `<meta name="description" content="${desc.replace(/"/g, '&quot;')}">`);
    html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, () => `<meta property="og:title" content="${title.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">`);
    html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, () => `<meta property="og:description" content="${desc.replace(/"/g, '&quot;')}">`);
    html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, () => `<meta name="twitter:title" content="${title.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">`);
    html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, () => `<meta name="twitter:description" content="${desc.replace(/"/g, '&quot;')}">`);
    html = html.replace(/<h1([^>]*)>[\s\S]*?<\/h1>/i, (_, g1) => `<h1${g1}>${h1.replace(/&/g, '&amp;')}</h1>`);
    html = html.replace(/"headline":\s*"[^\r\n]*",/, () => `"headline": "${cleanHeadline.replace(/"/g, '\\"')}",`);
    html = html.replace(/("@type":\s*"Article"[\s\S]*?"description":\s*)"[^\r\n]*",/, (_, p1) => `${p1}"${desc.replace(/"/g, '\\"')}",`);
    html = html.replace(/<span class="breadcrumb-current" aria-current="page">[^<]*<\/span>/i, () => `<span class="breadcrumb-current" aria-current="page">${cleanHeadline.replace(/&/g, '&amp;')}</span>`);
    html = html.replace(/<span class="formula-badge">Conversion Guide: [^<]*<\/span>/i, () => `<span class="formula-badge">${cleanHeadline.replace(/&/g, '&amp;')}</span>`);
  }

  // Add JSON-LD SoftwareApplication + WebSite schema to localized homepages (es/index.html, de/index.html, pt/index.html) if missing
  if ((r === 'es/index.html' || r === 'de/index.html' || r === 'pt/index.html') && !/application\/ld\+json/i.test(html)) {
    const homeLd = {
      es: { name: 'OmniConverter Conversor de Unidades y Divisas', desc: 'Suite universal gratuita de conversión de unidades, divisas, zonas horarias y archivos en línea.', url: 'https://www.omniconverter.co.uk/es/' },
      de: { name: 'OmniConverter Einheiten- und Währungsrechner', desc: 'Kostenlose universelle Online-Suite zur Umrechnung von Einheiten, Währungen, Zeitzonen und Dateien.', url: 'https://www.omniconverter.co.uk/de/' },
      pt: { name: 'OmniConverter Conversor de Unidades e Moedas', desc: 'Suíte universal gratuita de conversão de unidades, moedas, fusos horários e arquivos online.', url: 'https://www.omniconverter.co.uk/pt/' }
    }[lang];
    const ldBlock = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "${homeLd.name}",
    "url": "${homeLd.url}",
    "inLanguage": "${lang}",
    "description": "${homeLd.desc}",
    "publisher": {
      "@type": "Organization",
      "name": "OmniConverter",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.omniconverter.co.uk/logo.png"
      }
    }
  }
  </script>\n</head>`;
    html = html.replace('</head>', () => ldBlock);
  }

  // Normalize currency/unit casing in titles, H1s, breadcrumbs, and badges across all guides
  if (isGuide) {
    const fixCase = (str) => str
      .replace(/\b(Usd|Gbp|Aud|Eur|Vnd|Jpy|Inr|Krw|Idr|Try|Cad)\b/g, m => m.toUpperCase())
      .replace(/\bKg\b/g, 'kg')
      .replace(/\bLbs\b/g, 'lbs')
      .replace(/\bMl\b/g, 'mL')
      .replace(/\bTo\b/g, 'to')
      .replace(/\bIn\b/g, 'in');
    html = html.replace(/<title>([^<]*)<\/title>/i, (_, t) => `<title>${fixCase(t)}</title>`);
    html = html.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/i, (_, g1, t) => `<h1${g1}>${fixCase(t)}</h1>`);
    html = html.replace(/<meta\s+property="og:title"\s+content="([^"]*)"\s*\/?>/i, (_, t) => `<meta property="og:title" content="${fixCase(t)}">`);
    html = html.replace(/<meta\s+name="twitter:title"\s+content="([^"]*)"\s*\/?>/i, (_, t) => `<meta name="twitter:title" content="${fixCase(t)}">`);
    html = html.replace(/"headline":\s*"([^\r\n]*)",/, (_, t) => `"headline": "${fixCase(t)}",`);
    html = html.replace(/<span class="breadcrumb-current" aria-current="page">([^<]*)<\/span>/i, (_, t) => `<span class="breadcrumb-current" aria-current="page">${fixCase(t)}</span>`);
    html = html.replace(/<span class="formula-badge">([^<]*)<\/span>/i, (_, t) => `<span class="formula-badge">${fixCase(t)}</span>`);
  }

  // Catch any remaining SLUG_DESC
  if (isGuide && /Step-by-step conversion guide for /i.test(html)) {
    const h1Text = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [,''])[1].replace(/<[^>]+>/g, '').trim();
    const betterDesc = `Complete conversion guide for ${h1Text}: exact mathematical formula, interactive live calculator, reference tables, and practical examples.`;
    html = html.replace(/Step-by-step conversion guide for [^"]*/gi, () => betterDesc.replace(/"/g, '&quot;'));
  }

  // 5. Fix NO_HREFLANG (5 pages)
  const hasHreflang = /<link[^>]+hreflang=/i.test(html);
  if (!hasHreflang && r !== '404.html') {
    if (r === 'indian-units.html') {
      const tags = `  <link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk/indian-units">\n  <link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk/indian-units">\n</head>`;
      html = html.replace('</head>', tags);
    } else if (r === 'pt/blog/2000-usd-to-gbp.html') {
      const tags = `  <link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk/blog/2000-usd-to-gbp">\n  <link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk/es/blog/2000-usd-a-gbp">\n  <link rel="alternate" hreflang="de" href="https://www.omniconverter.co.uk/de/blog/2000-usd-in-gbp">\n  <link rel="alternate" hreflang="pt" href="https://www.omniconverter.co.uk/pt/blog/2000-usd-para-gbp">\n  <link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk/blog/2000-usd-to-gbp">\n</head>`;
      html = html.replace('</head>', tags);
    } else if (isGuide && lang === 'en') {
      const url = `https://www.omniconverter.co.uk/blog/${slug}`;
      const tags = `  <link rel="alternate" hreflang="en" href="${url}">\n  <link rel="alternate" hreflang="x-default" href="${url}">\n</head>`;
      html = html.replace('</head>', tags);
    }
  }

  // Fix language switchers on es/blog.html, de/blog.html, pt/blog.html where EN points to /es/blog, /de/blog, /pt/blog
  if (r === 'es/blog.html' || r === 'de/blog.html' || r === 'pt/blog.html') {
    html = html.replace(/<a href="\/(es|de|pt)\/blog" title="English">EN<\/a>/g, '<a href="/blog" title="English">EN</a>');
  }

  // Mark Indian Units nav tab with (EN) on localized pages (/es/, /de/, /pt/)
  if (lang === 'es') {
    html = html.replace(/<a href="\/indian-units" class="tab-btn">(?:Unidades Indias|Indian Units)<\/a>/g, '<a href="/indian-units" class="tab-btn">Unidades Indias (EN)</a>');
  } else if (lang === 'de') {
    html = html.replace(/<a href="\/indian-units" class="tab-btn">(?:Indische Einheiten|Indian Units)<\/a>/g, '<a href="/indian-units" class="tab-btn">Indische Einheiten (EN)</a>');
  } else if (lang === 'pt') {
    html = html.replace(/<a href="\/indian-units" class="tab-btn">(?:Unidades Indianas|Indian Units)<\/a>/g, '<a href="/indian-units" class="tab-btn">Unidades Indianas (EN)</a>');
  }

  // 6. Fix UNVERIFIABLE_BYLINE across HTML and JSON-LD
  const editorialName = lang === 'es' ? 'Equipo Editorial de OmniConverter' : lang === 'de' ? 'OmniConverter Redaktionsteam' : lang === 'pt' ? 'Equipe Editorial OmniConverter' : 'OmniConverter Editorial Team';
  const reviewBoardName = lang === 'es' ? 'Consejo Técnico de OmniConverter' : lang === 'de' ? 'Technischer Beirat von OmniConverter' : lang === 'pt' ? 'Conselho Técnico OmniConverter' : 'OmniConverter Technical Review Board';

  html = html.replace(/Chef Claire Hastings|Dr\. Oliver Bennett|Marcus Vance|Aarav Sharma|Alex Morgan/g, editorialName);
  html = html.replace(/Sarah Jenkins,\s*MSc|Rajesh Verma,\s*Senior Land Surveyor/g, reviewBoardName);
  html = html.replace(/"@type":\s*"Person",\s*"name":\s*"(OmniConverter Editorial Team|Equipo Editorial de OmniConverter|OmniConverter Redaktionsteam|Equipe Editorial OmniConverter|OmniConverter Technical Review Board|Consejo Técnico de OmniConverter|Technischer Beirat von OmniConverter|Conselho Técnico OmniConverter)"(,\s*"jobTitle":\s*"[^"]*")?/g, `"@type": "Organization", "name": "$1"`);

  // 7. Fix ZERO_ADS_CLAIM across all languages
  html = html.replace(/with zero ads/gi, 'with instant client-side processing');
  html = html.replace(/zero ads,?\s*/gi, 'fast local processing, ');
  html = html.replace(/without ads/gi, 'with full browser privacy');
  html = html.replace(/no ads/gi, 'no popups');
  html = html.replace(/ad-free/gi, 'clutter-free');
  html = html.replace(/sin anuncios/gi, 'con total privacidad');
  html = html.replace(/ohne Werbung/gi, 'lokal im Browser');
  html = html.replace(/sem anúncios/gi, 'com total privacidade');

  // 8. Fix CERTIFIED_CLAIM outside <script> tags
  html = html.replace(/(<body[\s\S]*?<\/body>)/i, (bodyBlock) => {
    // Only replace in text/HTML outside script blocks
    const parts = bodyBlock.split(/(<script[\s\S]*?<\/script>)/gi);
    for (let i = 0; i < parts.length; i += 2) {
      parts[i] = parts[i]
        .replace(/\bcertified\b/gi, (m) => m[0] === 'C' ? 'Standard' : 'standard')
        .replace(/\bverified against\b/gi, (m) => m[0] === 'V' ? 'Aligned with' : 'aligned with');
    }
    return parts.join('');
  });
  // Also check meta tags in <head> for certified/verified against
  html = html.replace(/(<head[\s\S]*?<\/head>)/i, (headBlock) => {
    const parts = headBlock.split(/(<script[\s\S]*?<\/script>)/gi);
    for (let i = 0; i < parts.length; i += 2) {
      parts[i] = parts[i]
        .replace(/\bcertified\b/gi, (m) => m[0] === 'C' ? 'Standard' : 'standard')
        .replace(/\bverified against\b/gi, (m) => m[0] === 'V' ? 'Aligned with' : 'aligned with');
    }
    return parts.join('');
  });

  // 9. Remove AGG_RATING ("aggregateRating": { ... }) from all pages
  if (/"aggregateRating"/.test(html)) {
    html = html.replace(/,\s*"aggregateRating":\s*\{[\s\S]*?\}/g, '');
    html = html.replace(/"aggregateRating":\s*\{[\s\S]*?\}\s*,?/g, '');
  }

  // 10. Fix OG_TYPE on guides, KEYWORD_ALT on images, and BOILERPLATE block
  if (isGuide) {
    html = html.replace(/<meta\s+property="og:type"\s+content="website"\s*\/?>/i, '<meta property="og:type" content="article">');
    const st = slugTitle(slug).toLowerCase();
    const h1Clean = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [,''])[1].replace(/<[^>]+>/g, '').replace(/"/g, '&quot;').trim();
    html = html.replace(/<img([^>]+)alt="([^"]*)"([^>]*)>/gi, (full, pre, altVal, post) => {
      if (pre.includes('logo.png')) return full;
      const al = altVal.trim().toLowerCase();
      if (al === st || (h1Clean && al === h1Clean.toLowerCase())) {
        return `<img${pre}alt="Conversion chart and visual reference guide for ${h1Clean || altVal}"${post}>`;
      }
      return full;
    });
  }

  // Remove generic BOILERPLATE block from the 8 pages
  const boilerplateRegex = /\s*<div style="margin:2\.5rem 0;">\s*<h2[^>]*>In Depth Analysis, Historical Standards, and Industry Best Practices<\/h2>[\s\S]*?<\/div>/;
  if (boilerplateRegex.test(html)) {
    html = html.replace(boilerplateRegex, '');
  }

  // Update index.html meta description and dynamic guide count
  if (r === 'index.html') {
    const enGuideCount = fs.readdirSync(path.join(ROOT, 'blog')).filter(x => x.endsWith('.html')).length;
    const newIndexDesc = 'Free online unit, currency, world time zone, Indian traditional units (Bigha, Gaj, Tola, Lakh, Crore), and local browser file converter. Convert length, weight, temperature, volume, area, speed, and 45+ currencies instantly.';
    html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, () => `<meta name="description" content="${newIndexDesc}">`);
    html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, () => `<meta property="og:description" content="${newIndexDesc}">`);
    html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, () => `<meta name="twitter:description" content="${newIndexDesc}">`);
    html = html.replace(/\(All \d+ Guides\)/g, `(All ${enGuideCount} Guides)`);
  }

  // Update currency.html quick cards to link to actual guides where they exist
  if (r === 'currency.html') {
    html = html.replace('href="#5-usd-to-aud"', 'href="/blog/5-usd-to-aud"');
    html = html.replace('href="#100-usd-to-aud"', 'href="/blog/100-usd-to-aud"');
    html = html.replace('href="#199-usd-in-aud"', 'href="/blog/199-usd-in-aud"');
    html = html.replace('href="#32-usd-to-gbp"', 'href="/blog/32-usd-to-gbp"');
    html = html.replace('href="#1-aud-to-vnd"', 'href="/blog/1-aud-to-vnd"');
  }

  // Fix broken link /pt/blog/65-kg-em-libras -> /pt/blog/65-kg-para-libras
  html = html.replace(/\/pt\/blog\/65-kg-em-libras/g, '/pt/blog/65-kg-para-libras');

  if (html !== orig) {
    fs.writeFileSync(f, html, 'utf8');
    modifiedCount++;
  }
}

console.log(`Successfully updated ${modifiedCount} HTML files across the site!`);
