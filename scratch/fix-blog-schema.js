/**
 * fix-blog-schema.js
 * Upgrades JSON-LD on all 87 EN blog articles to BlogPosting @graph format.
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join('.', 'blog');
const TODAY = '2026-11-03';

function stripJsonLd(html) {
  return html.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '');
}

function insertBeforeHead(html, block) {
  return html.replace(/<\/head>/i, block + '\n</head>');
}

function fixFooter(html) {
  return html.replace(/OmniConverter Suite/g, 'OmniConverter');
}

const ORG_ID = 'https://www.omniconverter.co.uk/#organization';
const WEBSITE_ID = 'https://www.omniconverter.co.uk/#website';

const ORG_BLOCK = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "${ORG_ID}",
        "name": "OmniConverter",
        "url": "https://www.omniconverter.co.uk/",
        "logo": { "@type": "ImageObject", "url": "https://www.omniconverter.co.uk/logo.png", "width": 512, "height": 512 }
      },
      {
        "@type": "WebSite",
        "@id": "${WEBSITE_ID}",
        "url": "https://www.omniconverter.co.uk/",
        "name": "OmniConverter",
        "publisher": { "@id": "${ORG_ID}" },
        "inLanguage": "en-GB"
      }
    ]
  }
  </script>`;

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
let count = 0;

files.forEach(file => {
  const filePath = path.join(BLOG_DIR, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Extract existing meta
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const dateMatch = html.match(/"datePublished"\s*:\s*"([^"]+)"/i) ||
                    html.match(/article:published_time["']\s+content=["']([^"']+T)/i) ||
                    html.match(/article:published_time["']\s+content=["']([^"']+)["']/i);

  const slug = file.replace('.html', '');
  const fullUrl = `https://www.omniconverter.co.uk/blog/${slug}`;
  const rawTitle = titleMatch ? titleMatch[1].replace(/ \| OmniConverter$/, '').replace(/&amp;/g, '&').trim() : slug;
  const headline = rawTitle.substring(0, 110);
  const description = descMatch ? descMatch[1].replace(/&amp;/g, '&').trim() : '';
  const datePublished = dateMatch ? dateMatch[1].substring(0, 10) : '2026-09-01';

  html = stripJsonLd(html);
  html = fixFooter(html);

  const schema = `${ORG_BLOCK}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": "${fullUrl}#article",
        "mainEntityOfPage": { "@id": "${fullUrl}#webpage" },
        "headline": ${JSON.stringify(headline)},
        "description": ${JSON.stringify(description)},
        "image": "https://www.omniconverter.co.uk/logo.png",
        "datePublished": "${datePublished}",
        "dateModified": "${TODAY}",
        "author": {
          "@type": "Organization",
          "@id": "${ORG_ID}",
          "name": "OmniConverter Editorial Team",
          "url": "https://www.omniconverter.co.uk/about"
        },
        "publisher": { "@id": "${ORG_ID}" },
        "inLanguage": "en-GB"
      },
      {
        "@type": "WebPage",
        "@id": "${fullUrl}#webpage",
        "url": "${fullUrl}",
        "isPartOf": { "@id": "${WEBSITE_ID}" },
        "inLanguage": "en-GB",
        "dateModified": "${TODAY}"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "${fullUrl}#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.omniconverter.co.uk/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.omniconverter.co.uk/blog" },
          { "@type": "ListItem", "position": 3, "name": ${JSON.stringify(headline)} }
        ]
      }
    ]
  }
  </script>`;

  html = insertBeforeHead(html, schema);
  fs.writeFileSync(filePath, html, 'utf8');
  count++;
});

console.log(`✅ Blog schema fix complete. Updated ${count} articles.`);
