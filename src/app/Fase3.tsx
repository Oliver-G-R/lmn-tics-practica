import { CodePanel } from '../code/CodePanel';
import { Celular } from './Celular';
import { ContextoDnd } from './Dnd';
import { Lienzo } from './Pagina';
import { Personaliza } from './Personaliza';
import { useTaller } from './store';

/** Fase 3: personalizan y ven cómo cambia la línea de código correspondiente. */
export function Fase3() {
  const { doc, sel, seleccionar } = useTaller();
  if (!doc) return null;
  return (
    <ContextoDnd>
      <div className="grid h-full min-h-0 grid-cols-[350px_1fr_450px] gap-5 p-4">
        <Personaliza />
        <div className="min-h-0">
          <Celular>
            <Lienzo doc={doc} sel={sel} onSel={seleccionar} arrastrable={false} />
          </Celular>
        </div>
        <CodePanel doc={doc} sel={sel} />
      </div>
    </ContextoDnd>
  );
}
