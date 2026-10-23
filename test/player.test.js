import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const read = file => readFileSync(new URL('../' + file, import.meta.url));

function playbackFixture() {
  class Video extends EventTarget {
    paused = true;
    readyState = 0;
    currentTime = 0;
    duration = 120;
    buffered = { length: 0 };
    pending = [];
    loadCount = 0;
    load() { this.loadCount++; this.error = null; this.readyState = 0; this.currentTime = 0; this.pause(); }
    play() {
      if (this.playFailure) return Promise.reject(this.playFailure);
      this.paused = false;
      return new Promise((resolve, reject) => {
        this.pending.push({ resolve, reject });
        if (this.readyState >= 3) this.flush();
      });
    }
    pause() {
      const wasPaused = this.paused;
      this.paused = true;
      for (const pending of this.pending.splice(0)) pending.reject(new DOMException('Paused', 'AbortError'));
      if (!wasPaused) queueMicrotask(() => this.emit('pause'));
    }
    flush() { for (const pending of this.pending.splice(0)) pending.resolve(); }
    emit(type) {
      if (type === 'loadedmetadata') this.readyState = 1;
      if (type === 'playing') { this.readyState = 3; this.flush(); }
      this.dispatchEvent(new Event(type));
      this['on' + type]?.();
    }
  }
  const videos = Array.from({ length: 3 }, (_, index) => Object.assign(new Video(), { id: 'jyd-video' + (index + 1) }));
  const elements = new Map(videos.map((video, index) => ['jyd-video' + (index + 1), video]));
  const collections = new Map();
  function $(selector) {
    if (typeof selector?.click === 'function') return selector;
    if (!collections.has(selector)) {
      const collection = { classes: new Set(selector === '#jyd-pauseState' ? ['jyd-startIcon'] : []),
        visible: true,
        css: (...args) => args.length === 1 ? '800px' : collection,
        children: child => $(selector + ' ' + child),
        click: callback => { collection.clickHandler = callback; return collection; },
        hide: () => { collection.visible = false; return collection; },
        show: () => { collection.visible = true; return collection; },
        addClass: name => { collection.classes.add(name); return collection; },
        removeClass: name => { collection.classes.delete(name); return collection; }
      };
      for (const method of ['append', 'text', 'hover', 'dblclick', 'mousemove', 'mouseover', 'mouseout', 'mousedown', 'mouseup']) {
        collection[method] = () => collection;
      }
      collections.set(selector, collection);
    }
    return collections.get(selector);
  }
  const context = vm.createContext({ $, Promise, document: {
    createElement: () => ({ canPlayType: () => 'probably' }),
    getElementById: id => {
      if (!elements.has(id)) elements.set(id, { style: {}, offsetLeft: 0, addEventListener() {} });
      return elements.get(id);
    }
  }, window: { getSelection: () => ({ removeAllRanges() {} }) },
  navigator: { userAgent: 'Chrome', mimeTypes: {} },
  setTimeout, setInterval, clearInterval });
  vm.runInContext(read('extension/player/media.js').toString(), context);
  vm.runInContext(read('extension/player/original/jydH5Player.js').toString(), context);
  const player = context.jydH5Player({ element: 'h5PlayerId', publicRpType: '1,2,3',
    teacherVideoUrl: 'teacher.mp4', studentVideoUrl: 'student.mp4', courseVideoUrl: 'slides.mp4' });
  return { videos, player, document: context.document, button: $('#jyd-pauseState'), cover: $('.jyd-videoCover'),
    click: selector => { const control = $(selector); control.clickHandler.call(control); } };
}

test('one click starts all views even when their metadata arrives later', async () => {
  for (const selector of ['#jyd-pauseState', '.jyd-videoCover']) {
    const { videos, button, click } = playbackFixture();
    videos[0].emit('loadedmetadata');
    click(selector);
    assert.ok(videos.every(video => !video.paused), selector + ' must request all three views');
    videos[1].emit('loadedmetadata');
    videos[2].emit('loadedmetadata');
    assert.ok(videos.every(video => !video.paused), 'late metadata must not cancel playback');
    for (const video of videos) video.emit('playing');
    await new Promise(setImmediate);
    assert.ok(button.classes.has('jyd-pauseIcon'));
    click('#jyd-pauseState');
    assert.ok(videos.every(video => video.paused));
    assert.ok(button.classes.has('jyd-startIcon'));
  }
});

test('failed playback restores the play button and the next click retries', async () => {
  for (const name of ['NotAllowedError', 'NotSupportedError']) {
    const { videos, button, cover, click } = playbackFixture();
    for (const video of videos) video.emit('loadedmetadata');
    for (const video of videos) video.playFailure = new DOMException('Cannot play', name);
    click('.jyd-videoCover');
    await new Promise(setImmediate);
    assert.ok(videos.every(video => video.paused));
    assert.ok(button.classes.has('jyd-startIcon'));
    assert.ok(cover.visible);
    for (const video of videos) video.playFailure = null;
    click('#jyd-pauseState');
    for (const video of videos) video.emit('playing');
    await new Promise(setImmediate);
    assert.ok(videos.every(video => !video.paused));
    assert.ok(button.classes.has('jyd-pauseIcon'));
    click('#jyd-pauseState');
  }
});

test('seeking before metadata leaves all three timelines valid', () => {
  const { videos, document } = playbackFixture();
  document.getElementById('jyd-processBar').onmousedown({ clientX: 200 });
  assert.ok(videos.every(video => video.currentTime === 0));
  assert.equal(document.onmousemove, undefined);
});

test('reaching the end pauses and resets all views; one click starts the replay', async () => {
  const { videos, button, click } = playbackFixture();
  for (const video of videos) video.emit('loadedmetadata');
  videos[0].emit('canplay');
  click('#jyd-pauseState');
  for (const video of videos) video.emit('playing');
  videos[0].currentTime = videos[0].duration;
  videos[0].emit('timeupdate');
  for (const video of videos) video.emit('canplay');
  await new Promise(setImmediate);
  assert.ok(videos.every(video => video.paused && video.currentTime === 0));
  assert.ok(button.classes.has('jyd-startIcon'));
  click('#jyd-pauseState');
  assert.ok(videos.every(video => !video.paused));
  click('#jyd-pauseState');
});

test('a failed or interrupted view cannot stop the other two; ready views resume without another click', async () => {
  const { videos, button, player, click } = playbackFixture();
  videos[2].playFailure = new DOMException('Cannot play', 'NotSupportedError');
  click('.jyd-videoCover');
  await new Promise(setImmediate);
  assert.ok(videos.slice(0, 2).every(video => !video.paused));
  assert.ok(button.classes.has('jyd-pauseIcon'));
  videos[2].playFailure = null;
  videos[0].readyState = 3;
  videos[0].currentTime = 12;
  videos[2].emit('loadedmetadata');
  assert.equal(videos[2].currentTime, 12, 'late view must join the current timeline');
  videos[2].emit('canplay');
  videos[2].emit('playing');
  assert.ok(!videos[2].paused, 'late view must not require a second click');
  videos[1].pause();
  await new Promise(setImmediate);
  assert.ok(!videos[0].paused && !videos[2].paused, 'one native pause must not cascade');
  videos[1].emit('canplay');
  videos[1].emit('playing');
  assert.ok(videos.every(video => !video.paused));
  videos[2].error = { code: 2 };
  videos[2].pause();
  videos[2].emit('error');
  await new Promise(setImmediate);
  assert.ok(!videos[0].paused && !videos[1].paused, 'one source error must not cascade');
  player.stopVideo();
  player.playVideo();
  assert.equal(videos[2].loadCount, 1, 'retry must reload the failed source');
  for (const video of videos) video.emit('playing');
  await new Promise(setImmediate);
  assert.ok(videos.every(video => !video.paused));
  player.stopVideo();
});

test('dragging follows the latest position every 300ms, stays put while held and commits on release', async t => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  for (const playing of [false, true]) {
    const { videos, document, player, click, button } = playbackFixture();
    for (const video of videos) video.emit('loadedmetadata');
    videos[0].emit('canplay');
    if (playing) {
      click('#jyd-pauseState');
      for (const video of videos) video.emit('playing');
    }
    const writes = videos.map(video => {
      let time = video.currentTime;
      const targets = [];
      Object.defineProperty(video, 'currentTime', {
        get: () => time,
        set: value => { targets.push(value); time = value; video.seeking = true; }
      });
      return targets;
    });
    const progress = document.getElementById('jyd-processBar');
    const bar = document.getElementById('jyd-currentProcessBar');
    const label = document.getElementById('jyd-timeUpdateNow');
    progress.offsetLeft = 80;
    progress.onmousedown({ clientX: 280 });
    assert.equal(label.innerHTML, '00:00:30');
    for (let x = 300; x <= 480; x += 10) document.onmousemove({ clientX: x });
    t.mock.timers.tick(299);
    assert.ok(writes.every(targets => targets.length === 1 && targets[0] === 30));
    t.mock.timers.tick(1);
    assert.ok(writes.every(targets => targets.length === 2 && targets[1] === 60), 'latest pointer position must supersede an older loading target');
    videos[0].emit('timeupdate');
    assert.equal(bar.style.width, '400px', 'playback updates must not overwrite the preview');
    assert.equal(label.innerHTML, '00:01:00');
    for (const video of videos) video.seeking = false;
    videos[0].duration = 120.04;
    videos[0].emit('canplay');
    document.onmousemove({ clientX: 480 });
    t.mock.timers.tick(900);
    assert.ok(writes.every(targets => targets.length === 2), 'duration updates and identical pointer events must not repeat a seek');
    videos[0].duration = 120;
    videos[0].emit('canplay');
    document.onmousemove({ clientX: 680 });
    t.mock.timers.tick(299);
    assert.ok(writes.every(targets => targets.length === 2));
    document.onmouseup();
    document.onmouseup();
    t.mock.timers.tick(900);
    assert.ok(writes.every(targets => targets.length === 3 && targets[2] === 90), 'release must commit once and cancel the timer');
    assert.equal(document.onmousemove, null);
    for (const video of videos) video.emit('canplay');
    await new Promise(setImmediate);
    assert.ok(videos.every(video => video.currentTime === 90 && video.paused === !playing));
    assert.ok(button.classes.has(playing ? 'jyd-pauseIcon' : 'jyd-startIcon'));
    videos[0].emit('timeupdate');
    assert.equal(bar.style.width, '75%', 'normal progress updates must resume after release');
    player.stopVideo();
  }
});

test('cancelled requests cannot stop a newer play request; explicit pause stops all views', async () => {
  const { videos, button, player, click } = playbackFixture();
  click('.jyd-videoCover');
  click('#jyd-pauseState');
  click('#jyd-pauseState');
  for (const video of videos) { video.emit('loadedmetadata'); video.emit('playing'); }
  await new Promise(setImmediate);
  assert.ok(videos.every(video => !video.paused), 'old AbortErrors must not cancel the new request');
  assert.ok(button.classes.has('jyd-pauseIcon'));
  player.playStartPoint(30);
  videos[0].emit('waiting');
  videos[0].emit('playing');
  assert.ok(videos.every(video => video.currentTime === 30 && !video.paused));
  player.stopVideo();
  assert.ok(videos.every(video => video.paused));
  assert.ok(button.classes.has('jyd-startIcon'));
  player.playVideo();
  player.stopVideo();
  await new Promise(setImmediate);
  assert.ok(videos.every(video => video.paused));
  assert.ok(button.classes.has('jyd-startIcon'));
});

test('player initializes three views from its replay fragment and stops on page exit', () => {
  const calls = [], listeners = [];
  const error = { textContent: '' };
  const context = vm.createContext({ URL, URLSearchParams, location: { hash: '#rpId=' + 'A'.repeat(32) },
    document: { getElementById: () => error, querySelectorAll: () => [] }, window: { addEventListener: (...args) => listeners.push(args) },
    jydH5Player: options => { calls.push(options); return { stopVideo: () => calls.push('stopped') }; },
    fetch: () => assert.fail('Player must not fetch platform APIs or configuration') });
  vm.runInContext(read('extension/core.js').toString(), context);
  vm.runInContext(read('extension/player/boot.js').toString(), context);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].publicRpType, '1,2,3');
  assert.equal(calls[0].element, 'h5PlayerId');
  assert.equal(calls[0].enablePic, undefined);
  assert.equal(new URL(calls[0].teacherVideoUrl).searchParams.get('id'), 'A'.repeat(32));
  assert.equal(listeners[0][0], 'pagehide');
  listeners[0][1]();
  assert.equal(calls[1], 'stopped');
  context.location.hash = '#rpId=invalid';
  vm.runInContext(read('extension/player/boot.js').toString(), context);
  assert.equal(calls.length, 2);
  assert.ok(error.textContent.includes('编号无效'));
});
