import fs from 'fs';
import path from 'path';

const gscDir = 'C:/Users/NDCOM/.gemini/antigravity/brain/6ffcfe4a-11c0-4505-a8c1-5c4564b8cdf5/scratch/gsc_export';

function parseCsv(filename) {
  const filePath = path.join(gscDir, filename);
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    // Basic CSV splitting handling quotes
    const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^,]*))/g;
    const matches = [];
    let match;
    while ((match = regex.exec(lines[i])) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++;
      let val = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
      matches.push(val ? val.trim() : '');
    }
    // Remove trailing empty match if regex found it
    if (matches.length > headers.length) matches.length = headers.length;
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = matches[idx] || '';
    });
    rows.push(obj);
  }
  return rows;
}

console.log('=== GSC FILTERS & TOTALS ===');
console.log(fs.readFileSync(path.join(gscDir, 'Filters.csv'), 'utf8'));
console.log(fs.readFileSync(path.join(gscDir, 'Chart.csv'), 'utf8').substring(0, 500));

console.log('\n=== TOP 20 PAGES BY IMPRESSIONS ===');
const pages = parseCsv('Pages.csv');
// Sort by Impressions descending
pages.sort((a, b) => {
  const impA = parseInt(a['Impressions'] || a['impressions'] || '0', 10);
  const impB = parseInt(b['Impressions'] || b['impressions'] || '0', 10);
  return impB - impA;
});

pages.slice(0, 20).forEach((p, idx) => {
  const url = p['Top pages'] || p['Page'] || Object.values(p)[0];
  const clicks = p['Clicks'] || p['clicks'] || '0';
  const imp = p['Impressions'] || p['impressions'] || '0';
  const ctr = p['CTR'] || p['ctr'] || '0';
  const pos = p['Position'] || p['position'] || '0';
  console.log(`${idx + 1}. [${imp} imp | ${clicks} clicks | CTR: ${ctr} | Pos: ${pos}] -> ${url}`);
});

console.log('\n=== TOP 25 QUERIES BY IMPRESSIONS ===');
const queries = parseCsv('Queries.csv');
queries.sort((a, b) => {
  const impA = parseInt(a['Impressions'] || a['impressions'] || '0', 10);
  const impB = parseInt(b['Impressions'] || b['impressions'] || '0', 10);
  return impB - impA;
});

queries.slice(0, 25).forEach((q, idx) => {
  const query = q['Top queries'] || q['Query'] || Object.values(q)[0];
  const clicks = q['Clicks'] || q['clicks'] || '0';
  const imp = q['Impressions'] || q['impressions'] || '0';
  const ctr = q['CTR'] || q['ctr'] || '0';
  const pos = q['Position'] || q['position'] || '0';
  console.log(`${idx + 1}. [${imp} imp | ${clicks} clicks | CTR: ${ctr} | Pos: ${pos}] -> "${query}"`);
});

console.log('\n=== TOP COUNTRIES ===');
const countries = parseCsv('Countries.csv');
countries.slice(0, 10).forEach(c => {
  console.log(c);
});
