// Genera el HTML y CSS REALES de la página a partir de la configuración.
// Esto es lo que se dibuja en el marco del celular y lo que se muestra en el panel de código.
import { BLOQUE_POR_TIPO } from '../blocks';
import type { Code, Ctx } from '../blocks/spec';
import { FUENTES, PALETAS, ROLES, type Paleta, type Rol } from './paletas';
import type { EBlock } from './tipos';
import { esc } from './util';

export type Doc = { g: number; n: string; s: string; e: string; p: number; f: number; b: EBlock[]; c?: Partial<Record<Rol, string>>; o?: Record<string, string> };

// Marcas invisibles que señalan qué partes del código son valores editables: ␀ruta␁valor␂
const A = '\uE000', B = '\uE001', Z = '\uE002';
export const marca = (ruta: string, v: string) => `${A}${ruta}${B}${v}${Z}`;
export const plano = (s: string) => s.replace(/\uE000[^\uE001]*\uE001/g, '').replace(/\uE002/g, '');

function marcarDatos(id: string, v: any, ruta = ''): any {
  if (typeof v === 'string') return marca(`${id}|${ruta}`, v);
  if (Array.isArray(v)) return v.map((x, i) => marcarDatos(id, x, ruta ? `${ruta}.${i}` : String(i)));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, marcarDatos(id, x, ruta ? `${ruta}.${k}` : k)]));
  return v;
}

function marcarCtx(c: Ctx): Ctx {
  const pal = { ...c.pal } as Paleta;
  for (const r of ROLES) pal[r] = marca(`@c.${r}`, c.pal[r]);
  return { ...c, name: marca('@n', c.name), slogan: marca('@s', c.slogan), emoji: marca('@e', c.emoji), pal };
}

export const ctxDe = (doc: Doc): Ctx => ({
  name: doc.n,
  slogan: doc.s,
  emoji: doc.e,
  pal: { ...(PALETAS[doc.p] ?? PALETAS[0]), ...(doc.c ?? {}) },
  font: FUENTES[doc.f] ?? FUENTES[0],
});

export type LineaK = { t: string; k?: string };
export type CodeK = { html: LineaK[]; css: LineaK[] };

const DECL = /^(\s*[\w-]+\s*:\s*)(.*?)(;?)$/;
const esDeclCss = (l: string) => DECL.test(l) && !/\{\s*$/.test(l);
const esComentarioCss = (l: string) => /^\s*\/\*.*\*\/\s*$/.test(l);
const esElementoHtml = (l: string) => /^\s*<([a-z0-9]+)(\s[^>]*)?>.*<\/\1>\s*$/i.test(l);
const esComentarioHtml = (l: string) => /^\s*<!--.*-->\s*$/.test(l);

/** Las líneas que se pueden editar o borrar llevan una clave estable: tipo|h o c|posición. */
function conClaves(lineas: string[], t: string, lang: 'h' | 'c', o: Record<string, string>): LineaK[] {
  const out: LineaK[] = [];
  lineas.forEach((l, i) => {
    const p = plano(l);
    const ok = lang === 'c' ? esDeclCss(p) || esComentarioCss(p) : esElementoHtml(p) || esComentarioHtml(p);
    const k = ok ? `${t}|${lang}|${i}` : undefined;
    const ov = k ? o[k] : undefined;
    if (ov === '') return; // línea borrada por el alumno
    if (ov !== undefined && lang === 'c') {
      const m = DECL.exec(p);
      if (m) return void out.push({ t: m[1] + ov + m[3], k });
    }
    out.push({ t: l, k });
  });
  return out;
}

export function genGlobalK(c0: Ctx, o: Record<string, string> = {}): CodeK {
  const c = marcarCtx(c0);
  const css = [
    '/* Estilos generales de la página */',
    '* {',
    '  margin: 0;',
    '  box-sizing: border-box;',
    '}',
    'body {',
    `  font-family: ${c.font.css};`,
    `  background: ${c.pal.bg};`,
    `  color: ${c.pal.text};`,
    '  line-height: 1.5;',
    '}',
    'ul {',
    '  list-style: none;',
    '  padding: 0;',
    '}',
    'a {',
    '  text-decoration: none;',
    '}',
  ];
  return { html: [], css: conClaves(css, 'g', 'c', o) };
}

export function genBlockK(b: EBlock, c: Ctx, o: Record<string, string> = {}): CodeK {
  const def = BLOQUE_POR_TIPO[b.t];
  if (!def) return { html: [], css: [] };
  const code = def.gen(marcarDatos(b.id, b.d), marcarCtx(c));
  return { html: conClaves(code.html, b.t, 'h', o), css: conClaves(code.css, b.t, 'c', o) };
}

const textos = (ls: LineaK[]) => ls.map((l) => l.t);
export const genGlobal = (c: Ctx, o?: Record<string, string>): Code => ({ html: [], css: textos(genGlobalK(c, o).css) });
export const genBlock = (b: EBlock, c: Ctx, o?: Record<string, string>): Code => {
  const k = genBlockK(b, c, o);
  return { html: textos(k.html), css: textos(k.css) };
};

/** Código de la página completa (HTML + CSS en un solo documento), con la clave de cada línea editable. */
export function fullCodeK(doc: Doc): LineaK[] {
  const c = ctxDe(doc);
  const o = doc.o ?? {};
  const bloques = doc.b.map((b) => genBlockK(b, c, o));
  const ind = (ls: LineaK[], n: number): LineaK[] => ls.map((l) => ({ ...l, t: ' '.repeat(n) + l.t }));
  const L = (t: string): LineaK => ({ t });
  const css: LineaK[] = [...ind(genGlobalK(c, o).css, 4)];
  bloques.forEach((b) => css.push(L(''), ...ind(b.css, 4)));
  const body: LineaK[] = [];
  bloques.forEach((b, i) => {
    if (i > 0) body.push(L(''));
    body.push(...ind(b.html, 2));
  });
  return [
    L('<!DOCTYPE html>'),
    L('<html lang="es">'),
    L('<head>'),
    L('  <meta charset="UTF-8">'),
    L('  <meta name="viewport" content="width=device-width, initial-scale=1.0">'),
    L(`  <title>${esc(marca('@n', doc.n))}</title>`),
    L('  <style>'),
    ...css,
    L('  </style>'),
    L('</head>'),
    L('<body>'),
    ...body,
    L('</body>'),
    L('</html>'),
  ];
}
export const fullCode = (doc: Doc): string[] => textos(fullCodeK(doc));

/** Prefija los selectores con .pagina para que el CSS de la página no afecte al editor. */
export function scopeCss(lines: string[]): string {
  return lines
    .map((l) => {
      const m = /^([^\s/][^{]*)\{$/.exec(l);
      if (!m) return l;
      const sel = m[1]
        .split(',')
        .map((s) => s.trim())
        .map((s) => (s === 'body' ? '.pagina' : `.pagina ${s}`))
        .join(', ');
      return `${sel} {`;
    })
    .join('\n');
}

export function cssDePagina(doc: Doc): string {
  const c = ctxDe(doc);
  const o = doc.o ?? {};
  return scopeCss([...genGlobal(c, o).css, ...doc.b.flatMap((b) => genBlock(b, c, o).css)].map(plano));
}

export const contarLineas = (doc: Doc) => fullCode(doc).length;
