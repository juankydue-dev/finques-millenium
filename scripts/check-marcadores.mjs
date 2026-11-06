/**
 * CERO MARCADORES: recorre el HTML generado en dist/ y FALLA el build si
 * aparece cualquier marcador sin rellenar en el texto visible o en los
 * atributos que lee el usuario o el buscador (alt, title, content, aria-label).
 *
 * Lecciones de la web antigua:
 *  - "[data-consent]" (selectores CSS) daban falso positivo → solo texto visible y atributos legibles.
 *  - "valorem" (catalán) contiene "lorem" → patrones con límite de palabra.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

const PATRONES = [
  { re: /\[[A-ZÁÉÍÓÚÑÜÀÈÒÇ][A-ZÁÉÍÓÚÑÜÀÈÒÇ0-9 ·.ºª_-]{1,60}\]/, nombre: '[MARCADOR EN MAYÚSCULAS]' },
  { re: /\[(Provisional|Provisoire|Pendiente|Pendent|Pending)\]/i, nombre: '[Provisional]' },
  { re: /\bProvisional\b/, nombre: 'Provisional' },
  { re: /\bTODO\b/, nombre: 'TODO' },
  { re: /\bFIXME\b/, nombre: 'FIXME' },
  { re: /\blorem\b/i, nombre: 'lorem (con límite de palabra: "valorem" no cuenta)' },
  { re: /\bipsum\b/i, nombre: 'ipsum' },
  { re: /\[EMAIL\]/i, nombre: '[EMAIL]' },
  { re: /PENDIENTE DE REVISI/i, nombre: 'PENDIENTE DE REVISIÓN' },
  { re: /\bXXX+\b/, nombre: 'XXX' },
];

function htmlFiles(dir) {
  const out = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}

/** Texto que ve el usuario: cuerpo sin scripts/estilos/comentarios + atributos legibles. */
function textoVisible(html) {
  let t = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const atributos = [];
  for (const m of t.matchAll(/\b(?:alt|title|content|aria-label|placeholder|value)="([^"]*)"/gi)) {
    atributos.push(m[1]);
  }
  t = t.replace(/<[^>]+>/g, ' ');
  // Entidades básicas para que [NOMBRE] no se esconda como &#91;NOMBRE&#93;
  const des = (s) =>
    s
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  return des(t + '\n' + atributos.join('\n'));
}

const archivos = htmlFiles(DIST);
if (archivos.length === 0) {
  console.error('check-marcadores: no hay HTML en dist/. ¿Falló el build?');
  process.exit(1);
}

let errores = 0;
for (const archivo of archivos) {
  const texto = textoVisible(readFileSync(archivo, 'utf8'));
  for (const { re, nombre } of PATRONES) {
    const m = texto.match(re);
    if (m) {
      errores++;
      const ctx = texto.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40).replace(/\s+/g, ' ');
      console.error(`✗ ${relative(DIST, archivo)} → ${nombre}: …${ctx}…`);
    }
  }
}

if (errores > 0) {
  console.error(`\ncheck-marcadores: ${errores} marcador(es) sin rellenar. BUILD DETENIDO.`);
  process.exit(1);
}
console.log(`✓ check-marcadores: 0 marcadores en ${archivos.length} páginas.`);
