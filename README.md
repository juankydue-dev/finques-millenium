# Finques Mil·lenium — web nueva (demo)

Web estática construida con [Astro](https://astro.build) como demo de rediseño de Visto Bueno
para Finques Mil·lenium (Gavà). Español, catalán e inglés (el francés está preparado tras un
flag, pendiente de confirmación del cliente).

## Comandos

```bash
npm install        # dependencias
npm run dev        # desarrollo en localhost:4321
npm run build      # build completo: redirecciones + comprobación legal + Astro + anti-marcadores
npm run preview    # servir dist/ en local
```

## Principios del proyecto

1. **Fuente única de datos** — `src/config/empresa.ts`. Cada dato lleva `verificado: true/false`
   y **lo no verificado no se renderiza en ninguna página**. Lea siempre con `dato()`.
2. **Cero marcadores** — `scripts/check-marcadores.mjs` recorre el HTML generado y rompe el
   build si aparece `[MAYÚSCULAS]`, `Provisional`, `TODO`, `lorem` (con límite de palabra:
   "valorem" no cuenta), `[EMAIL]`, etc.
3. **Datos legales** — `scripts/check-legal.mjs`: en producción (`PUBLIC_DEMO=false`) el build
   falla si falta por verificar razón social, CIF, Registro Mercantil, pólizas, horario o el
   destino de los formularios.
4. **Redirecciones** — `redirects.config.mjs` es la única fuente; `scripts/gen-redirects.mjs`
   genera `vercel.json`, `render.yaml` y `public/.htaccess` (Apache de producción, que además
   negocia el idioma de la raíz por `Accept-Language`).
5. **Inmuebles** — capa de datos en `src/lib/propiedades.ts` con dos adaptadores:
   `demo` (`src/data/inmuebles.demo.json`, 6 ejemplos marcados "Ejemplo") y `xml` (feed del CRM,
   pendiente de mapear cuando se conozca el CRM; `PROPIEDADES_ORIGEN=xml`).
   Cada inmueble tiene página propia, JSON-LD `RealEstateListing`/`Offer` y entrada en
   `sitemap-inmuebles.xml`.
6. **Sin JavaScript** la web entera sigue funcionando: listados renderizados en build, filtros
   por zona como enlaces, formularios con fallback. El JS solo mejora (filtros instantáneos,
   calculadoras, banner de consentimiento, menú).
7. **Opiniones** — `src/data/reviews.json`: las reseñas reales de Google de la web actual.
   Nunca se inventan reseñas.
8. **Asistente** — el layout deja `<div id="vb-assistant" data-vb-mount hidden>` como punto de
   montaje del futuro widget de Visto Bueno. Sin implementar, a propósito.

## Variables de entorno

| Variable | Demo (por defecto) | Producción |
|---|---|---|
| `PUBLIC_DEMO` | `true` → noindex, franja de demo, formularios sin envío | `false` |
| `PUBLIC_FORM_ENDPOINT` | vacío → los formularios no envían nada | URL del backend de formularios |
| `PUBLIC_GA4_ID` | vacío → no se carga Google Analytics | `G-…` (solo tras consentimiento) |
| `PUBLIC_META_PIXEL_ID` | vacío → no se carga el píxel de Meta | id del píxel (solo tras consentimiento) |
| `PROPIEDADES_ORIGEN` | `demo` | `xml` cuando el adaptador del CRM esté mapeado |

## Despliegue

- **Render (demo):** `render.yaml` ya define el sitio estático `finques-millenium-demo`
  (build `npm ci && npm run build`, publica `dist/`). Basta conectar el repo en
  https://dashboard.render.com/blueprint/new?repo=<URL-del-repo>.
- **Vercel (demo):** `vercel.json` generado con las mismas redirecciones.
- **Apache (producción):** subir el contenido de `dist/` (incluye `.htaccess`) y compilar con
  `PUBLIC_DEMO=false` una vez verificados los datos pendientes en `src/config/empresa.ts`.

## Imágenes

Fotos de banco de Unsplash (licencia Unsplash, uso comercial permitido), en `src/assets/img/`.
No procede ninguna imagen de Fotocasa ni de otros portales. Sustituir por fotos reales de la
agencia antes de producción.
