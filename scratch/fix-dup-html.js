const fs = require('fs');
const h = fs.readFileSync('blog/700-gbp-to-aud.html', 'utf8');
const closingHtmls = [...h.matchAll(/<\/html>/gi)];
const closingBodies = [...h.matchAll(/<\/body>/gi)];

console.log('Closing html matches:', closingHtmls.length);
closingHtmls.forEach((m, i) => console.log(` html ${i} at index ${m.index}`));

console.log('Closing body matches:', closingBodies.length);
closingBodies.forEach((m, i) => console.log(` body ${i} at index ${m.index}`));

// If there are multiple, keep only up to the first valid one or deduplicate
if (closingHtmls.length > 1) {
  const firstHtmlEnd = closingHtmls[0].index + 7;
  const clean = h.substring(0, firstHtmlEnd);
  fs.writeFileSync('blog/700-gbp-to-aud.html', clean.trim() + '\n', 'utf8');
  console.log('Truncated 700-gbp-to-aud.html after first </html>');
}
