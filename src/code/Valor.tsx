import { TriangleAlert } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { validarValor, type Info } from '../lib/edicion';

export type Edicion = {
  leer: (ruta: string) => Info | null;
  aplicar: (ruta: string, raw: string) => void;
  borrar: (clave: string) => void;
};

/** Un valor del código que se puede cambiar con un clic (texto, precio, emoji o color). */
export function Valor({ ruta, edit, hijos }: { ruta: string; edit: Edicion; hijos: ReactNode }) {
  const info = edit.leer(ruta);
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!info) return <>{hijos}</>;

  const abrir = () => {
    setBorrador(info.valor);
    setError(null);
    setEditando(true);
  };
  const guardar = () => {
    if (borrador === info.valor) return setEditando(false);
    const e = validarValor(info.tipo, borrador);
    if (e) return setError(e);
    edit.aplicar(ruta, borrador);
    setEditando(false);
  };

  if (!editando) {
    return (
      <span
        role="button"
        tabIndex={0}
        title="Clic para cambiar este valor"
        onClick={abrir}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), abrir())}
        className="cursor-text rounded-sm underline decoration-amarillo/80 decoration-dotted decoration-2 underline-offset-4 hover:bg-amarillo/25"
      >
        {hijos}
      </span>
    );
  }

  return (
    <span className="relative inline-block align-baseline">
      <input
        autoFocus
        value={borrador}
        maxLength={info.max}
        inputMode={info.tipo === 'precio' ? 'numeric' : undefined}
        placeholder={info.tipo === 'css' ? 'vacío = borrar' : undefined}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => {
          setBorrador(info.tipo === 'precio' ? e.target.value.replace(/\D/g, '') : e.target.value);
          setError(null);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') guardar();
          if (e.key === 'Escape') setEditando(false);
        }}
        onBlur={() => (error ? setEditando(false) : guardar())}
        aria-label="Nuevo valor"
        style={{ width: `${Math.max(3, borrador.length + 1)}ch` }}
        className={`rounded border-2 bg-marino px-1 font-mono text-[15px] font-bold text-white outline-none ${error ? 'border-llama' : 'border-amarillo'}`}
      />
      {error && (
        <span className="absolute left-0 bottom-full z-30 mb-1 w-max max-w-[260px] rounded-lg bg-llama px-2 py-1 font-sans text-sm font-bold text-white shadow-xl"><TriangleAlert size={14} className="mr-1 inline -translate-y-px" />{error}</span>
      )}
      {!error && <span className="absolute left-0 bottom-full z-30 mb-1 w-max rounded-lg bg-black/80 px-2 py-0.5 font-sans text-xs text-white/80">{info.tipo === 'css' ? 'Enter para guardar · vacío borra la línea' : 'Enter para guardar'}</span>}
    </span>
  );
}
