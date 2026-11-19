import { Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { DURACIONES, faseDe, NOMBRES_FASE, useTaller } from './store';

export const formato = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Fase actual y tiempo restante. Es suave: nunca bloquea nada. */
export function Reloj() {
  const { pantalla, restante, pausado } = useTaller();
  const f = faseDe(pantalla);
  if (f < 0) return null;
  const total = DURACIONES[f] + 0;
  const poco = restante <= 30 && restante > 0;
  const fin = restante === 0;
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5" aria-hidden>
        {NOMBRES_FASE.map((_, i) => (
          <span key={i} className={`h-2.5 rounded-full transition-all ${i === f ? 'flama w-8' : i < f ? 'w-2.5 bg-amarillo/70' : 'w-2.5 bg-white/20'}`} />
        ))}
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold uppercase tracking-wider text-white/60">Fase {f + 1} de 4</div>
        <div className="text-xl font-extrabold">{NOMBRES_FASE[f]}</div>
      </div>
      <motion.div
        animate={fin || poco ? { scale: [1, 1.07, 1] } : { scale: 1 }}
        transition={{ repeat: fin || poco ? Infinity : 0, duration: 1.2 }}
        className={`min-w-[96px] rounded-2xl px-4 py-1.5 text-center font-mono text-3xl font-bold tabular-nums ${
          fin ? 'bg-llama text-white' : poco ? 'bg-naranja/90 text-marino' : 'bg-white/10'
        }`}
        title={pausado ? 'Reloj en pausa' : 'Tiempo restante'}
      >
        {formato(restante)}
        {pausado && <Pause size={18} className="ml-1 inline" />}
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
        <div className="flama h-full transition-all duration-1000 ease-linear" style={{ width: `${Math.min(100, (restante / total) * 100)}%` }} />
      </div>
    </div>
  );
}
