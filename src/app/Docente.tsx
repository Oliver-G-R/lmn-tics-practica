import { GraduationCap, Pause, Play, Plus, RotateCcw, SkipForward, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Boton } from './ui';
import { useTaller } from './store';

/** Panel oculto para el docente: Ctrl + Shift + D. */
export function Docente() {
  const [abierto, setAbierto] = useState(false);
  const [seguro, setSeguro] = useState(false);
  const { siguiente, sumarTiempo, pausado, alternarPausa, nuevoEquipo, pantalla } = useTaller();

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
        e.preventDefault();
        setAbierto((a) => !a);
        setSeguro(false);
      }
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, []);

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-4 right-4 z-[70] grid w-72 gap-2 rounded-2xl border-2 border-amarillo bg-marino p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <b className="flex items-center gap-2 text-lg"><GraduationCap size={22} /> Docente</b>
            <button onClick={() => setAbierto(false)} className="text-xl text-white/70 hover:text-white" aria-label="Cerrar">
              <X size={22} />
            </button>
          </div>
          <Boton variante="suave" disabled={pantalla === 'f4'} onClick={siguiente}>
            <SkipForward size={20} /> Siguiente fase
          </Boton>
          <Boton variante="suave" onClick={() => sumarTiempo(120)}>
            <Plus size={20} /> Sumar 2 minutos
          </Boton>
          <Boton variante="suave" onClick={alternarPausa}>
            {pausado ? <><Play size={20} /> Reanudar reloj</> : <><Pause size={20} /> Pausar reloj</>}
          </Boton>
          <Boton
            variante={seguro ? 'flama' : 'borde'}
            onClick={() => {
              if (seguro) {
                nuevoEquipo();
                setAbierto(false);
              } else setSeguro(true);
            }}
          >
            {seguro ? '¿Seguro? Borra todo' : <><RotateCcw size={20} /> Reiniciar todo</>}
          </Boton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
