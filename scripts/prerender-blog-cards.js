const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

// Helper to render static HTML card
function renderCard(item) {
  const targetUrl = item.slug.startsWith('/') ? item.slug : `/blog/${item.slug}`;
  const imgHtml = item.image 
    ? `<a href="${targetUrl}"><img src="${item.image}" alt="${item.title.replace(/"/g, '&quot;')}" style="width: 100%; height: 160px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: 0.85rem; border: 1px solid var(--card-border);" loading="lazy"></a>`
    : '';

  return `      <article class="blog-card" style="padding: 1.25rem;">
        <div>
          ${imgHtml}
          <div class="blog-card-header" style="margin-bottom: 0.6rem; display:flex; justify-content:space-between; align-items:center;">
            <span class="blog-card-tag">${item.category || 'Guide'}</span>
            <span class="blog-card-icon" style="font-size: 1.25rem;">${item.icon || '📄'}</span>
          </div>
          <h3 class="blog-card-title" style="font-size: 1.1rem; margin-bottom: 0.5rem; line-height: 1.35;">
            <a href="${targetUrl}">${item.title}</a>
          </h3>
          <p class="blog-card-summary" style="font-size: 0.88rem; line-height: 1.5; margin-bottom: 1rem;">${item.summary || ''}</p>
        </div>
        <div class="blog-card-footer" style="padding-top: 0.75rem; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">${item.date || '2026-10-15'}</span>
          <a href="${targetUrl}" class="blog-btn-read" style="font-size: 0.85rem;">Read Post &rarr;</a>
        </div>
      </article>`;
}

// Config per language
const configs = [
  {
    lang: 'en',
    htmlPath: path.join(rootDir, 'blog.html'),
    dataPath: path.join(rootDir, 'blog-data.js'),
    pageInfoText: (total) => `Showing 1-12 of ${total} articles`,
    offtopic: [
      'indonesia-cu',
      'convert-pdf-form',
      'convert-file-type-to-pdf',
      'converter-application-download',
      'file-changer',
      'how-to-change-file-format'
    ]
  },
  {
    lang: 'es',
    htmlPath: path.join(rootDir, 'es', 'blog.html'),
    dataPath: path.join(rootDir, 'es', 'blog-data.js'),
    pageInfoText: (total) => `Mostrando 1-12 de ${total} artículos`,
    offtopic: [
      'guia-moneda-indonesia',
      'convertir-formulario-pdf',
      'convertir-tipo-de-archivo-a-pdf',
      'como-cambiar-formato-de-archivo'
    ]
  },
  {
    lang: 'de',
    htmlPath: path.join(rootDir, 'de', 'blog.html'),
    dataPath: path.join(rootDir, 'de', 'blog-data.js'),
    pageInfoText: (total) => `Zeige 1-12 von ${total} Artikeln`,
    offtopic: [
      'indonesische-waehrung-ratgeber',
      'pdf-formular-umwandeln',
      'dateityp-in-pdf-umwandeln',
      'dateiformat-aendern-anleitung',
      'dateiumwandler'
    ]
  },
  {
    lang: 'pt',
    htmlPath: path.join(rootDir, 'pt', 'blog.html'),
    dataPath: path.join(rootDir, 'pt', 'blog-data.js'),
    pageInfoText: (total) => `Mostrando 1-12 de ${total} artigos`,
    offtopic: [
      'guia-moeda-indonesia',
      'converter-formulario-pdf',
      'converter-tipo-de-archivo-para-pdf',
      'como-mudar-formato-de-arquivo',
      'modificador-de-arquivos',
      'baixar-aplicativo-conversor'
    ]
  }
];

configs.forEach(cfg => {
  if (!fs.existsSync(cfg.htmlPath) || !fs.existsSync(cfg.dataPath)) {
    console.log(`Skipping ${cfg.lang}: files not found`);
    return;
  }

  const jsCode = fs.readFileSync(cfg.dataPath, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(jsCode, sandbox);
  const posts = sandbox.window.BLOG_POSTS || [];

  // Filter out offtopic
  const validPosts = posts.filter(p => {
    const slugName = (p.slug || '').replace(/^\/([a-z]{2}\/)?blog\//, '');
    return !cfg.offtopic.includes(slugName);
  });

  const cardsHtml = validPosts.slice(0, 12).map(renderCard).join('\n');

  let html = fs.readFileSync(cfg.htmlPath, 'utf8');

  // Replace <section class="blog-cards-grid" id="blogGrid"> ... </section>
  const gridRegex = /(<section class="blog-cards-grid" id="blogGrid">)[\s\S]*?(<\/section>)/;
  if (gridRegex.test(html)) {
    html = html.replace(gridRegex, `$1\n${cardsHtml}\n    $2`);
    console.log(`[${cfg.lang}] Injected ${Math.min(12, validPosts.length)} prerendered cards into #blogGrid`);
  } else {
    console.warn(`[${cfg.lang}] #blogGrid not found in HTML`);
  }

  // Update initial pagination text
  const pageInfoRegex = /(<div class="page-info" id="pageInfo">)[\s\S]*?(<\/div>)/;
  if (pageInfoRegex.test(html)) {
    html = html.replace(pageInfoRegex, `$1${cfg.pageInfoText(validPosts.length)}$2`);
  }

  // Ensure paginationWrapper is visible if validPosts.length > 0
  html = html.replace(/id="paginationWrapper"\s+style="display:\s*none;"/, 'id="paginationWrapper"');

  fs.writeFileSync(cfg.htmlPath, html, 'utf8');
  console.log(`[${cfg.lang}] Successfully updated ${cfg.htmlPath}`);
});
