import { House } from 'lucide-react';
import { esc } from '../lib/util';
import type { BlockDef } from './spec';

export const hero: BlockDef = {
  type: 'hero',
  name: 'Portada',
  icon: House,
  blurb: 'Nombre, slogan y logo',
  fields: [{ kind: 'text', key: 'b', label: 'Texto del botón', max: 20 }],
  gen: (d, c) => {
    const p = c.pal;
    return {
      html: [
        '<!-- Portada de tu negocio -->',
        '<header class="portada">',
        `  <div class="logo">${esc(c.emoji)}</div>`,
        `  <h1>${esc(c.name)}</h1>`,
        `  <p>${esc(c.slogan)}</p>`,
        `  <a href="#">${esc(d.b)}</a>`,
        '</header>',
      ],
      css: [
        '/* Portada de tu negocio */',
        '.portada {',
        `  background: ${p.accent};`,
        `  color: ${p.accentText};`,
        '  text-align: center;',
        '  padding: 48px 24px;',
        '}',
        '.portada .logo {',
        '  font-size: 64px;',
        '}',
        '.portada h1 {',
        '  font-size: 32px;',
        '  margin: 8px 0;',
        '}',
        '.portada a {',
        '  display: inline-block;',
        `  background: ${p.bg};`,
        `  color: ${p.text};`,
        '  padding: 12px 24px;',
        '  border-radius: 999px;',
        '  margin-top: 20px;',
        '  font-weight: 700;',
        '}',
      ],
    };
  },
};
