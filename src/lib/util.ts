/** Escapa texto para meterlo de forma segura dentro de HTML. Nunca se permite HTML libre. */
export function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const estrellas = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

/** Color con transparencia: con hex se pega el valor (#RRGGBB33); con nombres o rgb() se usa color-mix. */
export function alfa(color: string, pct: 20 | 33): string {
  const limpio = color.replace(/\uE000[^\uE001]*\uE001/g, '').replace(/\uE002/g, '');
  if (/^#[0-9a-f]{6}$/i.test(limpio)) return color + (pct === 20 ? '33' : '55');
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}

export const uid = () => Math.random().toString(36).slice(2, 9);

/** "Café-Libre" -> "@cafelibre" */
export function arroba(nombre: string): string {
  const s = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20);
  return '@' + (s || 'minegocio');
}
