const fs = require('fs');

const files = [
  'index.html', 'indian-units.html', 'currency.html', 'length.html',
  'temperature.html', 'weight-mass.html', 'volume-capacity.html',
  'time-duration.html', 'time-zone.html', 'area.html', 'speed.html', 'file-media.html'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let html = fs.readFileSync(f, 'utf8');
  if (!html.includes('manifest.json')) {
    html = html.replace(
      '</head>',
      '  <link rel="manifest" href="/manifest.json">\n  <meta name="theme-color" content="#4f46e5">\n</head>'
    );
    fs.writeFileSync(f, html, 'utf8');
    console.log(`Linked PWA manifest in ${f}`);
  }
});
