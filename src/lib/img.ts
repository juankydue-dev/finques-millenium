import type { ImageMetadata } from 'astro';

/** Todas las imágenes del proyecto, accesibles por nombre de archivo sin extensión. */
const mods = import.meta.glob<{ default: ImageMetadata }>('../assets/img/*.jpg', { eager: true });

const porNombre: Record<string, ImageMetadata> = {};
for (const [ruta, mod] of Object.entries(mods)) {
  const nombre = ruta.split('/').pop()!.replace(/\.jpg$/, '');
  porNombre[nombre] = mod.default;
}

export function img(nombre: string): ImageMetadata {
  const m = porNombre[nombre];
  if (!m) throw new Error(`Imagen no encontrada: ${nombre} (src/assets/img/${nombre}.jpg)`);
  return m;
}
