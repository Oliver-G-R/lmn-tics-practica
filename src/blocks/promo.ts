import { Flame } from 'lucide-react';
import { esc } from '../lib/util';
import type { BlockDef } from './spec';

export const promo: BlockDef = {
  type: 'promo',
  name: 'Promoción',
  icon: Flame,
  blurb: 'Banner con oferta',
  fields: [
    { kind: 'text', key: 'x', label: 'La oferta', max: 40 },
    { kind: 'text', key: 'y', label: 'Detalle', max: 60 },
  ],
  gen: (d, c) => {
    const p = c.pal;
    return {
      html: [
        '<!-- Promoción -->',
        '<section class="promo">',
        `  <h2>🔥 ${esc(d.x)}</h2>`,
        `  <p>${esc(d.y)}</p>`,
        '</section>',
      ],
      css: [
        '/* Promoción */',
        '.promo {',
        `  background: ${p.accent};`,
        `  color: ${p.accentText};`,
        '  text-align: center;',
        '  padding: 28px 20px;',
        `  border-bottom: 6px dashed ${p.bg};`,
        '}',
        '.promo h2 {',
        '  font-size: 26px;',
        '}',
        '.promo p {',
        '  margin-top: 6px;',
        '}',
      ],
    };
  },
};
