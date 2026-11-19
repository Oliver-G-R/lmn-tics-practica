import { Clock } from 'lucide-react';
import { alfa, esc } from '../lib/util';
import type { BlockDef } from './spec';

export const hrs: BlockDef = {
  type: 'hrs',
  name: 'Horario',
  icon: Clock,
  blurb: 'Días y horas',
  fields: [
    { kind: 'text', key: 'h', label: 'Título', max: 24 },
    {
      kind: 'list', key: 'i', label: 'Horarios', min: 2, max: 4, addLabel: '+ Agregar día',
      cols: [{ label: 'Días', kind: 'text', max: 24 }, { label: 'Horas', kind: 'text', max: 20 }],
      blank: ['Domingo', 'Cerrado'],
    },
  ],
  gen: (d, c) => {
    const p = c.pal;
    return {
      html: [
        '<!-- Horario -->',
        '<section class="horario">',
        `  <h2>${esc(d.h)}</h2>`,
        '  <ul>',
        ...(d.i as string[][]).map((it) => `    <li><span>${esc(it[0])}</span><b>${esc(it[1])}</b></li>`),
        '  </ul>',
        '</section>',
      ],
      css: [
        '/* Horario */',
        '.horario {',
        `  background: ${p.surface};`,
        '  padding: 32px 20px;',
        '}',
        '.horario h2 {',
        `  color: ${p.accent};`,
        '  font-size: 24px;',
        '  margin-bottom: 12px;',
        '}',
        '.horario li {',
        '  display: flex;',
        '  justify-content: space-between;',
        '  gap: 12px;',
        `  color: ${p.text};`,
        '  padding: 8px 0;',
        `  border-bottom: 1px solid ${alfa(p.muted, 33)};`,
        '}',
      ],
    };
  },
};
