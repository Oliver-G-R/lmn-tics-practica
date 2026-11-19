import { CodePanel } from '../code/CodePanel';
import { Celular } from './Celular';
import { Catalogo, ContextoDnd } from './Dnd';
import { Lienzo } from './Pagina';
import { useTaller } from './store';

/** Fase 2: catálogo de bloques, página en vivo y panel de código. */
export function Fase2() {
  const { doc, sel, seleccionar, quitar } = useTaller();
  if (!doc) return null;
  return (
    <ContextoDnd>
      <div className="grid h-full min-h-0 grid-cols-[250px_1fr_450px] gap-5 p-4">
        <Catalogo />
        <div className="min-h-0">
          <Celular>
            <Lienzo doc={doc} sel={sel} onSel={seleccionar} onQuitar={quitar} arrastrable />
          </Celular>
        </div>
        <CodePanel doc={doc} sel={sel} onQuitar={quitar} />
      </div>
    </ContextoDnd>
  );
}
