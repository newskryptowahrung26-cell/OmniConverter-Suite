const fs = require('fs');

const h1Updates = {
  'index.html': {
    target: '<h1 class="smallpdf-hero-title">We make unit & file conversion simple.</h1>',
    replacement: '<h1 class="smallpdf-hero-title">Universal Unit Converter & Currency Exchange Calculator</h1>'
  },
  'es/index.html': {
    target: /<h1 class="smallpdf-hero-title">[^<]+<\/h1>/,
    replacement: '<h1 class="smallpdf-hero-title">Conversor Universal de Unidades y Calculadora de Divisas</h1>'
  },
  'de/index.html': {
    target: /<h1 class="smallpdf-hero-title">[^<]+<\/h1>/,
    replacement: '<h1 class="smallpdf-hero-title">Universal-Einheitenrechner & Währungsumrechner</h1>'
  },
  'pt/index.html': {
    target: /<h1 class="smallpdf-hero-title">[^<]+<\/h1>/,
    replacement: '<h1 class="smallpdf-hero-title">Conversor Universal de Unidades e Calculadora de Câmbio</h1>'
  }
};

for (const [file, info] of Object.entries(h1Updates)) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(info.target, info.replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated H1 in:', file);
  }
}
