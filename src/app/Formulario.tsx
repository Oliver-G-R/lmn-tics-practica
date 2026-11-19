import { Star, X } from 'lucide-react';
import { useState } from 'react';
import type { Col, Field } from '../blocks/spec';
import { Campo } from './Campos';

type Props = {
  campos: Field[];
  datos: Record<string, any>;
  onCambio: (fn: (d: Record<string, any>) => Record<string, any>) => void;
  emojis: string[]; // emojis curados del giro
};

/** Formulario generado a partir de la descripción de campos de un bloque. */
export function Formulario({ campos, datos, onCambio, emojis }: Props) {
  const poner = (key: string, v: unknown) => onCambio((d) => ({ ...d, [key]: v }));
  return (
    <div className="grid gap-3">
      {campos.map((f) => {
        if (f.kind === 'text') {
          return <Campo key={f.key} etiqueta={f.label} valor={datos[f.key] ?? ''} max={f.max} area={f.area} hint={f.hint} onChange={(v) => poner(f.key, v)} />;
        }
        if (f.kind === 'emojis') {
          return <EmojisGaleria key={f.key} etiqueta={f.label} valor={datos[f.key] ?? []} opciones={emojis} onChange={(v) => poner(f.key, v)} />;
        }
        const filas: (string | number)[][] = datos[f.key] ?? [];
        const setFila = (i: number, j: number, v: string | number) => poner(f.key, filas.map((r, ri) => (ri === i ? r.map((c, ci) => (ci === j ? v : c)) : r)));
        return (
          <div key={f.key} className="grid gap-2">
            <div className="text-base font-bold">{f.label}</div>
            {filas.map((fila, i) => (
              <div key={i} className="grid gap-1.5 rounded-xl bg-white/5 p-2">
                <div className="flex items-start gap-1.5">
                  <div className={`grid min-w-0 flex-1 gap-1.5 ${f.cols.length > 1 && f.cols[0].kind !== 'text' ? '' : ''}`}>
                    {f.cols.map((col, j) => (
                      <Celda key={j} col={col} valor={fila[j]} onChange={(v) => setFila(i, j, v)} />
                    ))}
                  </div>
                  {filas.length > f.min && (
                    <button
                      aria-label="Quitar"
                      title="Quitar"
                      onClick={() => poner(f.key, filas.filter((_, ri) => ri !== i))}
                      className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-llama/25 font-black text-[#FF8A5C] hover:bg-llama/50"
                    >
                      <X size={18} strokeWidth={3} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filas.length < f.max && (
              <button onClick={() => poner(f.key, [...filas, [...f.blank]])} className="rounded-xl border-2 border-dashed border-white/25 py-2 text-base font-bold text-white/80 hover:border-amarillo hover:text-amarillo">
                {f.addLabel}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Celda({ col, valor, onChange }: { col: Col; valor: string | number; onChange: (v: string | number) => void }) {
  if (col.kind === 'stars') {
    return (
      <div className="flex items-center gap-1" role="group" aria-label="Estrellas">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => onChange(n)} aria-label={`${n} estrellas`} className={`text-2xl leading-none transition hover:scale-125 ${n <= Number(valor) ? 'text-amarillo' : 'text-white/25'}`}>
            <Star size={24} fill="currentColor" strokeWidth={1.5} />
          </button>
        ))}
      </div>
    );
  }
  return <Campo compacto valor={String(valor)} max={col.max ?? 24} placeholder={col.label} prefijo={col.kind === 'price' ? '$' : undefined} numerico={col.kind === 'price'} onChange={onChange} />;
}

function EmojisGaleria({ etiqueta, valor, opciones, onChange }: { etiqueta: string; valor: string[]; opciones: string[]; onChange: (v: string[]) => void }) {
  const [celda, setCelda] = useState(0);
  return (
    <div className="grid gap-2">
      <div className="text-base font-bold">{etiqueta}</div>
      <div className="grid grid-cols-6 gap-1.5">
        {valor.map((e, i) => (
          <button key={i} onClick={() => setCelda(i)} className={`rounded-lg border-2 py-1 text-2xl ${celda === i ? 'border-amarillo bg-amarillo/20' : 'border-white/15 bg-white/5'}`}>
            {e}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {opciones.map((e) => (
          <button key={e} onClick={() => onChange(valor.map((v, i) => (i === celda ? e : v)))} className="rounded-lg bg-white/5 py-1 text-2xl transition hover:scale-110 hover:bg-white/15">
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
