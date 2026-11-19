import { Share2 } from 'lucide-react';
import { esc } from '../lib/util';
import type { BlockDef } from './spec';

export const soc: BlockDef = {
  type: 'soc',
  name: 'Redes sociales',
  icon: Share2,
  blurb: 'Íconos de adorno',
  fields: [
    { kind: 'text', key: 'h', label: 'Título', max: 24 },
    { kind: 'text', key: 'x', label: 'Tu usuario (inventado)', max: 24, hint: 'No pongas tus redes reales' },
  ],
  gen: (d, c) => {
    const p = c.pal;
    return {
      html: [
        '<!-- Redes sociales -->',
        '<section class="redes">',
        `  <h2>${esc(d.h)}</h2>`,
        '  <div class="iconos">',
        '    <span>📸</span>',
        '    <span>🎵</span>',
        '    <span>👍</span>',
        '  </div>',
        `  <p>${esc(d.x)}</p>`,
        '</section>',
      ],
      css: [
        '/* Redes sociales */',
        '.redes {',
        `  background: ${p.surface};`,
        '  text-align: center;',
        '  padding: 32px 20px;',
        '}',
        '.redes h2 {',
        `  color: ${p.accent};`,
        '  font-size: 24px;',
        '  margin-bottom: 14px;',
        '}',
        '.iconos span {',
        `  background: ${p.bg};`,
        '  display: inline-block;',
        '  width: 52px;',
        '  height: 52px;',
        '  line-height: 52px;',
        '  border-radius: 50%;',
        '  font-size: 24px;',
        '  margin: 0 6px;',
        '}',
        '.redes p {',
        `  color: ${p.muted};`,
        '  margin-top: 12px;',
        '}',
      ],
    };
  },
};
