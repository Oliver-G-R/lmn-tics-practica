import { Box, FileCode, MoveLeft, Palette, Pencil, Trash2, Undo2, X, type LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BLOQUE_POR_TIPO } from '../blocks';
import { ctxDe, fullCodeK, genBlockK, genGlobalK, type Doc, type LineaK } from '../lib/pagina';
import { Boton } from '../app/ui';
import { CodigoVista, type Linea } from './CodigoVista';
import { leerValor } from '../lib/edicion';
import { useTaller } from '../app/store';
import type { Edicion } from './Valor';
import { lenguajes } from './Highlight';

type Vista = 'bloque' | 'global';

/** Panel de código: el HTML y CSS reales del bloque elegido, que se ilumina al cambiar algo. */
export function CodePanel({ doc, sel, onQuitar }: { doc: Doc; sel: string | null; onQuitar?: (id: string) => void }) {
  const { editarValor, borrarLinea, restaurarCodigo } = useTaller();
  const edit: Edicion = { leer: (r) => leerValor(doc, r), aplicar: editarValor, borrar: borrarLinea };
  const [vista, setVista] = useState<Vista>('bloque');
  const [todo, setTodo] = useState(false);
  const total = useMemo(() => fullCodeK(doc), [doc]);
  const c = ctxDe(doc);
  const bloque = doc.b.find((b) => b.id === sel) ?? null;

  const codigo = bloque ? genBlockK(bloque, c, doc.o) : null;
  const global = genGlobalK(c, doc.o);
  const prefijo = vista === 'global' ? 'g|' : bloque ? `${bloque.t}|` : null;
  const hayCambios = !!prefijo && Object.keys(doc.o ?? {}).some((k) => k.startsWith(prefijo));
  const k2l = (ls: LineaK[], lang: 'html' | 'css'): Linea[] => ls.map((l) => ({ ...l, lang }));

  return (
    <div className="flex h-full min-h-0 flex-col rounded-3xl border border-white/10 bg-[#04121e] shadow-xl">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <div>
          <h2 className="text-xl font-extrabold">Tu código</h2>
          <p className="text-sm text-white/60">Esto es lo que hay detrás de tu página</p>
        </div>
        <motion.span key={total.length} initial={{ scale: 1.25 }} animate={{ scale: 1 }} className="flama rounded-full px-3 py-1 text-base font-extrabold text-marino">
          {total.length} líneas
        </motion.span>
      </div>

      <div className="flex gap-1.5 px-3 pt-3">
        {(
          [
            ['bloque', BLOQUE_POR_TIPO[bloque?.t ?? '']?.icon ?? Box, bloque ? BLOQUE_POR_TIPO[bloque.t]?.name : 'Un bloque'],
            ['global', Palette, 'Estilos generales'],
          ] as [Vista, LucideIcon, string][]
        ).map(([v, Ico, texto]) => (
          <button
            key={v}
            onClick={() => setVista(v)}
            className={`flex-1 truncate rounded-xl px-3 py-2 text-base font-bold transition ${vista === v ? 'bg-white/15 text-amarillo' : 'text-white/70 hover:bg-white/10'}`}
          >
            <span className="flex items-center justify-center gap-2 truncate"><Ico size={18} className="shrink-0" />{texto}</span>
          </button>
        ))}
      </div>

      <p className="mx-3 mt-2 rounded-lg bg-amarillo/10 px-3 py-1.5 text-sm text-amarillo">
        <Pencil size={15} className="mr-1.5 inline -translate-y-px" />Los valores con <span className="underline decoration-dotted decoration-2 underline-offset-4">línea punteada</span> se pueden cambiar, y con la <X size={13} className="inline -translate-y-px" strokeWidth={3} /> borras una línea. ¡Pruébalo!
      </p>
      <div className="scroll-fino min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={vista === 'bloque' ? `b-${bloque?.id ?? 'ninguno'}` : 'g'}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            {vista === 'global' ? (
              <Seccion titulo="CSS" sub="Colores y letra de toda la página" lineas={k2l(global.css, 'css')} scope="global" edit={edit} />
            ) : !codigo ? (
              <div className="grid place-items-center gap-2 py-10 text-center text-lg text-white/80">
                <motion.div animate={{ x: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 1.6 }} className="text-5xl">
                  <MoveLeft size={52} />
                </motion.div>
                <p className="font-bold">Dale clic a un bloque de tu página</p>
                <p className="text-base text-white/60">y mira su código aquí</p>
              </div>
            ) : (
              <>
                <Seccion titulo="HTML" sub="Las piezas del bloque" lineas={k2l(codigo.html, 'html')} scope={`h-${bloque!.id}`} edit={edit} />
                <Seccion titulo="CSS" sub="Cómo se ve" lineas={k2l(codigo.css, 'css')} scope={`c-${bloque!.id}`} edit={edit} />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid gap-2 border-t border-white/10 p-3">
        {hayCambios && (
          <Boton variante="suave" className="w-full" onClick={() => restaurarCodigo(prefijo!)}>
            <Undo2 size={20} /> Deshacer mis cambios en el código
          </Boton>
        )}
        {onQuitar && bloque && (
          <Boton variante="borde" className="w-full !border-llama/60 !text-[#FF8A5C] hover:!bg-llama/20" onClick={() => onQuitar(bloque.id)}>
            <Trash2 size={20} /> Quitar este bloque
          </Boton>
        )}
        <Boton variante="suave" className="w-full" onClick={() => setTodo(true)}>
          <FileCode size={22} /> Ver todo el código
        </Boton>
      </div>

      <AnimatePresence>{todo && <TodoElCodigo lineas={total} onCerrar={() => setTodo(false)} edit={edit} />}</AnimatePresence>
    </div>
  );
}

function Seccion({ titulo, sub, lineas, scope, edit }: { titulo: string; sub: string; lineas: Linea[]; scope: string; edit?: Edicion }) {
  return (
    <section className="mb-4">
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-sm font-bold text-amarillo">{titulo}</span>
        <span className="text-sm text-white/60">{sub}</span>
      </div>
      <CodigoVista lineas={lineas} scope={scope} edit={edit} />
    </section>
  );
}

/** Página completa en HTML + CSS con el contador de líneas. */
export function TodoElCodigo({ lineas: filas, onCerrar, edit }: { lineas: LineaK[]; onCerrar: () => void; edit?: Edicion }) {
  const lineas = filas.map((l) => l.t);
  const langs = useMemo(() => lenguajes(lineas), [lineas.join('\n')]);
  const datos: Linea[] = filas.map((l, i) => ({ ...l, lang: langs[i] }));
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCerrar}
    >
      <motion.div
        initial={{ scale: 0.94, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 20 }}
        className="flex max-h-[calc(100dvh-3rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#04121e] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
          <div>
            <h2 className="text-2xl font-extrabold">Todo el código de tu página</h2>
            <p className="text-base text-white/70">
              Tu página tiene <b className="text-amarillo">{lineas.length} líneas de código</b>
            </p>
          </div>
          <Boton variante="suave" onClick={onCerrar}>
            Cerrar <X size={20} />
          </Boton>
        </div>
        <div className="scroll-fino min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <CodigoVista lineas={datos} scope="todo" edit={edit} />
        </div>
      </motion.div>
    </motion.div>
  );
}
