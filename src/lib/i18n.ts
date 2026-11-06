import type { Lang } from '../config/site';
import { LANGS, DEFAULT_LANG } from '../config/site';

export type SectionKey =
  | 'home' | 'comprar' | 'alquilar' | 'obra-nueva' | 'traspasos'
  | 'vender' | 'valorar' | 'hipoteca' | 'inversion' | 'alerta'
  | 'zonas' | 'nosotros' | 'contacto'
  | 'aviso-legal' | 'privacidad' | 'cookies'
  | 'inmuebles' | 'demo-envio';

/** Slugs por idioma. Los de es/ca/en calcan la web actual para no romper URLs conocidas. */
export const ROUTES: Record<SectionKey, Record<Lang, string>> = {
  home:          { es: '', ca: '', en: '', fr: '' },
  comprar:       { es: 'comprar', ca: 'comprar', en: 'buy', fr: 'acheter' },
  alquilar:      { es: 'alquilar', ca: 'llogar', en: 'rent', fr: 'louer' },
  'obra-nueva':  { es: 'obra-nueva', ca: 'obra-nova', en: 'new-homes', fr: 'programmes-neufs' },
  traspasos:     { es: 'traspasos', ca: 'traspassos', en: 'business-transfers', fr: 'cessions-de-fonds' },
  vender:        { es: 'vender', ca: 'vendre', en: 'sell', fr: 'vendre' },
  valorar:       { es: 'valorar', ca: 'valorar', en: 'valuation', fr: 'estimation' },
  hipoteca:      { es: 'hipoteca', ca: 'hipoteca', en: 'mortgage', fr: 'pret-immobilier' },
  inversion:     { es: 'inversion', ca: 'inversio', en: 'investment', fr: 'investissement' },
  alerta:        { es: 'alerta', ca: 'alerta', en: 'alert', fr: 'alerte' },
  zonas:         { es: 'zonas', ca: 'zones', en: 'areas', fr: 'secteurs' },
  nosotros:      { es: 'nosotros', ca: 'nosaltres', en: 'about', fr: 'a-propos' },
  contacto:      { es: 'contacto', ca: 'contacte', en: 'contact', fr: 'contact' },
  'aviso-legal': { es: 'aviso-legal', ca: 'avis-legal', en: 'legal-notice', fr: 'mentions-legales' },
  privacidad:    { es: 'politica-privacidad', ca: 'politica-privacitat', en: 'privacy-policy', fr: 'politique-confidentialite' },
  cookies:       { es: 'politica-cookies', ca: 'politica-galetes', en: 'cookie-policy', fr: 'politique-cookies' },
  inmuebles:     { es: 'inmuebles', ca: 'immobles', en: 'properties', fr: 'biens' },
  'demo-envio':  { es: 'demo-envio', ca: 'demo-enviament', en: 'demo-submission', fr: 'demo-envoi' },
};

/** Ruta absoluta (con barra final) de una sección, con segmentos extra opcionales. */
export function path(lang: Lang, section: SectionKey, ...rest: string[]): string {
  const slug = ROUTES[section][lang];
  const parts = ['', lang, ...(slug ? [slug] : []), ...rest.filter(Boolean)];
  return parts.join('/') + '/';
}

/** hreflang/og alternates de una página en todos los idiomas activos. */
export function alternates(section: SectionKey, ...rest: string[]): { lang: Lang; href: string }[] {
  return LANGS.map((lang) => ({ lang, href: path(lang, section, ...rest) }));
}

export const OG_LOCALE: Record<Lang, string> = { es: 'es_ES', ca: 'ca_ES', en: 'en_GB', fr: 'fr_FR' };
export const HTML_LANG: Record<Lang, string> = { es: 'es', ca: 'ca', en: 'en', fr: 'fr' };

export { LANGS, DEFAULT_LANG };
export type { Lang };

/** Cadenas de interfaz comunes (navegación, footer, tarjetas, formularios). */
export const UI = {
  es: {
    idioma: 'Español',
    saltar: 'Saltar al contenido',
    menu: 'Menú',
    cerrar: 'Cerrar',
    nav: {
      inmuebles: 'Inmuebles',
      comprar: 'Comprar', comprarDesc: 'Viviendas en venta en el Baix Llobregat.',
      alquilar: 'Alquilar', alquilarDesc: 'Pisos y casas en alquiler, con contrato claro.',
      obraNueva: 'Obra nueva', obraNuevaDesc: 'Promociones de obra nueva en nuestras zonas.',
      traspasos: 'Traspasos', traspasosDesc: 'Locales y negocios en funcionamiento.',
      alerta: 'Alerta Mil·lenium', alertaDesc: 'Le avisamos cuando entre una vivienda como la que busca.',
      vender: 'Vender',
      inversion: 'Inversión',
      herramientas: 'Herramientas',
      valorador: 'Valorador', valoradorDesc: 'Conozca el precio real de mercado de su vivienda.',
      hipoteca: 'Calculadora hipotecaria', hipotecaDesc: 'Calcule su cuota mensual en un minuto.',
      zonas: 'Zonas',
      nosotros: 'Nosotros',
      contacto: 'Contacto',
      valorarCta: 'Valorar mi vivienda',
    },
    footer: {
      lemaFundacion: 'Inmobiliaria en Gavà desde {ano}.',
      lema: 'Su inmobiliaria de barrio en Gavà.',
      avisoLegal: 'Aviso legal',
      privacidad: 'Política de privacidad',
      cookies: 'Política de cookies',
      configurarCookies: 'Configurar cookies',
      whatsappLabel: 'Escríbanos por WhatsApp (se abre en una ventana nueva)',
      instagramLabel: '@finquesmillenium en Instagram (se abre en una ventana nueva)',
      aicat: 'Agente inscrito en el Registro de Agentes Inmobiliarios de Cataluña (AICAT) nº {num}',
      peritoJudicial: 'Perito judicial',
      demoNota: 'Versión de demostración: los inmuebles y las imágenes son ejemplos.',
    },
    card: {
      ejemplo: 'Ejemplo',
      desde: 'Desde',
      mes: '/mes',
      hab: 'hab.',
      banos: 'baños',
      verFicha: 'Ver ficha',
      traspaso: 'Traspaso',
      obraNueva: 'Obra nueva',
      alquiler: 'Alquiler',
      venta: 'Venta',
      cee: 'Certificado energético',
    },
    form: {
      nombre: 'Nombre',
      telefono: 'Teléfono',
      email: 'Correo electrónico',
      mensaje: 'Mensaje',
      direccion: 'Dirección de la vivienda',
      enviar: 'Enviar',
      requerido: 'Este campo es necesario.',
      rgpd: 'He leído y acepto la política de privacidad.',
      rgpdNota: 'Usaremos sus datos solo para responderle. Puede ejercer sus derechos escribiendo a {email}.',
      demoAviso: 'Versión de demostración: este formulario no envía datos a nadie.',
    },
    consent: {
      titulo: 'Cookies y privacidad',
      texto: 'Usamos almacenamiento local imprescindible para recordar sus preferencias. La analítica y la publicidad están desactivadas salvo que usted las active aquí.',
      necesarias: 'Imprescindibles (siempre activas)',
      analitica: 'Analítica',
      publicidad: 'Publicidad',
      aceptarSel: 'Guardar mi elección',
      aceptarTodo: 'Aceptar todo',
      rechazar: 'Rechazar todo',
      masInfo: 'Más información en la política de cookies',
    },
    comunes: {
      llamenos: 'Llámenos',
      escribanosWhatsapp: 'Escribir por WhatsApp',
      valorarGratis: 'Valorar mi vivienda gratis',
      verTodas: 'Ver todas en Google (se abre en una ventana nueva)',
      dejarResena: 'Dejar una reseña (se abre en una ventana nueva)',
      opiniones: 'Lo dicen ellos, no nosotros.',
      segunGoogle: 'según {n} reseñas en Google',
      abreNueva: '(se abre en una ventana nueva)',
      volver: 'Volver',
      noJsListado: 'Los filtros rápidos necesitan JavaScript, pero puede navegar por zonas con los enlaces de arriba o llamarnos al {tel}.',
    },
    migas: { inicio: 'Inicio' },
  },
  ca: {
    idioma: 'Català',
    saltar: 'Salta al contingut',
    menu: 'Menú',
    cerrar: 'Tanca',
    nav: {
      inmuebles: 'Immobles',
      comprar: 'Comprar', comprarDesc: 'Habitatges en venda al Baix Llobregat.',
      alquilar: 'Llogar', alquilarDesc: 'Pisos i cases de lloguer, amb contracte clar.',
      obraNueva: 'Obra nova', obraNuevaDesc: 'Promocions d’obra nova a les nostres zones.',
      traspasos: 'Traspassos', traspasosDesc: 'Locals i negocis en funcionament.',
      alerta: 'Alerta Mil·lenium', alertaDesc: 'L’avisem quan entri un habitatge com el que busca.',
      vender: 'Vendre',
      inversion: 'Inversió',
      herramientas: 'Eines',
      valorador: 'Valorador', valoradorDesc: 'Conegui el preu real de mercat del seu habitatge.',
      hipoteca: 'Calculadora hipotecària', hipotecaDesc: 'Calculi la seva quota mensual en un minut.',
      zonas: 'Zones',
      nosotros: 'Nosaltres',
      contacto: 'Contacte',
      valorarCta: 'Valorar el meu habitatge',
    },
    footer: {
      lemaFundacion: 'Immobiliària a Gavà des de {ano}.',
      lema: 'La seva immobiliària de barri a Gavà.',
      avisoLegal: 'Avís legal',
      privacidad: 'Política de privacitat',
      cookies: 'Política de galetes',
      configurarCookies: 'Configurar galetes',
      whatsappLabel: 'Escrigui’ns per WhatsApp (s’obre en una finestra nova)',
      instagramLabel: '@finquesmillenium a Instagram (s’obre en una finestra nova)',
      aicat: 'Agent inscrit al Registre d’Agents Immobiliaris de Catalunya (AICAT) núm. {num}',
      peritoJudicial: 'Pèrit judicial',
      demoNota: 'Versió de demostració: els immobles i les imatges són exemples.',
    },
    card: {
      ejemplo: 'Exemple',
      desde: 'Des de',
      mes: '/mes',
      hab: 'hab.',
      banos: 'banys',
      verFicha: 'Veure fitxa',
      traspaso: 'Traspàs',
      obraNueva: 'Obra nova',
      alquiler: 'Lloguer',
      venta: 'Venda',
      cee: 'Certificat energètic',
    },
    form: {
      nombre: 'Nom',
      telefono: 'Telèfon',
      email: 'Correu electrònic',
      mensaje: 'Missatge',
      direccion: 'Adreça de l’habitatge',
      enviar: 'Enviar',
      requerido: 'Aquest camp és necessari.',
      rgpd: 'He llegit i accepto la política de privacitat.',
      rgpdNota: 'Farem servir les seves dades només per respondre-li. Pot exercir els seus drets escrivint a {email}.',
      demoAviso: 'Versió de demostració: aquest formulari no envia dades a ningú.',
    },
    consent: {
      titulo: 'Galetes i privacitat',
      texto: 'Fem servir emmagatzematge local imprescindible per recordar les seves preferències. L’analítica i la publicitat estan desactivades si vostè no les activa aquí.',
      necesarias: 'Imprescindibles (sempre actives)',
      analitica: 'Analítica',
      publicidad: 'Publicitat',
      aceptarSel: 'Desar la meva elecció',
      aceptarTodo: 'Acceptar-ho tot',
      rechazar: 'Rebutjar-ho tot',
      masInfo: 'Més informació a la política de galetes',
    },
    comunes: {
      llamenos: 'Truqui’ns',
      escribanosWhatsapp: 'Escriure per WhatsApp',
      valorarGratis: 'Valorar el meu habitatge gratis',
      verTodas: 'Veure-les totes a Google (s’obre en una finestra nova)',
      dejarResena: 'Deixar una ressenya (s’obre en una finestra nova)',
      opiniones: 'Ho diuen ells, no nosaltres.',
      segunGoogle: 'segons {n} ressenyes a Google',
      abreNueva: '(s’obre en una finestra nova)',
      volver: 'Tornar',
      noJsListado: 'Els filtres ràpids necessiten JavaScript, però pot navegar per zones amb els enllaços de dalt o trucar-nos al {tel}.',
    },
    migas: { inicio: 'Inici' },
  },
  en: {
    idioma: 'English',
    saltar: 'Skip to content',
    menu: 'Menu',
    cerrar: 'Close',
    nav: {
      inmuebles: 'Properties',
      comprar: 'Buy', comprarDesc: 'Homes for sale in Baix Llobregat.',
      alquilar: 'Rent', alquilarDesc: 'Flats and houses to rent, with a clear contract.',
      obraNueva: 'New homes', obraNuevaDesc: 'New developments in the areas we work.',
      traspasos: 'Business transfers', traspasosDesc: 'Working shops and businesses.',
      alerta: 'Mil·lenium Alert', alertaDesc: 'We let you know when a home like yours comes in.',
      vender: 'Sell',
      inversion: 'Investment',
      herramientas: 'Tools',
      valorador: 'Valuation tool', valoradorDesc: 'Find out your home’s real market price.',
      hipoteca: 'Mortgage calculator', hipotecaDesc: 'Work out your monthly payment in a minute.',
      zonas: 'Areas',
      nosotros: 'About us',
      contacto: 'Contact',
      valorarCta: 'Value my home',
    },
    footer: {
      lemaFundacion: 'Estate agency in Gavà since {ano}.',
      lema: 'Your neighbourhood estate agency in Gavà.',
      avisoLegal: 'Legal notice',
      privacidad: 'Privacy policy',
      cookies: 'Cookie policy',
      configurarCookies: 'Cookie settings',
      whatsappLabel: 'Message us on WhatsApp (opens in a new window)',
      instagramLabel: '@finquesmillenium on Instagram (opens in a new window)',
      aicat: 'Agent listed in the Catalan Register of Real Estate Agents (AICAT) no. {num}',
      peritoJudicial: 'Court-appointed property expert',
      demoNota: 'Demonstration version: the properties and images are examples.',
    },
    card: {
      ejemplo: 'Example',
      desde: 'From',
      mes: '/month',
      hab: 'bed',
      banos: 'bath',
      verFicha: 'View details',
      traspaso: 'Transfer',
      obraNueva: 'New build',
      alquiler: 'To rent',
      venta: 'For sale',
      cee: 'Energy certificate',
    },
    form: {
      nombre: 'Name',
      telefono: 'Phone',
      email: 'Email',
      mensaje: 'Message',
      direccion: 'Property address',
      enviar: 'Send',
      requerido: 'This field is required.',
      rgpd: 'I have read and accept the privacy policy.',
      rgpdNota: 'We will use your details only to reply to you. You can exercise your rights by writing to {email}.',
      demoAviso: 'Demonstration version: this form does not send data anywhere.',
    },
    consent: {
      titulo: 'Cookies and privacy',
      texto: 'We use essential local storage to remember your preferences. Analytics and advertising are off unless you turn them on here.',
      necesarias: 'Essential (always on)',
      analitica: 'Analytics',
      publicidad: 'Advertising',
      aceptarSel: 'Save my choice',
      aceptarTodo: 'Accept all',
      rechazar: 'Reject all',
      masInfo: 'More information in the cookie policy',
    },
    comunes: {
      llamenos: 'Call us',
      escribanosWhatsapp: 'Message us on WhatsApp',
      valorarGratis: 'Value my home for free',
      verTodas: 'See all on Google (opens in a new window)',
      dejarResena: 'Leave a review (opens in a new window)',
      opiniones: 'Their words, not ours.',
      segunGoogle: 'based on {n} Google reviews',
      abreNueva: '(opens in a new window)',
      volver: 'Back',
      noJsListado: 'The quick filters need JavaScript, but you can browse by area using the links above or call us on {tel}.',
    },
    migas: { inicio: 'Home' },
  },
} as const;

export type UIDict = (typeof UI)['es'];

export function t(lang: Lang): UIDict {
  return (UI as Record<string, UIDict>)[lang] ?? UI.es;
}

/** Sustitución simple de {placeholders} en cadenas del diccionario. */
export function fmt(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

/** Formato de precio: 289.000 € (es/ca) · €289,000 (en). */
export function precio(lang: Lang, n: number): string {
  const f = new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'es-ES').format(n);
  return lang === 'en' ? `€${f}` : `${f} €`;
}
