import { convertTemperature, UNITS } from './converter.js';
import { convertWeight, WEIGHT_UNITS } from './weight-converter.js';
import { convertVolume, VOLUME_UNITS } from './volume-converter.js';
import { convertLength, LENGTH_UNITS } from './length-converter.js';
import { convertTime, TIME_UNITS } from './time-converter.js';
import { convertArea, AREA_UNITS } from './area-converter.js';
import { convertSpeed, SPEED_UNITS } from './speed-converter.js';
import { convertImageFile, convertTextDocument } from './file-converter.js';

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Tabs
  const tabs = {
    temp: { btn: document.getElementById('tabTemp'), content: document.getElementById('contentTemp') },
    weight: { btn: document.getElementById('tabWeight'), content: document.getElementById('contentWeight') },
    volume: { btn: document.getElementById('tabVolume'), content: document.getElementById('contentVolume') },
    length: { btn: document.getElementById('tabLength'), content: document.getElementById('contentLength') },
    time: { btn: document.getElementById('tabTime'), content: document.getElementById('contentTime') },
    area: { btn: document.getElementById('tabArea'), content: document.getElementById('contentArea') },
    speed: { btn: document.getElementById('tabSpeed'), content: document.getElementById('contentSpeed') },
    files: { btn: document.getElementById('tabFiles'), content: document.getElementById('contentFiles') }
  };

  function switchTab(activeKey) {
    Object.keys(tabs).forEach(key => {
      const item = tabs[key];
      if (!item.btn || !item.content) return;
      if (key === activeKey) {
        item.btn.classList.add('active');
        item.content.classList.add('active');
      } else {
        item.btn.classList.remove('active');
        item.content.classList.remove('active');
      }
    });
  }

  Object.keys(tabs).forEach(key => {
    if (tabs[key].btn) {
      tabs[key].btn.addEventListener('click', () => switchTab(key));
    }
  });

  // Handle URL hash tab switching (e.g., index.html#volume, index.html#weight)
  function handleHashTab() {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash && tabs[hash]) {
      switchTab(hash);
      const activeEl = tabs[hash].content;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  handleHashTab();
  window.addEventListener('hashchange', handleHashTab);

  // --- UNIT CONVERTER SETUP FACTORY ---
  function setupConverter(cfg) {
    const tempInput = document.getElementById(cfg.inputId);
    const fromSelect = document.getElementById(cfg.fromId);
    const toSelect = document.getElementById(cfg.toId);
    const swapBtn = document.getElementById(cfg.swapId);
    const convertBtn = document.getElementById(cfg.convertId);
    const clearBtn = document.getElementById(cfg.clearId);

    const resultContainer = document.getElementById(cfg.resultContainerId);
    const resultValue = document.getElementById(cfg.resultValueId);
    const formulaText = document.getElementById(cfg.formulaTextId);
    const explanationText = document.getElementById(cfg.explanationTextId);
    const copyBtn = document.getElementById(cfg.copyBtnId);

    let currentResultString = '';

    function populateUnits() {
      if (!fromSelect || !toSelect) return;
      fromSelect.innerHTML = '';
      toSelect.innerHTML = '';
      Object.keys(cfg.unitsObj).forEach(key => {
        const unit = cfg.unitsObj[key];
        const optFrom = document.createElement('option');
        optFrom.value = key;
        optFrom.textContent = `${unit.name} (${unit.symbol})`;
        fromSelect.appendChild(optFrom);

        const optTo = document.createElement('option');
        optTo.value = key;
        optTo.textContent = `${unit.name} (${unit.symbol})`;
        toSelect.appendChild(optTo);
      });

      fromSelect.value = cfg.defaultFrom;
      toSelect.value = cfg.defaultTo;
    }

    function updateConversion() {
      if (!tempInput) return;
      const valueStr = tempInput.value.trim();
      if (valueStr === '') {
        if (resultContainer) resultContainer.style.display = 'none';
        return;
      }

      const res = cfg.convertFn(valueStr, fromSelect.value, toSelect.value);

      if (!res || res.error) {
        if (resultContainer) resultContainer.style.display = 'none';
        return;
      }

      if (resultValue) resultValue.textContent = res.formattedResult;
      if (formulaText) formulaText.textContent = res.formula;
      if (explanationText) explanationText.textContent = res.explanation;
      if (resultContainer) resultContainer.style.display = 'block';

      currentResultString = `${res.formattedInput} = ${res.formattedResult}`;
    }

    function handleSwap() {
      const temp = fromSelect.value;
      fromSelect.value = toSelect.value;
      toSelect.value = temp;
      updateConversion();
    }

    function handleClear() {
      tempInput.value = '';
      fromSelect.value = cfg.defaultFrom;
      toSelect.value = cfg.defaultTo;
      if (resultContainer) resultContainer.style.display = 'none';
      tempInput.focus();
    }

    async function handleCopy() {
      if (!currentResultString) return;
      try {
        await navigator.clipboard.writeText(currentResultString);
        showToast('Copied to clipboard!');
      } catch (err) {
        showToast('Failed to copy');
      }
    }

    populateUnits();

    if (tempInput) tempInput.addEventListener('input', updateConversion);
    if (fromSelect) fromSelect.addEventListener('change', updateConversion);
    if (toSelect) toSelect.addEventListener('change', updateConversion);
    if (swapBtn) swapBtn.addEventListener('click', handleSwap);
    if (convertBtn) convertBtn.addEventListener('click', updateConversion);
    if (clearBtn) clearBtn.addEventListener('click', handleClear);
    if (copyBtn) copyBtn.addEventListener('click', handleCopy);

    if (tempInput && tempInput.value) {
      updateConversion();
    }
  }

  // Initialize Unit Converters
  setupConverter({
    inputId: 'tempInput', fromId: 'fromSelect', toId: 'toSelect',
    swapId: 'swapBtn', convertId: 'convertBtn', clearId: 'clearBtn',
    resultContainerId: 'resultContainer', resultValueId: 'resultValue',
    formulaTextId: 'formulaText', explanationTextId: 'explanationText', copyBtnId: 'copyBtn',
    unitsObj: UNITS, convertFn: convertTemperature, defaultFrom: 'C', defaultTo: 'F'
  });

  setupConverter({
    inputId: 'weightInput', fromId: 'weightFromSelect', toId: 'weightToSelect',
    swapId: 'weightSwapBtn', convertId: 'weightConvertBtn', clearId: 'weightClearBtn',
    resultContainerId: 'weightResultContainer', resultValueId: 'weightResultValue',
    formulaTextId: 'weightFormulaText', explanationTextId: 'weightExplanationText', copyBtnId: 'weightCopyBtn',
    unitsObj: WEIGHT_UNITS, convertFn: convertWeight, defaultFrom: 'kg', defaultTo: 'lb'
  });

  setupConverter({
    inputId: 'volumeInput', fromId: 'volumeFromSelect', toId: 'volumeToSelect',
    swapId: 'volumeSwapBtn', convertId: 'volumeConvertBtn', clearId: 'volumeClearBtn',
    resultContainerId: 'volumeResultContainer', resultValueId: 'volumeResultValue',
    formulaTextId: 'volumeFormulaText', explanationTextId: 'volumeExplanationText', copyBtnId: 'volumeCopyBtn',
    unitsObj: VOLUME_UNITS, convertFn: convertVolume, defaultFrom: 'l', defaultTo: 'gal'
  });

  setupConverter({
    inputId: 'lengthInput', fromId: 'lengthFromSelect', toId: 'lengthToSelect',
    swapId: 'lengthSwapBtn', convertId: 'lengthConvertBtn', clearId: 'lengthClearBtn',
    resultContainerId: 'lengthResultContainer', resultValueId: 'lengthResultValue',
    formulaTextId: 'lengthFormulaText', explanationTextId: 'lengthExplanationText', copyBtnId: 'lengthCopyBtn',
    unitsObj: LENGTH_UNITS, convertFn: convertLength, defaultFrom: 'km', defaultTo: 'mi'
  });

  setupConverter({
    inputId: 'timeInput', fromId: 'timeFromSelect', toId: 'timeToSelect',
    swapId: 'timeSwapBtn', convertId: 'timeConvertBtn', clearId: 'timeClearBtn',
    resultContainerId: 'timeResultContainer', resultValueId: 'timeResultValue',
    formulaTextId: 'timeFormulaText', explanationTextId: 'timeExplanationText', copyBtnId: 'timeCopyBtn',
    unitsObj: TIME_UNITS, convertFn: convertTime, defaultFrom: 'hr', defaultTo: 'min'
  });

  setupConverter({
    inputId: 'areaInput', fromId: 'areaFromSelect', toId: 'areaToSelect',
    swapId: 'areaSwapBtn', convertId: 'areaConvertBtn', clearId: 'areaClearBtn',
    resultContainerId: 'areaResultContainer', resultValueId: 'areaResultValue',
    formulaTextId: 'areaFormulaText', explanationTextId: 'areaExplanationText', copyBtnId: 'areaCopyBtn',
    unitsObj: AREA_UNITS, convertFn: convertArea, defaultFrom: 'm2', defaultTo: 'ft2'
  });

  setupConverter({
    inputId: 'speedInput', fromId: 'speedFromSelect', toId: 'speedToSelect',
    swapId: 'speedSwapBtn', convertId: 'speedConvertBtn', clearId: 'speedClearBtn',
    resultContainerId: 'speedResultContainer', resultValueId: 'speedResultValue',
    formulaTextId: 'speedFormulaText', explanationTextId: 'speedExplanationText', copyBtnId: 'speedCopyBtn',
    unitsObj: SPEED_UNITS, convertFn: convertSpeed, defaultFrom: 'kmh', defaultTo: 'mph'
  });

  // Client-side file converter controller
  const imageInput = document.getElementById('imageFileInput');
  const targetImageFormat = document.getElementById('targetImageFormat');
  const convertImageBtn = document.getElementById('convertImageBtn');
  const imageResultArea = document.getElementById('imageResultArea');

  if (convertImageBtn) {
    convertImageBtn.addEventListener('click', async () => {
      const file = imageInput.files[0];
      if (!file) return alert('Please select an image file to convert.');
      try {
        const res = await convertImageFile(file, targetImageFormat.value);
        imageResultArea.innerHTML = `
          <div style="margin-top: 1rem; padding: 1rem; background: var(--primary-light); border-radius: 8px;">
            <p><strong>Conversion Complete!</strong> (${(res.size/1024).toFixed(1)} KB)</p>
            <a href="${res.downloadUrl}" download="${res.filename}" class="btn-convert" style="display:inline-block; margin-top:0.5rem; text-decoration:none;">Download ${res.filename}</a>
          </div>
        `;
      } catch (err) {
        alert(err.message);
      }
    });
  }

  const docInputText = document.getElementById('docInputText');
  const docConversionType = document.getElementById('docConversionType');
  const convertDocBtn = document.getElementById('convertDocBtn');
  const docResultArea = document.getElementById('docResultArea');

  if (convertDocBtn) {
    convertDocBtn.addEventListener('click', () => {
      const text = docInputText.value;
      if (!text.trim()) return alert('Please enter or paste text to convert.');
      const res = convertTextDocument(text, docConversionType.value);
      if (res.error) return alert(res.error);

      docResultArea.innerHTML = `
        <div style="margin-top: 1rem; padding: 1rem; background: var(--primary-light); border-radius: 8px;">
          <p><strong>File Generated Successfully!</strong></p>
          <a href="${res.downloadUrl}" download="${res.filename}" class="btn-convert" style="display:inline-block; margin-top:0.5rem; text-decoration:none;">Download ${res.filename}</a>
        </div>
      `;
    });
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
});
