const fs = require('fs');

let code = fs.readFileSync('scripts/vertex-publisher.js', 'utf8');

// English nav tabs replacement
const oldEnNav = `<nav class="nav-tabs" aria-label="Converter category navigation">
        <a href="/" class="tab-btn">Home</a>
        <a href="/currency" class="tab-btn">Currency</a>
        <a href="/length" class="tab-btn">Length</a>
        <a href="/temperature" class="tab-btn">Temperature</a>
        <a href="/weight-mass" class="tab-btn">Weight</a>
        <a href="/volume-capacity" class="tab-btn">Volume</a>
        <a href="/time-duration" class="tab-btn">Time</a>
        <a href="/area" class="tab-btn">Area</a>
        <a href="/speed" class="tab-btn">Speed</a>
        <a href="/file-media" class="tab-btn">Files</a>
        <a href="/blog" class="tab-btn active">Blog</a>
      </nav>`;

const newEnNav = `<nav class="nav-tabs" aria-label="Converter category navigation">
        <a href="/" class="tab-btn">Home</a>
        <a href="/indian-units" class="tab-btn">Indian Units</a>
        <a href="/time-zone" class="tab-btn">Time Zone</a>
        <a href="/currency" class="tab-btn">Currency</a>
        <a href="/length" class="tab-btn">Length</a>
        <a href="/temperature" class="tab-btn">Temperature</a>
        <a href="/weight-mass" class="tab-btn">Weight</a>
        <a href="/volume-capacity" class="tab-btn">Volume</a>
        <a href="/time-duration" class="tab-btn">Time</a>
        <a href="/area" class="tab-btn">Area</a>
        <a href="/speed" class="tab-btn">Speed</a>
        <a href="/file-media" class="tab-btn">Files</a>
        <a href="/blog" class="tab-btn active">Blog</a>
      </nav>`;

if (code.includes(oldEnNav)) {
  code = code.replace(oldEnNav, newEnNav);
  console.log('[OK] Patched English nav in vertex-publisher.js');
} else {
  console.log('[WARN] oldEnNav not matched exactly');
}

// Remove flag emojis from vertex-publisher.js
code = code
  .replace(/🇮🇳\s*/g, '')
  .replace(/🇬🇧\s*/g, '')
  .replace(/🇪🇸\s*/g, '')
  .replace(/🇩🇪\s*/g, '')
  .replace(/🇧🇷\s*/g, '');

fs.writeFileSync('scripts/vertex-publisher.js', code, 'utf8');
console.log('[OK] vertex-publisher.js cleaned and updated successfully');
