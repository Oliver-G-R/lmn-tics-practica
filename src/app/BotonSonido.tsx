import { useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { alternarMudo, estaMudo, suscribirSonido } from '../lib/sonido';

/** Silenciar o activar los sonidos (se recuerda en la computadora). */
export function BotonSonido({ className = '' }: { className?: string }) {
  const mudo = useSyncExternalStore(suscribirSonido, estaMudo);
  return (
    <button
      onClick={alternarMudo}
      title={mudo ? 'Activar sonidos' : 'Silenciar sonidos'}
      aria-label={mudo ? 'Activar sonidos' : 'Silenciar sonidos'}
      aria-pressed={mudo}
      className={`grid h-12 w-12 place-items-center rounded-2xl border-2 border-white/25 text-white transition hover:border-amarillo hover:text-amarillo ${className}`}
    >
      {mudo ? <VolumeX size={24} /> : <Volume2 size={24} />}
    </button>
  );
}
