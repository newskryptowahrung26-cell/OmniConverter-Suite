const fs = require('fs');
// Truncate at first </html> — position 16416 + 7 chars
let h = fs.readFileSync('blog/700-gbp-to-aud.html', 'utf8');
h = h.substring(0, 16416 + 7); // include </html> itself
fs.writeFileSync('blog/700-gbp-to-aud.html', h, 'utf8');
console.log('Fixed: blog/700-gbp-to-aud.html truncated. New length:', h.length);
