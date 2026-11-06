/**
 * Configuración general del sitio: idiomas, modo demo y flags de funcionalidad.
 */

export type Lang = 'es' | 'ca' | 'en' | 'fr';

/** Francés pendiente de confirmación con el cliente: desactivado. */
export const LANGS: Lang[] = ['es', 'ca', 'en'];
export const DEFAULT_LANG: Lang = 'es';

/** Modo demo: noindex, franja de demostración, formularios sin envío real. */
export const DEMO = (import.meta.env.PUBLIC_DEMO ?? 'true') !== 'false';

/** Modo del build: 'demo' | 'production'. check-legal.mjs exige datos legales en producción. */
export const MODE = DEMO ? 'demo' : 'production';

/** Destino de los formularios (Formspark, Basin, PHP propio…). Vacío en demo: no se envía nada. */
export const FORM_ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT ?? '';

/** IDs de analítica. Vacíos: no se carga nada y el banner solo gestiona el consentimiento. */
export const GA4_ID = import.meta.env.PUBLIC_GA4_ID ?? '';
export const META_PIXEL_ID = import.meta.env.PUBLIC_META_PIXEL_ID ?? '';

/** Funcionalidades que cargan terceros (se reflejan en la política de cookies). */
export const FEATURES = {
  /** Mapa incrustado (Leaflet + OpenStreetMap). Desactivado en demo: se enlaza al mapa externo. */
  mapaIncrustado: false,
  /** Autocompletado de direcciones (Photon). Desactivado en demo. */
  autocompletadoDirecciones: false,
};

/** Punto de integración del asistente de chat (Visto Bueno). No implementado todavía. */
export const CHAT_WIDGET = {
  habilitado: false,
  /** El layout emite <div id="vb-assistant" data-vb-mount hidden></div> para el montaje futuro. */
  mountId: 'vb-assistant',
};

export const SITE_URL = import.meta.env.SITE ?? 'https://finques-millenium-demo.vercel.app';
