import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX_PATH = path.join(ROOT, 'index.html');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0].split('#')[0] || '/';
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(ROOT, urlPath);
  const mime = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#root h1', { timeout: 15000 });
const rootHTML = await page.evaluate(() => document.getElementById('root').innerHTML);
await browser.close();
server.close();

const original = fs.readFileSync(INDEX_PATH, 'utf-8');
const PLACEHOLDER = '<div id="root"></div>';

if (!original.includes(PLACEHOLDER)) {
  console.error(`[prerender] "${PLACEHOLDER}" not found — was index.html already prerendered?`);
  process.exit(1);
}

fs.writeFileSync(INDEX_PATH, original.replace(PLACEHOLDER, `<div id="root">${rootHTML}</div>`), 'utf-8');
console.log(`[prerender] Done. Injected ${rootHTML.length} bytes into index.html.`);
