/**
 * FUENTE ÚNICA de redirecciones 301.
 * scripts/gen-redirects.mjs genera desde aquí:
 *   - vercel.json   (demo en Vercel)
 *   - public/.htaccess (producción en Apache; se copia a dist/ en el build)
 *
 * Añada aquí lo que vaya saliendo de Search Console y vuelva a desplegar.
 */

/** URLs antiguas (WordPress y versiones anteriores) → web nueva. Siempre 301. */
export const LEGACY = [
  { from: '/conocenos/', to: '/es/nosotros/' },
  { from: '/conocenos', to: '/es/nosotros/' },
  { from: '/si-vendes-nosotros-compramos/', to: '/es/vender/' },
  { from: '/si-vendes-nosotros-compramos', to: '/es/vender/' },
  { from: '/contactar', to: '/es/contacto/' },
  { from: '/contactar/', to: '/es/contacto/' },
  { from: '/es/contacto', to: '/es/contacto/' },
];

/**
 * Raíz → idioma, EN SERVIDOR y según Accept-Language (302: varía por cabecera).
 * El orden importa: la primera condición que casa, gana. Sin cabecera → español.
 */
export const ROOT = {
  porIdioma: [
    { lang: 'ca', to: '/ca/' },
    { lang: 'en', to: '/en/' },
  ],
  porDefecto: '/es/',
};
