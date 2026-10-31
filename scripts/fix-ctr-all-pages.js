/**
 * fix-ctr-all-pages.js
 * Fixes titles, descriptions, and FAQ schema on all high-impression pages
 * to maximize CTR from Google Search Console data (Oct 2026)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ─── HELPER ───────────────────────────────────────────────────────────────────
function readFile(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}
function writeFile(rel, content) {
  fs.writeFileSync(path.join(ROOT, rel), content, 'utf8');
}
function fixTitle(html, newTitle) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${newTitle}</title>`);
}
function fixDesc(html, newDesc) {
  return html.replace(
    /(<meta\s+name=["']description["']\s+content=["'])([^"']*)["']/i,
    `$1${newDesc}"`
  );
}

function injectFAQ(html, faqs) {
  if (html.includes('"FAQPage"')) return html; // already has FAQ
  const faqSchema = `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
${faqs.map(f => `    {
      "@type": "Question",
      "name": "${f.q}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${f.a}"
      }
    }`).join(',\n')}
  ]
}
</script>`;
  return html.replace('</head>', faqSchema + '\n</head>');
}

// ─── PAGE FIXES ───────────────────────────────────────────────────────────────
const fixes = [

  // ══════════════════════════════════════════════════════
  // MAIN TOOL PAGES
  // ══════════════════════════════════════════════════════
  {
    file: 'index.html',
    title: 'Free Unit Converter: Length, Weight, Temp & Currency',
    desc:  'Convert length, weight, temperature, currency & more free. 12 tools, 262+ guides, 4 languages. Instant answers — no signup needed. Try now →',
    faqs: [
      { q: 'What can I convert with OmniConverter?', a: 'OmniConverter lets you convert length, weight, temperature, currency, volume, speed, area, time, and file formats — all free, no signup needed.' },
      { q: 'Is OmniConverter free to use?', a: 'Yes, OmniConverter is 100% free. All 12 conversion tools and 262+ conversion guides are available without any registration or fees.' },
      { q: 'Does OmniConverter support multiple languages?', a: 'Yes, OmniConverter is available in English, Spanish (ES), German (DE), and Portuguese (PT).' }
    ]
  },
  {
    file: 'length.html',
    title: 'Length Converter: cm↔in, m↔ft — Instant Free Tool',
    desc:  'Convert meters to feet, cm to inches, mm, yards & miles instantly. Exact formulas + live calculator. Free, no signup needed. Convert now →',
  },
  {
    file: 'temperature.html',
    title: 'Temperature Converter: °C to °F, Kelvin & All Scales',
    desc:  'Convert Celsius to Fahrenheit instantly: °C↔°F, Kelvin, Rankine & 8 scales. Example: 50°F = 10°C. Free online calculator. Try now →',
  },
  {
    file: 'weight-mass.html',
    title: 'Weight Converter: kg↔lbs, Stone, oz, g — Free Tool',
    desc:  'Convert kg to lbs, stone to pounds, oz to grams instantly. Example: 180 lbs = 12 st 12 lb. Free UK weight calculator →',
  },
  {
    file: 'currency.html',
    title: 'Currency Converter: Live USD, GBP, AUD, EUR Rates',
    desc:  'Free real-time currency converter. Convert USD, GBP, EUR, AUD & 35+ currencies with live mid-market rates. Updated daily. No fees →',
  },
  {
    file: 'volume-capacity.html',
    title: 'Volume Converter: mL, L, Cups, Gallons — Free Tool',
    desc:  'Convert ml to cups, liters to gallons, fl oz instantly. Example: 500ml = 2.11 US cups. Free liquid volume calculator →',
  },
  {
    file: 'speed.html',
    title: 'Speed Converter: mph↔km/h, Knots, m/s — Free Tool',
    desc:  'Convert mph to km/h, knots, m/s instantly. Example: 60 mph = 96.56 km/h. UK speed limits included. Free calculator →',
  },
  {
    file: 'area.html',
    title: 'Area Converter: sq ft, sq m, Acres — Free Calculator',
    desc:  'Convert sq ft to sq m, acres to hectares, sq miles instantly. Example: 100 sq ft = 9.29 sq m. Free area calculator →',
  },
  {
    file: 'time-duration.html',
    title: 'Time & Duration Converter: Hours, Minutes, Seconds',
    desc:  'Convert hours to seconds, days to minutes, weeks to months. Example: 1 hour = 3,600 seconds. Free time calculator →',
  },
  {
    file: 'time-zone.html',
    title: 'World Time Zone Converter: Live Clock & Meeting Planner',
    desc:  'Free online world time zone converter and live world clock. Convert time across 150+ countries and cities with visual 24-hour meeting planner.',
  },
  {
    file: 'file-media.html',
    title: 'File & Media Converter: PDF, Images, CSV — Free Tool',
    desc:  'Convert images, PDFs, documents, JSON & CSV files free in your browser. Private, secure client-side conversion. No upload needed →',
  },
  {
    file: 'indian-units.html',
    title: 'Indian Units Converter: Bigha, Gaj, Tola, Lakh & Crore',
    desc:  'Free Indian unit converter. Convert Bigha to Sq Ft, Gaj to Sq Yard, Tola to Grams, Lakh to Millions & Crore to Billions. Free →',
  },

  // ══════════════════════════════════════════════════════
  // HIGH-IMPRESSION BLOG PAGES (EN)
  // ══════════════════════════════════════════════════════
  {
    file: 'blog/180lbs-in-stone.html',
    title: '180 lbs in Stone: 12 st 12 lb — Instant UK Answer',
    desc:  '180 lbs = 12 stone 12 lb (81.65 kg). Free instant table: 160–200 lbs. BMI chart included. UK standard weight converter →',
    faqs: [
      { q: 'What is 180 lbs in stone?', a: '180 pounds equals exactly 12 stone 12 pounds (12.857 stone or 81.65 kg). To calculate: divide 180 by 14 = 12.857 stone.' },
      { q: 'How do I convert pounds to stone?', a: 'To convert pounds to stone, divide the number of pounds by 14. For example: 180 ÷ 14 = 12 stone 12 lb.' },
      { q: 'Is 180 lbs a healthy weight?', a: 'Whether 180 lbs is healthy depends on your height. For a 5\'10" person, 180 lbs gives a BMI of 25.8 (borderline overweight). Use a BMI calculator for your exact height.' }
    ]
  },
  {
    file: 'blog/32-usd-to-gbp.html',
    title: '32 USD to GBP: Today\'s Rate (~£25) [Live 2026]',
    desc:  '$32 USD = approx £25.20 GBP today. Compare bank vs Wise rates. Free instant currency converter. Updated daily →',
    faqs: [
      { q: 'How much is 32 US dollars in British pounds?', a: '32 USD is approximately £25.20 GBP at the current mid-market rate (1 USD ≈ 0.787 GBP). Bank rates may be 2–5% lower than this.' },
      { q: 'What is the best way to convert USD to GBP?', a: 'For the best USD to GBP rate, use services like Wise or Revolut which offer near mid-market rates with low fees, rather than banks or airport exchanges.' },
      { q: 'How much does it cost to send $32 to the UK?', a: 'Sending $32 to the UK via Wise costs about £0.20–0.40 in fees. Bank wire transfers typically charge £5–25 flat fee plus a currency markup.' }
    ]
  },
  {
    file: 'blog/13-stone-in-pounds.html',
    title: '13 Stone in Pounds: Exactly 182 lbs [13 × 14]',
    desc:  '13 stone = 182 pounds exactly (82.55 kg). Full 1–20 stone reference table. BMI guide. Free UK weight calculator →',
    faqs: [
      { q: 'How many pounds is 13 stone?', a: '13 stone equals exactly 182 pounds (82.55 kg). The calculation is 13 × 14 = 182 lbs.' },
      { q: 'How do you convert stone to pounds?', a: 'Multiply the number of stone by 14. Example: 13 stone × 14 = 182 pounds.' },
      { q: 'Is 13 stone heavy for a man?', a: 'For a man of average height (5\'9\'), 13 stone (182 lbs) gives a BMI of about 26.9 — slightly overweight. For a taller man (6\'1\'), it\'s a healthy BMI of 24.' }
    ]
  },
  {
    file: 'blog/220-pounds-in-stone.html',
    title: '220 lbs in Stone: 15 st 10 lb — Quick UK Answer',
    desc:  '220 lbs = 15 stone 10 lb (99.79 kg). Full 200–240 lbs table. BMI guide included. Free UK weight converter →',
    faqs: [
      { q: 'What is 220 lbs in stone?', a: '220 pounds equals 15 stone 10 pounds (15.714 stone or 99.79 kg). Calculation: 220 ÷ 14 = 15 remainder 10.' },
      { q: 'How many stone and pounds is 220 lbs?', a: '220 lbs = 15 stone and 10 pounds. The whole stone part is 15 (15 × 14 = 210 lbs), and the remaining 10 lbs gives 15 st 10 lb.' },
      { q: 'Is 220 pounds overweight?', a: 'At 220 lbs (15 st 10 lb), whether you are overweight depends on height. For a 6\'0\" person, BMI is 29.8 (borderline obese). For 6\'3\", BMI is 27.5 (overweight).' }
    ]
  },
  {
    file: 'blog/50-fahrenheit-to-celsius.html',
    title: '50°F to Celsius: Exactly 10°C [Weather Guide 2026]',
    desc:  '50°F = 10°C exactly. What to wear at 10°C? Full weather & clothing guide. Formula included. Free temperature converter →',
  },
  {
    file: 'blog/300-meters-to-feet.html',
    title: '300 Meters to Feet: Exactly 984.25 ft [Instant Answer]',
    desc:  '300 meters = 984.25 feet (984 ft 3 in). Sports distance guide + 50–500m reference table. Free converter →',
    faqs: [
      { q: 'How many feet is 300 meters?', a: '300 meters equals exactly 984.252 feet (984 feet and 3 inches). The formula is: meters × 3.28084 = feet.' },
      { q: 'How far is 300 meters to walk?', a: '300 meters takes approximately 3–4 minutes to walk at a normal pace. It is about the length of 3 American football fields.' },
      { q: 'What is 300 meters in yards?', a: '300 meters equals 328.084 yards. Multiply meters by 1.09361 to get yards.' }
    ]
  },
  {
    file: 'blog/104-kg-pounds.html',
    title: '104 kg to lbs: Exactly 229.28 lbs [Gym Table]',
    desc:  '104 kg = 229.28 pounds (229 lbs 4.5 oz). Full 90–120 kg gym reference table. Free weight calculator →',
    faqs: [
      { q: 'What is 104 kg in pounds?', a: '104 kilograms equals exactly 229.282 pounds (229 lbs 4.5 oz). Formula: 104 × 2.20462 = 229.28 lbs.' },
      { q: 'How do I convert kg to lbs?', a: 'Multiply kilograms by 2.20462 to get pounds. For 104 kg: 104 × 2.20462 = 229.28 lbs.' },
      { q: 'Is 104 kg overweight?', a: 'At 104 kg (229 lbs), whether you are overweight depends on height. For a 5\'10\" person, BMI is 32.5 (obese). For a 6\'2\" person, BMI is 29.9 (borderline).' }
    ]
  },
  {
    file: 'blog/1-bar-to-psi-conversion.html',
    title: '1 Bar to PSI: Exactly 14.5038 psi [Tyre Pressure Guide]',
    desc:  '1 bar = 14.5038 psi. Car tyre pressure: 2.0–2.5 bar = 29–36 psi. Full pressure table. Free converter →',
    faqs: [
      { q: 'How many PSI is 1 bar?', a: '1 bar equals exactly 14.5038 PSI (pounds per square inch). This is the standard conversion used in automotive and industrial applications.' },
      { q: 'What is 2.5 bar in PSI for tyres?', a: '2.5 bar equals 36.26 PSI. This is a common recommended tyre pressure for many passenger cars. Always check your vehicle\'s door placard for the exact recommendation.' },
      { q: 'How do I convert bar to PSI?', a: 'To convert bar to PSI, multiply by 14.5038. Example: 2 bar × 14.5038 = 29.01 PSI.' }
    ]
  },
  {
    file: 'blog/170lbs-in-stone.html',
    title: '170 lbs in Stone: 12 st 2 lb — Instant UK Answer',
    desc:  '170 lbs = 12 stone 2 lb (77.11 kg). Full 150–190 lbs table. BMI chart included. Free UK calculator →',
    faqs: [
      { q: 'What is 170 lbs in stone?', a: '170 pounds equals 12 stone 2 pounds (12.143 stone or 77.11 kg). Calculation: 170 ÷ 14 = 12 remainder 2.' },
      { q: 'How do you convert 170 lbs to stone and pounds?', a: 'Divide 170 by 14: 14 × 12 = 168, remainder 2. So 170 lbs = 12 stone 2 pounds.' },
      { q: 'Is 170 pounds a healthy weight?', a: 'For a 5\'8\" person, 170 lbs gives a BMI of 25.8 (slightly overweight). For a 5\'11\" person, it gives a BMI of 23.7 (healthy range).' }
    ]
  },
  {
    file: 'blog/2000-dollars-in-pounds.html',
    title: '2000 USD to GBP: How Much in Pounds? [2026 Rate]',
    desc:  '$2,000 USD = approx £1,575 GBP today. Bank vs Wise fee comparison. Free currency converter. Updated daily →',
    faqs: [
      { q: 'How much is $2000 in British pounds?', a: '$2,000 USD is approximately £1,575 GBP at the current exchange rate (1 USD ≈ 0.787 GBP). Rates change daily.' },
      { q: 'What is the best way to convert $2000 to pounds?', a: 'For $2,000, use Wise or Revolut for the best rates. They charge about 0.4% (≈$8) versus bank fees of 3–5% (≈$60–100).' },
      { q: 'How much would I lose converting $2000 at a bank?', a: 'Converting $2,000 at a bank with a 3% markup costs approximately $60 compared to the mid-market rate. Wise typically saves you $40–50 on this amount.' }
    ]
  },
  {
    file: 'blog/1-cup-milk-in-milliliters.html',
    title: '1 Cup of Milk in mL: Exactly 240ml [Baking Guide]',
    desc:  '1 cup of milk = 240ml (US) or 250ml (UK metric). Baking conversion table + density chart. Free calculator →',
    faqs: [
      { q: 'How many ml is 1 cup of milk?', a: '1 US cup of milk is exactly 240 milliliters. 1 UK/metric cup is 250ml. For baking, always check which cup size your recipe uses.' },
      { q: 'Is a cup of milk 250ml or 240ml?', a: 'It depends on the country. US cups = 240ml (8 fl oz). UK/Australian metric cups = 250ml. Most UK recipes use 250ml cups.' },
      { q: 'How many cups is 500ml of milk?', a: '500ml of milk equals 2.08 US cups or exactly 2 UK metric cups.' }
    ]
  },
  {
    file: 'blog/60-mph-to-kmh.html',
    title: '60 mph to km/h: Exactly 96.56 km/h [UK Speed Guide]',
    desc:  '60 mph = 96.56 km/h. UK speed limit guide: 30/60/70 mph in km/h. Full table. Free speed converter →',
    faqs: [
      { q: 'How fast is 60 mph in km/h?', a: '60 miles per hour equals exactly 96.561 km/h. Formula: multiply mph by 1.60934.' },
      { q: 'What are the UK speed limits in km/h?', a: 'UK speed limits: 30 mph = 48.3 km/h (urban), 60 mph = 96.6 km/h (single carriageway), 70 mph = 112.7 km/h (motorway).' },
      { q: 'How do you convert mph to km/h?', a: 'Multiply miles per hour by 1.60934 to get km/h. Example: 60 × 1.60934 = 96.56 km/h.' }
    ]
  },
  {
    file: 'blog/100-kg-to-lbs.html',
    title: '100 kg to lbs: Exactly 220.46 lbs [Gym Reference]',
    desc:  '100 kg = 220.46 pounds. Full 80–120 kg gym reference table. Stone conversion included. Free calculator →',
    faqs: [
      { q: 'What is 100 kg in pounds?', a: '100 kilograms equals exactly 220.462 pounds (220 lbs 7.4 oz). Multiply kg by 2.20462 to convert.' },
      { q: 'What is 100 kg in stone and pounds?', a: '100 kg = 15 stone 10.46 pounds (15.747 stone). It is the equivalent of 220 lbs 7.4 oz.' },
      { q: 'How do I convert 100 kg to pounds quickly?', a: 'A quick estimate: multiply kg by 2.2. So 100 × 2.2 = 220 lbs (exact is 220.46 lbs).' }
    ]
  },
  {
    file: 'blog/80-kilo-lbs.html',
    title: '80 kg to lbs: Exactly 176.37 lbs [Quick Answer]',
    desc:  '80 kg = 176.37 pounds (176 lbs 6 oz). Full 70–90 kg reference table. Free weight calculator →',
    faqs: [
      { q: 'What is 80 kg in pounds?', a: '80 kilograms equals exactly 176.37 pounds (176 lbs 5.9 oz). Formula: 80 × 2.20462 = 176.37 lbs.' },
      { q: 'What is 80 kg in stone?', a: '80 kg = 12 stone 8.48 pounds (12.598 stone).' },
      { q: 'Is 80 kg heavy for a man?', a: 'For a man of average height (5\'9\"), 80 kg gives a BMI of 26.2 (slightly overweight). For a 6\'0\" man, BMI is 24.0 (healthy).' }
    ]
  },
  {
    file: 'blog/210-kg-in-pounds.html',
    title: '210 kg to lbs: Exactly 462.97 lbs [Heavy Reference]',
    desc:  '210 kg = 462.97 pounds (462 lbs 15.5 oz). Full 200–220 kg reference table. Free calculator →',
    faqs: [
      { q: 'What is 210 kg in pounds?', a: '210 kilograms equals exactly 462.971 pounds (462 lbs 15.5 oz). Formula: 210 × 2.20462 = 462.97 lbs.' },
      { q: 'What is 210 kg in stone?', a: '210 kg = 33 stone 1.07 pounds (33.069 stone).' },
      { q: 'How do I convert 210 kg to lbs?', a: 'Multiply 210 by 2.20462: 210 × 2.20462 = 462.97 lbs.' }
    ]
  },
  {
    file: 'blog/1-4-cup-is-ml.html',
    title: '1/4 Cup in mL: Exactly 59ml [Baking & Cooking]',
    desc:  '1/4 cup = 59.15ml (US) or 62.5ml (UK metric). Per-ingredient density table. Free converter →',
    faqs: [
      { q: 'How many ml is 1/4 cup?', a: '1/4 US cup equals 59.15 milliliters (approximately 59ml). 1/4 UK metric cup equals 62.5ml.' },
      { q: 'What is 1/4 cup of flour in grams?', a: '1/4 cup of all-purpose flour equals approximately 31 grams. Different flours have different densities — bread flour is about 34g per 1/4 cup.' },
      { q: 'Is a 1/4 cup the same as 4 tablespoons?', a: 'Yes, 1/4 US cup equals exactly 4 tablespoons (4 tbsp = 59.15ml = 2 fl oz).' }
    ]
  },
  {
    file: 'blog/1-tsp-is-ml.html',
    title: '1 Teaspoon in mL: Exactly 5ml [US, UK & Medical]',
    desc:  '1 tsp = 5ml (US/metric). UK = 5.9ml. Medical = exactly 5ml. Full comparison table. Safe dosing guide →',
    faqs: [
      { q: 'How many ml is 1 teaspoon?', a: '1 US teaspoon = 4.92892ml (≈5ml). 1 UK teaspoon = 5.9194ml. Medical/metric teaspoon = exactly 5ml.' },
      { q: 'Is a teaspoon 5ml for medicine?', a: 'Yes, for medicine and dosing purposes, 1 teaspoon is standardised as exactly 5ml worldwide. Always use a medicine measuring spoon for accuracy.' },
      { q: 'How many teaspoons is 15ml?', a: '15ml equals 3 US teaspoons or 1 US tablespoon.' }
    ]
  },
  {
    file: 'blog/70kg-in-stone.html',
    title: '70 kg in Stone: 11 st 0.3 lb — Quick UK Answer',
    desc:  '70 kg = 11 stone 0.3 lb (154.32 lbs). Full 60–80 kg table. BMI guide. Free UK weight calculator →',
    faqs: [
      { q: 'What is 70 kg in stone?', a: '70 kilograms equals 11 stone 0.3 pounds (11.023 stone or 154.32 lbs).' },
      { q: 'Is 70 kg a healthy weight?', a: 'For a person of average height (5\'7\"), 70 kg gives a BMI of 24.2 (healthy). For a 5\'4\" person, BMI is 26.5 (slightly overweight).' },
      { q: 'How many pounds is 70 kg?', a: '70 kilograms = 154.324 pounds (154 lbs 5.2 oz).' }
    ]
  },
  {
    file: 'blog/5-usd-to-aud.html',
    title: '5 USD to AUD: Today\'s Rate (~A$7.60) [Live 2026]',
    desc:  '$5 USD = approx A$7.60 AUD today. Live exchange rate. Free instant currency converter. Updated daily →',
    faqs: [
      { q: 'How much is $5 US dollars in Australian dollars?', a: '$5 USD is approximately A$7.60 AUD at current rates (1 USD ≈ 1.52 AUD). Rates change daily.' },
      { q: 'What is the USD to AUD exchange rate?', a: 'The mid-market USD to AUD rate is approximately 1.52 AUD per 1 USD. This changes daily based on market conditions.' },
      { q: 'Is it better to exchange USD to AUD in the US or Australia?', a: 'Generally, you get better rates using a multi-currency card (Wise, Revolut) or ATMs in Australia rather than airport exchanges in either country.' }
    ]
  },
  {
    file: 'blog/100-usd-to-aud.html',
    title: '100 USD to AUD: Today\'s Rate (~A$152) [Live 2026]',
    desc:  '$100 USD = approx A$152.50 AUD today. Full USD/AUD conversion table. Free currency converter →',
    faqs: [
      { q: 'How much is $100 US dollars in Australian dollars?', a: '$100 USD is approximately A$152.50 AUD at current mid-market rates (1 USD ≈ 1.52 AUD). Live rates vary daily.' },
      { q: 'How do I get the best rate converting USD to AUD?', a: 'Use Wise or Revolut for the best USD to AUD rates. They charge 0.4–0.6% vs. banks which charge 2–5%.' },
      { q: 'What is $100 AUD in US dollars?', a: '$100 AUD is approximately $65.79 USD at current rates (1 AUD ≈ 0.658 USD).' }
    ]
  },
  {
    file: 'blog/1-billion-korean-won-to-gbp.html',
    title: '1 Billion Korean Won to GBP: ₩1bn = ~£572,000',
    desc:  '₩1,000,000,000 KRW = ~£572,460 GBP. K-drama currency guide. Wire transfer cost breakdown. Free converter →',
    faqs: [
      { q: 'How much is 1 billion Korean won in British pounds?', a: '1 billion Korean won (₩1,000,000,000 KRW) equals approximately £572,460 GBP at current rates (1 KRW ≈ £0.000572).' },
      { q: 'How much is 1 billion won in USD?', a: '1 billion Korean won (₩1,000,000,000) equals approximately $727,000 USD at current rates.' },
      { q: 'Why is 1 billion won seen in K-dramas?', a: 'In Korean culture and K-dramas, 1 billion won (10억 원) is seen as a significant sum representing wealth. In GBP, it is approximately £572,000.' }
    ]
  },
  {
    file: 'blog/1-gallon-in-litres.html',
    title: '1 Gallon in Litres: US=3.785L, UK=4.546L [Guide]',
    desc:  '1 US gallon = 3.785 litres. 1 UK gallon = 4.546 litres. Fuel & cooking guide. Full table. Free converter →',
    faqs: [
      { q: 'How many litres is 1 gallon?', a: '1 US gallon = 3.785 litres. 1 UK (Imperial) gallon = 4.546 litres. Always check which gallon your recipe or fuel guide uses.' },
      { q: 'How many litres is a UK gallon?', a: '1 UK Imperial gallon equals exactly 4.54609 litres. This differs from the US gallon (3.785 litres).' },
      { q: 'How many gallons is 20 litres?', a: '20 litres = 5.283 US gallons or 4.399 UK gallons.' }
    ]
  },
  {
    file: 'blog/500-ml-to-cups.html',
    title: '500ml to Cups: Exactly 2 UK Cups / 2.11 US Cups',
    desc:  '500ml = 2.00 UK metric cups or 2.11 US cups. Full ml to cups table. Liquid measuring guide. Free converter →',
    faqs: [
      { q: 'How many cups is 500ml?', a: '500ml equals exactly 2 UK metric cups (250ml each) or 2.113 US cups (236.6ml each).' },
      { q: 'Is 500ml half a litre?', a: 'Yes, 500ml is exactly half a litre (0.5 litres = 500 millilitres).' },
      { q: 'What is 500ml of water in cups?', a: '500ml of water = 2 UK cups or 2.11 US cups. Water density is 1g/ml so 500ml = 500g of water.' }
    ]
  },
  {
    file: 'blog/100-fahrenheit-to-celsius.html',
    title: '100°F to Celsius: Exactly 37.78°C [Fever Guide]',
    desc:  '100°F = 37.78°C. Is 100°F a fever? Medical temperature guide + formula. Free temperature converter →',
    faqs: [
      { q: 'What is 100 degrees Fahrenheit in Celsius?', a: '100°F equals exactly 37.78°C. Formula: (100 - 32) × 5/9 = 37.78°C.' },
      { q: 'Is 100°F a fever?', a: '100°F (37.78°C) is considered a low-grade fever in adults. Normal body temperature is 98.6°F (37°C). A high fever is typically above 103°F (39.4°C).' },
      { q: 'What is body temperature 100.4°F in Celsius?', a: '100.4°F = 38°C, which is the clinical definition of a fever in adults.' }
    ]
  },

  // ══════════════════════════════════════════════════════
  // SPANISH PAGES (ES)
  // ══════════════════════════════════════════════════════
  {
    file: 'es/blog/165-libras-a-kg.html',
    title: '165 Libras a Kg: Son 74.84 kg [Respuesta Exacta]',
    desc:  '165 libras = 74.84 kg exactamente. Tabla 150–180 lbs en español. Calculadora gratis →',
    faqs: [
      { q: '¿Cuánto es 165 libras en kilogramos?', a: '165 libras equivalen exactamente a 74.843 kilogramos. Fórmula: 165 × 0.453592 = 74.84 kg.' },
      { q: '¿Cómo convierto libras a kilogramos?', a: 'Multiplica las libras por 0.453592 para obtener kilogramos. Ejemplo: 165 × 0.453592 = 74.84 kg.' },
      { q: '¿Son 165 libras un peso saludable?', a: 'Para una persona de 1.65m, 165 libras (74.84 kg) da un IMC de 27.5 (ligeramente sobrepeso). Para 1.75m, el IMC es 24.4 (peso saludable).' }
    ]
  },
  {
    file: 'es/blog/65-kg-a-libras.html',
    title: '65 kg a Libras: Son 143.3 lbs [Calculadora 2026]',
    desc:  '65 kg = 143.3 libras exactamente. Tabla 60–75 kg. Fórmula paso a paso. Calculadora gratis →',
    faqs: [
      { q: '¿Cuántas libras son 65 kilogramos?', a: '65 kilogramos equivalen exactamente a 143.300 libras. Fórmula: 65 × 2.20462 = 143.3 lbs.' },
      { q: '¿Cómo convierto kg a libras?', a: 'Multiplica los kilogramos por 2.20462. Ejemplo: 65 kg × 2.20462 = 143.3 libras.' },
      { q: '¿Son 65 kg un peso normal?', a: 'Para una mujer de 1.65m, 65 kg da un IMC de 23.9 (peso normal). Para un hombre de 1.75m, el IMC es 21.2 (peso saludable).' }
    ]
  },
  {
    file: 'es/blog/5-libras-a-kg.html',
    title: '5 Libras a Kg: Son 2.268 kg [Respuesta Exacta]',
    desc:  '5 libras = 2.268 kg exactamente. Fórmula rápida. Tabla completa 1–10 lbs. Calculadora gratis →',
    faqs: [
      { q: '¿Cuánto es 5 libras en kilogramos?', a: '5 libras equivalen exactamente a 2.268 kilogramos. Fórmula: 5 × 0.453592 = 2.268 kg.' },
      { q: '¿Cómo paso de libras a kilos?', a: 'Multiplica las libras por 0.453592 o divide entre 2.20462. Para 5 lbs: 5 × 0.453592 = 2.268 kg.' },
      { q: '¿Cuánto pesa 5 libras en gramos?', a: '5 libras equivalen a 2,267.96 gramos (aproximadamente 2,268 g).' }
    ]
  },
  {
    file: 'es/blog/4-metros-a-pies.html',
    title: '4 Metros a Pies: Son 13.12 pies [Tabla Completa]',
    desc:  '4 metros = 13.12 pies (13 pies 1.5 pulgadas). Tabla 1–10 m. Calculadora gratis →',
    faqs: [
      { q: '¿Cuántos pies son 4 metros?', a: '4 metros equivalen exactamente a 13.1234 pies (13 pies y 1.48 pulgadas). Fórmula: 4 × 3.28084 = 13.12 pies.' },
      { q: '¿Cómo convierto metros a pies?', a: 'Multiplica los metros por 3.28084. Ejemplo: 4 m × 3.28084 = 13.12 pies.' },
      { q: '¿Cuántos metros son 13 pies?', a: '13 pies equivalen a 3.9624 metros (casi 4 metros).' }
    ]
  },
  {
    file: 'es/blog/1-3-taza-a-gramos.html',
    title: '1/3 de Taza en Gramos: ~80g Harina [Cocina]',
    desc:  '1/3 taza = 80g (harina), 67g (azúcar), 80ml (agua). Tabla por ingrediente. Calculadora gratis →',
    faqs: [
      { q: '¿Cuántos gramos es 1/3 de taza?', a: 'Depende del ingrediente. 1/3 taza de harina = 80g. Azúcar = 67g. Agua = 80ml/80g. Mantequilla = 76g.' },
      { q: '¿Cuánto es 1/3 de taza en mililitros?', a: '1/3 de taza estadounidense = 78.9ml. 1/3 de taza métrica (Reino Unido/Australia) = 83.3ml.' },
      { q: '¿Es 1/3 de taza lo mismo que 5 cucharadas?', a: 'Sí, 1/3 de taza equivale exactamente a 5 cucharadas soperas y 1 cucharadita (5 tbsp + 1 tsp).' }
    ]
  },
  {
    file: 'es/blog/12-grados-celsius-a-fahrenheit.html',
    title: '12 Grados Celsius a Fahrenheit: Son 53.6°F',
    desc:  '12°C = 53.6°F. ¿Qué ponerse a 12°C? Guía clima y ropa. Fórmula incluida. Calculadora gratis →',
    faqs: [
      { q: '¿Cuánto es 12 grados Celsius en Fahrenheit?', a: '12°C equivale exactamente a 53.6°F. Fórmula: (12 × 9/5) + 32 = 53.6°F.' },
      { q: '¿Qué ropa usar a 12°C (53.6°F)?', a: 'A 12°C se recomienda: chaqueta ligera o jersey grueso, pantalón largo, y posiblemente bufanda. Es fresco pero no frío extremo.' },
      { q: '¿Cómo se convierte Celsius a Fahrenheit?', a: 'Fórmula: °F = (°C × 9/5) + 32. Ejemplo: 12°C → (12 × 1.8) + 32 = 53.6°F.' }
    ]
  },
  {
    file: 'es/blog/71-libras-a-kg.html',
    title: '71 Libras a Kg: Son 32.21 kg [Respuesta Exacta]',
    desc:  '71 libras = 32.21 kg exactamente. Tabla completa. Fórmula rápida. Calculadora gratis →',
    faqs: [
      { q: '¿Cuántos kilogramos son 71 libras?', a: '71 libras equivalen exactamente a 32.205 kilogramos. Fórmula: 71 × 0.453592 = 32.21 kg.' },
      { q: '¿Cómo convierto 71 libras a kilos?', a: 'Multiplica 71 por 0.453592: 71 × 0.453592 = 32.205 kg.' },
      { q: '¿Son 71 libras un peso saludable para un niño?', a: 'Para un niño de 10-11 años, 71 libras (32.2 kg) puede ser un peso normal dependiendo de la altura. Consulte siempre a su pediatra.' }
    ]
  },
  {
    file: 'es/time-duration.html',
    title: 'Convertidor de Tiempo y Duración | OmniConverter',
    desc:  'Convierta horas a minutos, días a segundos, semanas a meses al instante. Ej: 1 hora = 3,600 segundos. Calculadora de tiempo gratis →',
    faqs: [
      { q: '¿Cuántos segundos hay en una hora?', a: 'Hay exactamente 3,600 segundos en una hora (1 hora = 60 minutos × 60 segundos = 3,600 segundos).' },
      { q: '¿Cuántos minutos hay en un día?', a: 'Hay exactamente 1,440 minutos en un día (24 horas × 60 minutos = 1,440 minutos).' },
      { q: '¿Cuántos días hay en un año?', a: 'Un año regular tiene 365 días. Un año bisiesto tiene 366 días. En promedio, un año tiene 365.25 días.' }
    ]
  },

  // ══════════════════════════════════════════════════════
  // PORTUGUESE PAGES (PT)
  // ══════════════════════════════════════════════════════
  {
    file: 'pt/time-duration.html',
    title: 'Conversor de Tempo e Duração | OmniConverter',
    desc:  'Converta horas para minutos, dias para segundos, semanas para meses. Ex: 1 hora = 3.600 seg. Calculadora de tempo grátis →',
    faqs: [
      { q: 'Quantos segundos há em uma hora?', a: 'Há exatamente 3.600 segundos em uma hora (1 hora = 60 minutos × 60 segundos = 3.600 segundos).' },
      { q: 'Quantos minutos há em um dia?', a: 'Há exatamente 1.440 minutos em um dia (24 horas × 60 minutos = 1.440 minutos).' },
      { q: 'Quantas horas há em uma semana?', a: 'Há exatamente 168 horas em uma semana (7 dias × 24 horas = 168 horas).' }
    ]
  },
  {
    file: 'pt/volume-capacity.html',
    title: 'Conversor de Volume e Capacidade | OmniConverter',
    desc:  'Converta ml para xícaras, litros para galões, onças fluidas ao instante. Ex: 500ml = 2,11 xícaras. Calculadora grátis →',
    faqs: [
      { q: 'Quantos ml é 1 xícara?', a: '1 xícara americana = 236,6ml. 1 xícara métrica (Reino Unido/Austrália) = 250ml. Receitas brasileiras geralmente usam xícaras de 240ml.' },
      { q: 'Quantos litros é 1 galão?', a: '1 galão americano = 3,785 litros. 1 galão britânico (Imperial) = 4,546 litros.' },
      { q: 'Quantas colheres de sopa são 100ml?', a: '100ml equivalem a aproximadamente 6,76 colheres de sopa americanas (1 tbsp = 14,79ml).' }
    ]
  },
];

// ─── APPLY ALL FIXES ──────────────────────────────────────────────────────────
let successCount = 0;
let errorCount = 0;

for (const fix of fixes) {
  try {
    let html = readFile(fix.file);
    const orig = html;

    if (fix.title) html = fixTitle(html, fix.title);
    if (fix.desc)  html = fixDesc(html, fix.desc);
    if (fix.faqs)  html = injectFAQ(html, fix.faqs);

    if (html !== orig) {
      writeFile(fix.file, html);
      console.log(`✅ FIXED: ${fix.file}`);
      successCount++;
    } else {
      console.log(`⏭️  SKIP (no change): ${fix.file}`);
    }
  } catch (e) {
    console.error(`❌ ERROR: ${fix.file} — ${e.message}`);
    errorCount++;
  }
}

console.log(`\n══════════════════════════════════`);
console.log(`✅ Fixed: ${successCount} pages`);
console.log(`❌ Errors: ${errorCount} pages`);
console.log(`══════════════════════════════════`);
