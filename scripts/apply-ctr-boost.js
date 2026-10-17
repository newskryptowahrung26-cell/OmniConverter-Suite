const fs = require('fs');

function update220Stone() {
  const filePath = 'blog/220-pounds-in-stone.html';
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    '<title>220 Pounds in Stone: Exact Conversion (15 st 10 lb / 15.71 st)</title>',
    '<title>220 lbs in Stone: Exact Conversion (15 st 10 lb) + Body Weight Chart</title>'
  );

  content = content.replace(
    '<meta property="og:title" content="220 Pounds in Stone: Exact Conversion (15 st 10 lb / 15.71 st)">',
    '<meta property="og:title" content="220 lbs in Stone: Exact Conversion (15 st 10 lb) + Body Weight Chart">'
  );

  content = content.replace(
    '<meta name="twitter:title" content="220 Pounds in Stone: Exact Conversion (15 st 10 lb / 15.71 st)">',
    '<meta name="twitter:title" content="220 lbs in Stone: Exact Conversion (15 st 10 lb) + Body Weight Chart">'
  );

  content = content.replace(
    '<option value="kg" selected>Kilograms (kg)</option>',
    '<option value="kg">Kilograms (kg)</option>'
  );

  content = content.replace(
    '<option value="st" >Stones (st)</option>',
    '<option value="st" selected>Stones (st)</option>'
  );

  content = content.replace(
    '<div id="liveToolResultVal" style="font-size:1.8rem; font-weight:800; color:var(--primary-600); margin-top:0.2rem;">--</div>',
    '<div id="liveToolResultVal" style="font-size:1.8rem; font-weight:800; color:var(--primary-600); margin-top:0.2rem;">15.71 st (15 st 10 lb)</div>'
  );

  content = content.replace(
    '<div id="liveToolFormulaText" style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">Live formula calculation</div>',
    '<div id="liveToolFormulaText" style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">220 lbs ÷ 14 = 15 stone 10 pounds (99.79 kg)</div>'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated 220-pounds-in-stone.html successfully');
}

function update65Kg() {
  const filePath = 'es/blog/65-kg-a-libras.html';
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    '<title>65 Kilogramos a Libras: Fórmula y Calculadora</title>',
    '<title>65 kg a Libras: Equivalencia Exacta (143.3 lbs), Fórmula y Tabla</title>'
  );

  content = content.replace(
    '<meta name="description" content="Guía oficial para 65 Kilogramos a Libras. Fórmulas matemáticas certificadas, tablas de cálculo rápido y convertidor en línea.">',
    '<meta name="description" content="¿Cuánto es 65 kg a libras? 65 kilogramos equivalen exactamente a 143.3 libras (143.3005 lbs). Descubre la fórmula, tabla de peso corporal y calculadora instantánea.">'
  );

  // Check if open graph tags exist, if not or if simple, update
  content = content.replace(
    '</head>',
    `  <!-- Schema.org FAQPage for High SERP CTR -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Cuántas libras son 65 kilogramos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "65 kilogramos equivalen exactamente a 143.30 libras (143.3005 lbs). Para convertir kilogramos a libras, multiplica el peso en kg por 2.20462."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuál es la fórmula para convertir 65 kg a libras?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fórmula: Libras = Kilogramos × 2.20462. Cálculo: 65 × 2.20462 = 143.3005 lbs."
        }
      },
      {
        "@type": "Question",
        "name": "¿65 kg es un peso saludable para un adulto?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Para una estatura promedio de entre 1.60 m y 1.75 m, 65 kg (143.3 lbs) se sitúa dentro del rango de Índice de Masa Corporal (IMC) normal y saludable (18.5 - 24.9)."
        }
      }
    ]
  }
  </script>
</head>`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated es/blog/65-kg-a-libras.html successfully');
}

function updateLengthPage() {
  const filePath = 'length.html';
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    '<title>Length Converter | OmniConverter</title>',
    '<title>Length Converter: Meters, Feet, Inches, Miles &amp; CM Calculator</title>'
  );

  content = content.replace(
    '<title>Length Unit Converter | OmniConverter</title>',
    '<title>Length Converter: Meters, Feet, Inches, Miles &amp; CM Calculator</title>'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated length.html successfully');
}

update220Stone();
update65Kg();
updateLengthPage();
