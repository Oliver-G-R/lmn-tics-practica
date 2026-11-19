import { GIROS } from '../lib/plantillas';
import type { BlockDef, Data } from './spec';
import { hero } from './hero';
import { menu } from './menu';
import { gal } from './gal';
import { about } from './about';
import { hrs } from './hrs';
import { loc } from './loc';
import { cta } from './cta';
import { rev } from './rev';
import { soc } from './soc';
import { promo } from './promo';

/** Orden del catálogo. */
export const BLOQUES: BlockDef[] = [hero, menu, gal, about, hrs, loc, cta, rev, soc, promo];
export const BLOQUE_POR_TIPO: Record<string, BlockDef> = Object.fromEntries(BLOQUES.map((b) => [b.type, b]));

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

/** Datos de ejemplo de un bloque para un giro. */
export function defaultData(giro: number, type: string): Data {
  const g = GIROS[giro] ?? GIROS[0];
  return clone(g.data[type] ?? {});
}

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const str = (x: unknown, max: number, fb: string) => (typeof x === 'string' ? x.slice(0, max) : fb);

function cell(v: unknown, col: { kind: 'text' | 'price' | 'stars'; max?: number }, fb: unknown): unknown {
  if (col.kind === 'stars') {
    const n = typeof v === 'number' ? Math.round(v) : Number(fb);
    return Math.min(5, Math.max(1, n || 5));
  }
  if (col.kind === 'price') {
    const s = typeof v === 'string' || typeof v === 'number' ? String(v) : String(fb);
    return s.replace(/\D/g, '').slice(0, col.max ?? 5);
  }
  return str(v, col.max ?? 24, String(fb ?? ''));
}

/** Valida y completa los datos de un bloque (usa la descripción de campos del bloque). */
export function sanitizeData(type: string, raw: unknown, giro: number): Data {
  const def = BLOQUE_POR_TIPO[type];
  if (!def) return {};
  const base = defaultData(giro, type);
  const src = isObj(raw) ? raw : {};
  const out: Data = {};
  for (const f of def.fields) {
    if (f.kind === 'text') {
      out[f.key] = str(src[f.key], f.max, base[f.key] ?? '');
    } else if (f.kind === 'list') {
      const arr = Array.isArray(src[f.key]) ? (src[f.key] as unknown[]) : (base[f.key] as unknown[]);
      let rows = arr.slice(0, f.max).map((row, ri) =>
        f.cols.map((c, ci) => cell(Array.isArray(row) ? row[ci] : undefined, c, (base[f.key]?.[ri]?.[ci]) ?? f.blank[ci])),
      );
      while (rows.length < f.min) rows.push(f.cols.map((c, ci) => cell(undefined, c, f.blank[ci])));
      out[f.key] = rows;
    } else {
      const arr = Array.isArray(src[f.key]) ? (src[f.key] as unknown[]) : [];
      const fb = (base[f.key] as string[]) ?? [];
      out[f.key] = Array.from({ length: f.count }, (_, i) => str(arr[i], 8, fb[i] ?? '⭐'));
    }
  }
  return out;
}
