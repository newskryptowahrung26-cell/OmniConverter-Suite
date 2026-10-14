const fs = require('fs');
const path = require('path');

console.log('=== TEMPORARILY STRIPPING THIRD-PARTY AD UNITS FOR 100% CLEAN ADSENSE APPROVAL ===\n');

// 1. Remove High-CTR Action Cards with direct sponsored links
const actionCardRegex = /<!--\s*High-CTR Utility Action Bar\s*-->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi;
const actionCardClassRegex = /<div class="high-ctr-action-card"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi;

// 2. Remove Sponsored Direct Smartlink Boxes
const smartlinkBoxRegex = /<!--\s*Sponsored High-CTR Direct Link Banner\s*-->[\s\S]*?<\/div>/gi;
const smartlinkClassRegex = /<div class="sponsored-smartlink-box"[\s\S]*?<\/div>/gi;

// 3. Remove 728x90 Banner Ad Slots
const bannerSlotRegex = /<!--\s*High-CPM 728x90 Banner\s*-->[\s\S]*?<\/div>\s*<\/div>/gi;
const bannerClassRegex = /<div class="ad-banner-slot"[\s\S]*?<\/div>\s*<\/div>/gi;

// 4. Remove In-Content Native Ad Slots
const nativeSlotRegex = /<!--\s*(?:In-Content Native Ad Container|Recommended Sponsored Content)\s*-->[\s\S]*?<\/div>\s*<\/div>/gi;
const nativeClassRegex = /<div class="ad-native-slot"[\s\S]*?<\/div>\s*<\/div>/gi;

// 5. Remove Floating Sticky Utility Bars & Pills
const stickyBarRegex = /<!--\s*Floating High-CTR Utility Pill\s*-->[\s\S]*?<\/aside>/gi;
const stickyBarIdRegex = /<aside id="stickyUtilityBar"[\s\S]*?<\/aside>/gi;
const stickyPillRegex = /<!--\s*Mobile Sticky High-CTR Utility Pill\s*-->[\s\S]*?<\/div>\s*<\/div>/gi;
const stickyPillClassRegex = /<div class="sticky-utility-pill"[\s\S]*?<\/div>\s*<\/div>/gi;

// 6. Remove Defer Ad Network Loader Script
const deferredAdScriptRegex = /<!--\s*Defer Ad Network Global Monetizers[\s\S]*?<\/script>/gi;

let cleanedFiles = 0;

function cleanDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!['.git', 'node_modules', '.gemini'].includes(item)) cleanDir(full);
    } else if (item.endsWith('.html')) {
      let content = fs.readFileSync(full, 'utf8');
      const orig = content;

      content = content.replace(actionCardRegex, '');
      content = content.replace(actionCardClassRegex, '');
      content = content.replace(smartlinkBoxRegex, '');
      content = content.replace(smartlinkClassRegex, '');
      content = content.replace(bannerSlotRegex, '');
      content = content.replace(bannerClassRegex, '');
      content = content.replace(nativeSlotRegex, '');
      content = content.replace(nativeClassRegex, '');
      content = content.replace(stickyBarRegex, '');
      content = content.replace(stickyBarIdRegex, '');
      content = content.replace(stickyPillRegex, '');
      content = content.replace(stickyPillClassRegex, '');
      content = content.replace(deferredAdScriptRegex, '');

      // Also clean any remaining profitableratecpmnetwork or highrevenueformat occurrences
      if (content.includes('profitableratecpmnetwork.com') || content.includes('highrevenueformat.com') || content.includes('2ca98c99e53d3a8c6988fb21535d63d9')) {
        content = content.replace(/<script[^>]*src="https:\/\/[^"]*(?:profitableratecpmnetwork|highrevenueformat)[^"]*"[^>]*><\/script>/gi, '');
        content = content.replace(/<a[^>]*href="https:\/\/[^"]*profitableratecpmnetwork[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');
      }

      if (content !== orig) {
        fs.writeFileSync(full, content, 'utf8');
        cleanedFiles++;
      }
    }
  }
}

cleanDir('.');
console.log(`[OK] Successfully cleaned third-party ads from ${cleanedFiles} HTML files!`);
