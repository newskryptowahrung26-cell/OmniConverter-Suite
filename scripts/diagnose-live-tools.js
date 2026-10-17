const fs = require('fs');

const glob = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => dir + '/' + f);
};

const allFiles = [...glob('blog'), ...glob('es/blog'), ...glob('de/blog'), ...glob('pt/blog')];

let countWithLiveTool = 0;
let results = [];

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('id="liveToolInput"') || content.includes("id='liveToolInput'")) {
    countWithLiveTool++;

    // check if it has a script tag with calculate()
    const hasScript = content.includes('function calculate()');
    const hasCalculateCall = content.includes('calculate();');
    const hasConvertedResultDash = content.includes('id="liveToolResultVal"') && content.includes('>--<');

    results.push({
      file,
      hasScript,
      hasCalculateCall,
      hasConvertedResultDash
    });
  }
});

console.log('Total files with liveToolInput:', countWithLiveTool);
const missingScript = results.filter(r => !r.hasScript);
console.log('Files missing script entirely:', missingScript.map(r => r.file));
const missingCall = results.filter(r => r.hasScript && !r.hasCalculateCall);
console.log('Files with script but missing calculate(); invocation:', missingCall.map(r => r.file));
const hasDash = results.filter(r => r.hasConvertedResultDash);
console.log('Files with initial -- in HTML:', hasDash.length);
