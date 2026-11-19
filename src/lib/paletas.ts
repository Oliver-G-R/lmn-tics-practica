// Paletas y fuentes que pueden elegir los alumnos para su página.
// Todas cumplen contraste (se revisa en paletas.test.ts).

export const ROLES = ['bg', 'surface', 'text', 'muted', 'accent', 'accentText'] as const;
export type Rol = (typeof ROLES)[number];

export type Paleta = {
  nombre: string;
  bg: string; // fondo de la página
  surface: string; // tarjetas
  text: string; // texto principal
  muted: string; // texto secundario
  accent: string; // color de acento
  accentText: string; // texto sobre el acento
};

export const PALETAS: Paleta[] = [
  { nombre: 'Café', bg: '#FFF8F0', surface: '#F3E3D0', text: '#3B2418', muted: '#6B4A38', accent: '#8B4513', accentText: '#FFFFFF' },
  { nombre: 'Océano', bg: '#F0F8FF', surface: '#DCEEFB', text: '#0B2545', muted: '#3F5F82', accent: '#0B6BCB', accentText: '#FFFFFF' },
  { nombre: 'Menta', bg: '#F1FBF5', surface: '#D8F3E3', text: '#0F3D2E', muted: '#3D6B58', accent: '#0F7A55', accentText: '#FFFFFF' },
  { nombre: 'Atardecer', bg: '#FFF4EC', surface: '#FFE0CC', text: '#4A1D0A', muted: '#7A4A33', accent: '#C2410C', accentText: '#FFFFFF' },
  { nombre: 'Uva', bg: '#F7F2FF', surface: '#E7DAFF', text: '#2A1458', muted: '#5B4A85', accent: '#6D28D9', accentText: '#FFFFFF' },
  { nombre: 'Noche', bg: '#0F172A', surface: '#1E293B', text: '#F1F5F9', muted: '#A9B6C9', accent: '#FACC15', accentText: '#0F172A' },
];

export type Fuente = {
  nombre: string;
  familia: string; // nombre de la fuente en CSS
  css: string; // valor completo de font-family
};

export const FUENTES: Fuente[] = [
  { nombre: 'Moderna', familia: 'Inter', css: "'Inter', sans-serif" },
  { nombre: 'Elegante', familia: 'Playfair Display', css: "'Playfair Display', serif" },
  { nombre: 'Divertida', familia: 'Fredoka', css: "'Fredoka', sans-serif" },
];

/** Contraste WCAG entre dos colores hex (#RRGGBB). */
export function contraste(a: string, b: string): number {
  const lum = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
