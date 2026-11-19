import { FileText } from 'lucide-react';
import { esc } from '../lib/util';
import type { BlockDef } from './spec';

export const about: BlockDef = {
  type: 'about',
  name: 'Sobre nosotros',
  icon: FileText,
  blurb: 'Un texto corto',
  fields: [
    { kind: 'text', key: 'h', label: 'Título', max: 24 },
    { kind: 'text', key: 'x', label: 'Texto', max: 120, area: true },
  ],
  gen: (d, c) => {
    const p = c.pal;
    return {
      html: [
        '<!-- Sobre nosotros -->',
        '<section class="nosotros">',
        `  <h2>${esc(d.h)}</h2>`,
        `  <p>${esc(d.x)}</p>`,
        '</section>',
      ],
      css: [
        '/* Sobre nosotros */',
        '.nosotros {',
        `  background: ${p.bg};`,
        '  padding: 32px 20px;',
        '}',
        '.nosotros h2 {',
        `  color: ${p.accent};`,
        '  font-size: 24px;',
        '  margin-bottom: 10px;',
        '}',
        '.nosotros p {',
        `  color: ${p.text};`,
        '  font-size: 17px;',
        '}',
      ],
    };
  },
};
