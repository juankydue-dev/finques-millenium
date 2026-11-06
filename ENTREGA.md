# Entrega de la demo — Finques Mil·lenium

**Demo publicada:** https://finques-millenium-demo.onrender.com
**Código:** https://github.com/juankydue-dev/finques-millenium
**Modo:** demostración (noindex en todas las páginas, franja de aviso, inmuebles de ejemplo, formularios sin envío real).

## Criterios de "terminado"

| Criterio | Estado |
|---|---|
| Script anti-marcadores a cero en todo el HTML generado | ✅ 0 marcadores en 115 páginas (el build falla si aparece uno) |
| Cada inmueble con página propia y en el sitemap | ✅ 6 inmuebles × 3 idiomas, con schema.org `RealEstateListing`/`Offer`, en `sitemap-inmuebles.xml` (18 entradas) |
| URLs antiguas con 301 | ✅ `/conocenos/`, `/si-vendes-nosotros-compramos/`, `/contactar` y `/es/contacto` → 301 verificados en producción |
| Datos de empresa solo desde la configuración | ✅ `src/config/empresa.ts` con campo `verificado`; lo no verificado no se renderiza |
| Lighthouse ≥ 90 en las cuatro categorías | ✅ En la web publicada: rendimiento 99–100, accesibilidad 100, buenas prácticas 100. SEO da 100 sin el noindex; en demo marca 69 **solo** por el noindex deliberado |

Notas de plataforma:
- La redirección de la raíz es de servidor. En Render no se puede negociar el idioma por `Accept-Language`, así que `/` va siempre a `/es/`; el `.htaccess` generado para el Apache de producción sí negocia es/ca/en.
- `redirects.config.mjs` es la única fuente de redirecciones y genera a la vez `vercel.json`, `render.yaml` y `public/.htaccess`. Lo que salga de Search Console se añade ahí.

## Datos pendientes del cliente (no se muestran hasta verificarlos)

**Legales (en producción el build se niega a compilar sin ellos):**
1. Razón social exacta — la web antigua se contradecía («Finques Mil·lenium, S.L.» en el pie vs `[RAZÓN SOCIAL]` en Nosotros).
2. CIF — el B22731111 publicado parece inventado (prefijo 22 = Huesca).
3. Registro Mercantil de Barcelona: tomo, folio, hoja.
4. Aseguradora y nº de póliza de responsabilidad civil.
5. Entidad y nº de la garantía/caución de cantidades entregadas.
6. Plazo de conservación de datos de los formularios (la web antigua tenía «[24] meses» sin decidir).

**Identidad y credenciales:**
7. Números profesionales: la web antigua publicaba tres distintos — «Perito nº 3067», «API nº 3037» y «AICAT nº 3543». Solo el AICAT 3543 está confirmado y es el único que se muestra. Falta: nº de API y su colegio, y nº de perito.
8. Año de fundación («desde 1982»), «2ª generación» y cifra de operaciones — los claims están preparados en el código y se activan solos al marcar `fundacion` como verificada.
9. Nombre, cargo, foto e hitos del fundador para la cita y el timeline de Nosotros; fotos y permisos del resto del equipo.

**Operativa:**
10. Horario de tarde: ¿16:00–19:30 (lo que publicaba la web) o 17:00–20:30? Hasta entonces no se muestra horario.
11. Zonas definitivas: ¿con Sant Boi y El Prat, o con Begues? La demo muestra solo las tres seguras (Gavà, Castelldefels, Viladecans); las otras están preparadas en datos.
12. Precios €/m² por municipio y barrio (los de la web antigua están guardados con `verificado:false` y no se muestran).
13. ¿Mantener el francés? Está implementado tras un flag (`src/config/site.ts`), apagado.
14. Buzón de destino de los formularios (`PUBLIC_FORM_ENDPOINT`).
15. IDs de GA4 y Meta Pixel si quieren medir: el consentimiento ya está montado (desactivado por defecto) y la política de cookies se adapta sola.
16. CRM inmobiliario que usan, para mapear su feed XML en `src/lib/propiedades.ts` y sustituir los 6 ejemplos.
17. Fotos reales de la agencia y de los inmuebles (las actuales son de banco, licencia Unsplash).

## Para pasar a producción

1. Completar `src/config/empresa.ts` (todo `verificado: true`) y los pendientes de arriba.
2. Compilar con `PUBLIC_DEMO=false PUBLIC_FORM_ENDPOINT=… npm run build` — el build valida legales y marcadores.
3. Subir `dist/` (incluye `.htaccess`) al hosting Apache y apuntar `PUBLIC_SITE_URL` al dominio real.
4. Añadir a `redirects.config.mjs` las URLs antiguas que aparezcan en Search Console.
