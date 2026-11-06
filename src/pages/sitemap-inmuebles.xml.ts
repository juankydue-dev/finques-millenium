import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/site';
import { LANGS, path, alternates } from '../lib/i18n';
import { getInmuebles } from '../lib/propiedades';

const base = SITE_URL.replace(/\/$/, '');

export const GET: APIRoute = () => {
  const bloques = getInmuebles().flatMap((i) => {
    const alts = alternates('inmuebles', i.slug);
    return LANGS.map((lang) => {
      const loc = base + path(lang, 'inmuebles', i.slug);
      const links = alts
        .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${base + a.href}"/>`)
        .join('\n');
      return `  <url>\n    <loc>${loc}</loc>\n${links}\n  </url>`;
    });
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${bloques.join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
