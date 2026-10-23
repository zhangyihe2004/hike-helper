// Match the original engine's media interface using native online MP4 playback.
// Use the platform's controls, stylesheet and icons.
globalThis.Hls = class NativeReplayMedia {
  static Events = Object.freeze({ MANIFEST_PARSED: 'manifestParsed' });
  static isSupported() { return Boolean(document.createElement('video').canPlayType('video/mp4')); }
  loadSource(url) { this.url = url; }
  attachMedia(video) {
    this.video = video;
    video.preload = 'auto';
    video.src = this.url;
  }
  on(event, callback) {
    if (event === NativeReplayMedia.Events.MANIFEST_PARSED) {
      this.video.addEventListener('loadedmetadata', () => callback(event, {}), { once: true });
    }
  }
};
