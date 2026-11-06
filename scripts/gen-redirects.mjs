/**
 * Genera vercel.json y public/.htaccess desde redirects.config.mjs.
 * Se ejecuta en el prebuild: las dos plataformas comparten la misma fuente.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { LEGACY, ROOT } from '../redirects.config.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEMO = (process.env.PUBLIC_DEMO ?? 'true') !== 'false';

/* ---------- vercel.json ---------- */
const vercel = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  trailingSlash: true,
  redirects: [
    // Raíz → idioma del navegador (302 en servidor, sin JS ni meta refresh).
    ...ROOT.porIdioma.map(({ lang, to }) => ({
      source: '/',
      has: [{ type: 'header', key: 'accept-language', value: `^${lang}.*` }],
      destination: to,
      permanent: false,
    })),
    { source: '/', destination: ROOT.porDefecto, permanent: false },
    // URLs antiguas → 301.
    ...LEGACY.filter((r) => !r.from.endsWith('/')).map((r) => ({
      source: r.from,
      destination: r.to,
      permanent: true,
    })),
    // Las variantes con barra final las normaliza trailingSlash; añadimos las que cambian de destino.
    ...LEGACY.filter((r) => r.from.endsWith('/') && r.from !== r.to).map((r) => ({
      source: r.from.replace(/\/$/, '') + '/',
      destination: r.to,
      permanent: true,
    })),
  ],
  headers: [
    {
      source: '/_astro/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
        ...(DEMO ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] : []),
      ],
    },
  ],
};

/* ---------- .htaccess (producción Apache) ---------- */
const lineasLegacy = LEGACY.map((r) => `Redirect 301 ${r.from.replace(/\/$/, '') || r.from} ${r.to}`);
// Apache: Redirect no distingue barra final; usamos RedirectMatch exacto.
const htaccess = `# Generado por scripts/gen-redirects.mjs — NO editar a mano.
# Fuente: redirects.config.mjs

Options -Indexes
AddDefaultCharset utf-8

# --- Raíz → idioma del navegador (en servidor) ---
RewriteEngine On
${ROOT.porIdioma
  .map(
    ({ lang, to }) => `RewriteCond %{HTTP:Accept-Language} ^${lang} [NC]
RewriteRule ^$ ${to} [R=302,L]`
  )
  .join('\n')}
RewriteRule ^$ ${ROOT.porDefecto} [R=302,L]

# --- URLs antiguas (WordPress y versiones anteriores) ---
${LEGACY.map((r) => `RedirectMatch 301 ^${r.from.replace(/[.*+?^${'$'}{}()|[\\]\\\\]/g, '\\$&')}$ ${r.to}`).join('\n')}

# --- Cachés ---
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/avif "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# --- Cabeceras ---
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
</IfModule>

ErrorDocument 404 /404.html
`;

/* ---------- render.yaml (demo en Render: sitio estático desde Git) ---------- */
// Render no permite redirigir según Accept-Language: la raíz va siempre a /es/.
// En producción (Apache), .htaccess sí negocia el idioma.
const yamlEscape = (s) => `"${s}"`;
const renderRoutes = [
  { type: 'redirect', source: '/', destination: ROOT.porDefecto },
  ...LEGACY.map((r) => ({ type: 'redirect', source: r.from.replace(/\/$/, '') || r.from, destination: r.to })),
]
  // Render no distingue barra final en source; deduplicamos.
  .filter((r, i, a) => a.findIndex((x) => x.source === r.source) === i);

const renderYaml = `# Generado por scripts/gen-redirects.mjs — NO editar a mano (fuente: redirects.config.mjs)
services:
  - type: web
    name: finques-millenium-demo
    runtime: static
    buildCommand: npm ci && npm run build
    staticPublishPath: dist
    routes:
${renderRoutes.map((r) => `      - type: ${r.type}\n        source: ${yamlEscape(r.source)}\n        destination: ${yamlEscape(r.destination)}`).join('\n')}
    headers:
      - path: /_astro/*
        name: Cache-Control
        value: public, max-age=31536000, immutable
${DEMO ? `      - path: /*
        name: X-Robots-Tag
        value: noindex, nofollow
` : ''}`;

writeFileSync(join(raiz, 'vercel.json'), JSON.stringify(vercel, null, 2) + '\n');
writeFileSync(join(raiz, 'public', '.htaccess'), htaccess);
writeFileSync(join(raiz, 'render.yaml'), renderYaml);
console.log('✓ vercel.json, render.yaml y public/.htaccess generados desde redirects.config.mjs');
