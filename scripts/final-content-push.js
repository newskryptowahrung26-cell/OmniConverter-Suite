const fs = require('fs');

const finalPushes = {
  'es/terms.html': `
    <article class="content-section" style="margin-top:1.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main);">Disposiciones Legales Adicionales</h3>
      <p style="color:var(--text-muted); line-height:1.7;">
        OmniConverter se reserva el derecho de modificar o actualizar estos términos en cualquier momento para reflejar cambios normativos o la incorporación de nuevos módulos de cálculo. El uso continuado del sitio tras dichas modificaciones constituye la aceptación plena de los términos actualizados. Para cualquier consulta legal, contáctenos en info.omniconverter@gmail.com.
      </p>
    </article>`,

  'pt/about.html': `
    <article class="content-section" style="margin-top:1.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main);">Compromisso com a Educação e Inovação</h3>
      <p style="color:var(--text-muted); line-height:1.7;">
        Desenvolvido com foco na experiência do usuário, o OmniConverter apoia estudantes, pesquisadores e profissionais com tabelas dinâmicas, atalhos de cálculo mental e referências do mundo real. Nossa infraestrutura foi desenhada para carregar em menos de um segundo em qualquer rede móvel.
      </p>
    </article>`,

  'pt/terms.html': `
    <article class="content-section" style="margin-top:1.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main);">Cláusulas Complementares de Uso</h3>
      <p style="color:var(--text-muted); line-height:1.7;">
        O OmniConverter reserva-se o direito de aprimorar ou atualizar estes termos periodicamente para cumprir legislações vigentes e introduzir novas ferramentas de conversão. O acesso contínuo aos nossos serviços após tais revisões implica a aceitação integral dos termos vigentes.
      </p>
    </article>`,

  'pt/volume-capacity.html': `
    <article class="content-section" style="margin-top:1.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:1.25rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main);">Tabela de Equivalências Culinárias Comuns</h3>
      <p style="color:var(--text-muted); line-height:1.7;">
        Ao cozinhar pratos internacionais, lembre-se de que 1 xícara padrão de líquidos equivale a aproximadamente 240 ml, enquanto 1 colher de sopa mede exatamente 15 ml e 1 colher de chá corresponde a 5 ml. Para ingredientes densos como mel ou farinha, consulte nossas tabelas de massa equivalentes.
      </p>
    </article>`,

  'pt/weight-mass.html': `
    <article class="content-section" style="margin-top:1.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:2rem 1.75rem;">
      <h3 style="margin-top:0; color:var(--text-main);">Guia Prático de Pesos no Cotidiano</h3>
      <p style="color:var(--text-muted); line-height:1.7;">
        Compreender a relação entre quilogramas (kg) e libras (lbs) é fundamental para bagagens em aeroportos internacionais, onde a franquia máxima para malas despachadas é de 23 kg (aproximadamente 50,7 lbs). No fisiculturismo e academias, as anilhas olímpicas costumam ser identificadas em libras (como 45 lbs correspondendo a cerca de 20,4 kg).
      </p>
      <div style="overflow-x:auto; margin-top:1rem;">
        <table style="width:100%; border-collapse:collapse; font-size:0.95rem;">
          <thead>
            <tr style="background:var(--bg-elevated); border-bottom:2px solid var(--card-border); text-align:left;">
              <th style="padding:0.75rem;">Quilogramas (kg)</th>
              <th style="padding:0.75rem;">Libras (lbs)</th>
              <th style="padding:0.75rem;">Onças (oz)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem;">1 kg</td><td style="padding:0.75rem;">2,205 lbs</td><td style="padding:0.75rem;">35,27 oz</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem;">5 kg</td><td style="padding:0.75rem;">11,023 lbs</td><td style="padding:0.75rem;">176,37 oz</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem;">10 kg</td><td style="padding:0.75rem;">22,046 lbs</td><td style="padding:0.75rem;">352,74 oz</td></tr>
            <tr style="border-bottom:1px solid var(--card-border);"><td style="padding:0.75rem;">23 kg</td><td style="padding:0.75rem;">50,706 lbs</td><td style="padding:0.75rem;">811,30 oz</td></tr>
          </tbody>
        </table>
      </div>
    </article>`,

  'de/time-zone.html': `
    <article class="content-section" style="margin-top:1.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main);">Internationale Geschäfts- und Börsenzeiten im Überblick</h3>
      <p style="color:var(--text-muted); line-height:1.7;">
        Für Händler und globale Unternehmen ist die zeitliche Überlappung der wichtigsten Handelsplätze von herausragender Bedeutung. Die Frankfurter Wertpapierbörse und Xetra (9:00 bis 17:30 Uhr MEZ) überschneiden sich am Nachmittag für ca. 2 Stunden mit der New Yorker Wall Street (NYSE / NASDAQ, geöffnet von 15:30 bis 22:00 Uhr deutscher Zeit). In diesem Zeitfenster verzeichnet das globale Handelsvolumen traditionell seine stärksten Ausschläge.
      </p>
      <p style="color:var(--text-muted); line-height:1.7; margin-bottom:0;">
        Nutzen Sie unseren Konferenzrechner, um Einladungen für Microsoft Teams, Zoom oder Google Meet ohne manuelle Rechenfehler an internationale Partner in Tokio, Singapur, London oder Los Angeles zu versenden.
      </p>
    </article>`,

  'pt/time-zone.html': `
    <article class="content-section" style="margin-top:1.5rem; background:var(--bg-surface); border:1px solid var(--card-border); border-radius:var(--radius-xl); padding:1.75rem 1.5rem;">
      <h3 style="margin-top:0; color:var(--text-main);">Horários dos Mercados Financeiros e Negócios Globais</h3>
      <p style="color:var(--text-muted); line-height:1.7;">
        Para investidores e empresas multinacionais que operam entre o Brasil, Portugal e outros polos financeiros, compreender a sobreposição dos mercados é fundamental. A bolsa B3 em São Paulo opera em sintonia próxima com Wall Street em Nova York, enquanto a abertura das bolsas europeias (Euronext Lisboa, Frankfurt e Londres) coincide com o início da manhã no horário de Brasília.
      </p>
      <p style="color:var(--text-muted); line-height:1.7; margin-bottom:0;">
        Use o nosso planejador visual para agendar videoconferências em horários convenientes para todas as partes, prevenindo reuniões fora do expediente comercial de cada país.
      </p>
    </article>`
};

Object.entries(finalPushes).forEach(([file, html]) => {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace('</main>', `${html}\n  </main>`);
  fs.writeFileSync(file, c, 'utf8');
  console.log(`  [OK] Final push injected into ${file}`);
});
