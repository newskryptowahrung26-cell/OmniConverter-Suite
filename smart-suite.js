// OmniConverter Smart Suite: Theme Toggle, Quick Search (Ctrl+K), and Local History & Favorites
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initQuickSearch();
    initHistoryAndFavorites();
  });

  // ==========================================
  // 1. Dark / Light Mode Toggle
  // ==========================================
  function initThemeToggle() {
    const THEME_KEY = 'omniconverter_theme';
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(currentTheme);

    const langSwitcher = document.querySelector('.lang-switcher');
    if (!langSwitcher || document.getElementById('theme-toggle-btn')) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle-btn';
    toggleBtn.type = 'button';
    toggleBtn.setAttribute('aria-label', 'Toggle Dark/Light Mode');
    toggleBtn.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid var(--card-border, #e2e8f0);
      background: var(--card-bg, rgba(255,255,255,0.8));
      color: var(--text-main, #0f172a);
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      margin-left: 6px;
      padding: 0;
      flex-shrink: 0;
    `;
    toggleBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    toggleBtn.title = currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';

    toggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
      toggleBtn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
      toggleBtn.title = newTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });

    // Append INSIDE lang-switcher pill so it never floats or breaks the layout
    langSwitcher.appendChild(toggleBtn);
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #0b0f19 0%, #0f172a 50%, #1e1b4b 100%)');
      document.documentElement.style.setProperty('--card-bg', 'rgba(30, 41, 59, 0.85)');
      document.documentElement.style.setProperty('--card-border', 'rgba(51, 65, 85, 0.6)');
      document.documentElement.style.setProperty('--text-main', '#f8fafc');
      document.documentElement.style.setProperty('--text-muted', '#cbd5e1');
      document.documentElement.style.setProperty('--text-light', '#64748b');
      document.documentElement.style.setProperty('--bg-surface', 'rgba(15, 23, 42, 0.7)');
      document.documentElement.style.setProperty('--bg-elevated', 'rgba(30, 41, 59, 0.9)');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)');
      document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.85)');
      document.documentElement.style.setProperty('--card-border', 'rgba(226, 232, 240, 0.8)');
      document.documentElement.style.setProperty('--text-main', '#0f172a');
      document.documentElement.style.setProperty('--text-muted', '#64748b');
      document.documentElement.style.setProperty('--text-light', '#94a3b8');
      document.documentElement.style.setProperty('--bg-surface', '#ffffff');
      document.documentElement.style.setProperty('--bg-elevated', '#f8fafc');
    }
  }

  // ==========================================
  // 2. Instant Quick-Search (Ctrl + K / Cmd + K)
  // ==========================================
  function initQuickSearch() {
    const isSpanish = window.location.pathname.startsWith('/es/');
    const isGerman = window.location.pathname.startsWith('/de/');
    const isPortuguese = window.location.pathname.startsWith('/pt/');

    let searchPlaceholder = 'Search units, currencies & tools... (Ctrl + K)';
    if (isSpanish) searchPlaceholder = 'Buscar unidades, divisas y herramientas... (Ctrl + K)';
    else if (isGerman) searchPlaceholder = 'Einheiten, Währungen & Tools suchen... (Ctrl + K)';
    else if (isPortuguese) searchPlaceholder = 'Buscar unidades, moedas e ferramentas... (Ctrl + K)';

    // Insert Search button directly inside .nav-tabs as first clean tab item
    const navTabs = document.querySelector('.nav-tabs');
    if (navTabs && !document.getElementById('header-search-btn')) {
      const searchTrigger = document.createElement('button');
      searchTrigger.id = 'header-search-btn';
      searchTrigger.type = 'button';
      searchTrigger.className = 'tab-btn';
      searchTrigger.setAttribute('aria-label', 'Open Quick Search');
      searchTrigger.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 0.35rem 0.65rem;
        border-radius: var(--radius-lg, 14px);
        font-size: 0.82rem;
        font-weight: 700;
        background: rgba(99, 102, 241, 0.1);
        color: var(--primary-600, #4f46e5);
        border: 1px solid rgba(99, 102, 241, 0.25);
        cursor: pointer;
        flex-shrink: 0;
      `;
      searchTrigger.innerHTML = `<span>🔍</span> <span>Search</span> <kbd style="background:rgba(99,102,241,0.15); padding:1px 4px; border-radius:4px; font-size:0.7rem; font-family:monospace;">Ctrl K</kbd>`;
      
      searchTrigger.addEventListener('click', openSearchModal);
      navTabs.insertBefore(searchTrigger, navTabs.firstChild);
    }

    // Keyboard shortcut listener (Ctrl + K / Cmd + K)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      }
      if (e.key === 'Escape') {
        const modal = document.getElementById('omniconverter-search-modal');
        if (modal) modal.style.display = 'none';
      }
    });

    const searchableTools = [
      { name: 'Temperature Converter (°C, °F, K, °R)', url: '/temperature', tag: 'Tool' },
      { name: 'Oven Baking & Convection Fan Converter', url: '/temperature', tag: 'Culinary' },
      { name: 'Currency & Exchange Rate Calculator', url: '/currency', tag: 'Finance' },
      { name: 'Travel Card & Foreign ATM Fee Loss Estimator', url: '/currency', tag: 'Travel' },
      { name: 'Weight & Mass Converter (kg, lbs, stones, oz)', url: '/weight-mass', tag: 'Tool' },
      { name: 'Body Weight, Stone & Healthy BMI Goal Calculator', url: '/weight-mass', tag: 'Health' },
      { name: 'Length & Distance Converter (m, ft, inches, miles)', url: '/length', tag: 'Tool' },
      { name: '50 Fahrenheit to Celsius (10°C Exact)', url: '/blog/50-fahrenheit-to-celsius', tag: 'Guide' },
      { name: '180 lbs in Stone (12 st 12 lb / 81.65 kg)', url: '/blog/180lbs-in-stone', tag: 'Guide' },
      { name: '32 USD to GBP Currency Exchange Guide', url: '/blog/32-usd-to-gbp', tag: 'Guide' },
      { name: '220 lbs in Stone (15 st 10 lb)', url: '/blog/220-pounds-in-stone', tag: 'Guide' },
      { name: 'Volume & Capacity Converter (Liters, Gallons, Cups)', url: '/volume-capacity', tag: 'Tool' },
      { name: 'Area Converter (Square Feet, Acres, Hectares)', url: '/area', tag: 'Tool' },
      { name: 'Time & Duration Converter', url: '/time-duration', tag: 'Tool' },
      { name: 'Speed Converter (MPH, km/h, Knots)', url: '/speed', tag: 'Tool' }
    ];

    function openSearchModal() {
      let modal = document.getElementById('omniconverter-search-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'omniconverter-search-modal';
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(6px);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 10vh;
          z-index: 99999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        modal.innerHTML = `
          <div style="background: var(--bg-surface, #ffffff); color: var(--text-main, #0f172a); max-width: 580px; width: calc(100% - 32px); border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); border: 1px solid var(--card-border, #cbd5e1); overflow: hidden;">
            <div style="display: flex; align-items: center; padding: 14px 18px; border-bottom: 1px solid var(--card-border, #cbd5e1); gap: 10px;">
              <span style="font-size: 1.2rem; color: #64748b;">🔍</span>
              <input type="text" id="omni-search-input" placeholder="${searchPlaceholder}" style="flex: 1; border: none; background: transparent; font-size: 1.05rem; font-weight: 600; color: inherit; outline: none;">
              <kbd style="font-size: 0.75rem; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; color: #64748b;">ESC</kbd>
            </div>
            <div id="omni-search-results" style="max-height: 380px; overflow-y: auto; padding: 8px;"></div>
          </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.style.display = 'none';
        });

        const input = document.getElementById('omni-search-input');
        input.addEventListener('input', () => {
          renderResults(input.value.trim().toLowerCase());
        });
      }

      modal.style.display = 'flex';
      const input = document.getElementById('omni-search-input');
      input.value = '';
      renderResults('');
      setTimeout(() => input.focus(), 50);
    }

    function renderResults(query) {
      const container = document.getElementById('omni-search-results');
      if (!container) return;

      const filtered = searchableTools.filter(t => !query || t.name.toLowerCase().includes(query) || t.tag.toLowerCase().includes(query));

      if (filtered.length === 0) {
        container.innerHTML = `<div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 0.9rem;">No matching converter tools or guides found.</div>`;
        return;
      }

      container.innerHTML = filtered.map(item => `
        <a href="${item.url}" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; text-decoration: none; border-radius: 8px; color: inherit; transition: background 0.15s ease;" onmouseover="this.style.background='rgba(99,102,241,0.08)'" onmouseout="this.style.background='transparent'">
          <span style="font-size: 0.95rem; font-weight: 600;">${item.name}</span>
          <span style="font-size: 0.75rem; font-weight: 700; background: rgba(99,102,241,0.15); color: #4f46e5; padding: 2px 8px; border-radius: 999px;">${item.tag}</span>
        </a>
      `).join('');
    }
  }

  // ==========================================
  // 3. Recent Conversions History & Favorites
  // ==========================================
  function initHistoryAndFavorites() {
    const liveResult = document.getElementById('liveToolResultVal') || document.getElementById('liveResultVal') || document.getElementById('resultValue');
    const inputVal = document.getElementById('liveToolInput') || document.getElementById('liveTempInput') || document.getElementById('tempInput') || document.getElementById('weightInput') || document.getElementById('currencyInput');
    const fromUnit = document.getElementById('liveToolFromUnit') || document.getElementById('liveFromUnit') || document.getElementById('fromSelect') || document.getElementById('weightFromSelect') || document.getElementById('currencyFromSelect');
    const toUnit = document.getElementById('liveToolToUnit') || document.getElementById('liveToUnit') || document.getElementById('toSelect') || document.getElementById('weightToSelect') || document.getElementById('currencyToSelect');

    if (!liveResult) return;

    const HISTORY_KEY = 'omniconverter_recent_history';
    const isSpanish = window.location.pathname.startsWith('/es/');
    const isGerman = window.location.pathname.startsWith('/de/');
    const isPortuguese = window.location.pathname.startsWith('/pt/');

    let historyTitle = '🕒 Recent Conversions & Favorites';
    let clearHistText = 'Clear';
    let emptyText = 'No recent conversions yet. Compute any value above!';

    if (isSpanish) {
      historyTitle = '🕒 Conversiones Recientes y Favoritos';
      clearHistText = 'Limpiar';
      emptyText = 'No hay conversiones recientes.';
    } else if (isGerman) {
      historyTitle = '🕒 Letzte Umrechnungen & Favoriten';
      clearHistText = 'Löschen';
      emptyText = 'Noch keine Umrechnungen gespeichert.';
    } else if (isPortuguese) {
      historyTitle = '🕒 Conversões Recentes e Favoritos';
      clearHistText = 'Limpar';
      emptyText = 'Nenhuma conversão recente gravada.';
    }

    let historyBox = document.getElementById('omniconverter-history-box');
    if (!historyBox) {
      historyBox = document.createElement('div');
      historyBox.id = 'omniconverter-history-box';
      historyBox.style.cssText = `
        margin-top: 1.5rem;
        background: var(--bg-surface, #ffffff);
        border: 1px solid var(--card-border, #e2e8f0);
        border-radius: 14px;
        padding: 14px 18px;
        font-family: inherit;
      `;

      historyBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-main, #0f172a); display: flex; align-items: center; gap: 6px;">
            ${historyTitle}
          </span>
          <button id="clearHistoryBtn" style="background: none; border: none; font-size: 0.78rem; color: #94a3b8; cursor: pointer;">${clearHistText}</button>
        </div>
        <div id="historyItemsList" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
      `;

      const parentContainer = liveResult.closest('div[style*="background:var(--bg-elevated)"]') || liveResult.closest('.converter-card') || liveResult.parentElement;
      if (parentContainer && parentContainer.parentNode) {
        parentContainer.parentNode.insertBefore(historyBox, parentContainer.nextSibling);
      }

      document.getElementById('clearHistoryBtn').addEventListener('click', () => {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
      });
    }

    function recordHistoryItem() {
      const val = inputVal ? inputVal.value.trim() : '';
      const f = fromUnit ? fromUnit.value : '';
      const t = toUnit ? toUnit.value : '';
      const res = liveResult ? liveResult.textContent.trim() : '';

      if (!val || !res) return;

      const item = {
        title: `${val} ${f} = ${res}`,
        val: val,
        from: f,
        to: t,
        time: Date.now()
      };

      let history = [];
      try {
        history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
      } catch (e) {}

      history = history.filter(h => h.title !== item.title);
      history.unshift(item);
      if (history.length > 6) history = history.slice(0, 6);

      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      renderHistory();
    }

    function renderHistory() {
      const listEl = document.getElementById('historyItemsList');
      if (!listEl) return;

      let history = [];
      try {
        history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
      } catch (e) {}

      if (history.length === 0) {
        listEl.innerHTML = `<span style="font-size: 0.82rem; color: #94a3b8;">${emptyText}</span>`;
        return;
      }

      listEl.innerHTML = history.map(item => `
        <button type="button" class="history-item-pill" data-val="${item.val}" data-from="${item.from}" data-to="${item.to}" style="background: var(--bg-elevated, #f8fafc); border: 1px solid var(--card-border, #cbd5e1); border-radius: 20px; padding: 4px 10px; font-size: 0.8rem; font-weight: 600; color: var(--text-main, #0f172a); cursor: pointer; transition: all 0.15s ease;">
          ${item.title}
        </button>
      `).join('');

      listEl.querySelectorAll('.history-item-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          if (inputVal) inputVal.value = btn.dataset.val;
          if (fromUnit && btn.dataset.from) fromUnit.value = btn.dataset.from;
          if (toUnit && btn.dataset.to) toUnit.value = btn.dataset.to;
          if (inputVal) inputVal.dispatchEvent(new Event('input', { bubbles: true }));
          if (fromUnit) fromUnit.dispatchEvent(new Event('change', { bubbles: true }));
          if (toUnit) toUnit.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
    }

    let timer = null;
    if (inputVal) {
      inputVal.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(recordHistoryItem, 1500);
      });
    }

    renderHistory();
  }
})();
