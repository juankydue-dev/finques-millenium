/**
 * FUENTE ÚNICA de datos de la empresa.
 *
 * Cada dato lleva `verificado`. Lo no verificado NO se renderiza en ninguna página:
 * use siempre `dato()` o `verificados()` para leer, nunca el valor directamente.
 *
 * En modo producción, scripts/check-legal.mjs corta el build si falta por verificar
 * un dato legal obligatorio (razón social, CIF, Registro Mercantil, pólizas…).
 */

export interface Dato<T = string> {
  valor: T;
  verificado: boolean;
  /** De dónde sale el valor (para el repaso con el cliente). */
  fuente?: string;
}

const d = <T>(valor: T, verificado: boolean, fuente?: string): Dato<T> => ({ valor, verificado, fuente });

export const EMPRESA = {
  // ——— Identidad comercial (confirmada en fuentes públicas) ———
  nombreComercial: d('Finques Mil·lenium', true, 'web actual, Google, Fotocasa'),
  direccion: d('C/ Sant Pere, 91, bajos', true, 'confirmado'),
  codigoPostal: d('08850', true, 'confirmado'),
  municipio: d('Gavà', true, 'confirmado'),
  provincia: d('Barcelona', true, 'confirmado'),
  telefono: d('+34 936 33 42 42', true, 'confirmado'),
  whatsapp: d('+34 667 77 63 28', true, 'confirmado (el móvil, nunca el fijo)'),
  email: d('comercialgava@finques-millenium.com', true, 'confirmado'),
  instagram: d('finquesmillenium', true, 'confirmado'),
  geo: d({ lat: 41.3036552, lng: 2.0002789 }, true, 'web actual (oficina C/ Sant Pere 91)'),

  // ——— Agente (confirmado) ———
  agenteNombre: d('José Luis Lorite Sanz', true, 'confirmado'),
  aicat: d('3543', true, 'confirmado'),
  peritoJudicial: d(true, true, 'confirmado (sin número: pendiente)'),

  // ——— PENDIENTES DE CONFIRMAR CON EL CLIENTE: no se renderizan ———
  razonSocial: d('', false, 'la web actual contradice: footer «Finques Mil·lenium, S.L.» vs [RAZÓN SOCIAL]'),
  cif: d('', false, 'el B22731111 publicado parece inventado (prefijo 22 = Huesca)'),
  registroMercantil: d('', false, 'tomo · folio · hoja pendientes'),
  numeroApi: d('', false, 'la web publica 3037 y 3067 además del AICAT 3543: aclarar'),
  colegioApi: d('', false, 'pendiente'),
  numeroPerito: d('', false, 'pendiente'),
  aseguradoraRC: d('', false, 'aseguradora y nº de póliza pendientes'),
  garantiaCaucion: d('', false, 'entidad y nº pendientes'),
  horario: d(
    {
      manana: { abre: '09:30', cierra: '14:00' },
      tarde: { abre: '16:00', cierra: '19:30' },
      dias: 'L–V',
    },
    false,
    'la web publica 16:00–19:30; el cliente baraja 17:00–20:30'
  ),
  fundacion: d(1982, false, 'la web dice «desde 1982»; pendiente, igual que «2ª generación» y nº de operaciones'),
  retencionMeses: d(24, false, 'plazo de conservación de datos de contacto: decidir con su asesor'),
};

/** Zonas de trabajo. Solo las presentes en TODAS las fuentes están verificadas. */
export const ZONAS_EMPRESA = {
  gava: d('Gavà', true, 'sede; presente en todas las fuentes'),
  castelldefels: d('Castelldefels', true, 'presente en todas las fuentes'),
  viladecans: d('Viladecans', true, 'presente en todas las fuentes'),
  // Pendiente: ¿Sant Boi y El Prat, o Begues?
  'sant-boi': d('Sant Boi de Llobregat', false, 'pendiente de confirmar el set de zonas'),
  'el-prat': d('El Prat de Llobregat', false, 'pendiente de confirmar el set de zonas'),
  begues: d('Begues', false, 'pendiente de confirmar el set de zonas'),
};

/** Devuelve el valor solo si está verificado; si no, null. */
export function dato<T>(x: Dato<T>): T | null {
  return x.verificado ? x.valor : null;
}

/** Lista de claves de EMPRESA aún sin verificar (para el informe de pendientes). */
export function pendientes(): string[] {
  return Object.entries(EMPRESA)
    .filter(([, v]) => !(v as Dato<unknown>).verificado)
    .map(([k]) => k);
}

/** Datos legales que el build exige en modo producción (check-legal.mjs). */
export const LEGAL_OBLIGATORIO = [
  'razonSocial',
  'cif',
  'registroMercantil',
  'aseguradoraRC',
  'garantiaCaucion',
  'horario',
  'retencionMeses',
] as const;

/** Teléfono en formato href tel: */
export const telHref = (t: string) => 'tel:' + t.replace(/\s/g, '');
/** WhatsApp wa.me con mensaje prellenado */
export const waHref = (t: string, msg: string) =>
  'https://wa.me/' + t.replace(/[+\s]/g, '') + '?text=' + encodeURIComponent(msg);
