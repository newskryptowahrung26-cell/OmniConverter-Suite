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

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

const existingNormMap = new Map();
existingSlugs.forEach(slug => {
  existingNormMap.set(slug, normalize(slug.replace(/-/g, ' ')));
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

// 3. Classification logic
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

  // Default Home Suite
  return {
    category: 'Universal Multi-Unit Calculator',
    toolLink: 'https://www.omniconverter.co.uk/',
    toolSlug: ''
  };
}

// 4. Clean Slug Generator
function createSlug(kw) {
  let s = kw.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  // Truncate to reasonable slug length if too long
  const parts = s.split('-');
  if (parts.length > 7) {
    s = parts.slice(0, 7).join('-');
  }
  return s;
}

// 5. Generate Target Title
function createTargetTitle(kw, category) {
  // Title case helper
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

// 7. Process Keywords and build clusters
const existingKeywordsList = [];
const newKeywordsList = [];
const clusterMap = new Map(); // slug -> { primaryKw, secondaryKws: [] }

// Deduplicate raw lines while keeping casing
const uniqueKws = [...new Set(rawLines)];

for (const rawKw of uniqueKws) {
  const normKw = normalize(rawKw);
  const catInfo = classifyCategory(rawKw);

  // Check matching with existing articles
  let matchedExistingSlug = null;
  let matchType = '';

  for (const [slug, normSlug] of existingNormMap.entries()) {
    if (normKw === normSlug) {
      matchedExistingSlug = slug;
      matchType = 'Direct Keyword Match';
      break;
    } else if (normKw.includes(normSlug) || normSlug.includes(normKw)) {
      matchedExistingSlug = slug;
      matchType = 'LSI / Semantic Extension';
      break;
    }
  }

  if (matchedExistingSlug) {
    existingKeywordsList.push({
      keyword: rawKw,
      category: catInfo.category,
      contentType: 'Existing Published Article',
      targetUrlOrSlug: `/blog/${matchedExistingSlug}`,
      role: matchType === 'Direct Keyword Match' ? 'Primary Keyword (Already Published)' : 'LSI / Semantic Support Keyword',
      actionNeeded: matchType === 'Direct Keyword Match'
        ? 'Maintain Position #1: verify internal links and FAQ schema'
        : `Inject into /blog/${matchedExistingSlug} as secondary H2/H3 or FAQ to rank for this long-tail variant`,
      searchIntent: 'Informational / Calculation Query',
      priority: 'P1 - High Traffic Maintenance',
      internalToolLink: catInfo.toolLink,
      snippetStrategy: createSnippetStrategy(rawKw, catInfo.category)
    });
  } else {
    // New keyword: cluster by slug root
    const slug = createSlug(rawKw);
    newKeywordsList.push({
      keyword: rawKw,
      category: catInfo.category,
      slug,
      catInfo
    });
  }
}

// Group new keywords into article clusters
const newArticlesPlan = [];
const processedSlugs = new Set();

// Determine Priority (P1, P2, P3) based on query pattern
function determinePriority(kw) {
  const l = kw.toLowerCase();
  // High volume exact conversion queries
  if (/^\d+\s*(cup|cups|stone|kg|lbs|pound|pounds|dollar|dollars|aud|usd|gbp|eur|f|c|meter|meters|quart|gallon|ounce)\b/.test(l)) {
    return 'P1 - High Volume / Quick Win (Low KD)';
  }
  if (/to|in|convert|calculator|how many|difference/.test(l)) {
    return 'P2 - Core Cluster Authority';
  }
  return 'P3 - Long-Tail Semantic Extension';
}

for (const item of newKeywordsList) {
  const slug = item.slug;
  const kw = item.keyword;
  const cat = item.category;

  const isPrimary = !processedSlugs.has(slug);
  processedSlugs.add(slug);

  const priority = determinePriority(kw);

  newArticlesPlan.push({
    keyword: kw,
    category: cat,
    contentType: isPrimary ? 'New High-Priority Blog Post' : 'Supporting LSI / Variant',
    targetUrlOrSlug: `/blog/${slug}`,
    role: isPrimary ? 'Primary Target Keyword' : 'Secondary LSI Keyword',
    actionNeeded: isPrimary
      ? `Publish new comprehensive guide with calculator embed and schema: ${createTargetTitle(kw, cat)}`
      : `Include as H2 subheading or FAQ question inside /blog/${slug}`,
    searchIntent: cat.includes('Cooking') ? 'Kitchen Recipe Conversion' : (cat.includes('Currency') ? 'Forex Transaction / Travel' : 'Direct Numerical Calculation'),
    priority,
    internalToolLink: item.catInfo.toolLink,
    snippetStrategy: createSnippetStrategy(kw, cat)
  });
}

const allRows = [...existingKeywordsList, ...newArticlesPlan];

console.log(`Classified:
  - Existing Blog LSI/Matches: ${existingKeywordsList.length}
  - New Blog Articles & Clusters: ${newArticlesPlan.length}
  - Total Plan Rows: ${allRows.length}
`);

// 8. Generate CSV File
function escapeCsv(val) {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

const headers = [
  'Keyword',
  'Category',
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

for (const row of allRows) {
  csvLines.push([
    escapeCsv(row.keyword),
    escapeCsv(row.category),
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

// 9. Output Category Summary
const categoryStats = {};
for (const row of allRows) {
  categoryStats[row.category] = (categoryStats[row.category] || 0) + 1;
}

console.log('\n=== STRATEGY BREAKDOWN BY CATEGORY ===');
console.table(categoryStats);
