import { ShoppingBag } from 'lucide-react';
import { esc } from '../lib/util';
import type { BlockDef } from './spec';

export const menu: BlockDef = {
  type: 'menu',
  name: 'Productos o menú',
  icon: ShoppingBag,
  blurb: '3 a 6 artículos con precio',
  fields: [
    { kind: 'text', key: 'h', label: 'Título', max: 24 },
    {
      kind: 'list', key: 'i', label: 'Productos', min: 3, max: 6, addLabel: '+ Agregar producto',
      cols: [{ label: 'Nombre', kind: 'text', max: 24 }, { label: 'Precio', kind: 'price', max: 5 }],
      blank: ['Nuevo producto', '30'],
    },
  ],
  gen: (d, c) => {
    const p = c.pal;
    return {
      html: [
        '<!-- Productos o menú -->',
        '<section class="menu">',
        `  <h2>${esc(d.h)}</h2>`,
        '  <ul>',
        ...(d.i as string[][]).map((it) => `    <li><span>${esc(it[0])}</span><b>$${esc(it[1])}</b></li>`),
        '  </ul>',
        '</section>',
      ],
      css: [
        '/* Productos o menú */',
        '.menu {',
        `  background: ${p.bg};`,
        '  padding: 32px 20px;',
        '}',
        '.menu h2 {',
        `  color: ${p.accent};`,
        '  font-size: 24px;',
        '  margin-bottom: 16px;',
        '}',
        '.menu li {',
        '  display: flex;',
        '  justify-content: space-between;',
        `  background: ${p.surface};`,
        '  padding: 12px 16px;',
        '  border-radius: 12px;',
        '  margin-bottom: 8px;',
        '}',
        '.menu b {',
        `  color: ${p.accent};`,
        '}',
      ],
    };
  },
};
