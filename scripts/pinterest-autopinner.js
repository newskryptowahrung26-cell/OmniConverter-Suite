/**
 * Pinterest Auto-Pinner for OmniConverter Blog
 * =============================================
 * Automatically pins all blog articles to Pinterest boards.
 *
 * SETUP (one-time):
 * 1. Go to https://developers.pinterest.com/ → Create App
 * 2. Get Access Token with boards:read, boards:write, pins:read, pins:write scope
 * 3. Create boards on Pinterest for each category
 * 4. Fill in PINTEREST_CONFIG below
 *
 * USAGE:
 *   node scripts/pinterest-autopinner.js          ← pin all unpinned articles
 *   node scripts/pinterest-autopinner.js --dry    ← dry run (no actual pins)
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

// ═══════════════════════════════════════════════════════════
// 🔧 FILL THESE IN AFTER CREATING PINTEREST APP
// ═══════════════════════════════════════════════════════════
const PINTEREST_CONFIG = {
  accessToken: process.env.PINTEREST_ACCESS_TOKEN || 'PASTE_YOUR_TOKEN_HERE',

  // Board IDs — get from: https://api.pinterest.com/v5/boards (after auth)
  boards: {
    currency:    process.env.PINTEREST_BOARD_CURRENCY    || 'BOARD_ID_CURRENCY',
    temperature: process.env.PINTEREST_BOARD_TEMP        || 'BOARD_ID_TEMPERATURE',
    weight:      process.env.PINTEREST_BOARD_WEIGHT      || 'BOARD_ID_WEIGHT',
    kitchen:     process.env.PINTEREST_BOARD_KITCHEN     || 'BOARD_ID_KITCHEN',
    length:      process.env.PINTEREST_BOARD_LENGTH      || 'BOARD_ID_LENGTH',
    general:     process.env.PINTEREST_BOARD_GENERAL     || 'BOARD_ID_GENERAL',
  }
};
// ═══════════════════════════════════════════════════════════

const BASE_URL  = 'https://www.omniconverter.co.uk';
const DRY_RUN   = process.argv.includes('--dry');
const STATE_FILE = path.join(__dirname, '..', '.pinterest-pinned.json');

// Load already-pinned slugs to avoid duplicates
function loadPinnedState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch { return {}; }
}
function savePinnedState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// Detect board from article slug/type
function getBoardId(enSlug) {
  const s = enSlug.toLowerCase();
  if (/(usd|gbp|aud|eur|inr|krw|jpy|vnd|try|idr|currency|forex|lakh|won|rupiah|lira)/.test(s)) return PINTEREST_CONFIG.boards.currency;
  if (/(celsius|fahrenheit|temperature)/.test(s)) return PINTEREST_CONFIG.boards.temperature;
  if (/(kg|lbs|pounds|stone|weight|tola|grams)/.test(s)) return PINTEREST_CONFIG.boards.weight;
  if (/(cup|ml|gallon|litre|tsp|ounce|milliliter|kitchen|baking)/.test(s)) return PINTEREST_CONFIG.boards.kitchen;
  if (/(meter|feet|inch|km|miles|length|bigha|gaj|guntha)/.test(s)) return PINTEREST_CONFIG.boards.length;
  return PINTEREST_CONFIG.boards.general;
}

// Build a rich Pinterest pin description from the article's H1 and meta description
function buildPinDescription(h1, metaDesc, lang) {
  const suffix = {
    en: '✅ Free calculator + exact formulas → omniconverter.co.uk',
    es: '✅ Calculadora gratuita + fórmulas exactas → omniconverter.co.uk',
    de: '✅ Kostenloser Rechner + genaue Formeln → omniconverter.co.uk',
    pt: '✅ Calculadora gratuita + fórmulas exatas → omniconverter.co.uk',
  }[lang] || '✅ Free calculator → omniconverter.co.uk';

  return `${h1}\n\n${metaDesc}\n\n${suffix}`;
}

// Pinterest API v5 — Create Pin
function createPin(boardId, title, description, imageUrl, linkUrl) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      board_id: boardId,
      title: title.slice(0, 100),
      description: description.slice(0, 500),
      media_source: {
        source_type: 'image_url',
        url: imageUrl
      },
      link: linkUrl
    });

    const options = {
      hostname: 'api.pinterest.com',
      path: '/v5/pins',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINTEREST_CONFIG.accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log(`\n🎯 Pinterest Auto-Pinner${DRY_RUN ? ' (DRY RUN — no actual pins)' : ''}\n`);

  const pinnedState = loadPinnedState();
  const langs = [
    { lang: 'en', dir: 'blog',    urlPrefix: '/blog/' },
    { lang: 'es', dir: 'es/blog', urlPrefix: '/es/blog/' },
    { lang: 'de', dir: 'de/blog', urlPrefix: '/de/blog/' },
    { lang: 'pt', dir: 'pt/blog', urlPrefix: '/pt/blog/' },
  ];

  let totalPinned = 0;
  let totalSkipped = 0;

  for (const { lang, dir, urlPrefix } of langs) {
    const absDir = path.join(__dirname, '..', dir);
    if (!fs.existsSync(absDir)) continue;

    const files = fs.readdirSync(absDir).filter(f => f.endsWith('.html'));

    for (const file of files) {
      const filePath = path.join(absDir, file);
      const html = fs.readFileSync(filePath, 'utf8');
      if (html.includes('http-equiv="refresh"')) continue;

      const localSlug = file.replace('.html', '');
      const stateKey  = `${lang}:${localSlug}`;

      if (pinnedState[stateKey]) {
        totalSkipped++;
        continue;
      }

      // Extract hreflang EN slug
      const hreflangMatch = html.match(/hreflang="en"\s+href="https:\/\/www\.omniconverter\.co\.uk\/blog\/([^"]+)"/i);
      const enSlug = hreflangMatch ? hreflangMatch[1].replace(/\.html$/, '') : localSlug;

      // Extract H1
      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : localSlug.replace(/-/g, ' ');

      // Extract meta description
      const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
      const metaDesc  = descMatch ? descMatch[1] : h1;

      const imageUrl  = `${BASE_URL}/assets/blog/${lang}/${localSlug}.png`;
      const linkUrl   = `${BASE_URL}${urlPrefix}${localSlug}`;
      const boardId   = getBoardId(enSlug);
      const desc      = buildPinDescription(h1, metaDesc, lang);

      if (DRY_RUN) {
        console.log(`[DRY] ${lang.toUpperCase()} | "${h1.slice(0, 50)}" → Board: ${boardId}`);
        totalPinned++;
        continue;
      }

      // Rate limit: Pinterest allows ~100 pins/min; add small delay
      await new Promise(r => setTimeout(r, 700));

      const result = await createPin(boardId, h1, desc, imageUrl, linkUrl);

      if (result.status === 201) {
        pinnedState[stateKey] = { pinId: result.body.id, pinnedAt: new Date().toISOString() };
        savePinnedState(pinnedState);
        console.log(`✅ [${lang.toUpperCase()}] Pinned: "${h1.slice(0, 50)}"`);
        totalPinned++;
      } else {
        console.error(`❌ [${lang.toUpperCase()}] Failed (HTTP ${result.status}): "${h1.slice(0, 40)}"`, JSON.stringify(result.body).slice(0, 120));
      }
    }
  }

  console.log(`\n📌 Done! Pinned: ${totalPinned} | Skipped (already pinned): ${totalSkipped}`);
}

main().catch(err => { console.error(err); process.exit(1); });
