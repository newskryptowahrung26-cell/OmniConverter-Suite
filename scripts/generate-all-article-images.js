/**
 * Master Batch Generator & Image Updater for All Multilingual Blog Articles
 * Generates 100% unique, title-specific 1200x630 PNG hero images for every article
 * across EN, ES, DE, and PT, and updates ONLY the image URLs in each article HTML.
 */

const fs = require('fs');
const path = require('path');
const { generateArticleHeroImage } = require('./blog-image-generator');

async function main() {
  console.log('=== GENERATING UNIQUE TITLE-SPECIFIC HERO IMAGES FOR ALL ARTICLES ===\n');

  // 1. Read blog-data.js to get chronological order of English slugs so adjacent cards get distinct themes
  const enOrderMap = new Map();
  if (fs.existsSync('blog-data.js')) {
    const rawData = fs.readFileSync('blog-data.js', 'utf8');
    const m = rawData.match(/const BLOG_POSTS\s*=\s*(\[[\s\S]*?\]);/);
    if (m) {
      const list = eval('(' + m[1] + ')');
      list.forEach((item, idx) => {
        enOrderMap.set(item.id, idx);
      });
    }
  }

  const langs = ['en', 'es', 'de', 'pt'];
  let totalGenerated = 0;
  let totalHtmlUpdated = 0;

  for (const lang of langs) {
    const dir = lang === 'en' ? 'blog' : `${lang}/blog`;
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort();
    let langCount = 0;

    for (const file of files) {
      const filePath = path.join(dir, file);
      let html = fs.readFileSync(filePath, 'utf8');

      // Skip redirect stubs
      if (html.includes('http-equiv="refresh"')) continue;

      const localSlug = file.replace('.html', '');
      const hreflangEnMatch = html.match(/hreflang="en"\s+href="https:\/\/www\.omniconverter\.co\.uk\/blog\/([^"]+)"/i);
      const enSlug = hreflangEnMatch ? hreflangEnMatch[1].replace(/\.html$/, '') : localSlug;

      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const h1Text = h1Match
        ? h1Match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim()
        : localSlug.replace(/-/g, ' ');

      const themeIdx = enOrderMap.has(enSlug) ? enOrderMap.get(enSlug) : totalGenerated;
      const relImgPath = `/assets/blog/${lang}/${localSlug}.png?v=2`;
      const absImgUrl = `https://www.omniconverter.co.uk${relImgPath}`;
      const diskImgPath = path.join(__dirname, '..', 'assets', 'blog', lang, `${localSlug}.png`);

      await generateArticleHeroImage({
        enSlug,
        localSlug,
        title: h1Text,
        lang,
        outFile: diskImgPath,
        themeIndexOverride: themeIdx
      });
      totalGenerated++;
      langCount++;

      // Strictly update ONLY the image references in the HTML
      const origHtml = html;

      // 1. Update og:image
      if (/<meta\s+property="og:image"\s+content="[^"]*"/i.test(html)) {
        html = html.replace(/<meta\s+property="og:image"\s+content="[^"]*"/i, `<meta property="og:image" content="${absImgUrl}"`);
      }

      // 2. Update twitter:image
      if (/<meta\s+name="twitter:image"\s+content="[^"]*"/i.test(html)) {
        html = html.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"/i, `<meta name="twitter:image" content="${absImgUrl}"`);
      }

      // 3. Update JSON-LD Article image (either array or string) without touching publisher logo
      html = html.replace(/"image":\s*\[\s*"[^"]*"\s*\]/g, `"image": [\n      "${absImgUrl}"\n    ]`);
      html = html.replace(/"image":\s*"[^"]*"/g, `"image": "${absImgUrl}"`);

      // 4. Update hero <img> inside <article>
      html = html.replace(/(<article[\s\S]*?<img\s+[^>]*?src=")([^"]+)(")/i, `$1${relImgPath}$3`);

      if (html !== origHtml) {
        fs.writeFileSync(filePath, html, 'utf8');
        totalHtmlUpdated++;
      }
    }

    console.log(`[OK] ${lang.toUpperCase()}: Generated ${langCount} unique 1200x630 PNG images in assets/blog/${lang}/`);
  }

  console.log(`\n=== COMPLETE: Generated ${totalGenerated} unique PNG images & updated ${totalHtmlUpdated} article HTML files ===`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
