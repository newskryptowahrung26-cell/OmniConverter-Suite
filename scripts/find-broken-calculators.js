const fs = require('fs');

const glob = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => dir + '/' + f);
};

const allFiles = [...glob('blog'), ...glob('es/blog'), ...glob('de/blog'), ...glob('pt/blog')];

let filesWithoutScript = [];
let filesWithDash = [];
let filesWithOtherIssues = [];

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('id="liveToolInput"') || content.includes("id='liveToolInput'")) {
    const hasScript = content.includes('function calculate()');
    if (!hasScript) {
      filesWithoutScript.push(file);
    }
    if (content.includes('>--<')) {
      filesWithDash.push(file);
    }
  }
});

console.log('Files missing calculate() script:', filesWithoutScript);
console.log('Files with >--<:', filesWithDash);
