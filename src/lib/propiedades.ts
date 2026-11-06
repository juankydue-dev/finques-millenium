/**
 * Capa de datos de inmuebles con dos adaptadores:
 *  - demo:   src/data/inmuebles.demo.json (6 ejemplos marcados "Ejemplo")
 *  - xml:    feed XML del CRM inmobiliario (formato Kyero u otro; mapear en adaptadorXml)
 *
 * El resto de la web consume SIEMPRE `getInmuebles()`: cambiar de origen no toca páginas.
 */
import demo from '../data/inmuebles.demo.json';
import type { Lang } from '../config/site';

export type Operacion = 'venta' | 'alquiler' | 'obra-nueva' | 'traspaso';

export interface Inmueble {
  id: string;
  slug: string;
  ejemplo: boolean;
  operacion: Operacion;
  tipo: 'piso' | 'casa' | 'atico' | 'local';
  municipio: string;
  barrio?: string;
  precio: number;
  precioDesde?: boolean;
  alquilerMensual?: number;
  superficie: number;
  habitaciones?: number;
  banos?: number;
  planta?: number;
  parcela?: number;
  terraza?: number;
  ascensor?: boolean;
  piscina?: boolean;
  cee?: string;
  destacado?: boolean;
  titulo: Record<string, string>;
  descripcion: Record<string, string>;
  extras: Record<string, string[]>;
  imagenes: { src: string; alt: Record<string, string> }[];
}

const ORIGEN = import.meta.env.PROPIEDADES_ORIGEN ?? 'demo';

function adaptadorDemo(): Inmueble[] {
  return (demo as { inmuebles: Inmueble[] }).inmuebles;
}

/**
 * Adaptador del feed XML del CRM (pendiente de conocer el CRM del cliente).
 * Debe descargar/leer el XML en build (variable PROPIEDADES_FEED_URL o fichero local),
 * mapear cada <property> al modelo Inmueble y marcar ejemplo:false.
 */
function adaptadorXml(): Inmueble[] {
  throw new Error(
    'Adaptador XML sin configurar: defina PROPIEDADES_FEED_URL y complete el mapeo en src/lib/propiedades.ts'
  );
}

export function getInmuebles(): Inmueble[] {
  return ORIGEN === 'xml' ? adaptadorXml() : adaptadorDemo();
}

export function porOperacion(op: Operacion, municipio?: string): Inmueble[] {
  return getInmuebles().filter(
    (i) => i.operacion === op && (!municipio || i.municipio === municipio)
  );
}

export function porSlug(slug: string): Inmueble | undefined {
  return getInmuebles().find((i) => i.slug === slug);
}

export function destacados(): Inmueble[] {
  return getInmuebles().filter((i) => i.destacado);
}

export const OPERACION_SECCION: Record<Operacion, 'comprar' | 'alquilar' | 'obra-nueva' | 'traspasos'> = {
  venta: 'comprar',
  alquiler: 'alquilar',
  'obra-nueva': 'obra-nueva',
  traspaso: 'traspasos',
};

export function tituloDe(i: Inmueble, lang: Lang): string {
  return i.titulo[lang] ?? i.titulo.es;
}
export function descripcionDe(i: Inmueble, lang: Lang): string {
  return i.descripcion[lang] ?? i.descripcion.es;
}
export function extrasDe(i: Inmueble, lang: Lang): string[] {
  return i.extras[lang] ?? i.extras.es ?? [];
}
