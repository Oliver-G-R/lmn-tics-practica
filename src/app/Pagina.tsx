import { MoveLeft, X } from 'lucide-react';
import { useMemo, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { genBlock, cssDePagina, ctxDe, plano, type Doc } from '../lib/pagina';
import { BLOQUE_POR_TIPO } from '../blocks';
import type { EBlock } from '../lib/tipos';

/** Los enlaces de la página son de adorno: no deben cambiar el hash del link. */
const frenarEnlaces = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest('a')) e.preventDefault();
};

const htmlDe = (b: EBlock, doc: Doc) => plano(genBlock(b, ctxDe(doc), doc.o).html.join('\n'));

/** La página final (sin controles). La usa el visor del QR y la pantalla de lanzamiento. */
export function PaginaEstatica({ doc, altoMin = '100%' }: { doc: Doc; altoMin?: string }) {
  const css = useMemo(() => cssDePagina(doc), [doc]);
  return (
    <div className="pagina" style={{ minHeight: altoMin }} onClickCapture={frenarEnlaces}>
      <style>{css}</style>
      {doc.b.map((b) => (
        <div key={b.id} dangerouslySetInnerHTML={{ __html: htmlDe(b, doc) }} />
      ))}
    </div>
  );
}

type LienzoProps = {
  doc: Doc;
  sel: string | null;
  onSel: (id: string) => void;
  onQuitar?: (id: string) => void;
  arrastrable: boolean;
};

/** La página en el editor: bloques seleccionables, ordenables y con botón de quitar. */
export function Lienzo({ doc, sel, onSel, onQuitar, arrastrable }: LienzoProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'lienzo' });
  const css = useMemo(() => cssDePagina(doc), [doc]);
  return (
    <div ref={setNodeRef} className="pagina" style={{ minHeight: '100%' }} onClickCapture={frenarEnlaces}>
      <style>{css}</style>
      <SortableContext items={doc.b.map((b) => b.id)} strategy={verticalListSortingStrategy} disabled={!arrastrable}>
        {doc.b.map((b) => (
          <BloqueOrdenable key={b.id} b={b} doc={doc} seleccionado={sel === b.id} onSel={onSel} onQuitar={onQuitar} arrastrable={arrastrable} />
        ))}
      </SortableContext>
      {doc.b.length === 0 && (
        <div style={{ padding: '80px 24px', textAlign: 'center', opacity: 0.8 }}>
          <MoveLeft size={48} style={{ margin: '0 auto' }} />
          <p style={{ marginTop: 8, fontWeight: 700 }}>Arrastra bloques aquí</p>
        </div>
      )}
      {arrastrable && isOver && <div style={{ position: 'sticky', bottom: 0, height: 6, background: '#FEC400' }} />}
    </div>
  );
}

function BloqueOrdenable({
  b, doc, seleccionado, onSel, onQuitar, arrastrable,
}: { b: EBlock; doc: Doc; seleccionado: boolean; onSel: (id: string) => void; onQuitar?: (id: string) => void; arrastrable: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: b.id, disabled: !arrastrable });
  const nombre = BLOQUE_POR_TIPO[b.t]?.name ?? b.t;
  return (
    <div
      ref={setNodeRef}
      {...(arrastrable ? attributes : {})}
      {...(arrastrable ? listeners : {})}
      onClick={() => onSel(b.id)}
      className="group"
      style={{
        position: 'relative',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.55 : 1,
        zIndex: isDragging ? 20 : undefined,
        cursor: arrastrable ? 'grab' : 'pointer',
        touchAction: arrastrable ? 'none' : undefined,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        dangerouslySetInnerHTML={{ __html: htmlDe(b, doc) }}
      />
      <div
        className={`pointer-events-none absolute inset-0 z-10 border-4 transition ${seleccionado ? 'border-[#FEC400]' : 'border-transparent group-hover:border-white/70'}`}
      />
      {(seleccionado || arrastrable) && (
        <div className="pointer-events-none absolute left-2 top-2 z-10 rounded-full bg-[#001F34] px-2.5 py-0.5 text-xs font-bold text-white opacity-0 shadow transition group-hover:opacity-100" style={{ opacity: seleccionado ? 1 : undefined }}>
          {nombre}
        </div>
      )}
      {arrastrable && onQuitar && (
        <button
          aria-label={`Quitar ${nombre}`}
          title="Quitar bloque"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onQuitar(b.id);
          }}
          className={`absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-[#FE5208] text-lg font-black text-white shadow-lg transition hover:scale-110 focus-visible:opacity-100 group-hover:opacity-100 ${seleccionado ? 'opacity-100' : 'opacity-0'}`}
        >
          <X size={20} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
