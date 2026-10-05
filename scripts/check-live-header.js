const https = require('https');
https.get('https://www.omniconverter.co.uk/', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const start = data.indexOf('<nav class="nav-tabs"');
    const end = data.indexOf('</header>');
    console.log(data.substring(start, end + 9));
  });
});
