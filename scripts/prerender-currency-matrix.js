const fs = require('fs');

const fallbackRows = `
              <!-- Pre-rendered Static Fallback Matrix for Crawlers & Instant Display -->
              <tr style="border-bottom:1px solid var(--border-color);"><td style="padding:0.65rem 1rem;">$1 USD</td><td style="padding:0.65rem 1rem;">A$1.43 AUD</td><td style="padding:0.65rem 1rem;">$0.70 USD</td></tr>
              <tr style="border-bottom:1px solid var(--border-color);"><td style="padding:0.65rem 1rem;">$5 USD</td><td style="padding:0.65rem 1rem;">A$7.13 AUD</td><td style="padding:0.65rem 1rem;">$3.51 USD</td></tr>
              <tr style="border-bottom:1px solid var(--border-color);"><td style="padding:0.65rem 1rem;">$10 USD</td><td style="padding:0.65rem 1rem;">A$14.26 AUD</td><td style="padding:0.65rem 1rem;">$7.01 USD</td></tr>
              <tr style="border-bottom:1px solid var(--border-color);"><td style="padding:0.65rem 1rem;">$25 USD</td><td style="padding:0.65rem 1rem;">A$35.65 AUD</td><td style="padding:0.65rem 1rem;">$17.53 USD</td></tr>
              <tr style="border-bottom:1px solid var(--border-color);"><td style="padding:0.65rem 1rem;">$50 USD</td><td style="padding:0.65rem 1rem;">A$71.29 AUD</td><td style="padding:0.65rem 1rem;">$35.07 USD</td></tr>
              <tr style="border-bottom:1px solid var(--border-color);"><td style="padding:0.65rem 1rem;">$100 USD</td><td style="padding:0.65rem 1rem;">A$142.58 AUD</td><td style="padding:0.65rem 1rem;">$70.14 USD</td></tr>
              <tr style="border-bottom:1px solid var(--border-color);"><td style="padding:0.65rem 1rem;">$500 USD</td><td style="padding:0.65rem 1rem;">A$712.90 AUD</td><td style="padding:0.65rem 1rem;">$350.68 USD</td></tr>
              <tr style="border-bottom:1px solid var(--border-color);"><td style="padding:0.65rem 1rem;">$1,000 USD</td><td style="padding:0.65rem 1rem;">A$1,425.80 AUD</td><td style="padding:0.65rem 1rem;">$701.36 USD</td></tr>
              <tr style="border-bottom:1px solid var(--border-color);"><td style="padding:0.65rem 1rem;">$5,000 USD</td><td style="padding:0.65rem 1rem;">A$7,129.00 AUD</td><td style="padding:0.65rem 1rem;">$3,506.80 USD</td></tr>
              <tr><td style="padding:0.65rem 1rem;">$10,000 USD</td><td style="padding:0.65rem 1rem;">A$14,258.00 AUD</td><td style="padding:0.65rem 1rem;">$7,013.61 USD</td></tr>`;

['currency.html', 'es/currency.html', 'de/currency.html', 'pt/currency.html'].forEach(p => {
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    const regex = /<tbody id="matrixTableBody">\s*<!-- Populated dynamically via JS -->\s*<\/tbody>/;
    if (regex.test(c)) {
      c = c.replace(regex, '<tbody id="matrixTableBody">\n' + fallbackRows.trim() + '\n            </tbody>');
      fs.writeFileSync(p, c, 'utf8');
      console.log('Pre-rendered static matrix rows in:', p);
    }
  }
});
