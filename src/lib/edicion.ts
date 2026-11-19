// Edición de valores desde el panel de código. Solo se pueden cambiar valores ya existentes
// (textos, precios, emojis y colores): nunca se acepta HTML ni CSS libre.
import { BLOQUE_POR_TIPO, sanitizeData } from '../blocks';
import { ctxDe, genBlockK, genGlobalK, plano, type Doc } from './pagina';
import { ROLES, type Rol } from './paletas';
import { LIMITES } from './tipos';
import { validarTexto } from './filtro';

export type Tipo = 'texto' | 'color' | 'precio' | 'emoji' | 'css';
export type Info = { valor: string; max: number; tipo: Tipo };

import { esColorCss, MSG_COLOR, normalizarColor } from './colores';

/** Qué hay en esa ruta del código y cómo se puede editar. null si no es editable. */
export function leerValor(doc: Doc, ruta: string): Info | null {
  if (ruta.startsWith('L|')) return _linea.leerLinea(doc, ruta.slice(2));
  if (ruta === '@n') return { valor: doc.n, max: LIMITES.nombre, tipo: 'texto' };
  if (ruta === '@s') return { valor: doc.s, max: LIMITES.slogan, tipo: 'texto' };
  if (ruta === '@e') return { valor: doc.e, max: 8, tipo: 'emoji' };
  if (ruta.startsWith('@c.')) {
    const rol = ruta.slice(3) as Rol;
    return ROLES.includes(rol) ? { valor: ctxDe(doc).pal[rol], max: 40, tipo: 'color' } : null;
  }
  const [id, camino] = ruta.split('|');
  const b = doc.b.find((x) => x.id === id);
  const def = b && BLOQUE_POR_TIPO[b.t];
  if (!b || !def || !camino) return null;
  const partes = camino.split('.');
  const campo = def.fields.find((f) => f.key === partes[0]);
  let v: any = b.d;
  for (const p of partes) v = v?.[p];
  if (!campo || typeof v !== 'string') return null;
  if (campo.kind === 'text') return { valor: v, max: campo.max, tipo: 'texto' };
  if (campo.kind === 'emojis') return { valor: v, max: 8, tipo: 'emoji' };
  const col = campo.cols[Number(partes[2])];
  if (!col) return null;
  return { valor: v, max: col.max ?? 24, tipo: col.kind === 'price' ? 'precio' : 'texto' };
}

/** Mensaje de error si el valor no es válido, o null si está bien. */
export function validarValor(tipo: Tipo, v: string): string | null {
  if (tipo === 'css') return v.trim() === '' || cssSegura(v.trim().replace(/;+$/, '')) ? null : 'Ese valor no se puede usar';
  if (tipo === 'color') return esColorCss(normalizarColor(v)) ? null : MSG_COLOR;
  if (tipo === 'emoji') return v.trim() ? validarTexto(v) : 'No puede quedar vacío';
  return validarTexto(v);
}

/** Aplica un cambio hecho en el código. Devuelve el documento nuevo (o el mismo si no es válido). */
export function aplicarValor(doc: Doc, ruta: string, raw: string): Doc {
  if (ruta.startsWith('L|')) return _linea.aplicarLinea(doc, ruta.slice(2), raw);
  const info = leerValor(doc, ruta);
  if (!info || validarValor(info.tipo, raw)) return doc;
  if (ruta === '@n') return { ...doc, n: raw.slice(0, LIMITES.nombre) };
  if (ruta === '@s') return { ...doc, s: raw.slice(0, LIMITES.slogan) };
  if (ruta === '@e') return { ...doc, e: raw.trim().slice(0, 8) };
  if (ruta.startsWith('@c.')) {
    return { ...doc, c: { ...doc.c, [ruta.slice(3)]: normalizarColor(raw) } };
  }
  const [id, camino] = ruta.split('|');
  return {
    ...doc,
    b: doc.b.map((b) => {
      if (b.id !== id) return b;
      const d = JSON.parse(JSON.stringify(b.d));
      const partes = camino.split('.');
      let o = d;
      for (const p of partes.slice(0, -1)) o = o[p];
      o[partes[partes.length - 1]] = raw;
      return { ...b, d: sanitizeData(b.t, d, doc.g) };
    }),
  };
}

// ───────── Cambios línea por línea (valores de CSS y borrar líneas) ─────────

const VALOR_CSS = /^[\w\s#.,%()'"/+\-!]*$/;

/** Un valor de CSS es seguro si solo tiene caracteres normales y nada que cargue cosas o rompa la regla. */
export function cssSegura(v: string): boolean {
  return v.length <= 80 && VALOR_CSS.test(v) && !/url\s*\(|expression|javascript|import|var\s*\(/i.test(v);
}

export const CLAVE_LINEA = /^(g|hero|menu|gal|about|hrs|loc|cta|rev|soc|promo)\|[hc]\|\d{1,3}$/;

const DECL = /^(\s*[\w-]+\s*:\s*)(.*?)(;?)$/;

/** Valor actual (sin ';') de la línea de CSS con esa clave, según el código generado. */
function valorGenerado(doc: Doc, k: string): string | null {
  const [t] = k.split('|');
  const c = ctxDe(doc);
  const sin = { ...doc, o: {} };
  const lineas = t === 'g' ? genGlobalK(c, {}).css : (() => { const b = sin.b.find((x) => x.t === t); return b ? genBlockK(b, c, {}).css : []; })();
  const l = lineas.find((x) => x.k === k);
  const m = l && DECL.exec(plano(l.t));
  return m ? m[2] : null;
}

/** Borra una línea del código (la página se actualiza al momento). */
export function borrarLinea(doc: Doc, k: string): Doc {
  if (!CLAVE_LINEA.test(k)) return doc;
  return { ...doc, o: { ...doc.o, [k]: '' } };
}

/** Quita todos los cambios hechos en el código de un bloque (prefijo "tipo|") o de todo (sin prefijo). */
export function restaurarCodigo(doc: Doc, prefijo = ''): Doc {
  const o = Object.fromEntries(Object.entries(doc.o ?? {}).filter(([k]) => !k.startsWith(prefijo)));
  return { ...doc, o: Object.keys(o).length ? o : undefined };
}

/** Cambia el valor de una línea de CSS. Vacío = borrar la línea. */
function aplicarLinea(doc: Doc, k: string, raw: string): Doc {
  const v = raw.trim().replace(/;+$/, '').trim();
  if (v === '') return borrarLinea(doc, k);
  if (!CLAVE_LINEA.test(k) || !cssSegura(v)) return doc;
  const o = { ...doc.o };
  if (v === valorGenerado(doc, k)) delete o[k]; // volvió al valor original
  else o[k] = v;
  return { ...doc, o: Object.keys(o).length ? o : undefined };
}

function leerLinea(doc: Doc, k: string): Info | null {
  if (!CLAVE_LINEA.test(k)) return null;
  const v = doc.o?.[k] ?? valorGenerado(doc, k);
  return v === null ? null : { valor: v, max: 80, tipo: 'css' };
}

export const _linea = { aplicarLinea, leerLinea };
