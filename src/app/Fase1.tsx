import { Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { GIROS } from '../lib/plantillas';
import { LIMITES } from '../lib/tipos';
import { PISTA_PERSONAL } from '../lib/filtro';
import { Campo } from './Campos';
import { Celular } from './Celular';
import { PaginaEstatica } from './Pagina';
import { useTaller } from './store';

/** Fase 1: eligen el giro (se precarga la plantilla) y escriben el nombre del negocio. */
export function Fase1() {
  const { doc, elegirGiro, setCampo } = useTaller();
  return (
    <div className="grid h-full min-h-0 grid-cols-[1fr_360px] gap-6 p-5">
      <div className="flex min-h-0 flex-col gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">¿Qué negocio vas a inventar?</h1>
          <p className="text-lg text-white/70">Elige uno. Tu página aparece lista para que la cambies.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {GIROS.map((g, i) => {
            const activo = doc?.g === i;
            return (
              <motion.button
                key={g.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => elegirGiro(i)}
                className={`flex items-center gap-3 rounded-2xl border-[3px] px-4 py-3 text-left transition ${
                  activo ? 'border-amarillo bg-amarillo/15 shadow-lg shadow-amarillo/10' : 'border-white/15 bg-marino-2 hover:border-white/40'
                }`}
              >
                <span className="text-5xl leading-none">{g.emoji}</span>
                <span>
                  <span className="block text-xl font-extrabold leading-tight">{g.nombre}</span>
                  <span className="block text-base text-white/70">{g.desc}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
        <motion.div initial={false} animate={{ opacity: doc ? 1 : 0.4 }} className="rounded-2xl bg-marino-2 p-4">
          <Campo
            etiqueta="Nombre de tu negocio"
            valor={doc?.n ?? ''}
            max={LIMITES.nombre}
            hint={doc ? PISTA_PERSONAL : 'Primero elige un negocio'}
            placeholder="Escribe un nombre"
            onChange={(v) => setCampo('n', v)}
          />
        </motion.div>
      </div>

      <div className="min-h-0">
        {doc ? (
          <Celular>
            <PaginaEstatica doc={doc} />
          </Celular>
        ) : (
          <div className="grid h-full place-items-center rounded-3xl border-2 border-dashed border-white/15 text-center text-xl text-white/60">
            <div>
              <Smartphone size={64} className="mx-auto" />
              <p className="mt-2 font-bold">Aquí verás tu página</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
