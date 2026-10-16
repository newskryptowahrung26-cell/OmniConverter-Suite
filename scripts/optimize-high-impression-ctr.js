const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Optimize 220-pounds-in-stone.html
const p220File = path.join(rootDir, 'blog', '220-pounds-in-stone.html');
if (fs.existsSync(p220File)) {
  let c = fs.readFileSync(p220File, 'utf8');
  c = c.replace(
    /<title>220 Pounds In Stone \| OmniConverter<\/title>/,
    '<title>220 Pounds in Stone: Exact Conversion (15 st 10 lb / 15.71 st)</title>'
  );
  c = c.replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="What is 220 pounds in stone? 220 lbs = 15 stone 10 pounds (15.714 st, 99.79 kg). Use our worked math, body weight chart, and instant calculator.">'
  );
  c = c.replace(
    /<meta property="og:title" content="[^"]*">/,
    '<meta property="og:title" content="220 Pounds in Stone: Exact Conversion (15 st 10 lb / 15.71 st)">'
  );
  c = c.replace(
    /<meta property="og:description" content="[^"]*">/,
    '<meta property="og:description" content="What is 220 pounds in stone? 220 lbs = 15 stone 10 pounds (15.714 st, 99.79 kg). Use our worked math, body weight chart, and instant calculator.">'
  );
  c = c.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    '<meta name="twitter:title" content="220 Pounds in Stone: Exact Conversion (15 st 10 lb / 15.71 st)">'
  );
  c = c.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    '<meta name="twitter:description" content="What is 220 pounds in stone? 220 lbs = 15 stone 10 pounds (15.714 st, 99.79 kg). Use our worked math, body weight chart, and instant calculator.">'
  );
  fs.writeFileSync(p220File, c, 'utf8');
  console.log('[OK] Optimized 220-pounds-in-stone.html');
}

// 2. Optimize 32-usd-to-gbp.html
const p32File = path.join(rootDir, 'blog', '32-usd-to-gbp.html');
if (fs.existsSync(p32File)) {
  let c = fs.readFileSync(p32File, 'utf8');
  c = c.replace(
    /<title>32 Usd To Gbp \| OmniConverter<\/title>/,
    '<title>32 USD in GBP: How Much is $32 in British Pounds? (Live Rate)</title>'
  );
  c = c.replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="Convert 32 USD to GBP with live mid-market exchange rates. 32 US Dollars is approximately £24.18 GBP. Compare card fees, bank spreads, and transfer costs.">'
  );
  // Default calculator input to 32 instead of 100
  c = c.replace('value="100"', 'value="32"');
  c = c.replace('£75.56 GBP', '£24.18 GBP');
  c = c.replace('100 USD × 0.7556 = £75.56 GBP', '32 USD × 0.7556 = £24.18 GBP');
  fs.writeFileSync(p32File, c, 'utf8');
  console.log('[OK] Optimized 32-usd-to-gbp.html');
}

// 3. Optimize 50-fahrenheit-to-celsius.html
const p50File = path.join(rootDir, 'blog', '50-fahrenheit-to-celsius.html');
if (fs.existsSync(p50File)) {
  let c = fs.readFileSync(p50File, 'utf8');
  c = c.replace(
    /<title>50 Fahrenheit to Celsius: Temperature Guide \| OmniConverter<\/title>/,
    '<title>50°F to °C: What is 50 Fahrenheit in Celsius? (Exact: 10°C)</title>'
  );
  c = c.replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="What is 50 degrees Fahrenheit in Celsius? 50°F equals exactly 10°C. See the step-by-step conversion formula, mental math shortcut, and weather chart.">'
  );
  fs.writeFileSync(p50File, c, 'utf8');
  console.log('[OK] Optimized 50-fahrenheit-to-celsius.html');
}

// 4. Optimize 1-4-cup-is-ml.html
const p14File = path.join(rootDir, 'blog', '1-4-cup-is-ml.html');
if (fs.existsSync(p14File)) {
  let c = fs.readFileSync(p14File, 'utf8');
  c = c.replace(
    /<title>1\/4 Cup is How Many mL\? Kitchen Volume Guide<\/title>/,
    '<title>1/4 Cup in mL: How Many Milliliters is 1/4 Cup? (59.15 mL / 60 mL)</title>'
  );
  c = c.replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="How many mL is 1/4 cup? 1/4 US cup = 59.15 mL (commonly 60 mL), Metric cup = 62.5 mL, and UK cup = 71 mL. Instant kitchen baking conversion chart.">'
  );
  fs.writeFileSync(p14File, c, 'utf8');
  console.log('[OK] Optimized 1-4-cup-is-ml.html');
}
