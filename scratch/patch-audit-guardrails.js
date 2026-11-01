const fs = require('fs');

let audit = fs.readFileSync('scripts/seo-audit.js', 'utf8');

// Ensure we don't double patch
if (!audit.includes('NO_FAQ_SCHEMA')) {
  const target = 'if (calcs > 1) issues.push(`MULTI_CALC(${calcs})`);';
  const newRules = `
  // CTR Quality Rules for Blog Articles
  if (isGuide && !html.includes('"FAQPage"')) issues.push('NO_FAQ_SCHEMA');
  if (isGuide && desc && !desc.includes('→') && !desc.includes('->') && !desc.includes('&rarr;')) issues.push('NO_CTR_CTA');
  if (calcs > 1) issues.push(\`MULTI_CALC(\${calcs})\`);`;

  audit = audit.replace(target, newRules);
  fs.writeFileSync('scripts/seo-audit.js', audit, 'utf8');
  console.log('seo-audit.js successfully updated with CTR quality guardrails!');
} else {
  console.log('Already patched.');
}
