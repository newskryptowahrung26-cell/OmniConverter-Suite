import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function getCanonicalConcept(kw) {
  let s = kw.toLowerCase().trim();

  // Normalize digits attached to letters (e.g. 100f -> 100 f, 3kg -> 3 kg, 140lbs -> 140 lbs)
  s = s.replace(/(\d+)([a-zA-Z]+)/g, '$1 $2').replace(/([a-zA-Z]+)(\d+)/g, '$1 $2');

  // Remove question prefixes and filler words
  s = s.replace(/^(how many|how much|what is|convert|calculate|formula for|difference between|how to convert|calculator for)\s+/, '');
  s = s.replace(/\b(is what|in a|as a|into a|in to|to a|equals|is equal to)\b/g, ' to ');

  // Standardize connectors
  s = s.replace(/\b(in|into|is|as|to)\b/g, ' to ');

  // Standardize common unit synonyms
  const unitSynonyms = [
    // Pressure & Engineering
    [/\b(pounds per square inch|pound per square inch)\b/g, 'psi'],
    [/\b(bars|bar)\b/g, 'bar'],

    // Temperature
    [/\b(fahrenheit|deg f|degree f|degrees f)\b/g, 'f'],
    [/\b(celsius|centigrade|celcius|deg c|degree c|degrees c)\b/g, 'c'],

    // Weight & Mass
    [/\b(kilograms|kilogram|kilos|kilo)\b/g, 'kg'],
    [/\b(pounds|pound|lbs|lb)\b/g, 'lbs'],
    [/\b(stones|stone|st)\b/g, 'stone'],
    [/\b(grams|gram|g)\b/g, 'g'],
    [/\b(ounces|ounce|oz)\b/g, 'oz'],

    // Cooking & Volume
    [/\b(milliliters|milliliter|millilitres|millilitre)\b/g, 'ml'],
    [/\b(liters|liter|litres|litre|l)\b/g, 'liters'],
    [/\b(quarts|quart|qt)\b/g, 'quart'],
    [/\b(gallons|gallon|gal)\b/g, 'gallon'],
    [/\b(cups|cup)\b/g, 'cup'],
    [/\b(teaspoons|teaspoon|tsp)\b/g, 'tsp'],
    [/\b(tablespoons|tablespoon|tbsp)\b/g, 'tbsp'],
    [/\b(fluid ounces|fluid ounce|fl oz)\b/g, 'fl oz'],

    // Length & Distance
    [/\b(meters|meter|metres|metre|mtr|m)\b/g, 'meter'],
    [/\b(centimeters|centimeter|centimetres|centimetre)\b/g, 'cm'],
    [/\b(millimeters|millimeter|millimetres|millimetre)\b/g, 'mm'],
    [/\b(inches|inch|in)\b/g, 'inch'],
    [/\b(feet|foot|ft)\b/g, 'feet'],
    [/\b(yards|yard|yd)\b/g, 'yard'],
    [/\b(miles|mile)\b/g, 'miles'],
    [/\b(kilometers|kilometer|kilometres|kilometre|km)\b/g, 'km'],

    // Currency
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

    // Time Zone
    [/\b(time zones|time zone|timezones|timezone)\b/g, 'timezone']
  ];

  for (const [pattern, replacement] of unitSynonyms) {
    s = s.replace(pattern, replacement);
  }

  // Clean extra words, non-alphanumeric, and multiple spaces
  s = s.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  s = s.replace(/\bto\s+to\b/g, 'to');
  return s;
}

// Read existing blog slugs
const blogDir = path.join(rootDir, 'blog');
const existingSlugs = fs.existsSync(blogDir)
  ? fs.readdirSync(blogDir).filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''))
  : [];

const existingConceptMap = new Map();
existingSlugs.forEach(slug => {
  const concept = getCanonicalConcept(slug.replace(/-/g, ' '));
  existingConceptMap.set(concept, slug);
});

// Read raw keywords
const rawLines = fs.readFileSync(path.join(rootDir, 'scripts', 'raw-keywords.csv'), 'utf8')
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(l => l && l.toLowerCase() !== 'keyword');

console.log('Total Raw Keywords to process:', rawLines.length);

// Group all raw keywords by canonical concept
const conceptGroups = new Map();
rawLines.forEach((kw, idx) => {
  const concept = getCanonicalConcept(kw);
  if (!conceptGroups.has(concept)) {
    conceptGroups.set(concept, []);
  }
  conceptGroups.get(concept).push({ kw, idx });
});

console.log('Total Unique Canonical Concepts:', conceptGroups.size);

let existingPostKeywords = 0;
let newPrimaryPostKeywords = 0;
let semanticLsiKeywords = 0;
let exactDuplicateKeywords = 0;

conceptGroups.forEach((items, concept) => {
  const isExisting = existingConceptMap.has(concept);
  const seenExact = new Set();

  items.forEach((item, index) => {
    const isExactDup = seenExact.has(item.kw.toLowerCase());
    seenExact.add(item.kw.toLowerCase());

    if (isExactDup) {
      exactDuplicateKeywords++;
      semanticLsiKeywords++;
    } else if (isExisting) {
      existingPostKeywords++;
      if (index > 0) {
        semanticLsiKeywords++;
      }
    } else {
      if (index === 0) {
        newPrimaryPostKeywords++;
      } else {
        semanticLsiKeywords++;
      }
    }
  });
});

console.log({
  totalRawKeywords: rawLines.length,
  uniqueConcepts: conceptGroups.size,
  newPrimaryPostKeywords,
  existingPostKeywords,
  semanticLsiKeywords,
  exactDuplicateKeywords
});
