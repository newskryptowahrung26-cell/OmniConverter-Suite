const fs = require('fs');
const auditSrc = fs.readFileSync('scripts/seo-audit.js', 'utf8');
const calcTypeFn = auditSrc.match(/function calcType[\s\S]*?\n\}/);
console.log('--- calcType definition ---');
console.log(calcTypeFn ? calcTypeFn[0] : 'not found');

const blogSrc = fs.readFileSync('blog/180lbs-in-stone.html', 'utf8');
const calcIdx = blogSrc.indexOf('liveToolFromUnit');
console.log('\n--- liveToolFromUnit in blog/180lbs-in-stone.html ---');
if (calcIdx !== -1) {
  console.log(blogSrc.substring(calcIdx - 200, calcIdx + 300));
} else {
  console.log('not found in 180lbs-in-stone.html');
}
