const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = 4173;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  let filePath = path.join(root, urlPath);
  if (!filePath.startsWith(root)) { res.writeHead(403); res.end(); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(root, urlPath + '.html'), (err2, data2) => {
        if (err2) { res.writeHead(404); res.end('Not found: ' + urlPath); return; }
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(data2);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {'Content-Type': types[ext] || 'application/octet-stream'});
    res.end(data);
  });
}).listen(port, () => console.log('Serving ' + root + ' at http://localhost:' + port));
