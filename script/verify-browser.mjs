// Use the Chrome and Node runtimes already present on the GitHub runner.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, stat, mkdtemp, rm } from 'node:fs/promises';
import { resolve, extname, join } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
const root = resolve('build');
const server = createServer(async (req, res) => {
  let file = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + '/') && file !== root) { res.writeHead(403).end(); return; }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.xml': 'application/xml' })[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(await readFile(join(root, 'error.html')));
  }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const profile = await mkdtemp(join(tmpdir(), 'blog-chrome-'));
const chrome = spawn(process.env.CHROME_BIN || 'google-chrome', ['--headless=new', '--disable-gpu', '--no-sandbox', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    let log = '';
    const timer = setTimeout(() => reject(new Error('Chrome startup timeout')), 15000);
    chrome.on('error', reject);
    chrome.stderr.on('data', data => { log += data; const m = log.match(/DevTools listening on (ws:\/\/[^\s]+)/); if (m) { clearTimeout(timer); resolve(m[1]); } });
  });
  const pages = await (await fetch(endpoint.replace(/^ws:/, 'http:').replace(/\/devtools\/browser\/.*/, '/json/list'))).json();
  socket = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
  await new Promise((r, j) => { socket.onopen = r; socket.onerror = j; });
  let id = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => { const msg = JSON.parse(data); if (pending.has(msg.id)) { const { resolve, reject, timer } = pending.get(msg.id); clearTimeout(timer); pending.delete(msg.id); msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result); } };
  const call = (method, params = {}) => new Promise((resolve, reject) => { const requestId = ++id; const timer = setTimeout(() => reject(new Error(`CDP timeout: ${method}`)), 15000); pending.set(requestId, { resolve, reject, timer }); socket.send(JSON.stringify({ id: requestId, method, params })); });
  const evaluate = async expression => { const r = await call('Runtime.evaluate', { expression, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
  await call('Page.enable');
  const visit = async path => {
    await call('Page.navigate', { url: base + path });
    for (let i = 0; i < 100; i++) {
      if (await evaluate(`location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete'`)) return;
      await new Promise(r => setTimeout(r, 100));
    }
    throw new Error('Page load timeout');
  };
  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await visit('/');
  const visible = selector => evaluate(`!!document.querySelector(${JSON.stringify(selector)}) && document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect().height > 0`);
  assert.equal(await visible('.navbar-toggle'), true);
  assert.equal(await visible('#site-navigation'), false);
  await evaluate(`document.querySelector('.navbar-toggle').click()`);
  assert.equal(await visible('#site-navigation'), true);
  assert.equal(await evaluate(`document.querySelector('.navbar-toggle').getAttribute('aria-expanded')`), 'true');
  assert.equal(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), true, 'Mobile horizontal overflow');
  await evaluate(`document.querySelector('.navbar-toggle').click()`);
  assert.equal(await visible('#site-navigation'), false);
  await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  assert.equal(await visible('#site-navigation'), true);
  assert.equal(await visible('.navbar-toggle'), false);
  const post = await evaluate(`Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href')).find(h => /^\/posts\/\d/.test(h))`);
  assert.ok(post, 'Homepage post link');
  await visit(post);
  assert.equal(await visible('h1'), true);
  await visit('/about/');
  assert.equal(await visible('h1'), true);
  await visit('/error.html');
  assert.equal(await evaluate(`document.getElementById('suggest') === null`), true);
  await visit('/blog/legacy-post/');
  assert.equal(await evaluate(`document.querySelector('#suggest a').getAttribute('href')`), '/posts/legacy-post/');
  assert.equal(await evaluate(`typeof window.jQuery`), 'undefined');
  console.log('Browser checks passed: mobile open/close and ARIA, no overflow, desktop navigation, post, about, error and legacy URL suggestion.');
} finally {
  if (socket) socket.close();
  chrome.kill();
  await new Promise(r => server.close(r));
  await new Promise(r => chrome.exitCode !== null ? r() : chrome.once('exit', r));
  await rm(profile, { recursive: true, force: true });
}
