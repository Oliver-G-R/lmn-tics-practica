import { MessageCircle } from 'lucide-react';
import { esc } from '../lib/util';
import type { BlockDef } from './spec';

export const cta: BlockDef = {
  type: 'cta',
  name: 'Contacto',
  icon: MessageCircle,
  blurb: 'Botón tipo WhatsApp',
  fields: [
    { kind: 'text', key: 'x', label: 'Mensaje', max: 60 },
    { kind: 'text', key: 'b', label: 'Texto del botón', max: 24, hint: 'Es de adorno: no pongas tu número' },
  ],
  gen: (d, c) => {
    const p = c.pal;
    return {
      html: [
        '<!-- Contacto -->',
        '<section class="contacto">',
        `  <p>${esc(d.x)}</p>`,
        `  <a href="#">💬 ${esc(d.b)}</a>`,
        '</section>',
      ],
      css: [
        '/* Contacto */',
        '.contacto {',
        `  background: ${p.surface};`,
        '  text-align: center;',
        '  padding: 32px 20px;',
        '}',
        '.contacto p {',
        `  color: ${p.text};`,
        '  font-size: 18px;',
        '  font-weight: 700;',
        '  margin-bottom: 14px;',
        '}',
        '.contacto a {',
        '  display: inline-block;',
        '  background: #25D366;',
        '  color: #0B3D1E;',
        '  padding: 14px 26px;',
        '  border-radius: 999px;',
        '  font-weight: 700;',
        '}',
      ],
    };
  },
};
