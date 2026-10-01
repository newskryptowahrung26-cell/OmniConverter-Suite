import fs from 'fs';

export function getCanonicalConcept(kw) {
  let s = kw.toLowerCase().trim();

  // Normalize digits stuck to letters (e.g. 100f -> 100 f, 3kg -> 3 kg, 140lbs -> 140 lbs)
  s = s.replace(/(\d+)([a-zA-Z]+)/g, '$1 $2').replace(/([a-zA-Z]+)(\d+)/g, '$1 $2');

  // Remove question prefixes and filler words
  s = s.replace(/^(how many|how much|what is|convert|calculate|formula for|difference between|how to convert)\s+/, '');
  s = s.replace(/\b(is what|in a|as a|into a|in to|to a|equals|is equal to)\b/g, ' to ');

  // Standardize connectors
  s = s.replace(/\b(in|into|is|as|to)\b/g, ' to ');

  // Standardize common unit synonyms
  const unitSynonyms = [
    [/\b(fahrenheit|deg f|degree f|degrees f)\b/g, 'f'],
    [/\b(celsius|centigrade|celcius|deg c|degree c|degrees c)\b/g, 'c'],
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
    [/\b(meters|meter|metres|metre|m)\b/g, 'meter'],
    [/\b(centimeters|centimeter|centimetres|centimetre)\b/g, 'cm'],
    [/\b(millimeters|millimeter|millimetres|millimetre)\b/g, 'mm'],
    [/\b(inches|inch|in)\b/g, 'inch'],
    [/\b(feet|foot|ft)\b/g, 'feet'],
    [/\b(yards|yard|yd)\b/g, 'yard'],
    [/\b(miles|mile)\b/g, 'miles'],
    [/\b(kilometers|kilometer|kilometres|kilometre|km)\b/g, 'km'],
    [/\b(australian dollars|aussie dollar|aussie dollars)\b/g, 'aud'],
    [/\b(us dollars|us dollar|american dollar|american dollars)\b/g, 'usd'],
    [/\b(british pounds|pound sterling|pounds sterling)\b/g, 'gbp'],
    [/\b(korean won)\b/g, 'won'],
    [/\b(turkish lira)\b/g, 'lira'],
    [/\b(indonesian rupiah)\b/g, 'rupiah'],
    [/\b(japanese yen)\b/g, 'yen']
  ];

  for (const [pattern, replacement] of unitSynonyms) {
    s = s.replace(pattern, replacement);
  }

  // Clean extra spaces and dedupe 'to to'
  s = s.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  s = s.replace(/\bto\s+to\b/g, 'to');
  return s;
}

const rawLines = fs.readFileSync('scripts/raw-keywords.csv', 'utf8')
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(l => l && l.toLowerCase() !== 'keyword');

const conceptMap = new Map();
rawLines.forEach(kw => {
  const concept = getCanonicalConcept(kw);
  if (!conceptMap.has(concept)) {
    conceptMap.set(concept, []);
  }
  conceptMap.get(concept).push(kw);
});

console.log('Total Raw Keywords:', rawLines.length);
console.log('Unique Canonical Concepts:', conceptMap.size);

const multiVariantConcepts = Array.from(conceptMap.entries()).filter(([c, list]) => list.length > 1);
console.log('Concepts with multiple duplicate/semantic keywords:', multiVariantConcepts.length);
console.log('Total keywords that become LSI / Semantic variants:', rawLines.length - conceptMap.size);

console.log('\nConcept [100 f to c] keywords:');
console.log(conceptMap.get('100 f to c'));
