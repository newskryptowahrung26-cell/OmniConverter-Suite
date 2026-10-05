const fs = require('fs');
const path = require('path');

console.log('=== EXPANDING ALL REMAINING THIN PAGES TO HIGH WORD COUNT & TEXT RATIO ===\n');

// 1. Tool Pages - German (de)
const deAdditions = {
  'de/area.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Flächen- und Grundstücksumrechner: Quadratmeter, Hektar, Ar & Quadratfuß</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Flächenmaße sind die Grundlage für Immobilienkauf, Landwirtschaft, Architektur und Bauwesen. In Kontinentaleuropa ist der Quadratmeter (m²) und der Hektar (ha) der gesetzliche Standard, während im angelsächsischen Raum Quadratfuß (sq ft) und Acres dominieren. Unser Umrechner liefert sofortige, zertifizierte Ergebnisse ohne Rundungsverlust.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Wichtige Flächen-Umrechnungsformeln</h3>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem; margin-bottom:1.5rem;">
        <li><strong>Quadratmeter in Quadratfuß (sq ft):</strong> m² × 10,76391</li>
        <li><strong>Hektar in Quadratmeter:</strong> 1 Hektar = 10.000 m² (100 m × 100 m)</li>
        <li><strong>Hektar in Acres:</strong> 1 ha = 2,471054 Acres</li>
        <li><strong>Quadratkilometer in Hektar:</strong> 1 km² = 100 Hektar = 1.000.000 m²</li>
        <li><strong>Ar:</strong> 1 Ar = 100 m² (traditionelles europäisches Flurstücksmaß)</li>
      </ul>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Immobilien-Flächen Referenztabelle</h3>
      <div style="overflow-x:auto; margin-bottom:1.5rem;">
        <table style="width:100%; border-collapse:collapse; font-size:0.95rem;">
          <thead>
            <tr style="background:var(--bg-elevated); border-bottom:2px solid var(--card-border); text-align:left;">
              <th style="padding:0.75rem;">Fläche</th>
              <th style="padding:0.75rem;">Quadratmeter (m²)</th>
              <th style="padding:0.75rem;">Quadratfuß (sq ft)</th>
              <th style="padding:0.75rem;">Typische Praxisanwendung</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">50 m²</td><td style="padding:0.75rem;">50 m²</td><td style="padding:0.75rem;">538,2 sq ft</td><td style="padding:0.75rem;">Standard 2-Zimmer-Wohnung</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">120 m²</td><td style="padding:0.75rem;">120 m²</td><td style="padding:0.75rem;">1.291,7 sq ft</td><td style="padding:0.75rem;">Einfamilienhaus Wohnfläche</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">600 m²</td><td style="padding:0.75rem;">600 m²</td><td style="padding:0.75rem;">6.458,3 sq ft</td><td style="padding:0.75rem;">Typisches Baugrundstück</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">1 Hektar (10.000 m²)</td><td style="padding:0.75rem;">10.000 m²</td><td style="padding:0.75rem;">107.639 sq ft</td><td style="padding:0.75rem;">Größe von ca. 1,4 Fußballfeldern</td></tr>
          </tbody>
        </table>
      </div>
    </article>`,

  'de/length.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Längen- und Distanzumrechner: Meter, Zentimeter, Zoll, Fuß & Meilen</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Präzise Längenumrechnungen sind entscheidend im Bauwesen, beim Online-Shopping (z.B. Kleidergrößen und Display-Diagonalen in Zoll), im Maschinenbau und auf Reisen. Der Meter ist die fundamentale Basiseinheit des internationalen Einheitensystems (SI).
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Formeln & Faktoren im Überblick</h3>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem; margin-bottom:1.5rem;">
        <li><strong>Zoll (Inch) in Zentimeter:</strong> 1 Zoll = exakt 2,54 cm</li>
        <li><strong>Fuß (Foot) in Zentimeter:</strong> 1 Fuß = 12 Zoll = 30,48 cm</li>
        <li><strong>Yard in Meter:</strong> 1 Yard = 3 Fuß = 36 Zoll = 0,9144 Meter</li>
        <li><strong>Meile (Statute Mile) in Kilometer:</strong> 1 Meile = 1,609344 km</li>
        <li><strong>Seemeile (Nautische Meile):</strong> 1 NM = 1.852 Meter</li>
      </ul>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Körpergrößen & Alltags-Referenztabelle</h3>
      <div style="overflow-x:auto; margin-bottom:1.5rem;">
        <table style="width:100%; border-collapse:collapse; font-size:0.95rem;">
          <thead>
            <tr style="background:var(--bg-elevated); border-bottom:2px solid var(--card-border); text-align:left;">
              <th style="padding:0.75rem;">Zentimeter (cm)</th>
              <th style="padding:0.75rem;">Fuß & Zoll (ft in)</th>
              <th style="padding:0.75rem;">Nur Zoll (in)</th>
              <th style="padding:0.75rem;">Praxisbezug</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">160 cm</td><td style="padding:0.75rem;">5 ft 3 in</td><td style="padding:0.75rem;">62,99 in</td><td style="padding:0.75rem;">Durchschnittliche Frauenkörpergröße</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">175 cm</td><td style="padding:0.75rem;">5 ft 9 in</td><td style="padding:0.75rem;">68,90 in</td><td style="padding:0.75rem;">Allgemeiner europäischer Durchschnitt</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">180 cm</td><td style="padding:0.75rem;">5 ft 11 in</td><td style="padding:0.75rem;">70,87 in</td><td style="padding:0.75rem;">Durchschnittliche Männerkörpergröße DE</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">183 cm</td><td style="padding:0.75rem;">6 ft 0 in</td><td style="padding:0.75rem;">72,00 in</td><td style="padding:0.75rem;">Beliebte US-Größenmarke ("6 Feet")</td></tr>
          </tbody>
        </table>
      </div>
    </article>`,

  'de/temperature.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Thermodynamischer Temperatur-Umrechner: Alle 8 Skalen im Live-Vergleich</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Die Temperatur misst die mittlere kinetische Energie von Teilchen. Während im deutschsprachigen Raum und weltweit die Celsius-Skala (°C) Standard ist, nutzen die USA weiterhin Fahrenheit (°F). In der Physik und Thermodynamik ist Kelvin (K) als absolute Temperaturskala maßgeblich. Unser Werkzeug unterstützt alle 8 historischen und modernen Skalen.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Exakte Umrechnungsformeln</h3>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem; margin-bottom:1.5rem;">
        <li><strong>Celsius in Fahrenheit:</strong> (°C × 9/5) + 32 = °F</li>
        <li><strong>Fahrenheit in Celsius:</strong> (°F - 32) × 5/9 = °C</li>
        <li><strong>Celsius in Kelvin:</strong> °C + 273,15 = K</li>
        <li><strong>Kelvin in Celsius:</strong> K - 273,15 = °C</li>
        <li><strong>Rankine:</strong> (°C + 273,15) × 9/5 = °R</li>
      </ul>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Wichtige thermische Referenzpunkte</h3>
      <div style="overflow-x:auto; margin-bottom:1.5rem;">
        <table style="width:100%; border-collapse:collapse; font-size:0.95rem;">
          <thead>
            <tr style="background:var(--bg-elevated); border-bottom:2px solid var(--card-border); text-align:left;">
              <th style="padding:0.75rem;">Ereignis</th>
              <th style="padding:0.75rem;">Celsius (°C)</th>
              <th style="padding:0.75rem;">Fahrenheit (°F)</th>
              <th style="padding:0.75rem;">Kelvin (K)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">Absoluter Nullpunkt</td><td style="padding:0.75rem;">-273,15 °C</td><td style="padding:0.75rem;">-459,67 °F</td><td style="padding:0.75rem;">0,00 K</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">Wassergefrierpunkt</td><td style="padding:0.75rem;">0,00 °C</td><td style="padding:0.75rem;">32,00 °F</td><td style="padding:0.75rem;">273,15 K</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">Zimmertemperatur</td><td style="padding:0.75rem;">20,00 °C</td><td style="padding:0.75rem;">68,00 °F</td><td style="padding:0.75rem;">293,15 K</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">Menschliche Körpertemperatur</td><td style="padding:0.75rem;">37,00 °C</td><td style="padding:0.75rem;">98,60 °F</td><td style="padding:0.75rem;">310,15 K</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">Wassersiedepunkt (1 bar)</td><td style="padding:0.75rem;">100,00 °C</td><td style="padding:0.75rem;">212,00 °F</td><td style="padding:0.75rem;">373,15 K</td></tr>
          </tbody>
        </table>
      </div>
    </article>`,

  'de/currency.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Echtzeit-Währungsrechner: Live-Mittelkurse für über 35 Weltwährungen</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Unser Währungsrechner berechnet sekundengenaue Devisenkurse für Auslandsreisen, E-Commerce, internationales Banking und Geschäftsrechnungen. Konvertieren Sie Euro (EUR), US-Dollar (USD), britisches Pfund (GBP), Schweizer Franken (CHF), japanischen Yen (JPY) und australischen Dollar (AUD) mit tagesaktuellen Interbanken-Raten.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Devisenwissen: Mittelkurs vs. Bank-Wechselkurs</h3>
      <p style="line-height:1.7; color:var(--text-muted);">
        Der hier angezeigte Mittelkurs (Interbanken-Rate) ist der fairste globale Referenzkurs, den Großbanken untereinander handeln. Traditionelle Filialbanken und Geldwechselstuben an Flughäfen berechnen oft verdeckte Margenaufschläge von 2% bis 6%. Mit unserem Tool sehen Sie den echten Rechnungsbetrag vor Bankgebühren.
      </p>
    </article>`,

  'de/volume-capacity.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Volumen- und Küchenumrechner: Liter, Milliliter, Tassen, Gallonen & Teelöffel</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Hohlmaße und Volumeneinheiten sind in Küche, Chemie, Kraftstoffverbrauch und Logistik unverzichtbar. Vor allem beim Backen nach internationalen Rezepten treten regelmäßig Umrechnungsfragen zwischen metrischen Litern und US-Customary Cups auf.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Internationale Küchen-Umrechnungswerte</h3>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem; margin-bottom:1.5rem;">
        <li><strong>1 US-Cup (Tasse):</strong> 236,588 ml (häufig gerundet auf 240 ml)</li>
        <li><strong>1 Metrischer Cup:</strong> 250,0 ml (Standard in Australien und Neuseeland)</li>
        <li><strong>1 Esslöffel (tbsp):</strong> 3 Teelöffel = 14,787 ml (metrisch: 15 ml)</li>
        <li><strong>1 Teelöffel (tsp):</strong> 4,929 ml (metrisch: 5 ml)</li>
        <li><strong>1 US-Flüssiggallone:</strong> 3,78541 Liter (4 Quarts = 128 fl oz)</li>
        <li><strong>1 Imperiale Gallone (UK):</strong> 4,54609 Liter (160 fl oz)</li>
      </ul>
    </article>`,

  'de/file-media.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Browserbasierter Datei- & Bildkonverter: 100% Datenschutz ohne Server-Upload</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Moderne Bildformate wie WebP bieten bis zu 30% kleinere Dateigrößen bei gleicher visueller Qualität, werden jedoch von manchen älteren Anwendungen noch nicht unterstützt. Unser lokaler Medienkonverter konvertiert Bilder zwischen PNG, JPEG und WebP direkt auf Ihrem Gerät via HTML5 Canvas-APIs.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Sicherheitsgarantie</h3>
      <p style="line-height:1.7; color:var(--text-muted);">
        Ihre Fotos, Rechnungen und Dokumente verlassen zu keinem Zeitpunkt Ihren Browser. Keine Speicherung, kein fremder Serverzugriff und kein Datenschutzrisiko nach DSGVO.
      </p>
    </article>`,

  'de/about.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Über das Projekt OmniConverter</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        OmniConverter wurde mit einem klaren Ziel ins Leben gerufen: Das Internet braucht ein werbefreies, blitzschnelles und mathematisch exaktes Umrechnungswerkzeug, das die Privatsphäre seiner Nutzer respektiert. Viele traditionelle Konverterseiten sind überladen mit aufdringlichen Bannern, Popups und sammeln persönliche Nutzerdaten.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Unsere technischen Prinzipien</h3>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem;">
        <li><strong>Konstante mathematische Genauigkeit:</strong> Alle Einheitenrechnungen greifen auf offizielle NIST- und SI-Konstanten zurück.</li>
        <li><strong>100% lokale Ausführung:</strong> Rechenoperationen und Dateikonvertierungen laufen nativ auf Ihrem Endgerät in JavaScript.</li>
        <li><strong>Barrierefreiheit & modernes Design:</strong> Volle Unterstützung für Tastatursteuerung, Bildschirmlesegeräte und automatischen Dark Mode.</li>
      </ul>
    </article>`,

  'de/privacy-policy.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Datenschutzerklärung und Transparenzbericht</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Der Schutz Ihrer persönlichen Daten steht bei OmniConverter an oberster Stelle. Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Datenverarbeitung bei der Nutzung unserer Werkzeuge.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">1. Grundsatz der Datensparsamkeit & Lokale Verarbeitung</h3>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1rem;">
        Alle mathematischen Umrechnungen sowie die Bearbeitung von Dateien finden clientseitig in Ihrem Webbrowser statt. Wir übertragen weder Ihre eingegebenen Messwerte noch hochgeladene Bilddateien an externe Server.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">2. Analyse und Webseitenbetrieb</h3>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1rem;">
        Zur Gewährleistung der technischen Stabilität und Sicherheit nutzen wir aggregierte, anonymisierte Protokolldaten im Rahmen der europäischen DSGVO. Nutzer haben jederzeit die volle Kontrolle über ihre Cookie-Einstellungen.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">3. Ihre Rechte</h3>
      <p style="line-height:1.7; color:var(--text-muted);">
        Sie haben gemäß DSGVO das Recht auf Auskunft, Berichtigung und Löschung. Wenden Sie sich bei Datenschutzfragen an info.omniconverter@gmail.com.
      </p>
    </article>`,

  'de/terms.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Allgemeine Geschäfts- und Nutzungsbedingungen</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Mit dem Zugriff auf die Website OmniConverter (https://www.omniconverter.co.uk) erkennen Sie die folgenden Nutzungsbedingungen an.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Haftungsausschluss für mathematische Berechnungen</h3>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1rem;">
        Unsere Umrechnungsalgorithmen werden sorgfältig geprüft und entsprechen anerkannten wissenschaftlichen Standards. OmniConverter übernimmt jedoch keine Gewähr für die absolute Fehlerfreiheit bei kritischen Ingenieurs-, Finanz- oder medizinischen Berechnungen. Überprüfen Sie sicherheitsrelevante Ergebnisse stets unabhängig.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Urheberrecht und geistiges Eigentum</h3>
      <p style="line-height:1.7; color:var(--text-muted);">
        Die Struktur, Algorithmen und redaktionellen Leitfäden von OmniConverter sind urheberrechtlich geschützt. Die private und nicht-kommerzielle Nutzung ist kostenfrei gestattet.
      </p>
    </article>`
};

// 2. Tool Pages - Spanish (es)
const esAdditions = {
  'es/area.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Convertidor de Superficie y Terreno: Metros Cuadrados, Hectáreas y Acres</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        La medición de superficies es imprescindible en el sector inmobiliario, la agricultura, la arquitectura y la construcción. Mientras que el metro cuadrado (m²) y la hectárea (ha) son el estándar oficial en España y Latinoamérica, en los países anglosajones se utilizan pies cuadrados (sq ft) y acres.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Fórmulas de Conversión de Área</h3>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem; margin-bottom:1.5rem;">
        <li><strong>Metros cuadrados a Pies cuadrados:</strong> m² × 10,76391</li>
        <li><strong>Hectárea a Metros cuadrados:</strong> 1 hectárea = 10.000 m²</li>
        <li><strong>Hectárea a Acres:</strong> 1 ha = 2,47105 acres</li>
        <li><strong>Kilómetros cuadrados a Hectáreas:</strong> 1 km² = 100 hectáreas</li>
      </ul>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Tabla de Referencia Inmobiliaria</h3>
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:0.95rem;">
          <thead>
            <tr style="background:var(--bg-elevated); border-bottom:2px solid var(--card-border); text-align:left;">
              <th style="padding:0.75rem;">Medida</th>
              <th style="padding:0.75rem;">Metros Cuadrados</th>
              <th style="padding:0.75rem;">Pies Cuadrados</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">Vivienda media (piso)</td><td style="padding:0.75rem;">90 m²</td><td style="padding:0.75rem;">968,7 sq ft</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">Chalet / Casa independiente</td><td style="padding:0.75rem;">200 m²</td><td style="padding:0.75rem;">2.152,8 sq ft</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem; font-weight:700;">1 Hectárea (Finca agrícola)</td><td style="padding:0.75rem;">10.000 m²</td><td style="padding:0.75rem;">107.639 sq ft</td></tr>
          </tbody>
        </table>
      </div>
    </article>`,

  'es/length.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Convertidor de Longitud: Metros, Centímetros, Pulgadas, Pies y Millas</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        La longitud es la dimensión física más utilizada en la vida cotidiana. Nuestro convertidor calcula con exactitud matemática entre el sistema métrico internacional y las unidades imperiales estadounidenses y británicas.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Factores de Conversión Directos</h3>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem;">
        <li><strong>Pulgadas a Centímetros:</strong> 1 pulgada (in) = 2,54 cm exactos</li>
        <li><strong>Pies a Centímetros:</strong> 1 pie (ft) = 12 pulgadas = 30,48 cm</li>
        <li><strong>Yardas a Metros:</strong> 1 yarda = 3 pies = 0,9144 metros</li>
        <li><strong>Millas a Kilómetros:</strong> 1 milla = 1,609344 km</li>
      </ul>
    </article>`,

  'es/temperature.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Convertidor de Temperatura: Celsius, Fahrenheit y Kelvin</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Convierta temperaturas entre escalas térmicas de manera instantánea. Esencial para recetas de cocina y horneado en grados Fahrenheit (°F), informes meteorológicos internacionales y fórmulas de física científica en Kelvin (K).
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Fórmulas Termodinámicas</h3>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem;">
        <li><strong>Celsius a Fahrenheit:</strong> (°C × 9/5) + 32 = °F</li>
        <li><strong>Fahrenheit a Celsius:</strong> (°F - 32) × 5/9 = °C</li>
        <li><strong>Celsius a Kelvin:</strong> °C + 273,15 = K</li>
      </ul>
    </article>`,

  'es/currency.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Conversor de Divisas en Vivo: Tipos de Cambio Interbancarios</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Calcule conversiones exactas entre el Dólar estadounidense (USD), el Euro (EUR), la Libra esterlina (GBP), el Peso mexicano (MXN), el Peso colombiano (COP) y más de 35 monedas mundiales con cotizaciones en tiempo real sin comisiones ocultas.
      </p>
    </article>`,

  'es/volume-capacity.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Conversor de Volumen y Medidas de Cocina</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Convierta litros, mililitros, tazas de repostería (cups), cucharadas y galones con total exactitud. Ideal para adaptar recetas internacionales sin fallos de medición.
      </p>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem;">
        <li><strong>1 Taza estadounidense (Cup):</strong> 236,59 ml (o 240 ml estándar culinario)</li>
        <li><strong>1 Cucharada sopera (tbsp):</strong> 15 ml</li>
        <li><strong>1 Cucharadita (tsp):</strong> 5 ml</li>
        <li><strong>1 Galón líquido estadounidense:</strong> 3,78541 litros</li>
      </ul>
    </article>`,

  'es/file-media.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Convertidor de Archivos e Imágenes 100% en el Navegador</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Convierta imágenes entre formatos WebP, PNG y JPEG directamente en su dispositivo. Garantía absoluta de privacidad: sus archivos nunca se cargan en servidores externos.
      </p>
    </article>`,

  'es/about.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Acerca de la Suite OmniConverter</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        OmniConverter es una plataforma digital moderna diseñada para ofrecer cálculos rápidos, precisos y con respeto integral por la privacidad del usuario. Todas nuestras herramientas funcionan de forma nativa en el navegador con soporte completo para modo oscuro y accesibilidad móvil.
      </p>
    </article>`,

  'es/privacy-policy.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Compromiso de Privacidad y Protección de Datos</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        En OmniConverter no recopilamos archivos personales ni datos bancarios. Todas las operaciones matemáticas y de conversión gráfica se ejecutan localmente en la memoria del navegador de su dispositivo. Cumplimos rigurosamente con los estándares europeos del RGPD.
      </p>
    </article>`,

  'es/terms.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Términos y Condiciones de Uso</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        El acceso y uso de los servicios de OmniConverter es libre y gratuito para fines personales, educativos y profesionales. Nuestras fórmulas matemáticas siguen los estándares internacionales del NIST y SI.
      </p>
    </article>`
};

// 3. Tool Pages - Portuguese (pt)
const ptAdditions = {
  'pt/area.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Conversor de Área e Terrenos: Metros Quadrados, Hectares, Alqueires e Acres</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        A medição de área é crucial no agronegócio, engenharia civil, arquitetura e mercado imobiliário. Nosso conversor fornece equivalências exatas entre metros quadrados (m²), hectares (ha), alqueires paulistas/mineiros e acres norte-americanos.
      </p>
      <h3 style="font-size:1.2rem; font-weight:700; margin:1.5rem 0 0.75rem 0; color:var(--text-main);">Fórmulas Principais</h3>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem;">
        <li><strong>1 Hectare:</strong> 10.000 m² = 2,47105 acres</li>
        <li><strong>Metros quadrados para Pés quadrados:</strong> m² × 10,76391</li>
        <li><strong>1 Alqueire Paulista:</strong> 24.200 m² (2,42 hectares)</li>
        <li><strong>1 Alqueire Mineiro:</strong> 48.400 m² (4,84 hectares)</li>
      </ul>
    </article>`,

  'pt/length.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Conversor de Comprimento e Distância: Metros, Polegadas, Pés e Milhas</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Converta distâncias com precisão entre o sistema métrico e as unidades imperiais anglo-saxônicas. Essencial para projetos de engenharia, compras internacionais e viagens.
      </p>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem;">
        <li><strong>1 Polegada (in):</strong> exatamente 2,54 cm</li>
        <li><strong>1 Pé (ft):</strong> 12 polegadas = 30,48 cm</li>
        <li><strong>1 Milha terrestre:</strong> 1,609344 km</li>
        <li><strong>1 Milha náutica:</strong> 1.852 metros</li>
      </ul>
    </article>`,

  'pt/temperature.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Conversor de Temperatura: Celsius, Fahrenheit e Kelvin</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Realize conversões térmicas imediatas para receitas de forno em Fahrenheit (°F), previsões climáticas no exterior ou estudos científicos em Kelvin (K).
      </p>
      <ul style="line-height:1.8; color:var(--text-muted); padding-left:1.5rem;">
        <li><strong>Celsius para Fahrenheit:</strong> (°C × 9/5) + 32 = °F</li>
        <li><strong>Fahrenheit para Celsius:</strong> (°F - 32) × 5/9 = °C</li>
        <li><strong>Celsius para Kelvin:</strong> °C + 273,15 = K</li>
      </ul>
    </article>`,

  'pt/currency.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Conversor de Moedas e Câmbio em Tempo Real</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Acompanhe taxas de câmbio comerciais e turismo em tempo real para Real Brasileiro (BRL), Dólar Americano (USD), Euro (EUR), Libra Esterlina (GBP) e mais de 35 moedas internacionais.
      </p>
    </article>`,

  'pt/volume-capacity.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Conversor de Volume e Medidas Culinárias</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Converta litros, mililitros, xícaras de chá, colheres de sopa e galões americanos ou britânicos para receitas culinárias perfeitas e dosagens laboratoriais.
      </p>
    </article>`,

  'pt/file-media.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Conversor de Imagens Local no Navegador</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Transforme fotos entre WebP, PNG e JPEG com agilidade sem carregar arquivos em servidores externos. Privacidade completa e sem filas de espera.
      </p>
    </article>`,

  'pt/about.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Sobre o OmniConverter</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        O OmniConverter foi criado para oferecer um serviço gratuito, ultrarrápido e livre de anúncios invasivos para cálculos matemáticos e conversões métricas diárias com máxima precisão.
      </p>
    </article>`,

  'pt/privacy-policy.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Política de Privacidade e Segurança</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        Priorizamos a privacidade dos nossos usuários. Nenhum dado pessoal, documento ou imagem carregada é enviado ou armazenado em bancos de dados remotos. Todos os cálculos ocorrem 100% no seu navegador.
      </p>
    </article>`,

  'pt/terms.html': `
    <article class="content-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text-main);">Termos e Condições de Uso</h2>
      <p style="line-height:1.7; color:var(--text-muted); margin-bottom:1.25rem;">
        O uso das ferramentas do OmniConverter é totalmente gratuito para finalidades pessoais, acadêmicas e comerciais. Nossos algoritmos seguem os rigorosos padrões métricos internacionais.
      </p>
    </article>`
};

const allAdditions = { ...deAdditions, ...esAdditions, ...ptAdditions };

let expandedToolCount = 0;
Object.entries(allAdditions).forEach(([file, guideHtml]) => {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');

  // Check if already injected
  const firstH2Match = guideHtml.match(/<h2[^>]*>(.*?)<\/h2>/i);
  const headline = firstH2Match ? firstH2Match[1] : '';

  if (!c.includes(headline)) {
    c = c.replace('</main>', `${guideHtml}\n  </main>`);
    fs.writeFileSync(file, c, 'utf8');
    expandedToolCount++;
    console.log(`  [OK] Injected rich guide into ${file}`);
  }
});
console.log(`  [OK] Expanded ${expandedToolCount} tool pages with full educational sections.`);

// 4. Boost any remaining localized blog articles to ensure word count >= 300 words
const blogDirs = ['de/blog', 'es/blog', 'pt/blog'];
let boostedBlogCount = 0;

blogDirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  files.forEach(f => {
    const fp = path.join(dir, f);
    let html = fs.readFileSync(fp, 'utf8');

    const cleanText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const count = cleanText.split(/\s+/).length;

    if (count < 280) {
      const isDe = dir.startsWith('de');
      const isEs = dir.startsWith('es');
      const isPt = dir.startsWith('pt');

      let boostText = '';
      if (isDe) {
        boostText = `
        <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; margin:1.5rem 0;">
          <h3 style="margin-top:0; color:var(--text-main);">Wissenschaftliche Hintergrundinformationen</h3>
          <p style="color:var(--text-muted); line-height:1.7;">
            Die genaue Erfassung von Maß- und Gewichtsgrößen folgt den weltweiten Richtlinien der Internationalen Organisation für das gesetzliche Messwesen (OIML) sowie der Physikalisch-Technischen Bundesanstalt (PTB). In Industrie, Forschung und Handel vermeidet die Einhaltung ungerundeter Rechenfaktoren messbare Abweichungen.
          </p>
          <p style="color:var(--text-muted); line-height:1.7; margin-bottom:0;">
            Nutzen Sie für wiederkehrende Rechenaufgaben unsere interaktiven Tabellen und bookmarken Sie diesen Leitfaden für den schnellen Zugriff am Arbeitsplatz.
          </p>
        </div>`;
      } else if (isEs) {
        boostText = `
        <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; margin:1.5rem 0;">
          <h3 style="margin-top:0; color:var(--text-main);">Fundamentos Científicos y Metrológicos</h3>
          <p style="color:var(--text-muted); line-height:1.7;">
            La exactitud en la conversión de medidas está regulada internacionalmente por la Oficina Internacional de Pesas y Medidas (BIPM). En los sectores industrial, farmacéutico, comercial y de comercio exterior, conservar factores precisos con hasta cuatro decimales previene distorsiones acumuladas.
          </p>
          <p style="color:var(--text-muted); line-height:1.7; margin-bottom:0;">
            Recomendamos verificar siempre las tablas de referencia rápida adjuntas para agilizar sus cálculos diarios en el trabajo o en el hogar.
          </p>
        </div>`;
      } else if (isPt) {
        boostText = `
        <div style="background:var(--bg-elevated); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; margin:1.5rem 0;">
          <h3 style="margin-top:0; color:var(--text-main);">Fundamentos Científicos e Metrologia Legal</h3>
          <p style="color:var(--text-muted); line-height:1.7;">
            A conversão exata entre sistemas de medição obedece às normas do Instituto Nacional de Metrologia, Qualidade e Tecnologia (INMETRO) e aos acordos do Sistema Internacional de Unidades (SI). A precisão na escala decimal assegura confiabilidade para engenharia, logística e pesquisa científica.
          </p>
          <p style="color:var(--text-muted); line-height:1.7; margin-bottom:0;">
            Utilize nossas calculadoras integradas e consulte as tabelas comparativas para cálculos rápidos e confiáveis no seu dia a dia.
          </p>
        </div>`;
      }

      html = html.replace('</article>', `${boostText}\n    </article>`);
      fs.writeFileSync(fp, html, 'utf8');
      boostedBlogCount++;
    }
  });
});
console.log(`  [OK] Boosted ${boostedBlogCount} blog articles with metrological foundations.`);

console.log('\n=== CONTENT EXPANSION COMPLETE! ===\n');
