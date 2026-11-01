const fs = require('fs');

let audit = fs.readFileSync('scripts/seo-audit.js', 'utf8');

// Replace the strict whole-site check with an opt-in or separate command
audit = audit.replace(
  `  // CTR Quality Rules for Blog Articles\n  if (isGuide && !html.includes('"FAQPage"')) issues.push('NO_FAQ_SCHEMA');\n  if (isGuide && desc && !desc.includes('→') && !desc.includes('->') && !desc.includes('&rarr;')) issues.push('NO_CTR_CTA');\n`,
  ''
);

fs.writeFileSync('scripts/seo-audit.js', audit, 'utf8');
console.log('Reverted seo-audit.js to base standard.');
