const fs = require('fs');
const path = require('path');

const esPath = 'd:/Temperater Converter/es/blog/100-usd-a-aud.html';
let content = fs.readFileSync(esPath, 'utf8');

// Replace all alternate hreflang links with the correct cluster
const targetGroup = `<link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk/blog/100-usd-to-aud">
  <link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk/es/blog/100-usd-a-aud">
  <link rel="alternate" hreflang="de" href="https://www.omniconverter.co.uk/de/blog/100-usd-in-aud">
  <link rel="alternate" hreflang="pt" href="https://www.omniconverter.co.uk/pt/blog/100-usd-para-aud">
  <link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk/blog/100-usd-to-aud">`;

// Remove all current hreflang tags in this file
content = content.replace(/<link[^>]+hreflang=[^>]+>\r?\n?/gi, '');

// Re-inject after canonical tag
content = content.replace(
  '<link rel="canonical" href="https://www.omniconverter.co.uk/es/blog/100-usd-a-aud">',
  `<link rel="canonical" href="https://www.omniconverter.co.uk/es/blog/100-usd-a-aud">\n  ${targetGroup}`
);

fs.writeFileSync(esPath, content, 'utf8');
console.log('es/blog/100-usd-a-aud.html cleanly updated with canonical cluster!');
