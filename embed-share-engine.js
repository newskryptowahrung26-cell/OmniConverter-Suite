// Universal Embed Widget & Viral Share Deep-Linking Engine
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    initEmbedWidgetModal();
    initShareResultAndUrlParams();
  });

  // 1. URL Query Parameter Sync & Deep-Linking (?val=50&from=F&to=C)
  function initShareResultAndUrlParams() {
    const inputVal = document.getElementById('liveToolInput') || document.getElementById('liveTempInput') || document.getElementById('tempInput') || document.getElementById('weightInput') || document.getElementById('currencyInput');
    const fromUnit = document.getElementById('liveToolFromUnit') || document.getElementById('liveFromUnit') || document.getElementById('fromSelect') || document.getElementById('weightFromSelect') || document.getElementById('currencyFromSelect');
    const toUnit = document.getElementById('liveToolToUnit') || document.getElementById('liveToUnit') || document.getElementById('toSelect') || document.getElementById('weightToSelect') || document.getElementById('currencyToSelect');
    const convertBtn = document.getElementById('convertBtn') || document.getElementById('weightConvertBtn') || document.getElementById('currencyConvertBtn');

    if (!inputVal) return;

    // A. Parse incoming URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paramVal = urlParams.get('val') || urlParams.get('amount') || urlParams.get('q');
    const paramFrom = urlParams.get('from');
    const paramTo = urlParams.get('to');

    let shouldRecalc = false;
    if (paramVal && !isNaN(parseFloat(paramVal))) {
      inputVal.value = paramVal;
      shouldRecalc = true;
    }
    if (paramFrom && fromUnit) {
      for (let opt of fromUnit.options) {
        if (opt.value.toLowerCase() === paramFrom.toLowerCase()) {
          fromUnit.value = opt.value;
          shouldRecalc = true;
          break;
        }
      }
    }
    if (paramTo && toUnit) {
      for (let opt of toUnit.options) {
        if (opt.value.toLowerCase() === paramTo.toLowerCase()) {
          toUnit.value = opt.value;
          shouldRecalc = true;
          break;
        }
      }
    }

    if (shouldRecalc) {
      inputVal.dispatchEvent(new Event('input', { bubbles: true }));
      if (fromUnit) fromUnit.dispatchEvent(new Event('change', { bubbles: true }));
      if (toUnit) toUnit.dispatchEvent(new Event('change', { bubbles: true }));
      if (convertBtn) convertBtn.click();
    }

    // B. Add "🔗 Share Link" & "📲 WhatsApp" buttons next to Copy / Print
    const copyBtn = document.getElementById('liveToolCopyBtn') || document.getElementById('liveCopyBtn') || document.getElementById('copyBtn') || document.getElementById('weightCopyBtn') || document.getElementById('currencyCopyBtn');
    if (copyBtn && !document.getElementById('omniconverter-share-btn')) {
      const shareBtn = document.createElement('button');
      shareBtn.id = 'omniconverter-share-btn';
      shareBtn.type = 'button';
      shareBtn.className = 'tab-btn';
      shareBtn.style.cssText = `
        padding: 0.6rem 1rem;
        font-weight: 700;
        border: 1px solid var(--card-border, #e2e8f0);
        background: var(--bg-surface, #ffffff);
        color: var(--text-main, #0f172a);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        border-radius: var(--radius-md, 8px);
      `;

      const path = window.location.pathname;
      const lang = path.startsWith('/es/') ? 'es' : (path.startsWith('/de/') ? 'de' : (path.startsWith('/pt/') ? 'pt' : 'en'));
      let shareLabel = '🔗 Share Link';
      if (lang === 'es') shareLabel = '🔗 Compartir';
      else if (lang === 'de') shareLabel = '🔗 Teilen';
      else if (lang === 'pt') shareLabel = '🔗 Compartilhar';

      shareBtn.innerHTML = `<span>🔗</span> <span>${shareLabel}</span>`;
      
      shareBtn.addEventListener('click', async () => {
        const val = encodeURIComponent(inputVal.value);
        const f = fromUnit ? encodeURIComponent(fromUnit.value) : '';
        const t = toUnit ? encodeURIComponent(toUnit.value) : '';
        
        const shareUrl = `${window.location.origin}${window.location.pathname}?val=${val}${f ? '&from=' + f : ''}${t ? '&to=' + t : ''}`;
        
        if (navigator.share) {
          try {
            await navigator.share({
              title: document.title,
              text: `Check this calculation on OmniConverter:`,
              url: shareUrl
            });
            return;
          } catch (e) {}
        }

        // Fallback: Clipboard copy
        try {
          await navigator.clipboard.writeText(shareUrl);
          showToast(lang === 'es' ? '¡Enlace directo copiado!' : (lang === 'de' ? 'Direktlink kopiert!' : (lang === 'pt' ? 'Link direto copiado!' : 'Shareable link copied to clipboard!')));
        } catch (err) {
          prompt('Copy this shareable link:', shareUrl);
        }
      });

      if (copyBtn.parentElement) {
        copyBtn.parentElement.appendChild(shareBtn);
      }
    }
  }

  // 2. Embed This Calculator Widget Modal
  function initEmbedWidgetModal() {
    const copyBtn = document.getElementById('liveToolCopyBtn') || document.getElementById('liveCopyBtn') || document.getElementById('copyBtn') || document.getElementById('weightCopyBtn') || document.getElementById('currencyCopyBtn');
    if (!copyBtn || document.getElementById('omniconverter-embed-btn')) return;

    const path = window.location.pathname;
    const lang = path.startsWith('/es/') ? 'es' : (path.startsWith('/de/') ? 'de' : (path.startsWith('/pt/') ? 'pt' : 'en'));

    let embedLabel = '</> Embed Widget';
    let modalTitle = 'Embed This Calculator on Your Website';
    let modalDesc = 'Copy and paste the responsive embed code below into your blog, CMS, or website HTML:';
    let copyCodeLabel = 'Copy Embed Code';
    let copiedToast = 'Embed code copied to clipboard!';

    if (lang === 'es') {
      embedLabel = '</> Insertar Widget';
      modalTitle = 'Inserta esta Calculadora en tu Sitio Web';
      modalDesc = 'Copia y pega este código HTML responsivo en tu blog o página web:';
      copyCodeLabel = 'Copiar Código';
      copiedToast = '¡Código de inserción copiado!';
    } else if (lang === 'de') {
      embedLabel = '</> Widget einbetten';
      modalTitle = 'Diesen Rechner auf Ihrer Website einbinden';
      modalDesc = 'Kopieren Sie diesen responsiven HTML-Code in Ihren Blog oder Ihre Website:';
      copyCodeLabel = 'Code kopieren';
      copiedToast = 'Einbettungscode kopiert!';
    } else if (lang === 'pt') {
      embedLabel = '</> Incorporar Widget';
      modalTitle = 'Incorpore esta Calculadora no seu Site';
      modalDesc = 'Copie e cole este código HTML responsivo no seu blog ou página web:';
      copyCodeLabel = 'Copiar Código';
      copiedToast = 'Código de incorporação copiado!';
    }

    const embedBtn = document.createElement('button');
    embedBtn.id = 'omniconverter-embed-btn';
    embedBtn.type = 'button';
    embedBtn.className = 'tab-btn';
    embedBtn.style.cssText = `
      padding: 0.6rem 1rem;
      font-weight: 700;
      border: 1px solid rgba(99, 102, 241, 0.3);
      background: rgba(99, 102, 241, 0.08);
      color: var(--primary-600, #4f46e5);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      border-radius: var(--radius-md, 8px);
    `;
    embedBtn.innerHTML = `<span>&lt;/&gt;</span> <span>${embedLabel}</span>`;

    embedBtn.addEventListener('click', () => {
      openEmbedModal({ modalTitle, modalDesc, copyCodeLabel, copiedToast });
    });

    if (copyBtn.parentElement) {
      copyBtn.parentElement.appendChild(embedBtn);
    }
  }

  function openEmbedModal({ modalTitle, modalDesc, copyCodeLabel, copiedToast }) {
    let modal = document.getElementById('omniconverter-embed-modal');
    const embedUrl = `${window.location.origin}${window.location.pathname}`;
    const pageTitle = document.title.split('|')[0].trim() || 'Online Calculator';
    
    // High-Authority Backlink HTML snippet
    const embedHtmlCode = `<!-- OmniConverter Free Widget -->\n<iframe src="${embedUrl}" width="100%" height="450" style="border:1px solid #e2e8f0; border-radius:12px; max-width:600px; box-shadow:0 4px 12px rgba(0,0,0,0.05);" loading="lazy" title="${pageTitle}"></iframe>\n<p style="font-size:12px; color:#64748b; font-family:sans-serif; margin-top:4px;">Powered by <a href="${embedUrl}" target="_blank" rel="noopener" style="color:#4f46e5; text-decoration:none; font-weight:600;">OmniConverter: ${pageTitle}</a></p>`;

    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'omniconverter-embed-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(4px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999999;
        padding: 16px;
      `;

      modal.innerHTML = `
        <div style="background: #ffffff; color: #0f172a; max-width: 540px; width: 100%; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); padding: 24px; position: relative; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <button id="closeEmbedModalBtn" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b; padding: 4px 8px;">✕</button>
          <h3 style="margin: 0 0 8px 0; font-size: 1.25rem; font-weight: 800; color: #0f172a;">${modalTitle}</h3>
          <p style="margin: 0 0 16px 0; font-size: 0.9rem; color: #64748b; line-height: 1.5;">${modalDesc}</p>
          
          <div style="position: relative; margin-bottom: 16px;">
            <textarea id="embedCodeTextarea" readonly style="width: 100%; height: 110px; padding: 12px; font-family: monospace; font-size: 0.82rem; border-radius: 8px; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; resize: none; box-sizing: border-box;"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button id="copyEmbedCodeBtn" style="background: linear-gradient(135deg, #4f46e5, #6366f1); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 12px rgba(79,70,229,0.3);">
              📋 ${copyCodeLabel}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });

      document.getElementById('closeEmbedModalBtn').addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    const textarea = document.getElementById('embedCodeTextarea');
    if (textarea) textarea.value = embedHtmlCode;

    const copyBtn = document.getElementById('copyEmbedCodeBtn');
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(embedHtmlCode);
        showToast(copiedToast);
      } catch (err) {
        textarea.select();
        document.execCommand('copy');
        showToast(copiedToast);
      }
    };

    modal.style.display = 'flex';
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    } else {
      alert(msg);
    }
  }
})();
