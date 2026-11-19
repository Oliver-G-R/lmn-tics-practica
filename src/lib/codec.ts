// Comprime y descomprime la configuración de la página para viajar en el hash del link.
import LZString from 'lz-string';
import { BLOQUE_POR_TIPO, defaultData, sanitizeData } from '../blocks';
import { FUENTES, PALETAS, ROLES } from './paletas';
import type { Doc } from './pagina';
import { GIROS } from './plantillas';
import { esColorCss, normalizarColor } from './colores';
import { CLAVE_LINEA, cssSegura } from './edicion';
import { LIMITES, type Block, type Config, type EBlock } from './tipos';
import { uid } from './util';

const URL_POR_DEFECTO = 'https://taller-web-tic.vercel.app';

/**
 * Dirección que va dentro del QR. Orden:
 * 1) VITE_PUBLIC_URL (variable de entorno, se fija al hacer el build);
 * 2) si la app está publicada en internet (no localhost, no USB), la dirección desde donde se está usando;
 * 3) la dirección por defecto.
 */
export function urlPublica(): string {
  const env = (import.meta.env.VITE_PUBLIC_URL as string | undefined)?.trim();
  if (env) return env.replace(/\/+$/, '');
  if (typeof location !== 'undefined' && /^https:$/.test(location.protocol) && !/^(localhost|127\.|192\.168\.|10\.)/.test(location.hostname)) return location.origin;
  return URL_POR_DEFECTO;
}
export const INFO_URL: string = import.meta.env.VITE_INFO_URL || 'https://especialidad-tic.vercel.app';
export const MAX_LINK = 1200;

const igual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Del editor al formato del link. Los datos que son iguales a la plantilla no se guardan (el visor los rellena). */
export function docAConfig(doc: Doc): Config {
  const b: Block[] = doc.b.map((bl) => {
    const base = defaultData(doc.g, bl.t);
    const d: Record<string, unknown> = {};
    for (const k of Object.keys(bl.d)) if (!igual(bl.d[k], base[k])) d[k] = bl.d[k];
    return Object.keys(d).length ? { t: bl.t, d } : { t: bl.t };
  });
  const c = doc.c && Object.keys(doc.c).length ? { c: doc.c as Record<string, string> } : {};
  const o = doc.o && Object.keys(doc.o).length ? { o: doc.o } : {};
  return { v: 1, g: doc.g, n: doc.n, s: doc.s, e: doc.e, p: doc.p, f: doc.f, b, ...c, ...o };
}

/** Del link al editor (agrega ids a los bloques). */
export function configADoc(cfg: Config): Doc {
  return {
    g: cfg.g, n: cfg.n, s: cfg.s, e: cfg.e, p: cfg.p, f: cfg.f, ...(cfg.c ? { c: cfg.c } : {}), ...(cfg.o ? { o: cfg.o } : {}),
    b: cfg.b.map((bl): EBlock => ({ id: uid(), t: bl.t, d: sanitizeData(bl.t, bl.d, cfg.g) })),
  };
}

export function encode(cfg: Config): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(cfg));
}

const ent = (x: unknown, min: number, max: number, fb: number) =>
  typeof x === 'number' && Number.isInteger(x) && x >= min && x <= max ? x : fb;

/** Valida cualquier cosa que venga de un link y aplica valores por defecto. Devuelve null si no sirve. */
export function sanitizeConfig(raw: unknown): Config | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  if (r.v !== 1 || !Array.isArray(r.b)) return null;
  const g = ent(r.g, 0, GIROS.length - 1, 0);
  const gi = GIROS[g];
  const vistos = new Set<string>();
  const b: Block[] = [];
  for (const item of r.b) {
    if (b.length >= LIMITES.bloques) break;
    const t = (item as { t?: unknown })?.t;
    if (typeof t !== 'string' || !BLOQUE_POR_TIPO[t] || vistos.has(t)) continue;
    vistos.add(t);
    b.push({ t, d: sanitizeData(t, (item as { d?: unknown }).d, g) });
  }
  const c: Record<string, string> = {};
  if (typeof r.c === 'object' && r.c !== null && !Array.isArray(r.c)) {
    for (const rol of ROLES) {
      const v = (r.c as Record<string, unknown>)[rol];
      if (typeof v === 'string' && esColorCss(normalizarColor(v))) c[rol] = normalizarColor(v);
    }
  }
  const o: Record<string, string> = {};
  if (typeof r.o === 'object' && r.o !== null && !Array.isArray(r.o)) {
    for (const [k, v] of Object.entries(r.o as Record<string, unknown>)) {
      if (!CLAVE_LINEA.test(k) || typeof v !== 'string') continue;
      if (k.split('|')[1] === 'h' ? v === '' : v === '' || cssSegura(v)) o[k] = v;
    }
  }
  return {
    v: 1,
    ...(Object.keys(c).length ? { c } : {}),
    ...(Object.keys(o).length ? { o } : {}),
    g,
    n: typeof r.n === 'string' ? r.n.slice(0, LIMITES.nombre) : gi.negocio,
    s: typeof r.s === 'string' ? r.s.slice(0, LIMITES.slogan) : gi.slogan,
    e: typeof r.e === 'string' && r.e ? r.e.slice(0, 8) : gi.emoji,
    p: ent(r.p, 0, PALETAS.length - 1, gi.paleta),
    f: ent(r.f, 0, FUENTES.length - 1, gi.fuente),
    b,
  };
}

/** Del texto del hash a una configuración válida. Devuelve null si el link está roto. */
export function decode(texto: string): Config | null {
  try {
    const limpio = texto.replace(/^#/, '');
    if (!limpio) return null;
    const json = LZString.decompressFromEncodedURIComponent(limpio);
    if (!json) return null;
    return sanitizeConfig(JSON.parse(json));
  } catch {
    return null;
  }
}

export const urlDe = (cfg: Config) => `${urlPublica()}/s#${encode(cfg)}`;

/** Pasos para acortar textos opcionales, del menos al más importante. */
const recortes: ((d: Doc) => void)[] = [
  (d) => d.b.forEach((b) => b.t === 'rev' && (b.d.i = b.d.i.slice(0, 2))),
  (d) => d.b.forEach((b) => b.t === 'rev' && (b.d.i = b.d.i.map((r: any[]) => [r[0], String(r[1]).slice(0, 40), r[2]]))),
  (d) => d.b.forEach((b) => ['about', 'cta', 'loc', 'promo'].includes(b.t) && ['x', 'y'].forEach((k) => typeof b.d[k] === 'string' && (b.d[k] = b.d[k].slice(0, 45)))),
  (d) => d.b.forEach((b) => b.t === 'menu' && (b.d.i = b.d.i.slice(0, 4))),
  (d) => d.b.forEach((b) => b.t === 'rev' && (b.d.i = b.d.i.map((r: any[]) => [r[0], String(r[1]).slice(0, 20), r[2]]))),
  (d) => d.b.forEach((b) => b.t === 'about' && (b.d.x = String(b.d.x).slice(0, 25))),
  (d) => d.b.forEach((b) => b.t === 'hrs' && (b.d.i = b.d.i.slice(0, 2))),
  (d) => { d.o = undefined; },
];

export type Enlace = { url: string; cfg: Config; recortado: boolean };

/** Arma el link; si pasa de 1,200 caracteres, recorta textos opcionales y avisa. */
export function armarEnlace(doc: Doc): Enlace {
  const copia: Doc = JSON.parse(JSON.stringify(doc));
  let recortado = false;
  let url = urlDe(docAConfig(copia));
  for (const paso of recortes) {
    if (url.length <= MAX_LINK) break;
    paso(copia);
    recortado = true;
    url = urlDe(docAConfig(copia));
  }
  return { url, cfg: docAConfig(copia), recortado };
}
