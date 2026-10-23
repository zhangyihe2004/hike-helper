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
      local: { get: () => pending || Promise.resolve(typeof initial === 'object' ? initial : { enabled: initial }) },
      onChanged: { addListener: callback => listeners.push(callback) }
    },
    change(value, area = 'local', key = 'enabled') {
      for (const callback of listeners) callback({ [key]: { newValue: value } }, area);
    },
    resolve: value => resolve(typeof value === 'object' ? value : { enabled: value }),
    reject: () => reject(new Error('storage unavailable'))
  };
}

function browser(store = storage(), href = site, messageFails = false) {
  const listeners = new Map();
  const opened = [];
  const messages = [];
  const alerts = [];
  let original = 0;
  const sandbox = vm.createContext({
    URL, URLSearchParams,
    location: { href },
    chrome: { storage: store.api, runtime: { sendMessage: message => {
      messages.push(message);
      if (messageFails === 'sync') throw new Error('Extension context invalidated');
      return messageFails ? Promise.reject(new Error('Worker unavailable')) : Promise.resolve({ ok: true });
    } } },
    window: { open: (...args) => opened.push(args), alert: message => alerts.push(message) },
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
    messages, alerts,
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

test('default OFF preserves the site; ON opens the clicked record and OFF restores the site', async () => {
  const store = storage();
  const page = browser(store);
  await tick();
  page.click();
  assert.equal(page.original, 1);
  assert.equal(page.opened.length, 0);
  assert.equal(page.listenerCount(), 0);
  store.change(true);
  const event = page.click(handler(second));
  assert.equal(event.stopped, true);
  assert.equal(page.original, 1);
  assert.equal(page.opened[0][0], core.buildPlayerUrl(second));
  assert.deepEqual(page.opened[0].slice(1), ['_blank', 'noopener']);
  store.change(false);
  assert.equal(page.listenerCount(), 0);
  page.click(handler(second));
  assert.equal(page.original, 2);
  assert.equal(page.opened.length, 1);
});

test('delegation handles middle clicks and ignores unrelated or prevented actions', async () => {
  const page = browser(storage(true));
  await tick();
  page.click(handler(second), 'auxclick', 1);
  assert.equal(page.opened.length, 1);
  page.click(handler(second), 'auxclick', 2);
  page.click('logout()');
  page.click(handler(first), 'click', 0, true);
  assert.equal(page.opened.length, 1);
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

test('stealth mode sends the clicked replay and course info without opening the platform player', async () => {
  const store = storage({ enabled: true, stealthMode: true });
  const page = browser(store);
  await tick();
  const event = page.click(handler(second));
  await tick();
  assert.equal(event.stopped, true);
  assert.equal(page.original, 0);
  assert.equal(page.opened.length, 0);
  assert.deepEqual({ ...page.messages[0], courseInfo: { ...page.messages[0].courseInfo } },
    { type: 'openStealthPlayer', rpId: second.rpId, courseInfo: {} });
  store.change(false, 'local', 'stealthMode');
  page.click(handler(first));
  assert.equal(page.opened[0][0], core.buildPlayerUrl(first));
});

test('initial storage reads preserve newer per-setting changes in stealth mode', async () => {
  const store = storage(false, true);
  const page = browser(store);
  store.change(true, 'local', 'stealthMode');
  store.resolve({ enabled: true, stealthMode: false });
  await tick();
  page.click();
  assert.equal(page.messages.length, 1);
  assert.equal(page.opened.length, 0);
  store.change(false);
  page.click();
  assert.equal(page.original, 1);
});

test('invalid IDs and worker errors cannot fall back to a counted platform page', async () => {
  for (const failure of [true, 'sync']) {
    const page = browser(storage({ enabled: true, stealthMode: true }), site, failure);
    await tick();
    page.click(handler({ ...first, rpId: 'invalid-record' }));
    page.click();
    await tick();
    assert.equal(page.original, 0);
    assert.equal(page.opened.length, 0);
    assert.equal(page.messages.length, 1);
    assert.equal(page.alerts.length, 2);
  }
});

test('stealth URLs contain only the selected record and map all three media views correctly', () => {
  for (const record of [first, second]) {
    const path = core.buildStealthPlayerPath(record.rpId);
    assert.equal(path, 'player/index.html#rpId=' + record.rpId);
    const sources = core.buildMediaSources(record.rpId);
    for (const [key, type] of [['teacherVideoUrl', '2'], ['studentVideoUrl', '1'], ['courseVideoUrl', '3']]) {
      const url = new URL(sources[key]);
      assert.equal(url.origin, 'https://jxlmtt.hitsz.edu.cn:78');
      assert.equal(url.pathname, '/Root/download.shtml');
      assert.equal(url.searchParams.get('p'), 'recordRp');
      assert.equal(url.searchParams.get('type'), type);
      assert.equal(url.searchParams.get('id'), record.rpId);
      assert.equal(url.searchParams.size, 3);
    }
  }
  for (const rpId of ['', null, 'A'.repeat(33), 'x&userId=1', 'https://example.com']) {
    assert.throws(() => core.buildMediaSources(rpId));
    assert.throws(() => core.buildStealthPlayerPath(rpId));
  }
});

test('reads displayed course metadata and bounds hash parameters without replacing the selected replay', () => {
  const course = { textContent: '示例课程' };
  const classLabel = { textContent: '授课班级: 示例班级', getAttribute: () => null };
  const header = { querySelector: selector => selector === '.topm' ? course : classLabel };
  const doc = { querySelector: selector => selector === '.curr-contentltop' ? header : null };
  const link = { querySelector: selector => selector === '.titlex' ? { textContent: '示例老师' } : null };
  const info = core.readCourseInfo(doc, link);
  assert.deepEqual({ ...info }, { courseName: '示例课程', teacherName: '示例老师', className: '示例班级' });
  const url = new URL(core.buildStealthPlayerPath(first.rpId, {
    ...info, courseName: '课程 &rpId=other', teacherName: 'x'.repeat(200), unknown: 'ignored'
  }), 'https://extension.example/');
  const params = new URLSearchParams(url.hash.slice(1));
  assert.equal(params.get('rpId'), first.rpId);
  assert.equal(params.get('courseName'), '课程 &rpId=other');
  assert.equal(params.get('teacherName').length, 160);
  assert.equal(params.has('unknown'), false);
  assert.deepEqual({ ...core.cleanCourseInfo({ courseName: '\n课程\t甲\0', teacherName: 42 }) }, { courseName: '课程 甲' });
});
