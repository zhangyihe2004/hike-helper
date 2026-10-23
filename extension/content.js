(() => {
  'use strict';
  const core = globalThis.HikeHelper;
  if (!core.isSitePage(location.href)) return;
  let enabled = false;
  let stealthMode = false;
  const revisions = { enabled: 0, stealthMode: 0 };

  async function onClick(event) {
    if (!enabled || event.defaultPrevented) return;
    if (event.type === 'click' && event.button !== 0) return;
    if (event.type === 'auxclick' && event.button !== 1) return;
    const target = event.target?.closest ? event.target : event.target?.parentElement;
    const link = target?.closest?.('a[onclick]');
    if (!link) return;
    const record = core.parseHandler(link.getAttribute('onclick'));
    if (!record) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!stealthMode) {
      window.open(core.buildPlayerUrl(record), '_blank', 'noopener');
      return;
    }
    // Never fall back to the counted page if the independent player fails.
    if (!core.isReplayId(record.rpId)) {
      window.alert('视频编号无效。');
      return;
    }
    try {
      const result = await chrome.runtime.sendMessage({ type: 'openStealthPlayer', rpId: record.rpId,
        courseInfo: core.readCourseInfo(document, link) });
      if (!result?.ok) throw new Error();
    } catch {
      window.alert('无法打开播放器。');
    }
  }

  function setEnabled(value) {
    const next = value === true;
    if (next === enabled) return;
    enabled = next;
    for (const type of ['click', 'auxclick']) {
      if (enabled) document.addEventListener(type, onClick, true);
      else document.removeEventListener(type, onClick, true);
    }
  }

  // Listen before reading storage so a late initial read cannot undo a toggle.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    for (const key of Object.keys(revisions)) {
      if (!Object.hasOwn(changes, key)) continue;
      revisions[key]++;
      if (key === 'enabled') setEnabled(changes[key].newValue);
      else stealthMode = changes[key].newValue === true;
    }
  });
  const initialRevisions = { ...revisions };
  chrome.storage.local.get({ enabled: false, stealthMode: false }).then(settings => {
    if (revisions.enabled === initialRevisions.enabled) setEnabled(settings.enabled);
    if (revisions.stealthMode === initialRevisions.stealthMode) stealthMode = settings.stealthMode === true;
  }).catch(() => {});
})();
