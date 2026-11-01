// Use the Chrome and Node runtimes already present on the GitHub runner.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, readdir, stat, mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises';
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
  const evaluate = async expression => { const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
  await call('Page.enable');
  await mkdir('output/playwright', { recursive: true });
  const screenshot = async name => { await evaluate('document.fonts.ready.then(() => true)'); const result = await call('Page.captureScreenshot', { format: 'png' }); await writeFile(`output/playwright/${name}.png`, Buffer.from(result.data, 'base64')); };
  const visit = async path => {
    await call('Page.navigate', { url: base + path });
    for (let i = 0; i < 100; i++) {
      if (await evaluate(`location.pathname === ${JSON.stringify(path)} && document.readyState !== 'loading'`)) return;
      await new Promise(r => setTimeout(r, 100));
    }
    throw new Error('Page load timeout');
  };
  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await visit('/');
  assert.equal(await evaluate(String.raw`/[\u3040-\u30ff\u4e00-\u9fff]/.test(document.querySelector('.article_title').textContent)`), true, 'Japanese title text survives rendering');
  const visible = selector => evaluate(`!!document.querySelector(${JSON.stringify(selector)}) && document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect().height > 0`);
  assert.equal(await visible('.navbar-toggle'), true);
  assert.equal(await visible('#site-navigation'), false);
  await evaluate(`document.querySelector('.navbar-toggle').click()`);
  assert.equal(await visible('#site-navigation'), true);
  assert.equal(await evaluate(`document.querySelector('.navbar-toggle').getAttribute('aria-expanded')`), 'true');
  await screenshot('mobile-navigation');
  assert.equal(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), true, 'Mobile horizontal overflow');
  await evaluate(`document.querySelector('.navbar-toggle').click()`);
  assert.equal(await visible('#site-navigation'), false);
  await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  assert.equal(await visible('#site-navigation'), true);
  assert.equal(await visible('.navbar-toggle'), false);
  await screenshot('desktop-home');
  const post = await evaluate(String.raw`Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href')).find(h => /^\/posts\/\d/.test(h))`);
  assert.ok(post, 'Homepage post link');
  await visit(post);
  assert.equal(await visible('h1'), true);
  await visit('/about/');
  assert.equal(await visible('h1'), true);
  // Browsers repair nested documents: verify exact structure/content on every
  // generated page instead of only checking that a heading is visible.
  const htmlFiles = (await readdir(root, { recursive: true })).filter(p => p.endsWith('.html')).sort();
  const coverage = [];
  for (const width of [390, 1280]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width === 390 });
    for (const file of htmlFiles) {
      const path = '/' + file;
      await visit(path);
      const state = await evaluate(`(() => {
        const count = s => document.querySelectorAll(s).length;
        const text = s => document.querySelector(s)?.textContent.replace(/\\s+/g, ' ').trim();
        return { nav: count('.navbar'), menu: count('#site-navigation'), footer: count('#footer'),
          headingCount: count('.header > h1, .page_title > h1'), heading: text('.header > h1, .page_title > h1'),
          title: document.title.replace(/\\s+/g, ' ').trim(),
          nestedLayout: count('.header .navbar, .header #footer, .header .article_info'),
          aboutSections: Array.from(document.querySelectorAll('h2, h3')).map(e => e.textContent.trim()),
          scripts: count('script[src="/javascripts/application.js"]') };
      })()`);
      for (const key of ['nav', 'menu', 'footer', 'headingCount', 'scripts']) assert.equal(state[key], 1, `${path}: ${key} at ${width}`);
      assert.equal(state.nestedLayout, 0, `${path}: nested layout`);
      assert.ok(state.heading && !state.title.includes('<'), `${path}: heading/title`);
      if (file === 'about/index.html') {
        assert.equal(state.heading, 'About Me');
        assert.equal(state.title, 'About Me - blog.takuyan.com');
        for (const label of ['Takuya Kato', 'Personal Projects', 'Contact']) assert.equal(state.aboutSections.filter(t => t === label).length, 1);
      } else if (file === 'error.html') {
        assert.equal(state.heading, '404 ページがみつかりません');
        assert.equal(state.title, '404 Page Not Found - blog.takuyan.com');
      } else if (file.startsWith('posts/tags/')) {
        const tag = state.heading.slice(1, -1);
        assert.equal(state.heading, `/${tag}/`);
        assert.equal(tag.replaceAll('_', '-'), file.split('/')[2]);
        assert.equal(state.title, `${tag} - blog.takuyan.com`);
      }
      if (['about/index.html', 'error.html', 'posts/tags/ruby/index.html'].includes(file)) await screenshot(`${width}-${file.replaceAll('/', '-')}`);
      coverage.push({ path, width });
    }
  }
  await writeFile('output/browser-coverage.json', JSON.stringify(coverage, null, 2));
  await visit('/error.html');
  assert.equal(await evaluate(`document.getElementById('suggest') === null`), true);
  await visit('/blog/legacy-post/');
  assert.equal(await evaluate(`document.querySelector('#suggest a').getAttribute('href')`), '/posts/legacy-post/');
  assert.equal(await evaluate(`typeof window.jQuery`), 'undefined');
  console.log(`Browser checks passed: ${htmlFiles.length} HTML pages at both widths (${coverage.length} visits), mobile open/close and ARIA, desktop navigation, exact about/error/tag headings and legacy URL suggestion.`);
} finally {
  if (socket) socket.close();
  chrome.kill();
  await new Promise(r => server.close(r));
  await new Promise(r => chrome.exitCode !== null ? r() : chrome.once('exit', r));
  await rm(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
