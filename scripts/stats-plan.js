import fs from 'fs';

const content = fs.readFileSync('omniconverter-keyword-strategy-plan.csv', 'utf8');
const lines = content.split(/\r?\n/).filter(Boolean);
const header = lines[0];
const rows = lines.slice(1);

function parseCsvLine(line) {
  // Simple regex for CSV parsing
  const matches = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i+1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      matches.push(current);
      current = '';
    } else {
      current += c;
    }
  }
  matches.push(current);
  return matches;
}

const stats = {
  total: rows.length,
  byCategory: {},
  byPriority: {},
  byContentType: {},
  existingPostsCount: 0,
  topP1Keywords: []
};

rows.forEach(line => {
  const [kw, cat, type, slug, role, action, intent, priority, tool, strategy] = parseCsvLine(line);
  stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
  stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
  stats.byContentType[type] = (stats.byContentType[type] || 0) + 1;
  if (type === 'Existing Published Article') {
    stats.existingPostsCount++;
  }
  if (priority.includes('P1') && stats.topP1Keywords.length < 30) {
    stats.topP1Keywords.push({ kw, cat, slug, role, priority });
  }
});

console.log(JSON.stringify(stats, null, 2));
