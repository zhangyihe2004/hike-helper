"""Local UI and real DOM click tests with mocked extension storage and windows."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = '''<script>
const changeListeners = [];
const readEnabled = () => localStorage.getItem('hike-helper-preview') === 'true';
window.chrome = {storage: {
  local: {
    get: async () => ({enabled: readEnabled()}),
    set: async ({enabled}) => {
      const oldValue = readEnabled();
      localStorage.setItem('hike-helper-preview', String(enabled));
      changeListeners.forEach(fn => fn({enabled:{oldValue,newValue:enabled}}, 'local'));
    }
  },
  onChanged: {addListener: fn => changeListeners.push(fn)}
}};
</script>'''
TEST_UI = '''<section style="padding:20px;border-top:1px solid #ccc;font-size:12px">
<strong>本地点击测试 · 模拟数据</strong><p>
<a href="#a" onclick="getStuControlType('record-a','course-alpha','COURSE_A','CLASS_A')">示例课程 A</a></p>
<p><a href="#b" onclick="getStuControlType('record-b','course-beta','COURSE_B','CLASS_B')">示例课程 B</a></p>
<p>原始点击：<output id="original">0</output> / 插件打开：<output id="opened">0</output></p>
<output id="url" style="display:block;overflow-wrap:anywhere"></output>
</section>'''
TEST_SCRIPTS = '''<script src="core.js"></script>
<script>
// Only this local fixture bypasses the real host guard; production stays scoped.
window.HikeHelper = {...HikeHelper, isSitePage: () => true};
let originalCount = 0, openedCount = 0;
window.getStuControlType = () => {document.querySelector('#original').textContent = ++originalCount;};
window.open = url => {
  document.querySelector('#opened').textContent = ++openedCount;
  document.querySelector('#url').textContent = url;
};
</script><script src="content.js"></script>'''


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        route = self.path.split('?', 1)[0]
        if route not in ['/extension/preview.html', '/extension/test.html']:
            return super().do_GET()
        html = (ROOT / 'extension' / 'popup.html').read_text(encoding='utf-8')
        scripts = FIXTURE
        if route.endswith('test.html'):
            scripts += TEST_UI + TEST_SCRIPTS
        html = html.replace('<script type="module"', scripts + '<script type="module"')
        payload = html.encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


if __name__ == '__main__':
    print('Popup: http://127.0.0.1:8766/extension/preview.html', flush=True)
    print('Click test: http://127.0.0.1:8766/extension/test.html', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8766), Handler).serve_forever()
