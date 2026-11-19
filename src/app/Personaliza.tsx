import { MousePointerClick, Palette, Tag, Type, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { BLOQUE_POR_TIPO } from '../blocks';
import { FUENTES, PALETAS } from '../lib/paletas';
import { GIROS } from '../lib/plantillas';
import { LIMITES } from '../lib/tipos';
import { Campo } from './Campos';
import { Formulario } from './Formulario';
import { PISTA_PERSONAL } from '../lib/filtro';
import { useTaller } from './store';

function T({ i: I, children }: { i: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <I size={20} className="text-amarillo" />
      {children}
    </span>
  );
}

let _n = 0;
function Seccion({ titulo, children }: { titulo: React.ReactNode; children: React.ReactNode }) {
  const orden = useRef(_n++ % 4).current;
  return (
    <motion.section initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: orden * 0.07, type: 'spring', stiffness: 260, damping: 24 }} className="rounded-2xl bg-marino-2 p-3.5">
      <h3 className="mb-2.5 text-lg font-extrabold">{titulo}</h3>
      {children}
    </motion.section>
  );
}

/** Controles de la fase 3: nombre, slogan, logo, color, letra y los textos del bloque elegido. */
export function Personaliza() {
  const { doc, sel, setCampo, setDato, seleccionar, editar } = useTaller();
  if (!doc) return null;
  const gi = GIROS[doc.g];
  const hero = doc.b.find((b) => b.t === 'hero');
  const alHero = () => hero && seleccionar(hero.id);
  const bloque = doc.b.find((b) => b.id === sel) ?? null;
  const def = bloque ? BLOQUE_POR_TIPO[bloque.t] : null;

  return (
    <div className="scroll-fino flex h-full flex-col gap-3 overflow-y-auto pr-1">
      <Seccion titulo={<T i={Tag}>Tu negocio</T>}>
        <div className="grid gap-2.5">
          <Campo etiqueta="Nombre" valor={doc.n} max={LIMITES.nombre} onFocus={alHero} onChange={(v) => setCampo('n', v)} hint={PISTA_PERSONAL} />
          <Campo etiqueta="Slogan" valor={doc.s} max={LIMITES.slogan} onFocus={alHero} onChange={(v) => setCampo('s', v)} />
          <div>
            <div className="mb-1 text-base font-bold">Logo</div>
            <div className="grid grid-cols-6 gap-1.5">
              {gi.emojis.map((e) => (
                <button
                  key={e}
                  onClick={() => {
                    alHero();
                    setCampo('e', e);
                  }}
                  aria-label={`Logo ${e}`}
                  className={`rounded-lg border-2 py-0.5 text-2xl transition hover:scale-110 ${doc.e === e ? 'border-amarillo bg-amarillo/25' : 'border-transparent bg-white/5'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Seccion>

      <Seccion titulo={<T i={Palette}>Color</T>}>
        <div className="grid grid-cols-3 gap-2">
          {PALETAS.map((p, i) => (
            <motion.button
              key={p.nombre}
              whileTap={{ scale: 0.94 }}
              onClick={() => editar((d) => ({ ...d, p: i, c: undefined }))}
              aria-label={`Paleta ${p.nombre}`}
              className={`overflow-hidden rounded-xl border-[3px] text-left ${doc.p === i ? 'border-amarillo' : 'border-transparent'}`}
            >
              <div className="flex h-9">
                <span className="flex-1" style={{ background: p.bg }} />
                <span className="flex-1" style={{ background: p.surface }} />
                <span className="flex-1" style={{ background: p.accent }} />
              </div>
              <div className="bg-black/30 px-2 py-0.5 text-sm font-bold">{p.nombre}</div>
            </motion.button>
          ))}
        </div>
      </Seccion>

      <Seccion titulo={<T i={Type}>Letra</T>}>
        <div className="grid grid-cols-3 gap-2">
          {FUENTES.map((f, i) => (
            <button
              key={f.nombre}
              onClick={() => setCampo('f', i)}
              className={`rounded-xl border-[3px] bg-white/5 py-2 text-center ${doc.f === i ? 'border-amarillo' : 'border-transparent'}`}
            >
              <div className="text-3xl leading-none" style={{ fontFamily: f.css }}>
                Aa
              </div>
              <div className="text-sm font-bold">{f.nombre}</div>
            </button>
          ))}
        </div>
      </Seccion>

      <Seccion titulo={def ? <T i={def.icon}>{def.name}</T> : <T i={MousePointerClick}>Elige un bloque</T>}>
        {bloque && def ? (
          <Formulario key={bloque.id} campos={def.fields} datos={bloque.d} emojis={gi.emojis} onCambio={(fn) => setDato(bloque.id, fn)} />
        ) : (
          <p className="text-base text-white/70">Dale clic a un bloque de tu página para cambiar sus textos.</p>
        )}
      </Seccion>
    </div>
  );
}
