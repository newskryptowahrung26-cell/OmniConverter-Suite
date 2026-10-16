const fs = require('fs');

const offTopic = [
  'blog/indonesia-cu.html',
  'blog/convert-pdf-form.html',
  'blog/convert-file-type-to-pdf.html',
  'blog/converter-application-download.html',
  'blog/file-changer.html',
  'blog/how-to-change-file-format.html',
  'es/blog/guia-moeda-indonesia.html',
  'es/blog/converter-formulario-pdf.html',
  'es/blog/converter-tipo-de-arquivo-para-pdf.html',
  'es/blog/baixar-aplicativo-conversor.html',
  'es/blog/modificador-de-arquivos.html',
  'es/blog/como-mudar-formato-de-arquivo.html',
  'de/blog/indonesische-waehrung-ratgeber.html',
  'de/blog/pdf-formular-konvertieren.html',
  'de/blog/dateityp-in-pdf-umwandeln.html',
  'de/blog/konverter-app-herunterladen.html',
  'de/blog/dateien-aendern.html',
  'de/blog/dateiformat-aendern.html',
  'pt/blog/guia-moeda-indonesia.html',
  'pt/blog/converter-formulario-pdf.html',
  'pt/blog/converter-tipo-de-arquivo-para-pdf.html',
  'pt/blog/baixar-aplicativo-conversor.html',
  'pt/blog/modificador-de-arquivos.html',
  'pt/blog/como-mudar-formato-de-arquivo.html'
];

let noindexCount = 0;
offTopic.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    if (!c.includes('name="robots" content="noindex')) {
      c = c.replace('<head>', '<head>\n  <meta name="robots" content="noindex, follow">');
      fs.writeFileSync(f, c, 'utf8');
      noindexCount++;
      console.log('Noindexed:', f);
    }
  }
});

console.log(`Total off-topic pages noindexed: ${noindexCount}`);
