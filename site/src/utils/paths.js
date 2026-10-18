/**
 * Path and URL utilities for handling base paths across deployment targets.
 */

export function normalizeBasePath(base) {
  if (!base || base === '/') return '/';
  let b = String(base).trim();
  if (!b.startsWith('/')) b = '/' + b;
  if (!b.endsWith('/')) b = b + '/';
  return b;
}

export function withBase(path, base = '/') {
  if (!path) return normalizeBasePath(base);
  const str = String(path).trim();
  if (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('mailto:') ||
    str.startsWith('tel:') ||
    str.startsWith('#')
  ) {
    return str;
  }
  const normalizedBase = normalizeBasePath(base);
  const cleanPath = str.startsWith('/') ? str.slice(1) : str;
  return normalizedBase === '/' ? `/${cleanPath}` : `${normalizedBase}${cleanPath}`;
}

export function isExternalUrl(url) {
  return /^(https?:)?\/\//.test(url) || /^mailto:/.test(url);
}
