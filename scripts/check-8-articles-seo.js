const fs = require('fs');

const slugs = [
  '70kg-in-stone',
  '4-meters-to-feet',
  '1-bigha-in-square-feet',
  '5-usd-to-aud',
  'convert-file-type-to-pdf',
  'convert-pdf-form',
  '1-aud-to-vnd',
  '100-fahrenheit-to-celsius'
];

slugs.forEach(s => {
  const html = fs.readFileSync('blog/' + s + '.html', 'utf8');
  const hasArticle = html.includes('"@type": "Article"') || html.includes('"@type":"Article"');
  const hasFaq = html.includes('"@type": "FAQPage"') || html.includes('"@type":"FAQPage"');
  const hasBreadcrumb = html.includes('BreadcrumbList');
  const hasToolWidget = html.includes('class="calculator-container"') || html.includes('id="interactive-calculator"') || html.includes('calc-');
  const hasInteractiveBox = html.includes('Relevant Interactive Converter Callout Box') || html.includes('tab-btn active');
  
  // Find in-content internal links
  const art = (html.match(/<article[\s\S]*?<\/article>/i) || [''])[0];
  const pTags = art.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
  const inContentLinks = [];
  pTags.forEach(p => {
    const m = [...p.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
    m.forEach(match => inContentLinks.push(`${match[2]} -> ${match[1]}`));
  });

  console.log(`\n=== ${s} ===`);
  console.log(`Article Schema: ${hasArticle} | FAQ Schema: ${hasFaq} | Breadcrumb: ${hasBreadcrumb}`);
  console.log(`In-Content Links (${inContentLinks.length}):`, inContentLinks);
});
