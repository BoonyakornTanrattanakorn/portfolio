import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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

function devStaticAssetsPlugin() {
  return {
    name: 'dev-static-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url ? req.url.split('?')[0] : '';
        const urlPath = decodeURIComponent(rawUrl);
        const cleanPath = urlPath.replace(/^\/portfolio\//, '/');

        // Favicon
        if (cleanPath === '/favicon.svg') {
          const filePath = path.resolve('site/favicon.svg');
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'image/svg+xml');
            return fs.createReadStream(filePath).pipe(res);
          }
        }

        // Assets (e.g. /assets/avatar.jpg, /assets/css/styles.css)
        if (cleanPath.startsWith('/assets/')) {
          const filePath = path.resolve('site' + cleanPath);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
            return fs.createReadStream(filePath).pipe(res);
          }
        }

        // CV documents (e.g. /CV/Boonyakorn_Tanrattanakorn_CV.html or .pdf)
        if (cleanPath.startsWith('/CV/')) {
          const filePath = path.resolve(cleanPath.slice(1));
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
            return fs.createReadStream(filePath).pipe(res);
          }
        }

        // Project media assets (e.g. /projects/sph-simulator/sph-poster.png, /projects/cursr-iv/FC.glb)
        // Skip .html files so the React app handles project page routes
        if (cleanPath.startsWith('/projects/')) {
          const filePath = path.resolve('site' + cleanPath);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile() && !filePath.endsWith('.html')) {
            const ext = path.extname(filePath).toLowerCase();
            res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
            return fs.createReadStream(filePath).pipe(res);
          }
        }

        // Website media assets (e.g. /websites/<id>/screenshot.png)
        if (cleanPath.startsWith('/websites/')) {
          const filePath = path.resolve('site' + cleanPath);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile() && !filePath.endsWith('.html')) {
            const ext = path.extname(filePath).toLowerCase();
            res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
            return fs.createReadStream(filePath).pipe(res);
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devStaticAssetsPlugin()],
  test: {
    environment: 'node',
    globals: true,
  },
});
