import { Star } from 'lucide-react';
import { esc, estrellas } from '../lib/util';
import type { BlockDef } from './spec';

export const rev: BlockDef = {
  type: 'rev',
  name: 'Reseñas',
  icon: Star,
  blurb: '2 a 3 opiniones inventadas',
  fields: [
    { kind: 'text', key: 'h', label: 'Título', max: 24 },
    {
      kind: 'list', key: 'i', label: 'Reseñas (inventadas)', min: 2, max: 3, addLabel: '+ Agregar reseña',
      cols: [{ label: 'Nombre', kind: 'text', max: 16 }, { label: 'Opinión', kind: 'text', max: 120 }, { label: 'Estrellas', kind: 'stars' }],
      blank: ['Alex', '¡Muy buena onda!', 5],
    },
  ],
  gen: (d, c) => {
    const p = c.pal;
    return {
      html: [
        '<!-- Reseñas -->',
        '<section class="resenas">',
        `  <h2>${esc(d.h)}</h2>`,
        ...(d.i as [string, string, number][]).flatMap((it) => [
          '  <div class="resena">',
          `    <span>${estrellas(it[2])}</span>`,
          `    <p>“${esc(it[1])}”</p>`,
          `    <small>— ${esc(it[0])}</small>`,
          '  </div>',
        ]),
        '</section>',
      ],
      css: [
        '/* Reseñas */',
        '.resenas {',
        `  background: ${p.bg};`,
        '  padding: 32px 20px;',
        '}',
        '.resenas h2 {',
        `  color: ${p.accent};`,
        '  font-size: 24px;',
        '  margin-bottom: 14px;',
        '}',
        '.resena {',
        `  background: ${p.surface};`,
        '  padding: 14px 16px;',
        '  border-radius: 14px;',
        '  margin-bottom: 10px;',
        '}',
        '.resena span {',
        `  color: ${p.accent};`,
        '  letter-spacing: 2px;',
        '}',
        '.resena small {',
        `  color: ${p.muted};`,
        '}',
      ],
    };
  },
};
