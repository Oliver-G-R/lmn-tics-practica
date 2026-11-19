import type { Paleta, Fuente } from '../lib/paletas';

import type { LucideIcon } from 'lucide-react';

export type Data = Record<string, any>;

export type Col = { label: string; kind: 'text' | 'price' | 'stars'; max?: number };

/** Descripción de los campos editables de un bloque. Sirve para dibujar el formulario y para validar. */
export type Field =
  | { kind: 'text'; key: string; label: string; max: number; area?: boolean; hint?: string }
  | { kind: 'list'; key: string; label: string; min: number; max: number; cols: Col[]; addLabel: string; blank: (string | number)[] }
  | { kind: 'emojis'; key: string; label: string; count: number };

export type Ctx = { name: string; slogan: string; emoji: string; pal: Paleta; font: Fuente };

export type Code = { html: string[]; css: string[] };

export type BlockDef = {
  type: string; // tipo corto que viaja en el link
  name: string; // nombre en el catálogo
  icon: LucideIcon;
  blurb: string;
  fields: Field[];
  gen: (d: Data, c: Ctx) => Code;
};
