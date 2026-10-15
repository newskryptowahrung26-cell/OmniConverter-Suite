const fs = require('fs');

['es', 'de', 'pt'].forEach(lang => {
  const dir = lang + '/blog';
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  let withRev = 0, withCalc = 0, withArticle = 0;
  files.forEach(f => {
    const c = fs.readFileSync(dir + '/' + f, 'utf8');
    if (c.includes('Reviewed by:') || c.includes('Revisado por:') || c.includes('Geprüft von:') || c.includes('Revisado por:')) withRev++;
    if (c.includes('liveToolInput')) withCalc++;
    if (c.includes('"@type": "Article"')) withArticle++;
  });
  console.log(lang, 'total:', files.length, '| withReviewer:', withRev, '| withCalc:', withCalc, '| withArticle:', withArticle);
});
