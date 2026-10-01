import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Read existing blog slugs
const blogDir = path.join(rootDir, 'blog');
const existingSlugs = fs.existsSync(blogDir)
  ? fs.readdirSync(blogDir).filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''))
  : [];

// Canonical normalization function
export function getCanonicalConcept(kw) {
  let s = kw.toLowerCase().trim();

  // Normalize numbers attached to letters (e.g. 100f -> 100 f, 3kg -> 3 kg, 140lbs -> 140 lbs)
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

  // Clean extra spaces, non-alphanumeric, and multiple spaces
  s = s.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  s = s.replace(/\bto\s+to\b/g, 'to');
  return s;
}

const existingConceptMap = new Map();
existingSlugs.forEach(slug => {
  const concept = getCanonicalConcept(slug.replace(/-/g, ' '));
  existingConceptMap.set(concept, slug);
});

// 2. Read raw keywords CSV
const rawPath = path.join(rootDir, 'scripts', 'raw-keywords.csv');
if (!fs.existsSync(rawPath)) {
  console.error('raw-keywords.csv not found!');
  process.exit(1);
}

const rawLines = fs.readFileSync(rawPath, 'utf8')
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(l => l && l.toLowerCase() !== 'keyword');

console.log(`Processing ${rawLines.length} total raw keywords...`);

// 3. Category classification logic
function classifyCategory(kw) {
  const l = kw.toLowerCase();

  // Temperature
  if (/\b(celsius|fahrenheit|kelvin|celcius|centigrade|temperature|temp|f to c|c to f|f in c|c in f|degree c|degree f)\b/.test(l) ||
      /\b\d+\s*(f|c|k)\s+(to|in|is what|into)\s+(c|f|k|celcius|centigrade|fahrenheit)\b/.test(l) ||
      /\b\d+\s*f\b.*\b(c|celcius|centigrade)\b/.test(l) ||
      /\b\d+\s*c\b.*\b(f|fahrenheit)\b/.test(l)) {
    return {
      category: 'Temperature & Weather',
      toolLink: 'https://www.omniconverter.co.uk/temperature',
      toolSlug: 'temperature'
    };
  }

  // Currency & Forex
  if (/\b(usd|aud|gbp|eur|inr|cad|jpy|krw|vnd|egp|lira|won|dollar|dollars|yen|currency|forex|fx|rub|idr|rupiah|krona|baht|peso|dirham|dirhams|dinar|dinars|euro|euros|sterling|cents|rupees|lakh|crore|money|exchange rate|convert money|foreign cash|cash exchange|travel money|chf|renminbi|myr|commbank|conversion rates)\b/.test(l)) {
    return {
      category: 'Currency & Foreign Exchange',
      toolLink: 'https://www.omniconverter.co.uk/currency',
      toolSlug: 'currency'
    };
  }

  // Time Zone & World Clock
  if (/\b(time zone|timezone|time zones|timezones|time in|time now|time is now|time is|clock|gmt|utc|est|edt|pst|pdt|cst|cdt|mst|mdt|ist|pkt|jst|bst|cet|cest|aest|am time|pm time|24hr|military time|time difference|time convert|current time|what time)\b/.test(l)) {
    return {
      category: 'Time Zone & World Clock',
      toolLink: 'https://www.omniconverter.co.uk/time-zone',
      toolSlug: 'time-zone'
    };
  }

  // Kitchen Volume & Cooking
  if (/\b(cup|cups|ml|milliliter|milliliters|millilitre|millilitres|liter|liters|litre|litres|gallon|gallons|gal|quart|quarts|qt|pint|pints|pt|tsp|tbsp|teaspoon|teaspoons|tablespoon|tablespoons|fluid ounce|fluid ounces|fl oz|cooking|liquid|baking|capacity)\b/.test(l)) {
    return {
      category: 'Cooking & Kitchen Volume',
      toolLink: 'https://www.omniconverter.co.uk/volume-capacity',
      toolSlug: 'volume-capacity'
    };
  }

  // Weight & Body Mass
  if (/\b(stone|lbs|lb|pound|pounds|kg|kilo|kilos|kilogram|kilograms|gram|grams|ounce|ounces|oz|ton|tons|tonne|tonnes|st|g to lb|kg to st|st to kg|st in kg|kg in st|st to lbs|weight|weigh|mass|body mass)\b/.test(l)) {
    return {
      category: 'Weight & Body Mass',
      toolLink: 'https://www.omniconverter.co.uk/weight-mass',
      toolSlug: 'weight-mass'
    };
  }

  // Length, Height & Distance
  if (/\b(meter|meters|metre|metres|cm|centimeter|centimeters|centimetres|mm|millimeter|millimeters|inch|inches|feet|foot|ft|yard|yards|yd|km|kilometer|kilometers|mile|miles|height|distance|step|steps|length)\b/.test(l)) {
    return {
      category: 'Length, Height & Distance',
      toolLink: 'https://www.omniconverter.co.uk/length',
      toolSlug: 'length'
    };
  }

  // Area & Land Measurement
  if (/\b(acre|acres|acreage|hectare|hectares|sq ft|square feet|square meter|square meters|sq m|sq km|square km|square yard|square miles|area of|area calculation|area converter|area formula|area equation|area rectangle)\b/.test(l)) {
    return {
      category: 'Area & Land Measurement',
      toolLink: 'https://www.omniconverter.co.uk/area',
      toolSlug: 'area'
    };
  }

  // Speed & Engineering Pressure
  if (/\b(mph|kmh|km\/h|miles per hour|knot|knots|speed|velocity|bar|psi|kpa|pascal|pressure)\b/.test(l)) {
    return {
      category: 'Speed & Engineering Pressure',
      toolLink: 'https://www.omniconverter.co.uk/speed',
      toolSlug: 'speed'
    };
  }

  // Time Duration & Dates
  if (/\b(hour|hours|hr|hrs|minute|minutes|min|mins|second|seconds|sec|secs|day|days|week|weeks|month|months|year|years|date|dates|calendar|days between|count days|add time|work days|time calculator|duration|birthday|age calculator|how old)\b/.test(l)) {
    return {
      category: 'Time Duration & Dates',
      toolLink: 'https://www.omniconverter.co.uk/time-duration',
      toolSlug: 'time-duration'
    };
  }

  // Files, Media & Digital Converters
  if (/\b(pdf|word|doc|docx|jpg|jpeg|png|webp|csv|json|file|files|image|images|video|audio|mp3|mp4|converter app|converter software|download|format changer|binary|hex|decimal|octal|translator)\b/.test(l)) {
    return {
      category: 'Files, Media & Software',
      toolLink: 'https://www.omniconverter.co.uk/file-media',
      toolSlug: 'file-media'
    };
  }

  // Universal Default
  return {
    category: 'Universal Multi-Unit Calculator',
    toolLink: 'https://www.omniconverter.co.uk/',
    toolSlug: ''
  };
}

// 4. Slug Generator
function createCleanSlug(kw) {
  let s = kw.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const parts = s.split('-');
  if (parts.length > 7) {
    s = parts.slice(0, 7).join('-');
  }
  return s;
}

// 5. Generate Target Title
function createTargetTitle(kw, category) {
  const words = kw.split(' ').map(w => {
    if (['in', 'to', 'is', 'a', 'of', 'for', 'and', 'the'].includes(w)) return w;
    return w.charAt(0).toUpperCase() + w.slice(1);
  });
  const mainPhrase = words.join(' ');

  if (category.includes('Cooking')) {
    return `${mainPhrase}: Exact Conversion, Kitchen Chart & Recipe Calculation`;
  }
  if (category.includes('Currency')) {
    return `${mainPhrase}: Live Exchange Rate, FX Calculation & Forex Guide`;
  }
  if (category.includes('Time Zone')) {
    return `${mainPhrase}: Current Local Time, Time Difference & Meeting Guide`;
  }
  if (category.includes('Weight')) {
    return `${mainPhrase}: Exact Weight Conversion, Formula & Lookup Table`;
  }
  if (category.includes('Temperature')) {
    return `${mainPhrase}: Temperature Conversion Formula & Oven / Weather Guide`;
  }
  if (category.includes('Length')) {
    return `${mainPhrase}: Exact Length & Distance Conversion Steps`;
  }
  if (category.includes('Time Duration')) {
    return `${mainPhrase}: Date & Duration Calculator Guide`;
  }
  return `${mainPhrase}: Conversion Formula, Steps & Online Calculator`;
}

// 6. Featured Snippet Directive for Google & Bing #1 Rank
function createSnippetStrategy(kw, category) {
  if (category.includes('Cooking') || category.includes('Volume')) {
    return 'State exact answer in bold in first sentence (e.g. "[Value] equals exactly [Result]"). Include a 3-column conversion table (Cup / mL / Fl Oz) and step-by-step ratio.';
  }
  if (category.includes('Currency')) {
    return 'Provide mid-market rate formula immediately in opening paragraph: "1 [CurrA] = [Rate] [CurrB] as of today". Detail cardholder fee markups (Visa/Mastercard) and add interactive calculator link.';
  }
  if (category.includes('Time Zone')) {
    return 'State current time and hours difference in first 20 words. Include a daylight saving time (DST) summary and 24-hour business meeting overlap recommendation.';
  }
  if (category.includes('Temperature')) {
    return 'Display exact temperature formula (e.g. °C = (°F - 32) × 5/9) with bold numerical result in sentence 1. Add oven baking / weather context table.';
  }
  if (category.includes('Weight')) {
    return 'Answer in first sentence: "1 [Unit] equals [Result]". Provide exact conversion formula, stone/lbs/kg comparison chart, and health/fitness mass context.';
  }
  return 'Direct answer formula in first paragraph followed by quick reference conversion chart and interactive calculator embed.';
}

// Priority Determination (P1, P2, P3)
function determinePriority(kw) {
  const l = kw.toLowerCase();
  // High volume exact calculation queries
  if (/^\d+\s*(cup|cups|stone|kg|lbs|pound|pounds|dollar|dollars|aud|usd|gbp|eur|f|c|meter|meters|quart|gallon|ounce)\b/.test(l)) {
    return 'P1 - High Volume / Quick Win (Low KD)';
  }
  if (/to|in|convert|calculator|how many|difference/.test(l)) {
    return 'P2 - Core Cluster Authority';
  }
  return 'P3 - Long-Tail Semantic Extension';
}

// 7. Cluster Keywords by Canonical Concept
const conceptClusters = new Map();

rawLines.forEach((kw, index) => {
  const concept = getCanonicalConcept(kw);
  if (!conceptClusters.has(concept)) {
    conceptClusters.set(concept, []);
  }
  conceptClusters.get(concept).push({ kw, index });
});

console.log(`Clustered into ${conceptClusters.size} unique canonical concepts.`);

const processedRows = [];

// Track exact seen keywords to detect duplicate rows in sheet
const seenExactKeywords = new Map(); // kw.toLowerCase() -> count

conceptClusters.forEach((items, concept) => {
  const isExistingPost = existingConceptMap.has(concept);
  const targetSlug = isExistingPost
    ? existingConceptMap.get(concept)
    : createCleanSlug(items[0].kw);

  const primaryKw = items[0].kw;
  const primaryCatInfo = classifyCategory(primaryKw);

  items.forEach((item, idx) => {
    const rawKw = item.kw;
    const catInfo = classifyCategory(rawKw);
    const kwLower = rawKw.toLowerCase();
    const seenTimes = seenExactKeywords.get(kwLower) || 0;
    seenExactKeywords.set(kwLower, seenTimes + 1);

    const isExactDuplicate = seenTimes > 0;
    const isPrimaryInCluster = idx === 0 && !isExactDuplicate;

    let contentType = '';
    let role = '';
    let actionNeeded = '';
    let priority = determinePriority(rawKw);

    if (isExistingPost) {
      contentType = 'Existing Published Article';
      if (isPrimaryInCluster && !isExactDuplicate) {
        role = 'Primary Keyword (Already Published)';
        actionNeeded = 'Maintain Position #1: verify internal links and FAQ schema';
        priority = 'P1 - Live Maintenance (Already Published)';
      } else if (isExactDuplicate) {
        role = 'Consolidated Duplicate Query';
        actionNeeded = `Exact duplicate in sheet: consolidated into existing live article /blog/${targetSlug} (no new page needed)`;
        priority = 'P3 - Long-Tail Semantic Extension';
      } else {
        role = 'LSI / Semantic Support Keyword';
        actionNeeded = `Inject into /blog/${targetSlug} as secondary H2/H3 subheading or FAQ to rank without cannibalization`;
        priority = 'P2 - Core Cluster Authority';
      }
    } else {
      // New Article Cluster
      if (isPrimaryInCluster) {
        contentType = 'New High-Priority Blog Post';
        role = 'Primary Target Keyword (Pillar)';
        actionNeeded = `Publish new pillar guide with calculator embed and schema: ${createTargetTitle(rawKw, catInfo.category)}`;
      } else if (isExactDuplicate) {
        contentType = 'Supporting LSI / Semantic Variant';
        role = 'Consolidated Duplicate Query';
        actionNeeded = `Exact duplicate in sheet: consolidated into canonical target /blog/${targetSlug} (prevents duplicate pages)`;
        priority = 'P3 - Long-Tail Semantic Extension';
      } else {
        contentType = 'Supporting LSI / Semantic Variant';
        role = 'LSI / Semantic Support Keyword';
        actionNeeded = `Include as H2/H3 subheading, comparison table entry, or FAQ inside /blog/${targetSlug} to capture long-tail searches`;
        priority = 'P2 - Core Cluster Authority';
      }
    }

    processedRows.push({
      keyword: rawKw,
      category: catInfo.category,
      canonicalConcept: concept,
      contentType,
      targetUrlOrSlug: `/blog/${targetSlug}`,
      role,
      actionNeeded,
      searchIntent: catInfo.category.includes('Cooking') ? 'Kitchen Recipe Conversion' : (catInfo.category.includes('Currency') ? 'Forex Transaction / Travel' : 'Direct Numerical Calculation'),
      priority,
      internalToolLink: catInfo.toolLink,
      snippetStrategy: createSnippetStrategy(rawKw, catInfo.category)
    });
  });
});

console.log(`Generated strategy rows for all ${processedRows.length} keywords.`);

// 8. Generate CSV File
function escapeCsv(val) {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

const headers = [
  'Keyword',
  'Category',
  'Canonical_Topic_Cluster',
  'Content_Type',
  'Target_URL_or_Slug',
  'Role_in_Article',
  'Action_Recommendation',
  'Search_Intent',
  'SEO_Priority',
  'Recommended_Internal_Tool_Link',
  'Google_and_Bing_Rank1_Snippet_Strategy'
];

const csvLines = [headers.join(',')];

for (const row of processedRows) {
  csvLines.push([
    escapeCsv(row.keyword),
    escapeCsv(row.category),
    escapeCsv(row.canonicalConcept),
    escapeCsv(row.contentType),
    escapeCsv(row.targetUrlOrSlug),
    escapeCsv(row.role),
    escapeCsv(row.actionNeeded),
    escapeCsv(row.searchIntent),
    escapeCsv(row.priority),
    escapeCsv(row.internalToolLink),
    escapeCsv(row.snippetStrategy)
  ].join(','));
}

const outCsvPath = path.join(rootDir, 'omniconverter-keyword-strategy-plan.csv');
fs.writeFileSync(outCsvPath, csvLines.join('\n'), 'utf8');
console.log(`Successfully generated downloadable plan at: ${outCsvPath}`);

// Summary stats
const summary = {
  totalKeywords: processedRows.length,
  newPillarArticles: processedRows.filter(r => r.contentType === 'New High-Priority Blog Post').length,
  existingArticles: processedRows.filter(r => r.contentType === 'Existing Published Article').length,
  lsiSemanticVariants: processedRows.filter(r => r.contentType === 'Supporting LSI / Semantic Variant').length,
  consolidatedDuplicates: processedRows.filter(r => r.role === 'Consolidated Duplicate Query').length
};

console.log('\n=== STRATEGY EXECUTION SUMMARY ===');
console.table(summary);
