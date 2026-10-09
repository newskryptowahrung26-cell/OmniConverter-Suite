const fs = require('fs');

const faqsByFile = {
  'weight-mass.html': [
    {
      q: "How do I convert stone to kg?",
      a: "Multiply the number of stones by 6.35029 to calculate the total mass in kilograms."
    },
    {
      q: "What is the difference between troy ounces and standard avoirdupois ounces?",
      a: "Standard avoirdupois ounces (used for grocery weights) equal 28.35 grams, whereas troy ounces (used for precious metals like gold and silver) equal 31.1035 grams."
    }
  ],
  'volume-capacity.html': [
    {
      q: "How many mL in a cup?",
      a: "A standard US customary cup equals 236.588 mL, while a standard metric cup equals 250 mL."
    },
    {
      q: "Why is a UK gallon different from a US gallon?",
      a: "The US gallon is based on the historic 231 cubic inch wine gallon, whereas the UK Imperial gallon is based on 10 pounds of water volume."
    }
  ],
  'area.html': [
    {
      q: "How many square feet in an acre?",
      a: "One acre equals exactly 43,560 square feet."
    },
    {
      q: "How do I convert sq ft to sq meters?",
      a: "Multiply square feet by 0.092903 to calculate square meters."
    }
  ],
  'speed.html': [
    {
      q: "How do I convert mph to km/h?",
      a: "Multiply miles per hour by 1.60934 to get kilometers per hour."
    },
    {
      q: "What is a knot?",
      a: "A knot is a unit of speed equal to one nautical mile per hour (1.852 km/h), used in maritime navigation and aviation."
    }
  ],
  'time-duration.html': [
    {
      q: "How many seconds are in a full day?",
      a: "A standard solar day contains exactly 86,400 seconds."
    },
    {
      q: "How do I convert hours into minutes?",
      a: "Multiply the total number of hours by 60."
    }
  ],
  'file-media.html': [
    {
      q: "Are my files uploaded to a server?",
      a: "No. OmniConverter processes all image and document conversions locally in your browser memory using HTML5 Canvas and Blob APIs."
    }
  ],
  'indian-units.html': [
    {
      q: "How many square feet are in 1 Bigha?",
      a: "In Uttar Pradesh and Bihar, 1 Pucca Bigha equals 27,225 sq ft. In Rajasthan it equals 17,424 sq ft, and in West Bengal 14,400 sq ft."
    },
    {
      q: "How many grams is 1 Tola of gold?",
      a: "Standard metric jewellers tola equals 10 grams, while the traditional British Indian tola equals 11.6638 grams."
    },
    {
      q: "How much is 1 Crore in Millions?",
      a: "1 Crore equals exactly 10 Million in the international numbering system (10,000,000)."
    }
  ]
};

let injectedCount = 0;

for (const [file, faqs] of Object.entries(faqsByFile)) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('"@type": "FAQPage"')) continue;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  const schemaScript = `\n  <!-- Schema.org FAQPage -->\n  <script type="application/ld+json">\n  ${JSON.stringify(faqSchema, null, 2).replace(/\n/g, '\n  ')}\n  </script>`;

  // Inject before </head>
  html = html.replace('</head>', schemaScript + '\n</head>');
  fs.writeFileSync(file, html, 'utf8');
  console.log(`Injected FAQPage schema into ${file}`);
  injectedCount++;
}

console.log(`Total FAQPage schemas injected: ${injectedCount}`);
