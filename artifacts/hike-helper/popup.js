const defaults = { enabled: false, stealthMode: false };
const settings = { ...defaults };
const revisions = { enabled: 0, stealthMode: 0 };
const toggles = Object.fromEntries(Object.keys(defaults).map(key => [key, document.getElementById(key)]));
const status = document.getElementById('status');
const stealthStatus = document.getElementById('stealthStatus');
const error = document.getElementById('error');
const pending = new Set();
let loaded = false;

function updateDisabled() {
  for (const [key, toggle] of Object.entries(toggles)) {
    toggle.disabled = !loaded || pending.has(key) || (key === 'stealthMode' && !settings.enabled);
  }
}

function render() {
  for (const [key, toggle] of Object.entries(toggles)) toggle.checked = settings[key];
  document.body.dataset.enabled = String(settings.enabled);
  document.body.dataset.stealth = String(settings.stealthMode);
  status.textContent = settings.enabled ? '已启用' : '未启用';
  stealthStatus.textContent = settings.stealthMode ? '隐身模式开' : '隐身模式关';
  updateDisabled();
}

function showError(message = '') {
  error.textContent = message;
  error.hidden = !message;
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  for (const key of Object.keys(defaults)) {
    if (!Object.hasOwn(changes, key)) continue;
    revisions[key]++;
    settings[key] = changes[key].newValue === true;
  }
  render();
});

const initialRevisions = { ...revisions };
chrome.storage.local.get(defaults).then(saved => {
  for (const key of Object.keys(defaults)) {
    if (revisions[key] === initialRevisions[key]) settings[key] = saved[key] === true;
  }
  loaded = true;
  render();
}).catch(() => {
  render();
  showError('读取设置失败。');
});

for (const [key, toggle] of Object.entries(toggles)) {
  toggle.addEventListener('change', async () => {
    const next = toggle.checked;
    const revision = revisions[key];
    pending.add(key);
    updateDisabled();
    showError();
    try {
      await chrome.storage.local.set({ [key]: next });
      if (revisions[key] === revision) settings[key] = next;
    } catch {
      showError('保存设置失败。');
    } finally {
      pending.delete(key);
      render();
    }
  });
}
