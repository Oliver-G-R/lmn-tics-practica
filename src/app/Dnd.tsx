import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useDraggable, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { BLOQUES, BLOQUE_POR_TIPO } from '../blocks';
import { LIMITES } from '../lib/tipos';
import { useTaller } from './store';

/** Contexto de arrastrar y soltar: catálogo → página, y reordenar dentro de la página. */
export function ContextoDnd({ children }: { children: ReactNode }) {
  const { doc, agregar, mover } = useTaller();
  const [activo, setActivo] = useState<string | null>(null);
  const sensores = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function fin(e: DragEndEvent) {
    setActivo(null);
    if (!doc || !e.over) return;
    const a = String(e.active.id);
    const o = String(e.over.id);
    if (a.startsWith('cat:')) {
      const idx = o === 'lienzo' ? doc.b.length : doc.b.findIndex((b) => b.id === o);
      agregar(a.slice(4), idx < 0 ? undefined : idx);
    } else if (a !== o && o !== 'lienzo') {
      mover(doc.b.findIndex((b) => b.id === a), doc.b.findIndex((b) => b.id === o));
    }
  }

  const def = activo?.startsWith('cat:') ? BLOQUE_POR_TIPO[activo.slice(4)] : null;
  return (
    <DndContext sensors={sensores} collisionDetection={closestCenter} onDragStart={(e) => setActivo(String(e.active.id))} onDragEnd={fin} onDragCancel={() => setActivo(null)}>
      {children}
      <DragOverlay dropAnimation={null}>
        {def && (
          <div className="flama flex w-36 -rotate-3 flex-col items-center rounded-2xl p-3 text-marino shadow-2xl">
            <def.icon size={36} />
            <span className="text-base font-extrabold">{def.name}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function TarjetaCatalogo({ tipo }: { tipo: string }) {
  const { doc, agregar } = useTaller();
  const def = BLOQUE_POR_TIPO[tipo];
  const usado = !!doc?.b.some((b) => b.t === tipo);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `cat:${tipo}`, disabled: usado });
  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => agregar(tipo)}
      title={usado ? 'Ya está en tu página' : `${def.blurb}. Arrástralo o dale clic`}
      aria-disabled={usado}
      className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 text-center transition ${
        usado ? 'border-white/10 bg-white/5 opacity-40' : 'border-white/15 bg-marino-2 hover:-translate-y-0.5 hover:border-amarillo hover:bg-marino-3'
      } ${isDragging ? 'opacity-30' : ''}`}
      style={{ touchAction: 'none', cursor: usado ? 'not-allowed' : 'grab' }}
    >
      <def.icon size={30} strokeWidth={2} className="text-amarillo" />
      <span className="text-base font-bold leading-tight">{def.name}</span>
      {usado && <Check size={18} className="absolute right-2 top-1.5 text-amarillo" />}
    </button>
  );
}

export function Catalogo() {
  const { doc } = useTaller();
  const n = doc?.b.length ?? 0;
  return (
    <div className="flex h-full flex-col gap-3">
      <div>
        <h2 className="text-xl font-extrabold">Bloques</h2>
        <p className="text-base text-white/70">Arrástralos a tu página o dales clic.</p>
      </div>
      <div className="scroll-fino grid grid-cols-2 gap-2.5 overflow-y-auto pr-1">
        {BLOQUES.map((b, i) => (
          <motion.div key={b.type} initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.05 + i * 0.04, type: 'spring', stiffness: 300, damping: 22 }}>
            <TarjetaCatalogo tipo={b.type} />
          </motion.div>
        ))}
      </div>
      <div className={`mt-auto rounded-xl px-3 py-2 text-center text-base font-bold ${n >= LIMITES.bloques ? 'bg-llama/30 text-amarillo' : 'bg-white/10'}`}>
        {n} de {LIMITES.bloques} bloques
      </div>
    </div>
  );
}
