const fs = require('fs');

const files = fs.readdirSync('blog').filter(f => f.endsWith('.html'));
console.log('Total English blog articles:', files.length);

let withAuthor = 0;
let withReviewer = 0;
let withCalc = 0;
let withArticleSchema = 0;
let withFaqSchema = 0;
let missingCalc = [];
let missingReviewer = [];
let missingArticleSchema = [];

files.forEach(f => {
  const content = fs.readFileSync('blog/' + f, 'utf8');
  const hasReviewer = content.includes('Reviewed by:');
  const hasCalc = content.includes('liveToolInput') || content.includes('live-tool') || content.includes('converter-card');
  const hasArticle = content.includes('"@type": "Article"');
  const hasFaq = content.includes('"@type": "FAQPage"');

  if (hasReviewer) withReviewer++; else missingReviewer.push(f);
  if (hasCalc) withCalc++; else missingCalc.push(f);
  if (hasArticle) withArticleSchema++; else missingArticleSchema.push(f);
  if (hasFaq) withFaqSchema++;
});

console.log('Results:');
console.log('- Total files:', files.length);
console.log('- With Reviewer & Trust block:', withReviewer, '| Missing:', missingReviewer.length);
console.log('- With In-Page Interactive Calculator:', withCalc, '| Missing:', missingCalc.length);
console.log('- With Article Schema:', withArticleSchema, '| Missing:', missingArticleSchema.length);
console.log('- With FAQ Schema:', withFaqSchema);
