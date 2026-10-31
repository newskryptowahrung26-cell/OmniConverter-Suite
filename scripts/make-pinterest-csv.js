const fs = require('fs');
const path = require('path');

const langs = [
  { lang: 'en', dir: 'blog', prefix: '/blog/' },
  { lang: 'es', dir: 'es/blog', prefix: '/es/blog/' },
  { lang: 'de', dir: 'de/blog', prefix: '/de/blog/' },
  { lang: 'pt', dir: 'pt/blog', prefix: '/pt/blog/' }
];

const csvRows = ['Title,Media URL,Pinterest board,Thumbnail,Link,Description'];

langs.forEach(({ lang, dir, prefix }) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

  files.forEach(f => {
    const fullPath = path.join(dir, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('http-equiv="refresh"')) return;
    const slug = f.replace('.html', '');

    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const title = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : slug;

    const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    const desc = descMatch ? descMatch[1] : title;

    const imgUrl = `https://www.omniconverter.co.uk/assets/blog/${lang}/${slug}.png`;
    const link = `https://www.omniconverter.co.uk${prefix}${slug}`;

    let board = 'Conversion Tools';
    const s = slug.toLowerCase();
    if (/(usd|gbp|aud|eur|inr|krw|jpy|currency|forex|won|dolar|libras|moeda)/.test(s)) {
      board = 'Currency & Forex Guides';
    } else if (/(celsius|fahrenheit|temperature|temperatur|temperatura)/.test(s)) {
      board = 'Temperature Conversions';
    } else if (/(kg|lbs|stone|weight|tola|gewicht|peso|quilos|pfund)/.test(s)) {
      board = 'Weight & Mass Guides';
    } else if (/(cup|ml|gallon|litre|tsp|liter|tasse|xicara|galao)/.test(s)) {
      board = 'Kitchen & Cooking Conversions';
    } else if (/(meter|feet|inch|bigha|gaj|guntha|pes|fuss|comprimento)/.test(s)) {
      board = 'Length & Measurement';
    }

    const cleanTitle = `"${title.replace(/"/g, '""').slice(0, 100)}"`;
    const cleanImg = `"${imgUrl}"`;
    const cleanBoard = `"${board}"`;
    const cleanLink = `"${link}"`;
    const cleanDesc = `"${(desc + ' | Free interactive calculator at OmniConverter').replace(/"/g, '""').slice(0, 490)}"`;

    csvRows.push(`${cleanTitle},${cleanImg},${cleanBoard},"",${cleanLink},${cleanDesc}`);
  });
});

fs.writeFileSync('pinterest-bulk-pins.csv', csvRows.join('\r\n'), 'utf8');
console.log(`Generated pinterest-bulk-pins.csv with ${csvRows.length - 1} pins!`);
