const fs = require('fs');

let c = fs.readFileSync('blog.html', 'utf8');
const tags = [
  '<link rel="alternate" hreflang="en" href="https://www.omniconverter.co.uk/blog">',
  '<link rel="alternate" hreflang="es" href="https://www.omniconverter.co.uk/es/blog">',
  '<link rel="alternate" hreflang="de" href="https://www.omniconverter.co.uk/de/blog">',
  '<link rel="alternate" hreflang="pt" href="https://www.omniconverter.co.uk/pt/blog">',
  '<link rel="alternate" hreflang="x-default" href="https://www.omniconverter.co.uk/blog">'
].join('\r\n  ');

if (!c.includes('hreflang="es" href="https://www.omniconverter.co.uk/es/blog"')) {
  c = c.replace('</head>', '  ' + tags + '\r\n</head>');
  fs.writeFileSync('blog.html', c, 'utf8');
  console.log('Successfully added hreflangs to blog.html');
}
