/**
 * En modo PRODUCCIÓN (PUBLIC_DEMO=false), el build falla si falta por
 * verificar algún dato legal obligatorio o el destino de los formularios.
 * En demo solo informa: lo no verificado simplemente no se renderiza.
 */
const DEMO = (process.env.PUBLIC_DEMO ?? 'true') !== 'false';

// Import dinámico del TS vía tsx no disponible: duplicamos la lista mínima aquí
// y la validamos contra src/config/empresa.ts leyéndolo como texto.
import { readFileSync } from 'node:fs';

const fuente = readFileSync(new URL('../src/config/empresa.ts', import.meta.url), 'utf8');

const OBLIGATORIOS = [
  'razonSocial', 'cif', 'registroMercantil', 'aseguradoraRC', 'garantiaCaucion', 'horario', 'retencionMeses',
];

const sinVerificar = [];
for (const clave of OBLIGATORIOS) {
  // Busca "clave: d(..., true|false" en la fuente única.
  const m = fuente.match(new RegExp(`${clave}:\\s*d\\([\\s\\S]*?,\\s*(true|false)\\s*,`));
  if (!m) { sinVerificar.push(`${clave} (no encontrado en empresa.ts)`); continue; }
  if (m[1] === 'false') sinVerificar.push(clave);
}

const sinEndpoint = !process.env.PUBLIC_FORM_ENDPOINT;

if (DEMO) {
  if (sinVerificar.length) {
    console.log(`ℹ check-legal (demo): pendientes de verificar y por tanto NO renderizados: ${sinVerificar.join(', ')}`);
  }
  if (sinEndpoint) console.log('ℹ check-legal (demo): formularios sin destino (PUBLIC_FORM_ENDPOINT): no envían nada.');
  process.exit(0);
}

let fallo = false;
if (sinVerificar.length) {
  console.error(`✗ check-legal (producción): datos legales obligatorios sin verificar: ${sinVerificar.join(', ')}`);
  fallo = true;
}
if (sinEndpoint) {
  console.error('✗ check-legal (producción): falta PUBLIC_FORM_ENDPOINT para los formularios.');
  fallo = true;
}
if (fallo) {
  console.error('BUILD DETENIDO: complete src/config/empresa.ts (verificado: true) y las variables de entorno.');
  process.exit(1);
}
console.log('✓ check-legal: datos legales completos.');
