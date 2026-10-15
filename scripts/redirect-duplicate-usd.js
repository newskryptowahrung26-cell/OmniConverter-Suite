const fs = require('fs');

// Canonicalize 2000-usd-to-gbp.html
(function redirectDuplicate() {
  let c = fs.readFileSync('blog/2000-usd-to-gbp.html', 'utf8');
  c = c.replace(
    '<link rel="canonical" href="https://www.omniconverter.co.uk/blog/2000-usd-to-gbp">',
    '<link rel="canonical" href="https://www.omniconverter.co.uk/blog/2000-dollars-in-pounds">\n  <meta http-equiv="refresh" content="0; url=https://www.omniconverter.co.uk/blog/2000-dollars-in-pounds">'
  );
  fs.writeFileSync('blog/2000-usd-to-gbp.html', c, 'utf8');
  console.log('2000-usd-to-gbp.html canonicalized and redirected.');
})();
