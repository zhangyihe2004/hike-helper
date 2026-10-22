(() => {
  'use strict';
  const core = globalThis.HikeHelper;
  if (!core.isSitePage(location.href)) return;
  let enabled = false;
  let revision = 0;

  function onClick(event) {
    if (!enabled || event.defaultPrevented) return;
    if (event.type === 'click' && event.button !== 0) return;
    if (event.type === 'auxclick' && event.button !== 1) return;
    const target = event.target?.closest ? event.target : event.target?.parentElement;
    const link = target?.closest?.('a[onclick]');
    if (!link) return;
    const record = core.parseHandler(link.getAttribute('onclick'));
    if (!record) return;
    const url = core.buildPlayerUrl(record);
    event.preventDefault();
    event.stopImmediatePropagation();
    window.open(url, '_blank', 'noopener');
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
    if (area !== 'local' || !Object.hasOwn(changes, 'enabled')) return;
    revision++;
    setEnabled(changes.enabled.newValue);
  });
  const initialRevision = revision;
  chrome.storage.local.get({ enabled: false }).then(settings => {
    if (revision === initialRevision) setEnabled(settings.enabled);
  }).catch(() => {
    if (revision === initialRevision) setEnabled(false);
  });
})();
