import fs from 'fs';

const langs = ['es', 'de', 'pt'];

console.log('--- Checking self-consistency for all localized HTML inline scripts ---');

langs.forEach(lang => {
  const dir = `${lang}`;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

  files.forEach(f => {
    const fullPath = `${lang}/${f}`;
    const content = fs.readFileSync(fullPath, 'utf8');

    // Find all IDs in HTML
    const htmlIds = new Set([...content.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]));

    // Find inline scripts
    const inlineScripts = [...content.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);

    inlineScripts.forEach((sc, idx) => {
      // Find getElementById calls
      const targetedIds = [...sc.matchAll(/getElementById\(["']([^"']+)["']\)/g)].map(m => m[1]);
      const missing = targetedIds.filter(id => !htmlIds.has(id));
      if (missing.length > 0) {
        console.log(`[${fullPath}] Inline script ${idx} misses DOM elements:`, missing);
      }
    });

    // Also check what selects exist and if they have options
    const selects = [...content.matchAll(/<select\s+[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/select>/gi)];
    selects.forEach(sel => {
      const id = sel[1];
      const inner = sel[2].trim();
      const optionCount = (inner.match(/<option/gi) || []).length;
      if (optionCount === 0) {
        console.log(`[${fullPath}] Select #${id} has ZERO static <option> tags!`);
      }
    });
  });
});
