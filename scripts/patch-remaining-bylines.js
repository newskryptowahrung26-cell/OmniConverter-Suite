const fs = require('fs');
const files = fs.readdirSync('blog').filter(f => f.endsWith('.html'));

const authors = {
  weight: { name: 'Dr. Oliver Bennett', title: 'Lead Measurement Specialist' },
  volume: { name: 'Chef Claire Hastings', title: 'Culinary Measurement Specialist' },
  currency: { name: 'Marcus Vance', title: 'Senior FX & Currency Analyst' },
  area: { name: 'Aarav Sharma', title: 'Land & Survey Measurement Specialist' },
  temperature: { name: 'Dr. Oliver Bennett', title: 'Thermodynamics & Measurement Specialist' },
  length: { name: 'Dr. Oliver Bennett', title: 'Metrology & Engineering Specialist' },
  file: { name: 'Alex Morgan', title: 'Digital Media & Document Systems Specialist' },
  general: { name: 'Dr. Oliver Bennett', title: 'Lead Measurement Specialist' }
};

const reviewers = {
  weight: 'Sarah Jenkins, MSc',
  volume: 'Sarah Jenkins, MSc',
  currency: 'Financial Editorial Board',
  area: 'Rajesh Verma, Senior Land Surveyor',
  temperature: 'Sarah Jenkins, MSc',
  length: 'Sarah Jenkins, MSc',
  file: 'Tech Editorial Review Team',
  general: 'Sarah Jenkins, MSc'
};

function detectCategory(f, content) {
  const name = f.toLowerCase();
  const text = (name + ' ' + content.slice(0, 3000)).toLowerCase();
  if (name.includes('usd') || name.includes('dollar') || name.includes('gbp') || name.includes('aud') || name.includes('vnd') || name.includes('eur') || text.includes('exchange rate') || text.includes('currency') || name.includes('crore')) return 'currency';
  if (name.includes('bigha') || name.includes('acre') || name.includes('square-feet') || name.includes('gaj') || name.includes('guntha') || text.includes('square feet') || text.includes('area conversion')) return 'area';
  if (name.includes('pdf') || name.includes('file-type') || text.includes('pdf form') || text.includes('convert file')) return 'file';
  if (name.includes('fahrenheit') || name.includes('celsius') || text.includes('temperature conversion')) return 'temperature';
  if (name.includes('meter') || name.includes('feet') || name.includes('inch') || name.includes('cm') || name.includes('km') || name.includes('yard')) return 'length';
  if (name.includes('stone') || name.includes('kg') || name.includes('lbs') || name.includes('pound') || name.includes('gram') || name.includes('tola') || name.includes('weight')) return 'weight';
  if (name.includes('ml') || name.includes('cup') || name.includes('tsp') || name.includes('tbsp') || name.includes('liter') || name.includes('gallon') || name.includes('volume')) return 'volume';
  return 'general';
}

let fixed = 0;
files.forEach(f => {
  let content = fs.readFileSync('blog/' + f, 'utf8');
  if (!content.includes('Reviewed by:')) {
    const cat = detectCategory(f, content);
    const author = authors[cat] || authors.general;
    const reviewer = reviewers[cat] || reviewers.general;

    const newByline = `<div style="display:flex; gap:1.25rem; flex-wrap:wrap; align-items:center; background:var(--bg-elevated); padding:0.6rem 1rem; border-radius:var(--radius-md); border:1px solid var(--card-border); font-size:0.85rem; color:var(--text-muted); margin:0.5rem 0 1.25rem 0;">
        <span>✍️ <strong>Author:</strong> ${author.name}</span>
        <span>🔬 <strong>Reviewed by:</strong> ${reviewer}</span>
        <span>📅 <strong>Last Reviewed:</strong> October 2026</span>
        <span>⏱️ 4 min read</span>
      </div>\n`;

    const imgMatch = content.match(/<img[^>]+class=["']?[^>]*loading=["']?eager["']?[^>]*>/i) || 
                     content.match(/<img[^>]+loading=["']?eager["']?[^>]*>/i) || 
                     content.match(/<img[^>]+border-radius:var\(--radius-xl\)[^>]*>/i) ||
                     content.match(/<img[^>]+>/i);
    if (imgMatch) {
      content = content.replace(imgMatch[0], imgMatch[0] + '\n' + newByline);
      fs.writeFileSync('blog/' + f, content, 'utf8');
      fixed++;
    }
  }
});
console.log('Fixed missing bylines in files:', fixed);
