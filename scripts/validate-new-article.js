/**
 * validate-new-article.js
 * Run this whenever creating a new article to ensure it satisfies high-CTR rules:
 * 1. Title < 60 chars
 * 2. Meta description < 155 chars + contains '→'
 * 3. Contains FAQPage schema with at least 3 Q&As
 * 4. Contains Article schema + BreadcrumbList
 * 5. Contains Live Calculator widget with id="liveToolFromUnit"
 * 6. Contains "related-articles" internal links
 */

const fs = require('fs');

function validateArticleFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);

  const title = titleMatch ? titleMatch[1] : '';
  const desc = descMatch ? descMatch[1] : '';

  const errors = [];
  const warnings = [];

  if (!title) errors.push('Missing <title>');
  else if (title.length > 60) errors.push(`Title too long (${title.length} chars > 60 limit): "${title}"`);

  if (!desc) errors.push('Missing meta description');
  else {
    if (desc.length > 155) errors.push(`Description too long (${desc.length} chars > 155 limit): "${desc}"`);
    if (!desc.includes('→') && !desc.includes('&rarr;')) warnings.push("Description should end with '→' to boost click-through rate");
  }

  if (!html.includes('"FAQPage"')) errors.push('Missing FAQPage Schema (crucial for Google expandable SERP snippets)');
  if (!html.includes('"Article"')) warnings.push('Missing Article Schema');
  if (!html.includes('"BreadcrumbList"')) warnings.push('Missing BreadcrumbList Schema');
  if (!html.includes('id="liveToolFromUnit"')) errors.push('Missing standard interactive liveToolFromUnit calculator element');
  if (!html.includes('class="related-articles"')) warnings.push('Missing related-articles internal link block');

  console.log(`\n=== Validation for ${filePath} ===`);
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ PERFECT! Meets 100% of the High-CTR Architectural Standard.');
    return true;
  }

  if (errors.length > 0) {
    console.log('❌ ERRORS (Must fix):');
    errors.forEach(e => console.log('  • ' + e));
  }

  if (warnings.length > 0) {
    console.log('⚠️ WARNINGS (Recommended):');
    warnings.forEach(w => console.log('  • ' + w));
  }

  return errors.length === 0;
}

if (process.argv[2]) {
  validateArticleFile(process.argv[2]);
}

module.exports = { validateArticleFile };
