import fs from 'fs';

const blogFiles = fs.readdirSync('blog').filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''));

export function getEntitySignature(str) {
  let s = str.toLowerCase();

  // Replace symbols and punctuation
  s = s.replace(/[\/\\_-]/g, ' ');
  s = s.replace(/[^a-z0-9\s]/g, ' ');

  // Separate numbers from letters (e.g. 170lbs -> 170 lbs, 100f -> 100 f, 1/3 -> 1 3)
  s = s.replace(/([0-9]+)([a-z]+)/g, '$1 $2').replace(/([a-z]+)([0-9]+)/g, '$1 $2');

  // Strip filler words, articles, and generic converter suffixes
  s = s.replace(/\b(a|an|the|of|for|to|in|into|is|as|at|by|per|from|and|or|how|many|much|what|is what|equal|equals|conversion|converter|calculator|calculate|converting|converted|guide|steps|formula|difference|today|now)\b/g, ' ');

  // Standardize number words
  s = s.replace(/\bone\b/g, '1')
       .replace(/\btwo\b/g, '2')
       .replace(/\bthree\b/g, '3')
       .replace(/\bfour\b/g, '4')
       .replace(/\bfive\b/g, '5')
       .replace(/\bsix\b/g, '6')
       .replace(/\bseven\b/g, '7')
       .replace(/\beight\b/g, '8')
       .replace(/\bnine\b/g, '9')
       .replace(/\bten\b/g, '10')
       .replace(/\bhalf\b/g, '1 2')
       .replace(/\bquarter\b/g, '1 4')
       .replace(/\bthird\b/g, '3');

  // Standardize units & currencies
  const unitMap = [
    [/\b(fahrenheit|deg f|degrees f|degree f)\b/g, 'f'],
    [/\b(celsius|centigrade|celcius|deg c|degrees c|degree c)\b/g, 'c'],
    [/\b(kilograms|kilogram|kilos|kilo)\b/g, 'kg'],
    [/\b(pounds|pound|lbs|lb)\b/g, 'lbs'],
    [/\b(stones|stone|st)\b/g, 'stone'],
    [/\b(grams|gram|g)\b/g, 'g'],
    [/\b(ounces|ounce|oz)\b/g, 'oz'],
    [/\b(milliliters|milliliter|millilitres|millilitre)\b/g, 'ml'],
    [/\b(liters|liter|litres|litre|l)\b/g, 'liters'],
    [/\b(quarts|quart|qt)\b/g, 'quart'],
    [/\b(gallons|gallon|gal)\b/g, 'gallon'],
    [/\b(cups|cup)\b/g, 'cup'],
    [/\b(teaspoons|teaspoon|tsp)\b/g, 'tsp'],
    [/\b(tablespoons|tablespoon|tbsp)\b/g, 'tbsp'],
    [/\b(fluid ounces|fluid ounce|fl oz)\b/g, 'fl oz'],
    [/\b(meters|meter|metres|metre|mtr|m)\b/g, 'meter'],
    [/\b(centimeters|centimeter|centimetres|centimetre)\b/g, 'cm'],
    [/\b(millimeters|millimeter|millimetres|millimetre)\b/g, 'mm'],
    [/\b(inches|inch|in)\b/g, 'inch'],
    [/\b(feet|foot|ft)\b/g, 'feet'],
    [/\b(yards|yard|yd)\b/g, 'yard'],
    [/\b(miles|mile)\b/g, 'miles'],
    [/\b(kilometers|kilometer|kilometres|kilometre|km)\b/g, 'km'],
    [/\b(miles per hour)\b/g, 'mph'],
    [/\b(kilometers per hour)\b/g, 'kmh'],
    [/\b(pounds per square inch)\b/g, 'psi'],
    [/\b(bars|bar)\b/g, 'bar'],
    [/\b(australian dollars|australian dollar|aussie dollar|aussie dollars)\b/g, 'aud'],
    [/\b(us dollars|us dollar|american dollar|american dollars|dollars|dollar)\b/g, 'usd'],
    [/\b(british pounds|british pound|pound sterling|pounds sterling)\b/g, 'gbp'],
    [/\b(korean won|krw)\b/g, 'won'],
    [/\b(turkish lira|try)\b/g, 'lira'],
    [/\b(indonesian rupiah|idr)\b/g, 'rupiah'],
    [/\b(japanese yen|jpy)\b/g, 'yen'],
    [/\b(euros|euro)\b/g, 'eur'],
    [/\b(canadian dollars|canadian dollar)\b/g, 'cad'],
    [/\b(egyptian pounds|egyptian pound)\b/g, 'egp'],
    [/\b(time zones|time zone|timezones|timezone)\b/g, 'timezone']
  ];

  for (const [pattern, replacement] of unitMap) {
    s = s.replace(pattern, replacement);
  }

  // Tokenize, sort, dedupe
  const tokens = [...new Set(s.split(/\s+/).filter(t => t.length > 0))].sort();
  return tokens.join('-');
}

console.log('--- Checking All 45 Published Blog Signatures ---');
const publishedSignatures = new Map();
blogFiles.forEach(f => {
  const sig = getEntitySignature(f);
  publishedSignatures.set(sig, f);
  console.log(f.padEnd(45), '->', sig);
});

// Test user examples
console.log('\n--- Checking User Examples ---');
const testKws = [
  '1 3 a cup in grams',
  '1/3 Cup to Grams',
  '1 3 cup in grams',
  '1 Bar to PSI',
  '1 bar a psi',
  '1 bar to psi',
  '1 bar to psi conversion',
  '1 4 cup is ml',
  '1/4 cup in ml',
  '1 stone in kg',
  '100 fahrenheit to celsius'
];

testKws.forEach(kw => {
  const sig = getEntitySignature(kw);
  const match = publishedSignatures.get(sig);
  console.log(`Keyword: "${kw}" -> Sig: [${sig}] -> Matches: ${match ? `PUBLISHED (/blog/${match})` : 'NEW'}`);
});
