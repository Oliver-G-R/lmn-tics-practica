import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { defaultData, BLOQUE_POR_TIPO } from '../blocks';
import type { Doc } from '../lib/pagina';
import { aplicarValor, borrarLinea, restaurarCodigo } from '../lib/edicion';
import { GIROS } from '../lib/plantillas';
import { LIMITES } from '../lib/tipos';
import { uid } from '../lib/util';
import { sonar } from '../lib/sonido';

export type Pantalla = 'inicio' | 'f1' | 'f2' | 'f3' | 'f4';
export const ORDEN: Pantalla[] = ['inicio', 'f1', 'f2', 'f3', 'f4'];
export const DURACIONES = [60, 240, 240, 120]; // segundos por fase
export const NOMBRES_FASE = ['Tu negocio', 'Arma tu página', 'Hazla tuya', 'Lánzala'];

const CLAVE = 'taller-web-tic:v1';

type Guardado = { pantalla: Pantalla; modo: 'solo' | 'equipo'; equipo: string; doc: Doc | null; sel: string | null };

function cargar(): Guardado | null {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return null;
    const g = JSON.parse(raw) as Guardado;
    if (!ORDEN.includes(g.pantalla)) return null;
    if (g.pantalla !== 'inicio' && !g.doc && g.pantalla !== 'f1') return null;
    return g;
  } catch {
    return null;
  }
}

export const faseDe = (p: Pantalla) => ORDEN.indexOf(p) - 1; // inicio = -1

export function docDeGiro(g: number, nombre?: string): Doc {
  const gi = GIROS[g];
  return {
    g, n: nombre ?? gi.negocio, s: gi.slogan, e: gi.emoji, p: gi.paleta, f: gi.fuente,
    b: gi.bloques.map((t) => ({ id: uid(), t, d: defaultData(g, t) })),
  };
}

type Ctx = {
  pantalla: Pantalla;
  modo: 'solo' | 'equipo';
  equipo: string;
  doc: Doc | null;
  sel: string | null;
  restante: number;
  pausado: boolean;
  aviso: string | null;
  cartel: boolean;
  empezar: (modo: 'solo' | 'equipo', equipo: string) => void;
  elegirGiro: (g: number) => void;
  editar: (fn: (d: Doc) => Doc) => void;
  setCampo: <K extends 'n' | 's' | 'e' | 'p' | 'f'>(k: K, v: Doc[K]) => void;
  setDato: (id: string, fn: (d: Record<string, any>) => Record<string, any>) => void;
  editarValor: (ruta: string, raw: string) => void;
  borrarLinea: (clave: string) => void;
  restaurarCodigo: (prefijo?: string) => void;
  seleccionar: (id: string | null) => void;
  agregar: (tipo: string, indice?: number) => boolean;
  quitar: (id: string) => void;
  mover: (de: number, a: number) => void;
  irA: (p: Pantalla) => void;
  siguiente: () => void;
  sumarTiempo: (seg: number) => void;
  alternarPausa: () => void;
  nuevoEquipo: () => void;
  avisar: (msg: string) => void;
};

const Contexto = createContext<Ctx | null>(null);
export const useTaller = () => {
  const c = useContext(Contexto);
  if (!c) throw new Error('useTaller fuera del proveedor');
  return c;
};

export function Proveedor({ children }: { children: ReactNode }) {
  const inicial = useRef(cargar()).current;
  const [pantalla, setPantalla] = useState<Pantalla>(inicial?.pantalla ?? 'inicio');
  const [modo, setModo] = useState<'solo' | 'equipo'>(inicial?.modo ?? 'equipo');
  const [equipo, setEquipo] = useState(inicial?.equipo ?? '');
  const [doc, setDoc] = useState<Doc | null>(inicial?.doc ?? null);
  const [sel, setSel] = useState<string | null>(inicial?.sel ?? null);
  const [restante, setRestante] = useState(() => {
    const f = faseDe(inicial?.pantalla ?? 'inicio');
    return f >= 0 ? DURACIONES[f] : 0;
  });
  const [pausado, setPausado] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [cartel, setCartel] = useState(false); // cartel de fase en pantalla: el reloj espera
  const timerCartel = useRef<number | undefined>(undefined);
  const timerAviso = useRef<number | undefined>(undefined);

  // Guarda el progreso para que una recarga accidental no borre el trabajo
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify({ pantalla, modo, equipo, doc, sel } satisfies Guardado));
    } catch {
      /* sin almacenamiento: no pasa nada */
    }
  }, [pantalla, modo, equipo, doc, sel]);

  // Sonidos del reloj: tic en los últimos 5 segundos y alarma al llegar a cero
  const antes = useRef(restante);
  useEffect(() => {
    if (pantalla !== 'inicio' && !pausado) {
      if (antes.current > 0 && restante === 0) sonar('alarma');
      else if (restante > 0 && restante <= 5 && restante < antes.current) sonar('tic');
    }
    antes.current = restante;
  }, [restante, pantalla, pausado]);

  // Reloj suave: nunca bloquea, solo avisa
  useEffect(() => {
    if (pantalla === 'inicio' || pausado || cartel) return;
    const t = setInterval(() => setRestante((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [pantalla, pausado, cartel]);

  const avisar = useCallback((msg: string) => {
    sonar('error');
    setAviso(msg);
    window.clearTimeout(timerAviso.current);
    timerAviso.current = window.setTimeout(() => setAviso(null), 2800);
  }, []);

  const irA = useCallback((p: Pantalla) => {
    sonar('whoosh');
    if (faseDe(p) >= 0) {
      setCartel(true);
      window.clearTimeout(timerCartel.current);
      timerCartel.current = window.setTimeout(() => setCartel(false), 1150);
    }
    setPantalla(p);
    const f = faseDe(p);
    setRestante(f >= 0 ? DURACIONES[f] : 0);
    setPausado(false);
  }, []);

  const siguiente = useCallback(() => {
    const i = ORDEN.indexOf(pantalla);
    if (i < ORDEN.length - 1) irA(ORDEN[i + 1]);
  }, [pantalla, irA]);

  const empezar = useCallback((m: 'solo' | 'equipo', nombre: string) => {
    setModo(m);
    setEquipo(nombre.trim());
    irA('f1');
  }, [irA]);

  const elegirGiro = useCallback((g: number) => {
    setDoc((d) => {
      // Si ya escribieron su propio nombre, se conserva al cambiar de giro
      const propio = d && d.n.trim() && d.n !== GIROS[d.g].negocio ? d.n : undefined;
      return docDeGiro(g, propio);
    });
    setSel(null);
    sonar('pop');
  }, []);

  const editar = useCallback((fn: (d: Doc) => Doc) => setDoc((d) => (d ? fn(d) : d)), []);
  const setCampo: Ctx['setCampo'] = useCallback((k, v) => setDoc((d) => (d ? { ...d, [k]: v } : d)), []);
  const setDato: Ctx['setDato'] = useCallback(
    (id, fn) => setDoc((d) => (d ? { ...d, b: d.b.map((b) => (b.id === id ? { ...b, d: fn(b.d) } : b)) } : d)),
    [],
  );

  const agregar = useCallback((tipo: string, indice?: number) => {
    if (!doc) return false;
    if (doc.b.length >= LIMITES.bloques) {
      avisar('Máximo 8 bloques. Quita uno para poner otro.');
      return false;
    }
    if (doc.b.some((b) => b.t === tipo)) {
      avisar('Ese bloque ya está en tu página.');
      return false;
    }
    const def = BLOQUE_POR_TIPO[tipo];
    if (!def) return false;
    const nuevo = { id: uid(), t: tipo, d: defaultData(doc.g, tipo) };
    setDoc((d) => {
      if (!d) return d;
      const b = [...d.b];
      b.splice(indice ?? b.length, 0, nuevo);
      return { ...d, b };
    });
    setSel(nuevo.id);
    sonar('pop');
    return true;
  }, [doc, avisar]);

  const quitar = useCallback((id: string) => {
    sonar('quitar');
    setDoc((d) => (d ? { ...d, b: d.b.filter((b) => b.id !== id) } : d));
    setSel((s) => (s === id ? null : s));
  }, []);

  const mover = useCallback((de: number, a: number) => {
    sonar('pop');
    setDoc((d) => {
      if (!d || de === a) return d;
      const b = [...d.b];
      const [x] = b.splice(de, 1);
      b.splice(a, 0, x);
      return { ...d, b };
    });
  }, []);

  const nuevoEquipo = useCallback(() => {
    try {
      localStorage.removeItem(CLAVE);
    } catch {
      /* nada */
    }
    setDoc(null);
    setSel(null);
    setEquipo('');
    setModo('equipo');
    setPantalla('inicio');
    setRestante(0);
    setPausado(false);
  }, []);

  const valor: Ctx = {
    pantalla, modo, equipo, doc, sel, restante, pausado, aviso, cartel,
    empezar, elegirGiro, editar, editarValor: (ruta, raw) => (sonar('tic'), setDoc((d) => (d ? aplicarValor(d, ruta, raw) : d))),
    borrarLinea: (k) => (sonar('quitar'), setDoc((d) => (d ? borrarLinea(d, k) : d))),
    restaurarCodigo: (p) => setDoc((d) => (d ? restaurarCodigo(d, p) : d)), setCampo, setDato, seleccionar: setSel, agregar, quitar, mover,
    irA, siguiente, sumarTiempo: (s) => setRestante((r) => r + s), alternarPausa: () => setPausado((p) => !p),
    nuevoEquipo, avisar,
  };
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
