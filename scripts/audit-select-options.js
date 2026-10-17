const fs = require('fs');

const glob = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => dir + '/' + f);
};

const allFiles = [...glob('blog'), ...glob('es/blog'), ...glob('de/blog'), ...glob('pt/blog')];

let mismatchCount = 0;
let details = [];

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('id="liveToolInput"') || content.includes("id='liveToolInput'")) {
    // Check if both from and to units are selected with the same value or have broken selected attributes
    const fromMatch = content.match(/<select id="liveToolFromUnit"[\s\S]*?<\/select>/);
    const toMatch = content.match(/<select id="liveToolToUnit"[\s\S]*?<\/select>/);

    if (fromMatch && toMatch) {
      const fromSelected = fromMatch[0].match(/<option\s+value="([^"]+)"[^>]*selected[^>]*>/i);
      const toSelected = toMatch[0].match(/<option\s+value="([^"]+)"[^>]*selected[^>]*>/i);

      const fromVal = fromSelected ? fromSelected[1] : null;
      const toVal = toSelected ? toSelected[1] : null;

      const hasScript = content.includes('function calculate()');

      // Also check whether the result in HTML is '--'
      const hasDash = content.includes('id="liveToolResultVal"') && content.includes('>--<');

      if (!hasScript || hasDash || fromVal === toVal || !fromVal || !toVal) {
        mismatchCount++;
        details.push({
          file,
          fromVal,
          toVal,
          hasScript,
          hasDash
        });
      }
    }
  }
});

console.log('Total issues found:', mismatchCount);
console.log(JSON.stringify(details, null, 2));
