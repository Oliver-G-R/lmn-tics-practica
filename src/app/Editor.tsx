import { useState } from 'react';
import { BotonSonido } from './BotonSonido';
import { NOMBRES_FASE } from './store';
import { AlarmClock, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/logo_lmn.png';
import { tieneGroseria } from '../lib/filtro';
import { Docente } from './Docente';
import { Fase1 } from './Fase1';
import { Fase2 } from './Fase2';
import { Fase3 } from './Fase3';
import { Fase4 } from './Fase4';
import { Inicio } from './Inicio';
import { Reloj } from './Reloj';
import { Boton } from './ui';
import { Proveedor, faseDe, useTaller } from './store';

export function Editor() {
  return (
    <Proveedor>
      <Cascaron />
    </Proveedor>
  );
}

/** Empezar de nuevo en cualquier momento: pide confirmar con un segundo clic. */
function Reiniciar() {
  const { nuevoEquipo } = useTaller();
  const [seguro, setSeguro] = useState(false);
  return (
    <Boton
      variante={seguro ? 'flama' : 'borde'}
      title="Borra todo y vuelve al inicio"
      onClick={() => {
        if (seguro) return nuevoEquipo();
        setSeguro(true);
        setTimeout(() => setSeguro(false), 3500);
      }}
    >
      <RotateCcw size={20} />
      {seguro ? '¿Seguro? Se borra todo' : 'Empezar de nuevo'}
    </Boton>
  );
}

const SIGUIENTE = ['Arma tu página →', 'Hazla tuya →', 'Lánzala →'];

function Cascaron() {
  const { pantalla, doc, restante, siguiente, aviso, cartel } = useTaller();
  const f = faseDe(pantalla);
  const nombreMalo = !!doc && tieneGroseria(doc.n);
  const puede = f === 0 ? !!doc && doc.n.trim().length > 0 && !nombreMalo : true;
  const fin = restante === 0 && f >= 0;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {f >= 0 && (
        <>
          <header className="relative flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-marino-2 px-4 py-2">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Liceo Metropolitano del Norte" className="h-11 w-11 rounded-lg" />
              <Reloj />
            </div>
            <div className="flex items-center gap-3">
            <BotonSonido />
            <Reiniciar />
            {f < 3 && (
              <Boton onClick={siguiente} disabled={!puede} title={puede ? '' : 'Elige un negocio y ponle un nombre bonito'}>
                {SIGUIENTE[f]}
              </Boton>
            )}
            </div>
          </header>
          <AnimatePresence>
            {fin && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flama shrink-0 overflow-hidden text-center font-extrabold text-marino">
                <div className="flex items-center justify-center gap-2 px-4 py-1.5 text-lg"><AlarmClock size={22} />{f < 3 ? '¡Tiempo! Pasen a la siguiente fase' : '¡Tiempo! Escaneen el QR para ver su página'}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <main className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={pantalla} className="h-full" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
            {pantalla === 'inicio' && <Inicio />}
            {pantalla === 'f1' && <Fase1 />}
            {pantalla === 'f2' && <Fase2 />}
            {pantalla === 'f3' && <Fase3 />}
            {pantalla === 'f4' && <Fase4 />}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {aviso && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} role="status" className="fixed bottom-6 left-1/2 z-[65] -translate-x-1/2 rounded-2xl bg-amarillo px-6 py-3 text-lg font-extrabold text-marino shadow-2xl">
            {aviso}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {cartel && f >= 0 && (
          <motion.div key={f} className="pointer-events-none fixed inset-0 z-[55] grid place-items-center bg-marino/80 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="text-center">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }} className="text-3xl font-extrabold uppercase tracking-[0.3em] text-white/70">
                Fase {f + 1}
              </motion.div>
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12, type: 'spring', stiffness: 200, damping: 16 }} className="texto-flama mt-2 text-7xl font-extrabold">
                {NOMBRES_FASE[f]}
              </motion.div>
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="flama mx-auto mt-5 h-1.5 w-72 origin-left rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Docente />
    </div>
  );
}
