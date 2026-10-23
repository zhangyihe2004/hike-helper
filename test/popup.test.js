import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../extension/popup.js', import.meta.url), 'utf8');
const tick = () => new Promise(resolve => setImmediate(resolve));

function popup(initial = { enabled: false, stealthMode: false }, delayed = false) {
  const nodes = Object.fromEntries(['enabled', 'stealthMode', 'status', 'stealthStatus', 'error'].map(id =>
    [id, { checked: false, disabled: true, listeners: {}, addEventListener(type, fn) { this.listeners[type] = fn; } }]));
  const listeners = [], saved = [];
  let resolve, reject, failSave = false;
  const pending = new Promise((yes, no) => { resolve = yes; reject = no; });
  const change = values => listeners.forEach(callback => callback(
    Object.fromEntries(Object.entries(values).map(([key, value]) => [key, { newValue: value }])), 'local'));
  const context = vm.createContext({ document: { getElementById: id => nodes[id], body: { dataset: {} } }, chrome: { storage: {
    local: { get: () => delayed ? pending : Promise.resolve(initial), set: async values => {
      if (failSave) throw new Error('Unavailable');
      saved.push(values); change(values);
    } }, onChanged: { addListener: callback => listeners.push(callback) }
  } } });
  vm.runInContext(source, context);
  return { nodes, saved, change, resolve, reject, setFailSave: () => { failSave = true; },
    toggle: async (key, value) => { nodes[key].checked = value; await nodes[key].listeners.change(); } };
}

test('popup preserves the master switch and enables the independent stealth preference', async () => {
  const ui = popup();
  await tick();
  assert.equal(ui.nodes.enabled.disabled, false);
  assert.equal(ui.nodes.stealthMode.disabled, true);
  assert.equal(ui.nodes.stealthStatus.textContent, '隐身模式关');
  await ui.toggle('enabled', true);
  assert.equal(ui.nodes.stealthMode.disabled, false);
  await ui.toggle('stealthMode', true);
  assert.equal(ui.nodes.stealthStatus.textContent, '隐身模式开');
  assert.deepEqual({ ...ui.saved[1] }, { stealthMode: true });
  await ui.toggle('enabled', false);
  assert.equal(ui.nodes.stealthMode.checked, true);
  assert.equal(ui.nodes.stealthMode.disabled, true);
  await ui.toggle('enabled', true);
  assert.equal(ui.nodes.stealthMode.checked, true);
  await ui.toggle('stealthMode', false);
  assert.equal(ui.nodes.stealthStatus.textContent, '隐身模式关');
});

test('popup initial reads cannot overwrite newer changes to either setting', async () => {
  const ui = popup(undefined, true);
  ui.change({ stealthMode: true });
  ui.resolve({ enabled: true, stealthMode: false });
  await tick();
  assert.equal(ui.nodes.enabled.checked, true);
  assert.equal(ui.nodes.stealthMode.checked, true);
});

test('popup save errors restore the saved preference and read errors keep controls disabled', async () => {
  const ui = popup({ enabled: true, stealthMode: false });
  await tick();
  ui.setFailSave();
  await ui.toggle('stealthMode', true);
  assert.equal(ui.nodes.stealthMode.checked, false);
  assert.equal(ui.nodes.error.hidden, false);
  assert.equal(ui.nodes.stealthMode.disabled, false);
  const unavailable = popup(undefined, true);
  unavailable.reject(new Error('Unavailable'));
  await tick();
  assert.equal(unavailable.nodes.enabled.disabled, true);
  assert.equal(unavailable.nodes.stealthMode.disabled, true);
});
