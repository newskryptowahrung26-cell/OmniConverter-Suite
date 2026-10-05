const fs = require('fs');
const path = require('path');

function getAllHtml(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'scratch') res = res.concat(getAllHtml(fp));
    } else if (f.endsWith('.html')) res.push(fp);
  }
  return res;
}

const files = getAllHtml('.');
const invalidApps = [];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const matches = [...c.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  matches.forEach(m => {
    try {
      const obj = JSON.parse(m[1]);
      const check = item => {
        if (item && item['@type'] === 'SoftwareApplication') {
          const missing = [];
          if (!item.offers) missing.push('offers');
          if (!item.aggregateRating) missing.push('aggregateRating');
          if (missing.length > 0) {
            invalidApps.push({ file: f, name: item.name, missing });
          }
        }
      };
      if (Array.isArray(obj)) obj.forEach(check);
      else check(obj);
    } catch(e) {}
  });
});

console.log(`SoftwareApplication missing fields (${invalidApps.length}):`);
invalidApps.forEach(x => console.log(' ', x.file, x.missing.join(', ')));
