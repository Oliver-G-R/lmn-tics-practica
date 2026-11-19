import { describe, it, expect } from 'vitest';
import { GIROS } from './plantillas';
import { armarEnlace, configADoc, decode, docAConfig, encode, MAX_LINK, sanitizeConfig } from './codec';
import { BLOQUES, defaultData } from '../blocks';
import type { Doc } from './pagina';
import { uid } from './util';

const docDeGiro = (g: number, tipos: string[]): Doc => ({
  g, n: GIROS[g].negocio, s: GIROS[g].slogan, e: GIROS[g].emoji, p: GIROS[g].paleta, f: GIROS[g].fuente,
  b: tipos.map((t) => ({ id: uid(), t, d: defaultData(g, t) })),
});

describe('codec', () => {
  GIROS.forEach((gi, g) => {
    it(`ida y vuelta: ${gi.nombre}`, () => {
      const doc = docDeGiro(g, gi.bloques);
      const cfg = docAConfig(doc);
      const vuelta = decode(encode(cfg));
      expect(vuelta).not.toBeNull();
      const doc2 = configADoc(vuelta!);
      expect(doc2.n).toBe(doc.n);
      expect(doc2.s).toBe(doc.s);
      expect(doc2.e).toBe(doc.e);
      expect(doc2.b.map((b) => [b.t, b.d])).toEqual(doc.b.map((b) => [b.t, b.d]));
    });
  });

  it('conserva los cambios del alumno', () => {
    const doc = docDeGiro(0, ['hero', 'menu']);
    doc.n = 'Mi Café ñandú';
    doc.e = '🧋';
    doc.p = 4;
    doc.b[1].d.i[0] = ['Té helado', '40'];
    const v = configADoc(decode(encode(docAConfig(doc)))!);
    expect(v.n).toBe('Mi Café ñandú');
    expect(v.e).toBe('🧋');
    expect(v.p).toBe(4);
    expect(v.b[1].d.i[0]).toEqual(['Té helado', '40']);
  });

  it('un link roto devuelve null', () => {
    expect(decode('')).toBeNull();
    expect(decode('esto-no-es-un-link')).toBeNull();
    expect(decode('N4Ig')).toBeNull();
    expect(decode('%%%')).toBeNull();
  });

  it('valida valores raros y no deja pasar tipos desconocidos', () => {
    const cfg = sanitizeConfig({ v: 1, g: 99, n: 'x'.repeat(100), s: 5, e: '', p: -3, f: 'a', b: [{ t: 'malo' }, { t: 'hero' }, { t: 'hero' }, 7] });
    expect(cfg).not.toBeNull();
    expect(cfg!.g).toBe(0);
    expect(cfg!.n.length).toBe(24);
    expect(cfg!.b.map((b) => b.t)).toEqual(['hero']);
    expect(sanitizeConfig({ v: 2, b: [] })).toBeNull();
    expect(sanitizeConfig(null)).toBeNull();
  });

  it('las plantillas completas caben en el link (< 1200)', () => {
    GIROS.forEach((gi, g) => {
      const doc = docDeGiro(g, BLOQUES.map((b) => b.type).slice(0, 8));
      const { url } = armarEnlace(doc);
      expect(url.length, gi.nombre).toBeLessThanOrEqual(MAX_LINK);
    });
  });

  it('con textos largos y raros recorta para caber', () => {
    const doc = docDeGiro(0, ['hero', 'menu', 'gal', 'about', 'rev', 'loc', 'cta', 'promo']);
    // texto pseudoaleatorio (difícil de comprimir) para probar el peor caso
    let sem = 12345;
    const raro = (n: number, _s: number) => Array.from({ length: n }, () => { sem = (sem * 1103515245 + 12345) & 0x7fffffff; return String.fromCharCode(97 + (sem >> 8) % 26); }).join('');
    doc.n = raro(24, 1); doc.s = raro(50, 2);
    doc.b.forEach((b) => {
      let s = 3;
      for (const k of Object.keys(b.d)) {
        if (typeof b.d[k] === 'string') b.d[k] = raro(b.d[k].length > 0 ? 100 : 5, s++).slice(0, k === 'x' ? 120 : 24);
      }
      if (b.t === 'menu') b.d.i = Array.from({ length: 6 }, (_, i) => [raro(24, i + 20), '99999']);
      if (b.t === 'rev') b.d.i = Array.from({ length: 3 }, (_, i) => [raro(16, i + 40), raro(120, i + 50), 5]);
    });
    const largo = armarEnlace(doc);
    expect(largo.url.length).toBeLessThanOrEqual(MAX_LINK);
    expect(largo.recortado).toBe(true);
  });
});

import { vi, afterEach } from 'vitest';
import { urlPublica } from './codec';

describe('dirección pública del QR', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
  it('usa VITE_PUBLIC_URL si existe (quita la diagonal final)', () => {
    vi.stubEnv('VITE_PUBLIC_URL', 'https://mi-expo.vercel.app/');
    expect(urlPublica()).toBe('https://mi-expo.vercel.app');
  });
  it('sin variable: si está publicada, usa su propia dirección', () => {
    vi.stubEnv('VITE_PUBLIC_URL', '');
    vi.stubGlobal('location', { protocol: 'https:', hostname: 'taller.ejemplo.com', origin: 'https://taller.ejemplo.com' });
    expect(urlPublica()).toBe('https://taller.ejemplo.com');
  });
  it('sin variable y en localhost o archivo local: usa la de por defecto', () => {
    vi.stubEnv('VITE_PUBLIC_URL', '');
    vi.stubGlobal('location', { protocol: 'http:', hostname: 'localhost', origin: 'http://localhost:5173' });
    expect(urlPublica()).toBe('https://taller-web-tic.vercel.app');
    vi.stubGlobal('location', { protocol: 'file:', hostname: '', origin: 'null' });
    expect(urlPublica()).toBe('https://taller-web-tic.vercel.app');
  });
});
