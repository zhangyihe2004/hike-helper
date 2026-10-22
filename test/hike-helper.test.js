import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const coreSource = readFileSync(new URL('../extension/core.js', import.meta.url), 'utf8');
const contentSource = readFileSync(new URL('../extension/content.js', import.meta.url), 'utf8');
const site = 'https://jxypt.hitsz.edu.cn/ve/back/rp/common/rpIndex.shtml';
const first = { rpId: 'A'.repeat(32), courseId: 'course-alpha', courseNum: 'COURSE_ALPHA', fzId: 'term-alpha-COURSE_ALPHA' };
const second = { rpId: 'B'.repeat(32), courseId: 'course-beta', courseNum: 'COURSE_BETA', fzId: 'term-beta-COURSE_BETA' };
const handler = record => `getStuControlType('${record.rpId}','${record.courseId}','${record.courseNum}','${record.fzId}')`;
const pure = vm.createContext({ URL, URLSearchParams });
vm.runInContext(coreSource, pure);
const core = pure.HikeHelper;
const tick = () => new Promise(resolve => setImmediate(resolve));

function storage(initial = false, delayed = false) {
  const listeners = [];
  let resolve;
  let reject;
  const pending = delayed ? new Promise((a, b) => { resolve = a; reject = b; }) : null;
  return {
    api: {
      local: { get: () => pending || Promise.resolve({ enabled: initial }) },
      onChanged: { addListener: callback => listeners.push(callback) }
    },
    change(value, area = 'local', key = 'enabled') {
      for (const callback of listeners) callback({ [key]: { newValue: value } }, area);
    },
    resolve: value => resolve({ enabled: value }),
    reject: () => reject(new Error('storage unavailable'))
  };
}

function browser(store = storage(), href = site) {
  const listeners = new Map();
  const opened = [];
  let original = 0;
  const sandbox = vm.createContext({
    URL, URLSearchParams,
    location: { href },
    chrome: { storage: store.api },
    window: { open: (...args) => opened.push(args) },
    document: {
      addEventListener(type, callback, capture) {
        assert.equal(capture, true);
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type).add(callback);
      },
      removeEventListener(type, callback, capture) {
        assert.equal(capture, true);
        listeners.get(type)?.delete(callback);
      }
    }
  });
  vm.runInContext(coreSource, sandbox);
  vm.runInContext(contentSource, sandbox);
  return {
    opened,
    get original() { return original; },
    listenerCount: () => [...listeners.values()].reduce((n, set) => n + set.size, 0),
    click(source = handler(first), type = 'click', button = 0, prevented = false) {
      const link = { getAttribute: () => source };
      const event = {
        type, button, defaultPrevented: prevented, stopped: false,
        target: { closest: () => link },
        preventDefault() { this.defaultPrevented = true; },
        stopImmediatePropagation() { this.stopped = true; }
      };
      for (const callback of listeners.get(type) || []) callback(event);
      if (!event.stopped && type === 'click') original++;
      return event;
    }
  };
}

test('accepts this site across courses and rejects other origins', () => {
  for (const url of [site, site + '?courseId=course-other', 'https://jxypt.hitsz.edu.cn/ve/']) {
    assert.equal(core.isSitePage(url), true);
  }
  for (const url of ['https://ids.hit.edu.cn/', site.replace('.cn/', '.cn.evil/'),
    site.replace('.cn/', '.cn:8443/'), 'not a URL']) {
    assert.equal(core.isSitePage(url), false);
  }
});

test('reads original, different-course and empty-class arguments', () => {
  assert.deepEqual({ ...core.parseHandler(handler(first)) }, first);
  assert.deepEqual({ ...core.parseHandler(handler(second)) }, second);
  const custom = { rpId: 'record-custom', courseId: 'course-custom', courseNum: 'CUSTOM_COURSE', fzId: '' };
  assert.deepEqual({ ...core.parseHandler(handler(custom)) }, custom);
  assert.deepEqual({ ...core.parseHandler(' return getStuControlType("x", "course-sample", "课程&甲", "班级 2") ; ') },
    { rpId: 'x', courseId: 'course-sample', courseNum: '课程&甲', fzId: '班级 2' });
});

test('rejects executable arguments, appended commands and unrelated handlers', () => {
  for (const source of [handler(first) + '; alert(1)', 'logout()',
    'getStuControlType(window.token,"1","2","3")',
    'getStuControlType("x","1","2","3","4")',
    'getStuControlType("","1","2","3")',
    'getStuControlType("x","1","2")', null]) {
    assert.equal(core.parseHandler(source), null, source);
  }
});

test('builds URLs using each row rather than a fixed course or account', () => {
  for (const record of [first, second, { rpId: 'x&rpId=other', courseId: 'course-random', courseNum: '课程&甲', fzId: '班级 2' }]) {
    const url = new URL(core.buildPlayerUrl(record));
    assert.equal(url.origin, 'https://jxypt.hitsz.edu.cn');
    assert.equal(url.searchParams.get('method'), 'studyCourseDeatil');
    assert.equal(url.searchParams.get('publicRpType'), '1,2,3');
    for (const [key, value] of Object.entries(record)) assert.equal(url.searchParams.get(key), value);
    assert.equal(url.searchParams.size, 7);
  }
  assert.throws(() => core.buildPlayerUrl({ ...first, rpId: '\n' }));
});

test('default OFF preserves the original handler and creates no click listeners', async () => {
  const page = browser();
  await tick();
  page.click();
  assert.equal(page.original, 1);
  assert.equal(page.opened.length, 0);
  assert.equal(page.listenerCount(), 0);
});

test('ON opens the clicked record and OFF restores the original immediately', async () => {
  const store = storage();
  const page = browser(store);
  await tick();
  store.change(true);
  const event = page.click(handler(second));
  assert.equal(event.stopped, true);
  assert.equal(page.original, 0);
  assert.equal(page.opened[0][0], core.buildPlayerUrl(second));
  assert.deepEqual(page.opened[0].slice(1), ['_blank', 'noopener']);
  store.change(false);
  assert.equal(page.listenerCount(), 0);
  page.click(handler(second));
  assert.equal(page.original, 1);
  assert.equal(page.opened.length, 1);
});

test('one saved switch updates multiple open pages and new pages', async () => {
  const store = storage(true);
  const page1 = browser(store);
  const page2 = browser(store, site + '?courseId=course-beta');
  await tick();
  page1.click();
  page2.click(handler(second));
  assert.equal(page1.opened.length, 1);
  assert.equal(page2.opened.length, 1);
  store.change(false);
  page1.click();
  page2.click();
  assert.equal(page1.original, 1);
  assert.equal(page2.original, 1);
});

test('delegation covers new rows, repeated toggles and middle clicks', async () => {
  const store = storage();
  const page = browser(store);
  await tick();
  for (let count = 0; count < 3; count++) {
    store.change(true);
    store.change(false);
  }
  store.change(true);
  store.change(true);
  assert.equal(page.listenerCount(), 2);
  page.click(handler(second), 'auxclick', 1);
  assert.equal(page.opened.length, 1);
  page.click(handler(second), 'auxclick', 2);
  page.click('logout()');
  page.click(handler(first), 'click', 0, true);
  assert.equal(page.opened.length, 1);
});

test('late initial storage reads cannot override a newer switch setting', async () => {
  for (const [latest, stale] of [[true, false], [false, true]]) {
    const store = storage(false, true);
    const page = browser(store);
    store.change(latest);
    store.resolve(stale);
    await tick();
    page.click();
    assert.equal(page.opened.length, latest ? 1 : 0);
  }
});

test('unrelated storage updates do not change state, and storage failure stays OFF', async () => {
  const store = storage(false, true);
  const page = browser(store);
  store.change(true, 'sync');
  store.change(true, 'local', 'other');
  store.reject();
  await tick();
  page.click();
  assert.equal(page.opened.length, 0);
  assert.equal(page.original, 1);
});

test('content script does nothing outside the target site', async () => {
  const page = browser(storage(true), 'https://example.com/ve/');
  await tick();
  assert.equal(page.listenerCount(), 0);
});

test('manifest and popup expose a site-wide content script and one switch', () => {
  const manifest = JSON.parse(readFileSync(new URL('../extension/manifest.json', import.meta.url)));
  assert.equal(manifest.manifest_version, 3);
  const packageInfo = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
  assert.equal(manifest.version, packageInfo.version);
  assert.deepEqual(manifest.permissions, ['storage']);
  assert.deepEqual(manifest.content_scripts[0].matches, ['https://jxypt.hitsz.edu.cn/ve/*']);
  assert.deepEqual(manifest.action.default_icon, manifest.icons);
  for (const file of Object.values(manifest.icons)) {
    assert.ok(readFileSync(new URL('../extension/' + file, import.meta.url)).length > 0);
  }
  for (const file of manifest.content_scripts[0].js) {
    assert.ok(readFileSync(new URL('../extension/' + file, import.meta.url)).length > 0);
  }
  const html = readFileSync(new URL('../extension/popup.html', import.meta.url), 'utf8');
  assert.equal((html.match(/role="switch"/g) || []).length, 1);
  assert.equal((html.match(/<button|<select/g) || []).length, 0);
});
