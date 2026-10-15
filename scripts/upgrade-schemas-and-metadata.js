const fs = require('fs');

const targets = [
  {
    slug: 'convert-file-type-to-pdf',
    headline: 'Convert File Type To PDF: Formats, Methodologies & Complete Guide',
    desc: 'Comprehensive technical guide on how to convert Word, Excel, PowerPoint, JPG, PNG, and HTML file types into ISO-compliant PDFs.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      {
        q: 'Can I convert password-protected or encrypted files into a PDF?',
        a: 'Yes, but you must supply the correct decryption password when opening the source file prior to conversion. The conversion engine requires full read access to parse content streams before writing them into a new encrypted or unencrypted PDF container.'
      },
      {
        q: 'What is the difference between standard PDF and PDF/A archiving format?',
        a: 'Standard PDF allows external links and dynamic elements, whereas PDF/A (ISO 19005) prohibits device-dependent features, audio/video, and external font links to guarantee exact visual preservation over decades of digital storage.'
      },
      {
        q: 'How does font embedding affect the converted PDF file size?',
        a: 'Full font embedding bundles the entire font character map into the file, increasing file size. Using subset font embedding includes only characters actually used in the document, keeping file size small while ensuring zero typography distortion across foreign devices.'
      }
    ]
  },
  {
    slug: 'convert-pdf-form',
    headline: 'Convert PDF Form: Static Documents to Fillable & Digital Formats',
    desc: 'Complete guide to converting static, scanned, and flat PDF forms into interactive fillable forms and spreadsheet data pipelines.',
    image: 'https://images.unsplash.com/photo-1631651693480-97f1132e333d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY4OTMyfDB8MXxzZWFyY2h8MXx8Y29udmVydCUyMHBkZiUyMGZvcm18ZW58MHx8fHwxNzg5OTAxMzE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    faqs: [
      {
        q: 'How do I convert a flat, non-interactive PDF into a fillable form?',
        a: 'Open the document in an authoring suite like Adobe Acrobat, Foxit, or Nitro, activate the Prepare Form tool, and allow automated OCR and form field detection to overlay text boxes, radio buttons, and checkboxes.'
      },
      {
        q: 'How can form responses submitted in PDF format be exported into Excel?',
        a: 'You can extract form data by exporting values as CSV, XML, or FDF (Forms Data Format) files, or utilize batch processing scripts to aggregate multiple submitted forms into a single structured table.'
      },
      {
        q: 'What is the difference between AcroForms and XFA forms?',
        a: 'AcroForms are traditional, widely supported interactive PDF forms compatible with virtually all modern web browsers and mobile readers. XFA (XML Forms Architecture) forms feature dynamic reflowable layouts but require specialized desktop Adobe viewers to open properly.'
      }
    ]
  },
  {
    slug: '1-aud-to-vnd',
    headline: '1 AUD to VND: Live Exchange Rates, Conversion Math & Travel Guide',
    desc: 'Convert 1 AUD to Vietnamese Dong (VND) with live mid-market exchange rates, bank transfer fees analysis, ATM withdrawal advice, and conversion tables.',
    image: 'https://images.unsplash.com/photo-1608731433809-149763562571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY4OTMyfDB8MXxzZWFyY2h8MXx8MSUyMGF1ZCUyMHRvJTIwdm5kfGVufDB8fHx8MTc4OTY0NzQ5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    faqs: [
      {
        q: 'Why does the exchange rate for 1 AUD to VND vary between banks and online providers?',
        a: 'Financial institutions add a profit margin (spread) to the interbank mid-market rate. Online currency transfer specialists maintain lower operational overheads, allowing them to offer exchange rates 2% to 4% cheaper than traditional retail banks or airport booths.'
      },
      {
        q: 'Is it better to convert AUD to VND before traveling to Vietnam or after arrival?',
        a: 'It is generally better to exchange currency after arriving in Vietnam or withdraw cash directly using a low-fee travel card at local ATMs. Australian banks hold limited Dong inventory and apply high markups.'
      },
      {
        q: 'Can I pay with Australian Dollars directly in shops and hotels in Vietnam?',
        a: 'No, Australian Dollars are not accepted for daily consumer transactions. Under Vietnamese monetary law, transactions, retail prices, and domestic goods must strictly be settled in Vietnamese Dong (VND).'
      }
    ]
  }
];

targets.forEach(t => {
  const filePath = `blog/${t.slug}.html`;
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Build complete Schema.org array (Article, FAQPage, BreadcrumbList)
  const fullSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": t.headline,
      "description": t.desc,
      "url": `https://www.omniconverter.co.uk/blog/${t.slug}`,
      "image": [t.image],
      "author": { "@type": "Organization", "name": "OmniConverter Editorial Team" },
      "publisher": {
        "@type": "Organization",
        "name": "OmniConverter",
        "logo": { "@type": "ImageObject", "url": "https://www.omniconverter.co.uk/logo.png" }
      },
      "datePublished": "2026-10-15",
      "dateModified": "2026-10-15"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": t.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.omniconverter.co.uk/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.omniconverter.co.uk/blog" },
        { "@type": "ListItem", "position": 3, "name": t.headline, "item": `https://www.omniconverter.co.uk/blog/${t.slug}` }
      ]
    }
  ];

  // Remove old BreadcrumbList script if existing
  html = html.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');

  // Inject fresh fullSchemas before </head>
  const scriptTag = `<script type="application/ld+json">\n${JSON.stringify(fullSchemas, null, 2)}\n</script>\n</head>`;
  html = html.replace('</head>', scriptTag);

  // Upgrade meta description
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"/i, `<meta name="description" content="${t.desc}"`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"/i, `<meta property="og:description" content="${t.desc}"`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"/i, `<meta name="twitter:description" content="${t.desc}"`);

  // Update date published meta tag
  html = html.replace(/<meta\s+name="article:published_time"\s+content="[^"]*"/i, `<meta name="article:published_time" content="2026-10-15">`);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`[OK] Upgraded Schema & Metadata for: ${t.slug}`);
});
