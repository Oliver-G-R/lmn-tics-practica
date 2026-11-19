import { TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { sonar } from '../lib/sonido';
import { validarTexto } from '../lib/filtro';

type CampoProps = {
  valor: string;
  onChange: (v: string) => void;
  max: number;
  etiqueta?: string;
  hint?: string;
  area?: boolean;
  onFocus?: () => void;
  placeholder?: string;
  compacto?: boolean;
  prefijo?: string;
  numerico?: boolean;
};

/** Campo de texto con límite de caracteres y filtro de palabras (se pone rojo si hay un problema). */
export function Campo({ valor, onChange, max, etiqueta, hint, area, onFocus, placeholder, compacto, prefijo, numerico }: CampoProps) {
  const error = validarTexto(valor);
  const hubo = useRef(false);
  useEffect(() => {
    if (error && !hubo.current) sonar('error');
    hubo.current = !!error;
  }, [error]);
  const [id] = useState(() => 'c' + Math.random().toString(36).slice(2, 8));
  const base = `w-full rounded-xl border-2 bg-marino px-3 text-base font-semibold text-white placeholder:text-white/40 outline-none transition focus:border-amarillo ${
    error ? 'border-llama bg-llama/15' : 'border-white/15'
  }`;
  const props = {
    id,
    value: valor,
    maxLength: max,
    placeholder,
    onFocus,
    'aria-invalid': !!error,
    onChange: (e: { target: { value: string } }) => onChange(numerico ? e.target.value.replace(/\D/g, '') : e.target.value),
  };
  return (
    <div className="min-w-0">
      {etiqueta && (
        <label htmlFor={id} className="mb-1 flex items-baseline justify-between text-base font-bold">
          <span>{etiqueta}</span>
          <span className={`text-sm font-semibold ${valor.length >= max ? 'text-amarillo' : 'text-white/50'}`}>
            {valor.length}/{max}
          </span>
        </label>
      )}
      <div className="relative">
        {prefijo && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base font-bold text-white/60">{prefijo}</span>}
        {area ? (
          <textarea {...props} rows={3} className={`${base} resize-none py-2`} />
        ) : (
          <input {...props} inputMode={numerico ? 'numeric' : undefined} className={`${base} ${compacto ? 'py-1.5' : 'py-2.5'} ${prefijo ? 'pl-7' : ''}`} />
        )}
      </div>
      {error ? <p className="mt-1 flex items-center gap-1.5 text-base font-bold text-[#FF8A5C]"><TriangleAlert size={18} className="shrink-0" />{error}</p> : hint ? <p className="mt-1 text-sm text-white/60">{hint}</p> : null}
    </div>
  );
}
