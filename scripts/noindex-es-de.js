const fs = require('fs');

const offTopic = [
  'es/blog/como-cambiar-formato-de-archivo.html',
  'es/blog/convertir-formulario-pdf.html',
  'es/blog/convertir-tipo-de-archivo-a-pdf.html',
  'es/blog/guia-moneda-indonesia.html',
  'de/blog/dateiformat-aendern-anleitung.html',
  'de/blog/dateiumwandler.html',
  'de/blog/pdf-formular-umwandeln.html'
];

offTopic.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    if (!c.includes('name="robots" content="noindex')) {
      c = c.replace('<head>', '<head>\n  <meta name="robots" content="noindex, follow">');
      fs.writeFileSync(f, c, 'utf8');
      console.log('Noindexed:', f);
    }
  }
});
