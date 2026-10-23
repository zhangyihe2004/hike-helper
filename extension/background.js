importScripts('core.js');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'openStealthPlayer') return;
  const core = globalThis.HikeHelper;
  if (sender.id !== chrome.runtime.id || !Number.isInteger(sender.tab?.id) ||
      !core.isSitePage(sender.url) || !core.isReplayId(message.rpId)) {
    sendResponse({ ok: false });
    return;
  }
  const path = core.buildStealthPlayerPath(message.rpId, message.courseInfo);
  chrome.storage.local.get({ enabled: false, stealthMode: false }).then(settings => {
    if (settings.enabled !== true || settings.stealthMode !== true) throw new Error('Mode disabled');
    return chrome.tabs.create({ url: chrome.runtime.getURL(path) });
  }).then(() => sendResponse({ ok: true }), () => sendResponse({ ok: false }));
  return true;
});
