import { describe, it, expect } from 'vitest';
import { aplicarValor, leerValor, validarValor } from './edicion';
import { docDeGiro } from '../app/store';
import { genBlock, ctxDe, plano, fullCode } from './pagina';
import { armarEnlace, configADoc, decode } from './codec';

describe('edición desde el código', () => {
  const doc = docDeGiro(0);
  const menu = doc.b.find((b) => b.t === 'menu')!;

  it('cambia un precio y un nombre de producto', () => {
    let d = aplicarValor(doc, `${menu.id}|i.0.1`, '99');
    d = aplicarValor(d, `${menu.id}|i.0.0`, 'Moka');
    expect(d.b.find((b) => b.t === 'menu')!.d.i[0]).toEqual(['Moka', '99']);
  });
  it('el precio solo acepta números y respeta el límite', () => {
    const d = aplicarValor(doc, `${menu.id}|i.0.1`, '1a2b3456789');
    expect(d.b.find((b) => b.t === 'menu')!.d.i[0][1]).toBe('12345');
  });
  it('cambia nombre, slogan y logo', () => {
    let d = aplicarValor(doc, '@n', 'Mi Súper Café');
    d = aplicarValor(d, '@e', '🧋');
    expect([d.n, d.e]).toEqual(['Mi Súper Café', '🧋']);
  });
  it('un color cambia en todo el código y viaja en el link', () => {
    const d = aplicarValor(doc, '@c.accent', '#ff0066');
    const html = plano(genBlock(d.b[0], ctxDe(d)).css.join('\n'));
    expect(html).toContain('#FF0066');
    const vuelta = configADoc(decode(armarEnlace(d).url.split('#')[1])!);
    expect(vuelta.c?.accent).toBe('#FF0066');
  });
  it('rechaza colores raros, groserías y rutas inventadas', () => {
    expect(aplicarValor(doc, '@c.accent', 'rojo')).toBe(doc);
    expect(aplicarValor(doc, '@c.accent', 'url(x)')).toBe(doc);
    expect(aplicarValor(doc, '@n', 'pinche café')).toBe(doc);
    expect(leerValor(doc, 'noexiste|x.y')).toBeNull();
    expect(validarValor('color', '#12345')).not.toBeNull();
  });
  it('no deja meter HTML: se escapa', () => {
    const d = aplicarValor(doc, '@n', '<b>hola</b>');
    const html = plano(genBlock(d.b[0], ctxDe(d)).html.join(''));
    expect(html).not.toContain('<b>hola');
    expect(html).toContain('&lt;b&gt;');
  });
  it('las marcas no cambian el número de líneas ni el HTML real', () => {
    expect(fullCode(doc).some((l) => plano(l).includes(''))).toBe(false);
  });
});

import { borrarLinea, restaurarCodigo, cssSegura } from './edicion';
import { cssDePagina, fullCodeK } from './pagina';
import { sanitizeConfig } from './codec';

describe('editar y borrar líneas del código', () => {
  const doc = docDeGiro(0);
  const clave = (t: string, trozo: string) => fullCodeK(doc).find((l) => l.k?.startsWith(`${t}|c|`) && plano(l.t).includes(trozo))!.k!;

  it('cambia el valor de una propiedad de CSS y la página lo refleja', () => {
    const k = clave('hero', 'padding: 48px 24px');
    const d = aplicarValor(doc, `L|${k}`, '10px 5px;');
    expect(cssDePagina(d)).toContain('padding: 10px 5px;');
    expect(cssDePagina(d)).not.toContain('padding: 48px 24px;');
  });
  it('borrar una línea de CSS la quita del código y de la página', () => {
    const k = clave('hero', 'padding: 48px 24px');
    const d = borrarLinea(doc, k);
    expect(cssDePagina(d)).not.toContain('padding: 48px 24px');
    expect(fullCodeK(d).length).toBe(fullCodeK(doc).length - 1);
  });
  it('dejar el valor vacío también borra la línea', () => {
    const k = clave('hero', 'padding: 48px 24px');
    expect(cssDePagina(aplicarValor(doc, `L|${k}`, '  '))).not.toContain('padding: 48px');
  });
  it('borrar una línea de HTML quita ese elemento', () => {
    const l = fullCodeK(doc).find((x) => x.k?.startsWith('hero|h|') && plano(x.t).includes('<p>'))!;
    const d = borrarLinea(doc, l.k!);
    expect(fullCodeK(d).some((x) => plano(x.t).includes('<p>El mejor'))).toBe(false);
  });
  it('si el valor vuelve al original, se quita el cambio', () => {
    const k = clave('hero', 'padding: 48px 24px');
    const d = aplicarValor(aplicarValor(doc, `L|${k}`, '1px'), `L|${k}`, '48px 24px');
    expect(d.o).toBeUndefined();
  });
  it('restaurar deja el código como estaba', () => {
    const k = clave('hero', 'padding: 48px 24px');
    expect(restaurarCodigo(borrarLinea(doc, k), 'hero|').o).toBeUndefined();
  });
  it('no acepta valores peligrosos', () => {
    ['url(http://x.com/a.png)', 'red; } body { display:none', 'expression(alert(1))', '<script>', '\\75rl(x)', 'var(--x)'].forEach((v) => expect(cssSegura(v), v).toBe(false));
    expect(cssSegura('10px 5px')).toBe(true);
    const k = clave('hero', 'padding: 48px 24px');
    expect(aplicarValor(doc, `L|${k}`, 'url(http://x)')).toBe(doc);
  });
  it('viaja en el link y un link manipulado se limpia', () => {
    const k = clave('hero', 'padding: 48px 24px');
    const d = aplicarValor(doc, `L|${k}`, '12px');
    const v = configADoc(decode(armarEnlace(d).url.split('#')[1])!);
    expect(v.o).toEqual({ [k]: '12px' });
    const malo = sanitizeConfig({ v: 1, b: [], o: { [k]: 'url(x)', 'x|c|1': '1px', 'hero|h|2': 'hola', 'hero|h|3': '' } });
    expect(malo!.o).toEqual({ 'hero|h|3': '' });
  });
});

describe('colores con nombre', () => {
  const doc = docDeGiro(0);
  it('acepta nombres, hex corto, rgb() y hsl()', () => {
    ['red', 'Tomato', 'rebeccapurple', '#f80', '#FF8800', 'ff8800', 'rgb(255, 0, 0)', 'hsl(120, 50%, 40%)', 'rgba(0,0,0,0.5)'].forEach((c) => {
      const d = aplicarValor(doc, '@c.accent', c);
      expect(d.c?.accent, c).toBeDefined();
    });
    expect(aplicarValor(doc, '@c.accent', 'ff8800').c?.accent).toBe('#FF8800');
    expect(aplicarValor(doc, '@c.accent', 'red').c?.accent).toBe('red');
  });
  it('rechaza lo que no es un color', () => {
    ['rojo', 'url(x)', 'red; } body {', 'rgb(1,2,3);}', 'javascript:1', ''].forEach((c) => expect(aplicarValor(doc, '@c.accent', c), c).toBe(doc));
  });
  it('el color con nombre se ve en el CSS y viaja en el link', () => {
    const d = aplicarValor(doc, '@c.accent', 'red');
    expect(cssDePagina(d)).toContain('background: red;');
    expect(configADoc(decode(armarEnlace(d).url.split('#')[1])!).c?.accent).toBe('red');
  });
  it('la transparencia no se rompe con nombres (usa color-mix)', () => {
    const d = aplicarValor(aplicarValor(doc, '@c.accent', 'red'), '@c.muted', 'gray');
    const conLoc = aplicarValor({ ...d, b: [...d.b, { id: 'locx', t: 'loc', d: { h: 'U', x: 'Aquí' } }] }, '@c.accent', 'red');
    expect(cssDePagina(conLoc)).toContain('color-mix(in srgb, red 20%, transparent)');
    expect(cssDePagina({ ...conLoc, c: { accent: '#112233' } })).toContain('#11223333');
  });
});

import { contarLineas } from './pagina';
import { GIROS } from './plantillas';

describe('contador de líneas', () => {
  it('es el número real de líneas del código que se muestra', () => {
    GIROS.forEach((_, g) => {
      const d = docDeGiro(g);
      const archivo = fullCodeK(d).map((l) => plano(l.t)).join('\n');
      expect(contarLineas(d), `giro ${g}`).toBe(archivo.split('\n').length);
    });
  });
  it('la página del celular (link del QR) tiene las mismas líneas que se cuentan', () => {
    GIROS.forEach((_, g) => {
      const d = aplicarValor(docDeGiro(g), '@n', 'Mi negocio');
      const { url } = armarEnlace(d);
      const enCelular = configADoc(decode(url.split('#')[1])!);
      expect(contarLineas(enCelular), `giro ${g}`).toBe(contarLineas(d));
    });
  });
  it('borrar líneas baja el contador exactamente en esa cantidad', () => {
    const d = docDeGiro(0);
    const claves = fullCodeK(d).filter((l) => l.k?.startsWith('hero|c|')).slice(0, 3).map((l) => l.k!);
    const sin = claves.reduce((acc, k) => borrarLinea(acc, k), d);
    expect(contarLineas(sin)).toBe(contarLineas(d) - 3);
  });
});
