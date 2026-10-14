const fs = require('fs');
const path = require('path');

// 1. Category Classifier
function getArticleCategory(slug) {
  const s = slug.toLowerCase();
  if (s.includes('usd') || s.includes('eur') || s.includes('gbp') || s.includes('aud') || s.includes('vnd') || s.includes('cad') || s.includes('jpy') || s.includes('currency') || s.includes('forex') || s.includes('dolar') || s.includes('inr') || s.includes('crore') || s.includes('lakh') || s.includes('pounds-to') || s.includes('libras-a-gbp') || s.includes('libras-para-gbp') || s.includes('pfund-in-gbp') || s.includes('won') || s.includes('rupiah') || s.includes('lira') || s.includes('rub') || s.includes('cny') || s.includes('baht')) return 'currency';
  if (s.includes('kg') || s.includes('lbs') || s.includes('pound') || s.includes('libra') || s.includes('pfund') || s.includes('gram') || s.includes('ounce') || s.includes('stone') || s.includes('weight') || s.includes('peso') || s.includes('gewicht') || s.includes('massa') || s.includes('tola')) return 'weight';
  if (s.includes('cup') || s.includes('liter') || s.includes('litre') || s.includes('ml') || s.includes('gallon') || s.includes('galao') || s.includes('galon') || s.includes('taza') || s.includes('xicara') || s.includes('tasse') || s.includes('volume') || s.includes('volumen') || s.includes('bar-to-psi') || s.includes('bar-a-psi') || s.includes('bar-em-psi') || s.includes('bar-in-psi') || s.includes('teaspoon') || s.includes('tablespoon') || s.includes('tbsp') || s.includes('tsp')) return 'volume';
  if (s.includes('celsius') || s.includes('fahrenheit') || s.includes('kelvin') || s.includes('temperature') || s.includes('temperatura')) return 'temperature';
  if (s.includes('mph') || s.includes('kmh') || s.includes('speed') || s.includes('velocidad') || s.includes('geschwindigkeit') || s.includes('velocidade')) return 'speed';
  if (s.includes('hour') || s.includes('minute') || s.includes('second') || s.includes('time') || s.includes('tiempo') || s.includes('zeit') || s.includes('tempo')) return 'time';
  if (s.includes('meter') || s.includes('feet') || s.includes('inch') || s.includes('mile') || s.includes('yard') || s.includes('metro') || s.includes('pies') || s.includes('pes') || s.includes('polegadas') || s.includes('zoll') || s.includes('length') || s.includes('distancia') || s.includes('distance') || s.includes('fuss') || s.includes('laenge')) return 'length';
  if (s.includes('area') || s.includes('acre') || s.includes('hectare') || s.includes('sq ft') || s.includes('quadrat') || s.includes('cuadrado') || s.includes('bigha') || s.includes('gaj') || s.includes('guntha') || s.includes('marla') || s.includes('kanal') || s.includes('cent')) return 'area';
  return 'general';
}

// 2. Comprehensive Anchor Phrase Mappings per Category and Language
const anchorMap = {
  en: {
    currency: {
      url: '/currency',
      phrases: ['currency transactions', 'foreign exchange', 'currency exchanges', 'exchange rate', 'currency conversion', 'interbank exchange rate', 'foreign currency', 'currency converter', 'international business', 'financial calculation']
    },
    weight: {
      url: '/weight-mass',
      phrases: ['weight measurements', 'mass and weight', 'mass or weight', 'weight conversion', 'metric and imperial units', 'measuring weight', 'weight conversions', 'unit conversion', 'units of measurement', 'units of mass', 'physical measurement']
    },
    volume: {
      url: '/volume-capacity',
      phrases: ['volumetric space', 'volume measurements', 'kitchen conversions', 'volume and capacity', 'volumetric displacement', 'liquid conversions', 'volume conversions', 'volumetric measurements', 'unit conversion', 'liquid volume']
    },
    temperature: {
      url: '/temperature',
      phrases: ['temperature conversion', 'thermodynamic', 'temperature scales', 'temperature units', 'temperature measurements', 'degrees Celsius', 'degrees Fahrenheit', 'thermal measurement']
    },
    speed: {
      url: '/speed',
      phrases: ['speed conversions', 'velocity calculations', 'speed and velocity', 'speed units', 'rate of motion']
    },
    time: {
      url: '/time-duration',
      phrases: ['time calculations', 'duration conversions', 'units of time', 'time duration', 'measure of time']
    },
    length: {
      url: '/length',
      phrases: ['length conversions', 'distance measurements', 'units of length', 'length measurements', 'distance and length', 'linear measurement']
    },
    area: {
      url: '/area',
      phrases: ['area measurements', 'land calculations', 'square units', 'land measurement', 'area conversion', 'surface area']
    },
    general: {
      url: '/',
      phrases: ['unit conversion', 'conversion calculations', 'units of measurement', 'conversion tool', 'conversion formulas', 'exact conversion']
    }
  },
  es: {
    currency: {
      url: '/es/currency',
      phrases: ['transacciones cambiarias transfronterizas', 'transacciones cambiarias', 'operadores de divisas', 'conversiones de moneda', 'conversión de moneda', 'tipo de cambio interbancario', 'mercado spot', 'tipo de cambio', 'cálculo financiero']
    },
    weight: {
      url: '/es/weight-mass',
      phrases: ['mediciones de peso', 'masa y peso', 'conversión de peso', 'sistemas de unidades métricos e imperiales', 'sistemas de unidades', 'cálculos de masa', 'conversiones de peso', 'conversión matemática', 'medidas de masa']
    },
    volume: {
      url: '/es/volume-capacity',
      phrases: ['mediciones de volumen', 'volumen y capacidad', 'conversión de volumen', 'sistemas de unidades métricos e imperiales', 'medidas culinarias', 'desplazamiento volumétrico', 'conversiones de volumen', 'conversión matemática', 'volumen de líquidos']
    },
    temperature: {
      url: '/es/temperature',
      phrases: ['conversión de temperatura', 'escalas de temperatura', 'grados de temperatura', 'conversión matemática', 'medición térmica']
    },
    speed: {
      url: '/es/speed',
      phrases: ['conversión de velocidad', 'velocidad en tiempo real', 'conversión matemática', 'unidades de velocidad']
    },
    time: {
      url: '/es/time-duration',
      phrases: ['cálculos de tiempo', 'duración y tiempo', 'conversión matemática', 'unidades de tiempo']
    },
    length: {
      url: '/es/length',
      phrases: ['medidas de longitud', 'distancia y longitud', 'conversión de longitud', 'sistemas de unidades métricos e imperiales', 'conversión matemática', 'distancia']
    },
    area: {
      url: '/es/area',
      phrases: ['medidas de área', 'cálculos de superficie', 'conversión de área', 'conversión matemática', 'medición de terrenos']
    },
    general: {
      url: '/es/',
      phrases: ['sistemas de unidades métricos e imperiales', 'conversión matemática', 'estándares internacionales oficiales', 'conversión de unidades']
    }
  },
  de: {
    currency: {
      url: '/de/currency',
      phrases: ['grenzüberschreitenden Währungstransaktionen', 'Währungstransaktionen', 'Devisenhändler', 'Währungsumrechnungen', 'Währungsumrechnung', 'Interbanken-Wechselkurses', 'Devisenhandelsplätzen', 'Wechselkurs', 'Währungsmarkt']
    },
    weight: {
      url: '/de/weight-mass',
      phrases: ['Gewichtsmessungen', 'Masse und Gewicht', 'Gewichtsumrechnung', 'metrischen und imperialen Einheiten', 'metrischen und imperialen Multiplikatoren', 'Massenberechnungen', 'Gewichtseinheiten', 'präzise Umrechnung']
    },
    volume: {
      url: '/de/volume-capacity',
      phrases: ['Volumenmessungen', 'Volumen und Kapazität', 'metrischen und imperialen Multiplikatoren', 'Küchenumrechnungen', 'Volumenumrechnung', 'präzise Umrechnung', 'Flüssigkeitsvolumen']
    },
    temperature: {
      url: '/de/temperature',
      phrases: ['Temperaturumrechnung', 'Temperaturskalen', 'präzise Umrechnung', 'thermodynamischen']
    },
    speed: {
      url: '/de/speed',
      phrases: ['Geschwindigkeitsumrechnung', 'Geschwindigkeitseinheiten', 'präzise Umrechnung']
    },
    time: {
      url: '/de/time-duration',
      phrases: ['Zeiteinheiten', 'Dauerumrechnung', 'präzise Umrechnung']
    },
    length: {
      url: '/de/length',
      phrases: ['Längenmessungen', 'Distanzumrechnung', 'Längeneinheiten', 'metrischen und imperialen Multiplikatoren', 'präzise Umrechnung']
    },
    area: {
      url: '/de/area',
      phrases: ['Flächenmessungen', 'Flächenberechnung', 'präzise Umrechnung']
    },
    general: {
      url: '/de/',
      phrases: ['metrischen und imperialen Multiplikatoren', 'präzise Umrechnung', 'wissenschaftlichen Maßeinheiten']
    }
  },
  pt: {
    currency: {
      url: '/pt/currency',
      phrases: ['transações cambiais transfronteiriças', 'transações cambiais', 'operadores de câmbio', 'conversões de moeda', 'conversão de moeda', 'taxa de câmbio interbancária', 'mesas de câmbio', 'taxa de câmbio', 'cálculo financeiro']
    },
    weight: {
      url: '/pt/weight-mass',
      phrases: ['medições de peso', 'massa e peso', 'conversão de peso', 'sistemas métrico e imperial', 'sistema métrico internacional', 'cálculos de massa', 'conversões de peso', 'conversão exata', 'unidades de massa']
    },
    volume: {
      url: '/pt/volume-capacity',
      phrases: ['medições de volume', 'volume e capacidade', 'sistema métrico internacional', 'conversões culinárias', 'deslocamento volumétrico', 'conversões de volume', 'conversão exata']
    },
    temperature: {
      url: '/pt/temperature',
      phrases: ['conversão de temperatura', 'escalas de temperatura', 'sistema métrico internacional', 'conversão exata']
    },
    speed: {
      url: '/pt/speed',
      phrases: ['conversão de velocidade', 'unidades de velocidade', 'sistema métrico internacional', 'conversão exata']
    },
    time: {
      url: '/pt/time-duration',
      phrases: ['cálculos de tempo', 'unidades de tempo', 'sistema métrico internacional', 'conversão exata']
    },
    length: {
      url: '/pt/length',
      phrases: ['medidas de comprimento', 'distância e comprimento', 'sistema métrico internacional', 'conversão exata']
    },
    area: {
      url: '/pt/area',
      phrases: ['medidas de área', 'cálculos de superfície', 'sistema métrico internacional', 'conversão exata']
    },
    general: {
      url: '/pt/',
      phrases: ['sistema métrico internacional', 'padrões internacionais oficiais', 'conversão de unidades', 'conversão exata']
    }
  }
};

const languages = [
  { lang: 'en', dir: 'blog', prefix: '/blog/' },
  { lang: 'es', dir: 'es/blog', prefix: '/es/blog/' },
  { lang: 'de', dir: 'de/blog', prefix: '/de/blog/' },
  { lang: 'pt', dir: 'pt/blog', prefix: '/pt/blog/' }
];

let injectedCount = 0;
let filesModified = 0;

languages.forEach(({ lang, dir, prefix }) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

  files.forEach(f => {
    const filePath = path.join(dir, f);
    let html = fs.readFileSync(filePath, 'utf8');
    const slug = f.replace('.html', '');
    const cat = getArticleCategory(slug);

    // Isolate article block
    const artMatch = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
    if (!artMatch) return;

    let artContent = artMatch[1];
    let fileChanged = false;

    // Check if body paragraphs already have an anchor link
    // We check if any <p> has an <a> link inside it
    const paragraphs = artContent.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
    const hasExistingInTextLink = paragraphs.some(p => /<a\b[^>]*>[\s\S]*?<\/a>/i.test(p));

    if (!hasExistingInTextLink) {
      const def = anchorMap[lang][cat] || anchorMap[lang].general;
      const targetUrl = def.url;

      for (const phrase of def.phrases) {
        const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Match phrase inside a <p> tag where it is not inside an <a> tag
        const pRegex = new RegExp(`(<p\\b[^>]*>(?:(?!<\\/p>)[\\s\\S])*?)\\b(${escapedPhrase})\\b((?:(?!<\\/p>)[\\s\\S])*?<\\/p>)`, 'i');
        const match = artContent.match(pRegex);
        if (match) {
          const before = match[1];
          const lastOpenA = before.lastIndexOf('<a ');
          const lastCloseA = before.lastIndexOf('</a>');
          if (lastOpenA === -1 || lastCloseA > lastOpenA) {
            const replacementLink = `<a href="${targetUrl}" style="color:var(--primary-600);font-weight:700;text-decoration:underline;">$2</a>`;
            artContent = artContent.replace(pRegex, `$1${replacementLink}$3`);
            fileChanged = true;
            injectedCount++;
            break;
          }
        }
      }

      // Fallback: If no predefined phrase matched in any paragraph, inject into paragraph 0 or 1
      if (!fileChanged && paragraphs.length > 0) {
        // Find suitable paragraph (either p0 or p1, not callout)
        let targetPIndex = 0;
        if (paragraphs[0].includes('class="') && paragraphs.length > 1) {
          targetPIndex = 1;
        }
        const originalP = paragraphs[targetPIndex];

        // Construct a natural contextual sentence according to language and category
        let naturalContextSentence = '';
        if (lang === 'en') {
          naturalContextSentence = ` For seamless instant calculations, you can explore our certified <a href="${targetUrl}" style="color:var(--primary-600);font-weight:700;text-decoration:underline;">online conversion calculator</a>.`;
        } else if (lang === 'es') {
          naturalContextSentence = ` Para verificar resultados al instante, consulte nuestra <a href="${targetUrl}" style="color:var(--primary-600);font-weight:700;text-decoration:underline;">calculadora de conversión en vivo</a>.`;
        } else if (lang === 'de') {
          naturalContextSentence = ` Für sekundenschnelle Berechnungen nutzen Sie unseren verifizierten <a href="${targetUrl}" style="color:var(--primary-600);font-weight:700;text-decoration:underline;">Online-Umrechner</a>.`;
        } else if (lang === 'pt') {
          naturalContextSentence = ` Para realizar cálculos em tempo real, acesse nossa <a href="${targetUrl}" style="color:var(--primary-600);font-weight:700;text-decoration:underline;">calculadora de conversão interativa</a>.`;
        }

        const newP = originalP.replace(/<\/p>$/i, `${naturalContextSentence}</p>`);
        artContent = artContent.replace(originalP, newP);
        fileChanged = true;
        injectedCount++;
      }
    }

    if (fileChanged) {
      const openTagMatch = artMatch[0].match(/<article\b[^>]*>/i);
      const openTag = openTagMatch ? openTagMatch[0] : '<article class="content-section" style="margin-top:0.75rem;">';
      html = html.replace(artMatch[0], `${openTag}${artContent}</article>`);
      fs.writeFileSync(filePath, html, 'utf8');
      filesModified++;
    }
  });
});

console.log(`[OK] Successfully processed in-content internal links! Total injected: ${injectedCount} across ${filesModified} files.`);
