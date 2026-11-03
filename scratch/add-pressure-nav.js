/**
 * scratch/add-pressure-nav.js
 * Adds Pressure nav link to all EN/ES/DE/PT HTML pages
 * EN  → adds after Speed link: <a href="/pressure" ...>Pressure</a>
 * ES  → adds after Velocidad link
 * DE  → adds after Geschwindigkeit link
 * PT  → adds after Velocidade link
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let fixed = 0, skipped = 0, alreadyDone = 0;

function getAllHtmlFiles(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      getAllHtmlFiles(full, results);
    } else if (e.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const allFiles = getAllHtmlFiles(ROOT);

// EN pages: insert Pressure after Speed, before Files
// Pattern to find: href="/speed" ... tab-btn
const EN_SPEED = `<a href="/speed" class="tab-btn">Speed</a>`;
const EN_SPEED_ACTIVE = `<a href="/speed" class="tab-btn active">Speed</a>`;
const EN_PRESSURE = `\n        <a href="/pressure" class="tab-btn">Pressure</a>`;

// ES pages
const ES_SPEED = `<a href="/es/speed" class="tab-btn">Velocidad</a>`;
const ES_SPEED_ACTIVE = `<a href="/es/speed" class="tab-btn active">Velocidad</a>`;
const ES_PRESSURE = `\n        <a href="/es/pressure" class="tab-btn">Presión</a>`;

// DE pages
const DE_SPEED = `<a href="/de/speed" class="tab-btn">Geschwindigkeit</a>`;
const DE_SPEED_ACTIVE = `<a href="/de/speed" class="tab-btn active">Geschwindigkeit</a>`;
const DE_PRESSURE = `\n        <a href="/de/pressure" class="tab-btn">Druck</a>`;

// PT pages
const PT_SPEED = `<a href="/pt/speed" class="tab-btn">Velocidade</a>`;
const PT_SPEED_ACTIVE = `<a href="/pt/speed" class="tab-btn active">Velocidade</a>`;
const PT_PRESSURE = `\n        <a href="/pt/pressure" class="tab-btn">Pressão</a>`;

for (const file of allFiles) {
  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch(e) {
    console.error('Cannot read:', file);
    skipped++;
    continue;
  }

  // Skip if Pressure nav already present
  if (content.includes('href="/pressure"') || content.includes('href="/es/pressure"') || 
      content.includes('href="/de/pressure"') || content.includes('href="/pt/pressure"')) {
    // But only skip if the non-hreflang pressure link is in nav context
    // Check for nav tab-btn pressure link specifically
    if (content.includes('class="tab-btn">Pressure</a>') || 
        content.includes('class="tab-btn active">Pressure</a>') ||
        content.includes('class="tab-btn">Presión</a>') ||
        content.includes('class="tab-btn active">Presión</a>') ||
        content.includes('class="tab-btn">Druck</a>') ||
        content.includes('class="tab-btn active">Druck</a>') ||
        content.includes('class="tab-btn">Pressão</a>') ||
        content.includes('class="tab-btn active">Pressão</a>')) {
      alreadyDone++;
      continue;
    }
  }

  let newContent = content;
  let changed = false;

  // Determine which language based on path
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const isES = rel.startsWith('es/');
  const isDE = rel.startsWith('de/');
  const isPT = rel.startsWith('pt/');

  if (isES) {
    // ES: insert after Speed (active or not)
    if (newContent.includes(ES_SPEED_ACTIVE)) {
      newContent = newContent.replace(ES_SPEED_ACTIVE, ES_SPEED_ACTIVE + ES_PRESSURE);
      changed = true;
    } else if (newContent.includes(ES_SPEED)) {
      newContent = newContent.replace(ES_SPEED, ES_SPEED + ES_PRESSURE);
      changed = true;
    }
  } else if (isDE) {
    if (newContent.includes(DE_SPEED_ACTIVE)) {
      newContent = newContent.replace(DE_SPEED_ACTIVE, DE_SPEED_ACTIVE + DE_PRESSURE);
      changed = true;
    } else if (newContent.includes(DE_SPEED)) {
      newContent = newContent.replace(DE_SPEED, DE_SPEED + DE_PRESSURE);
      changed = true;
    }
  } else if (isPT) {
    if (newContent.includes(PT_SPEED_ACTIVE)) {
      newContent = newContent.replace(PT_SPEED_ACTIVE, PT_SPEED_ACTIVE + PT_PRESSURE);
      changed = true;
    } else if (newContent.includes(PT_SPEED)) {
      newContent = newContent.replace(PT_SPEED, PT_SPEED + PT_PRESSURE);
      changed = true;
    }
  } else {
    // EN
    if (newContent.includes(EN_SPEED_ACTIVE)) {
      newContent = newContent.replace(EN_SPEED_ACTIVE, EN_SPEED_ACTIVE + EN_PRESSURE);
      changed = true;
    } else if (newContent.includes(EN_SPEED)) {
      newContent = newContent.replace(EN_SPEED, EN_SPEED + EN_PRESSURE);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('✅ Fixed:', rel);
    fixed++;
  } else {
    // No Speed nav found — might be a non-tool page without standard nav
    skipped++;
  }
}

console.log(`\nDone. Fixed: ${fixed} | Already done: ${alreadyDone} | Skipped (no speed nav): ${skipped}`);
