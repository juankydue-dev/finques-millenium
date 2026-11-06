import type { APIRoute } from 'astro';
import { DEMO, SITE_URL } from '../config/site';

export const GET: APIRoute = () => {
  const base = SITE_URL.replace(/\/$/, '');
  // En demo se permite el rastreo para que los robots VEAN el noindex de cada página.
  const body = `# Finques Mil·lenium${DEMO ? ' (demo)' : ''}
User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
