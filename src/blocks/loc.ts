import { MapPin } from 'lucide-react';
import { alfa, esc } from '../lib/util';
import type { BlockDef } from './spec';

export const loc: BlockDef = {
  type: 'loc',
  name: 'Ubicación',
  icon: MapPin,
  blurb: 'Texto y mapa ilustrado',
  fields: [
    { kind: 'text', key: 'h', label: 'Título', max: 24 },
    { kind: 'text', key: 'x', label: 'Dónde estás (inventa un lugar)', max: 60, hint: 'No pongas tu dirección real ni datos personales' },
  ],
  gen: (d, c) => {
    const p = c.pal;
    return {
      html: [
        '<!-- Ubicación -->',
        '<section class="ubicacion">',
        `  <h2>${esc(d.h)}</h2>`,
        `  <p>📍 ${esc(d.x)}</p>`,
        '  <div class="mapa">📍</div>',
        '</section>',
      ],
      css: [
        '/* Ubicación */',
        '.ubicacion {',
        `  background: ${p.bg};`,
        '  padding: 32px 20px;',
        '}',
        '.ubicacion h2 {',
        `  color: ${p.accent};`,
        '  font-size: 24px;',
        '  margin-bottom: 8px;',
        '}',
        '.ubicacion p {',
        `  color: ${p.text};`,
        '  margin-bottom: 14px;',
        '}',
        '.mapa {',
        '  height: 140px;',
        '  border-radius: 16px;',
        '  display: grid;',
        '  place-items: center;',
        '  font-size: 40px;',
        `  background-color: ${p.surface};`,
        `  background-image: linear-gradient(${alfa(p.accent, 20)} 2px, transparent 2px), linear-gradient(90deg, ${alfa(p.accent, 20)} 2px, transparent 2px);`,
        '  background-size: 28px 28px;',
        '}',
      ],
    };
  },
};
