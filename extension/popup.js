const toggle = document.querySelector('#enabled');
const status = document.querySelector('#status');
let saved = false;
let revision = 0;

function render(value) {
  saved = value === true;
  toggle.checked = saved;
  document.body.dataset.enabled = String(saved);
  status.textContent = saved ? '已启用' : '未启用';
  status.removeAttribute('data-error');
  toggle.removeAttribute('title');
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && Object.hasOwn(changes, 'enabled')) {
    revision++;
    render(changes.enabled.newValue);
  }
});

const initialRevision = revision;
chrome.storage.local.get({ enabled: false }).then(settings => {
  if (revision === initialRevision) render(settings.enabled);
  toggle.disabled = false;
}).catch(() => {
  render(false);
  toggle.title = '读取设置失败，请重新打开弹窗。';
  status.dataset.error = 'true';
  toggle.disabled = true;
});

toggle.addEventListener('change', async () => {
  const next = toggle.checked;
  toggle.disabled = true;
  try {
    await chrome.storage.local.set({ enabled: next });
    render(next);
  } catch {
    render(saved);
    toggle.title = '保存设置失败，请重试。';
    status.dataset.error = 'true';
  } finally {
    toggle.disabled = false;
  }
});
