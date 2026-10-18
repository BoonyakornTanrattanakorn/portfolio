import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { normalizeBasePath } from '../site/src/utils/paths.js';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.glb': 'model/gltf-binary',
  '.ico': 'image/x-icon',
};

export function createPreviewServer({ base = '/portfolio/', port = 4173, distDir } = {}) {
  const normalizedBase = normalizeBasePath(base);
  const rootDist = distDir || path.join(process.cwd(), 'dist');

  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://localhost:${port}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // If served beneath a subpath like /portfolio/
    if (normalizedBase !== '/') {
      if (pathname === '/' || pathname === normalizedBase.slice(0, -1)) {
        res.writeHead(302, { Location: normalizedBase });
        res.end();
        return;
      }
      if (!pathname.startsWith(normalizedBase)) {
        // Path does not belong to base; serve 404
        serve404(res, rootDist);
        return;
      }
      // Strip base prefix
      pathname = '/' + pathname.slice(normalizedBase.length);
    }

    // Resolve file inside distDir
    let relativeFilePath = pathname.startsWith('/') ? pathname.slice(1) : pathname;

    // Handle root /
    if (!relativeFilePath || relativeFilePath === '') {
      relativeFilePath = 'index.html';
    }

    let absoluteFilePath = path.join(rootDist, relativeFilePath);

    // If it's a directory (or ends with slash), look for index.html inside
    if (fs.existsSync(absoluteFilePath) && fs.statSync(absoluteFilePath).isDirectory()) {
      if (!req.url.endsWith('/') && !pathname.endsWith('/')) {
        // Enforce trailing slash on directory URLs so relative links resolve correctly
        res.writeHead(302, { Location: req.url + '/' });
        res.end();
        return;
      }
      absoluteFilePath = path.join(absoluteFilePath, 'index.html');
    } else if (!fs.existsSync(absoluteFilePath)) {
      // Check if it's a directory request without trailing slash (e.g. /projects/cursr-iv)
      const maybeDirPath = path.join(rootDist, relativeFilePath);
      if (fs.existsSync(maybeDirPath) && fs.statSync(maybeDirPath).isDirectory()) {
        res.writeHead(302, { Location: req.url + '/' });
        res.end();
        return;
      }
      // Or check if adding .html resolves (optional, but let's check exact file first)
    }

    if (fs.existsSync(absoluteFilePath) && fs.statSync(absoluteFilePath).isFile()) {
      const ext = path.extname(absoluteFilePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(absoluteFilePath).pipe(res);
    } else {
      serve404(res, rootDist);
    }
  });

  return server;
}

function serve404(res, rootDist) {
  const notFoundPath = path.join(rootDist, '404.html');
  if (fs.existsSync(notFoundPath)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(notFoundPath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
}

// If run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('preview.js')) {
  const args = process.argv.slice(2);
  let base = process.env.BASE_PATH || '/portfolio/';
  let port = 4173;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--base' && args[i + 1]) {
      base = args[i + 1];
      i++;
    } else if (args[i] === '--port' && args[i + 1]) {
      port = parseInt(args[i + 1], 10);
      i++;
    }
  }

  const server = createPreviewServer({ base, port });
  server.listen(port, () => {
    console.log(`Static preview server running at http://localhost:${port}${normalizeBasePath(base)}`);
  });
}
