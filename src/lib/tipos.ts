// Esquema de la configuración que viaja dentro del link (en el hash).
export type Block = { t: string; d?: Record<string, unknown> };

export type Config = {
  v: 1; // versión del esquema
  g: number; // giro (índice)
  n: string; // nombre del negocio
  s: string; // slogan
  e: string; // emoji del logo
  p: number; // paleta (índice)
  f: number; // fuente (índice)
  b: Block[]; // bloques en orden
  o?: Record<string, string>; // cambios hechos en el código: clave de línea -> valor nuevo ('' = línea borrada)
  c?: Record<string, string>; // colores cambiados a mano en el código (rol -> #RRGGBB)
};

/** Bloque dentro del editor: igual que Block pero con id (para arrastrar y reordenar). */
export type EBlock = { id: string; t: string; d: Record<string, any> };

export const LIMITES = { nombre: 24, slogan: 50, texto: 120, producto: 24, bloques: 8 } as const;
