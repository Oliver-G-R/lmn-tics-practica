import { Image } from 'lucide-react';
import { esc } from '../lib/util';
import type { BlockDef } from './spec';

export const gal: BlockDef = {
  type: 'gal',
  name: 'Galería',
  icon: Image,
  blurb: 'Cuadrícula de emojis',
  fields: [
    { kind: 'text', key: 'h', label: 'Título', max: 24 },
    { kind: 'emojis', key: 'i', label: 'Toca un cuadro y elige otro emoji', count: 6 },
  ],
  gen: (d, c) => {
    const p = c.pal;
    return {
      html: [
        '<!-- Galería de imágenes -->',
        '<section class="galeria">',
        `  <h2>${esc(d.h)}</h2>`,
        '  <div class="cuadricula">',
        ...(d.i as string[]).map((e) => `    <div>${esc(e)}</div>`),
        '  </div>',
        '</section>',
      ],
      css: [
        '/* Galería de imágenes */',
        '.galeria {',
        `  background: ${p.surface};`,
        '  padding: 32px 20px;',
        '}',
        '.galeria h2 {',
        `  color: ${p.accent};`,
        '  font-size: 24px;',
        '  margin-bottom: 16px;',
        '}',
        '.cuadricula {',
        '  display: grid;',
        '  grid-template-columns: repeat(3, 1fr);',
        '  gap: 10px;',
        '}',
        '.cuadricula div {',
        `  background: ${p.bg};`,
        '  border-radius: 14px;',
        '  font-size: 38px;',
        '  text-align: center;',
        '  padding: 14px 0;',
        '}',
      ],
    };
  },
};
