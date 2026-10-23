import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const read = name => readFileSync(new URL('../extension/' + name, import.meta.url), 'utf8');
const rpId = 'A'.repeat(32);
const sender = { id: 'test-extension', url: 'https://jxypt.hitsz.edu.cn/ve/course', tab: { id: 7 } };

function worker(settings = { enabled: true, stealthMode: true }, fail = '') {
  let listener;
  const opened = [];
  const context = vm.createContext({ URL, URLSearchParams, chrome: {
    runtime: { id: 'test-extension', getURL: path => 'chrome-extension://test-extension/' + path,
      onMessage: { addListener: callback => { listener = callback; } } },
    storage: { local: { get: async () => {
      if (fail === 'storage') throw new Error('Unavailable');
      return settings;
    } } },
    tabs: { create: async options => {
      if (fail === 'tabs') throw new Error('Unavailable');
      opened.push(options);
    } }
  } });
  context.importScripts = path => vm.runInContext(read(path), context);
  vm.runInContext(read('background.js'), context);
  return { opened, send: (message = { type: 'openStealthPlayer', rpId }, from = sender) =>
    new Promise(resolve => listener(message, from, response => resolve({ ...response }))) };
}

test('worker forwards only normalized course metadata to the packaged player', async () => {
  const background = worker();
  assert.deepEqual(await background.send({ type: 'openStealthPlayer', rpId,
    courseInfo: { courseName: '示例课程', teacherName: '示例老师', className: '示例班级', rpId: 'other' }
  }), { ok: true });
  const params = new URLSearchParams(new URL(background.opened[0].url).hash.slice(1));
  assert.equal(params.get('rpId'), rpId);
  assert.equal(params.get('courseName'), '示例课程');
  assert.equal(params.get('teacherName'), '示例老师');
  assert.equal(params.get('className'), '示例班级');
  assert.equal(params.size, 4);
});

test('worker rejects foreign pages, extension identities, missing tabs and malformed IDs', async () => {
  const background = worker();
  for (const from of [{ ...sender, id: 'other' }, { ...sender, url: 'https://example.com/ve/' },
    { ...sender, tab: undefined }, { ...sender, url: 'https://jxypt.hitsz.edu.cn.evil/ve/' }]) {
    assert.deepEqual(await background.send(undefined, from), { ok: false });
  }
  assert.deepEqual(await background.send({ type: 'openStealthPlayer', rpId: 'invalid' }), { ok: false });
  assert.equal(background.opened.length, 0);
});

test('disabled settings and API failures never open a fallback page', async () => {
  for (const background of [worker({ enabled: false, stealthMode: true }),
    worker({ enabled: true, stealthMode: false }), worker(undefined, 'storage'), worker(undefined, 'tabs')]) {
    assert.deepEqual(await background.send(), { ok: false });
    assert.equal(background.opened.length, 0);
  }
});
