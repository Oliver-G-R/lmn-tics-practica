import { Blocks, FileCode, Palette, Rocket, RotateCcw, Scissors, Smartphone, Target, TriangleAlert, type LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/logo_lmn.png';
import { armarEnlace, configADoc } from '../lib/codec';
import { primerProblema } from '../lib/filtro';
import { contarLineas, fullCodeK } from '../lib/pagina';
import { TodoElCodigo } from '../code/CodePanel';
import { Celular } from './Celular';
import { Confeti } from './Confeti';
import { PaginaEstatica } from './Pagina';
import { QR } from './QR';
import { Boton } from './ui';
import { sonar } from '../lib/sonido';
import { useTaller } from './store';

const FRASES: [LucideIcon, string, string, string][] = [
  [Target, 'Elegiste tu negocio', 'definiste el proyecto', 'Todo proyecto empieza con una idea.'],
  [Blocks, 'Armaste bloques', 'estructura HTML', 'El HTML es el esqueleto de la página.'],
  [Palette, 'Personalizaste', 'estilos CSS', 'El CSS le da color y estilo.'],
];

/** Fase 4: lanzar (cuenta regresiva + confeti), página completa y QR. */
export function Fase4() {
  const { doc, irA, nuevoEquipo, equipo } = useTaller();
  const [paso, setPaso] = useState<'listo' | 'cuenta' | 'lanzada'>('listo');
  const [cuenta, setCuenta] = useState(3);
  const [verTodo, setVerTodo] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  const problema = useMemo(() => (doc ? primerProblema([doc.n, doc.s, doc.b.map((b) => b.d)]) : null), [doc]);
  const enlace = useMemo(() => (doc ? armarEnlace(doc) : null), [doc]);
  // La página que de verdad se abre en el celular (la del link del QR, ya con cualquier recorte)
  const final = useMemo(() => (enlace ? configADoc(enlace.cfg) : null), [enlace]);
  if (!doc || !enlace || !final) return null;
  const lineas = contarLineas(final);
  const lanzada = paso === 'lanzada';

  function lanzar() {
    setPaso('cuenta');
    setCuenta(3);
    sonar('cuenta');
    let n = 3;
    const t = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        clearInterval(t);
        setPaso('lanzada');
        sonar('exito');
      } else {
        setCuenta(n);
        sonar('cuenta');
      }
    }, 1000);
  }

  return (
    <div className="relative h-full">
      {/* Cuenta regresiva a pantalla completa */}
      <AnimatePresence>
        {paso === 'cuenta' && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-marino" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={cuenta}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="texto-flama text-[22rem] font-extrabold leading-none"
              >
                {cuenta}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      {lanzada && <Confeti />}

      <div className={`grid h-full min-h-0 gap-8 p-5 ${lanzada ? 'grid-cols-[auto_1fr_1fr]' : 'grid-cols-[1fr_440px]'}`}>
        <motion.div className="min-h-0" key={lanzada ? 'l' : 'p'} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 18 }}>
          <Celular ancho={lanzada ? 340 : 330}>
            <PaginaEstatica doc={lanzada ? final : doc} />
          </Celular>
        </motion.div>

        {!lanzada ? (
          <div className="flex min-h-0 flex-col justify-center gap-4">
            <div className="grid gap-4 text-center">
              <div>
                <h1 className="text-4xl font-extrabold">¿Lista tu página?</h1>
                <p className="mt-2 text-xl text-white/75">Cuando la lances aparecerá un QR para verla en tu celular.</p>
              </div>
              {problema && (
                <div className="rounded-2xl border-2 border-llama bg-llama/15 p-4 text-left">
                  <p className="text-lg font-bold text-[#FF8A5C]">
                    <TriangleAlert size={20} className="mr-1.5 inline -translate-y-px" />
                    {problema}
                  </p>
                  <p className="mt-1 text-base text-white/80">Corrige tus textos para poder lanzar.</p>
                  <Boton variante="borde" className="mt-3" onClick={() => irA('f3')}>
                    ← Volver a Hazla tuya
                  </Boton>
                </div>
              )}
              <Boton grande disabled={!!problema || paso === 'cuenta'} onClick={lanzar}>
                <Rocket size={30} /> Lanzar mi página
              </Boton>
              <button onClick={() => irA('f3')} className="text-base font-semibold text-white/60 underline hover:text-white">
                Quiero cambiar algo
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Columna 1: el QR */}
            <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex min-h-0 flex-col items-center justify-center gap-5 text-center">
              <div className="flex items-center gap-3">
                <img src={logo} alt="" className="h-12 w-12 rounded-xl" />
                <div className="text-left leading-tight">
                  <div className="text-2xl font-extrabold">¡Lo lograste{equipo ? `, ${equipo}` : ''}!</div>
                  <div className="text-base text-white/65">Liceo Metropolitano del Norte · TIC</div>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1, boxShadow: ['0 0 0 0 rgba(254,196,0,0.6)', '0 0 0 24px rgba(254,196,0,0)'] }}
                transition={{ scale: { type: 'spring', stiffness: 180, damping: 14 }, boxShadow: { repeat: Infinity, duration: 1.8 } }}
                className="w-full max-w-[270px] rounded-3xl bg-white p-2.5 shadow-2xl shadow-black/40"
              >
                <QR texto={enlace.url} />
              </motion.div>
              <p className="-mt-2 font-mono text-base text-white/55" title={enlace.url.split('#')[0]}>
                {new URL(enlace.url).host}
              </p>

              <p className="flex items-center gap-2 text-2xl font-extrabold">
                <Smartphone size={28} className="text-amarillo" />
                Escanéalo con tu celular
              </p>

              {enlace.recortado && (
                <p className="max-w-[300px] rounded-xl bg-amarillo/15 px-3 py-2 text-base text-amarillo">
                  <Scissors size={18} className="mr-1.5 inline -translate-y-px" />
                  Acortamos algunos textos para que el QR se lea bien.
                </p>
              )}
            </motion.section>

            {/* Columna 2: lo que aprendieron */}
            <motion.section initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="flex min-h-0 flex-col justify-center gap-5">
              <div className="rounded-3xl border border-amarillo/30 bg-gradient-to-br from-marino-2 to-marino-3 px-6 py-5 text-center shadow-xl">
                <p className="text-lg text-white/75">Tu página tiene</p>
                <motion.p initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 12 }} className="texto-flama text-7xl font-extrabold leading-none tabular-nums">
                  {lineas}
                </motion.p>
                <p className="mt-1 text-lg font-bold">líneas de código</p>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-extrabold uppercase tracking-[0.2em] text-white/55">Lo que descubriste</h2>
                <ul className="grid gap-3">
                  {FRASES.map(([Ico, a, b, c], i) => (
                    <motion.li key={a} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.25 }} className="flex items-center gap-4 rounded-2xl bg-marino-2 px-4 py-3.5 ring-1 ring-white/10">
                      <span className="flama grid h-12 w-12 shrink-0 place-items-center rounded-xl text-marino">
                        <Ico size={26} strokeWidth={2.4} />
                      </span>
                      <span className="min-w-0 leading-snug">
                        <span className="block text-xl font-extrabold">
                          {a} <span className="font-bold text-amarillo">= {b}</span>
                        </span>
                        <span className="block text-base text-white/60">{c}</span>
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <Boton variante="suave" className="flex-1" onClick={() => setVerTodo(true)}>
                  <FileCode size={22} /> Ver código
                </Boton>
                <Boton variante={confirmar ? 'flama' : 'borde'} className="flex-1" onClick={() => (confirmar ? nuevoEquipo() : (setConfirmar(true), setTimeout(() => setConfirmar(false), 3000)))}>
                  <RotateCcw size={20} />
                  {confirmar ? '¿Seguro? Toca otra vez' : 'Nuevo equipo'}
                </Boton>
              </div>
            </motion.section>
          </>
        )}
      </div>
      <AnimatePresence>{verTodo && <TodoElCodigo lineas={fullCodeK(final)} onCerrar={() => setVerTodo(false)} />}</AnimatePresence>
    </div>
  );
}
