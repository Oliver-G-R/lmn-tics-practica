import { describe, it, expect } from 'vitest';
import { PALETAS, contraste } from './paletas';

describe('paletas', () => {
  PALETAS.forEach((p) => {
    it(`${p.nombre}: buen contraste`, () => {
      expect(contraste(p.text, p.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contraste(p.text, p.surface)).toBeGreaterThanOrEqual(4.5);
      expect(contraste(p.muted, p.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contraste(p.muted, p.surface)).toBeGreaterThanOrEqual(4.5);
      expect(contraste(p.accent, p.bg)).toBeGreaterThanOrEqual(3);
      expect(contraste(p.accentText, p.accent)).toBeGreaterThanOrEqual(4.5);
    });
  });
});
