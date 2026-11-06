import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/site';
import { LANGS, path, alternates, type SectionKey } from '../lib/i18n';
import zonas from '../data/zonas.json';

const base = SITE_URL.replace(/\/$/, '');

const SECCIONES: SectionKey[] = [
  'home', 'comprar', 'alquilar', 'obra-nueva', 'traspasos', 'vender', 'valorar',
  'hipoteca', 'inversion', 'alerta', 'zonas', 'nosotros', 'contacto',
  'aviso-legal', 'privacidad', 'cookies',
];

function urlCon(section: SectionKey, ...rest: string[]): string {
  const alts = alternates(section, ...rest);
  return LANGS.map((lang) => {
    const loc = base + path(lang, section, ...rest);
    const links = alts
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${base + a.href}"/>`)
      .join('\n');
    return `  <url>\n    <loc>${loc}</loc>\n${links}\n  </url>`;
  }).join('\n');
}

export const GET: APIRoute = () => {
  const bloques = [
    ...SECCIONES.map((s) => urlCon(s)),
    ...zonas.zonas.map((z) => urlCon('zonas', z.slug)),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${bloques.join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
