import { Fragment, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { tokenizar, type Lang } from './Highlight';
import { Valor, type Edicion } from './Valor';

export type Linea = { t: string; lang: Lang; k?: string };

type Estado = { scope: string; prev: string[]; ver: number[]; contador: number };
type Rango = { ruta: string; a: number; b: number };

/** Separa el texto real de las marcas de "valor editable" (ver lib/pagina.ts). */
function parsear(marcado: string): { plano: string; rangos: Rango[] } {
  const rangos: Rango[] = [];
  let plano = '';
  const re = /([^]*)([\s\S]*?)/g;
  let ult = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(marcado))) {
    plano += marcado.slice(ult, m.index);
    rangos.push({ ruta: m[1], a: plano.length, b: plano.length + m[2].length });
    plano += m[2];
    ult = m.index + m[0].length;
  }
  return { plano: plano + marcado.slice(ult), rangos };
}

function LineaCodigo({ texto, lang, edit, k: clave }: { texto: string; lang: Lang; edit?: Edicion; k?: string }) {
  if (texto === '') return <>{'​'}</>;
  const { plano, rangos } = parsear(texto);
  // En una propiedad de CSS, lo que no es un color con nombre (padding, tamaños...) se edita como valor completo de la línea
  const decl = lang === 'css' && clave && edit ? /^(\s*[\w-]+\s*:\s*)(.*?)(;?)$/.exec(plano) : null;
  if (decl) {
    const va = decl[1].length;
    const vb = va + decl[2].length;
    let desde = va;
    for (const r of [...rangos].sort((x, y) => x.a - y.a)) {
      if (r.a > desde) rangos.push({ ruta: `L|${clave}`, a: desde, b: Math.min(r.a, vb) });
      desde = Math.max(desde, r.b);
    }
    if (desde < vb) rangos.push({ ruta: `L|${clave}`, a: desde, b: vb });
  }
  const toks = tokenizar(plano, lang);
  const hechos = new Set<number>();
  const salida: ReactNode[] = [];
  let grupo: { i: number; hijos: ReactNode[]; muestra?: string } | null = null;
  let pos = 0;
  let k = 0;

  const tok = (t: string, c: string, sw?: string) => (
    <span key={k++} className={`tok ${c}`}>
      {sw && <span className="mr-1 inline-block h-3 w-3 translate-y-px rounded-sm border border-white/50 align-baseline" style={{ background: sw }} />}
      {t}
    </span>
  );
  const cerrar = () => {
    if (grupo) {
      const g = grupo;
      const hijos = (
        <>
          {g.muestra && <span className="mr-1 inline-block h-3 w-3 translate-y-px rounded-sm border border-white/50 align-baseline" style={{ background: g.muestra }} />}
          {g.hijos}
        </>
      );
      salida.push(edit ? <Valor key={k++} ruta={rangos[g.i].ruta} edit={edit} hijos={hijos} /> : <Fragment key={k++}>{hijos}</Fragment>);
    }
    grupo = null;
  };
  // Un valor vacío (el alumno borró el texto) se muestra como "…" para poder volver a escribirlo
  const vacios = (en: number) =>
    rangos.forEach((r, i) => {
      if (r.a === r.b && r.a === en && !hechos.has(i)) {
        hechos.add(i);
        cerrar();
        if (edit) salida.push(<Valor key={k++} ruta={r.ruta} edit={edit} hijos={<span className="tok text-white/40">…</span>} />);
      }
    });

  for (const t of toks) {
    let s = 0;
    while (s < t.t.length) {
      const abs = pos + s;
      vacios(abs);
      const i = rangos.findIndex((r) => r.a <= abs && abs < r.b);
      const limite = i >= 0 ? rangos[i].b : Math.min(...rangos.filter((r) => r.a > abs).map((r) => r.a), pos + t.t.length);
      const fin = Math.min(pos + t.t.length, limite) - pos;
      const trozo = t.t.slice(s, fin);
      const esColor = i >= 0 && rangos[i].ruta.startsWith('@c.');
      const sw = s === 0 && !esColor ? t.sw : undefined;
      if (i >= 0) {
        if (grupo && grupo.i !== i) cerrar();
        grupo ??= { i, hijos: [], muestra: esColor ? plano.slice(rangos[i].a, rangos[i].b) : undefined };
        grupo.hijos.push(tok(trozo, t.c, sw));
      } else {
        cerrar();
        salida.push(tok(trozo, t.c, sw));
      }
      s = fin;
    }
    pos += t.t.length;
  }
  cerrar();
  vacios(pos);
  return <>{salida}</>;
}

/**
 * Muestra líneas de código. Cuando una línea cambia (o aparece), se ilumina en amarillo y se desvanece.
 * La comparación ignora el orden: si solo se corrió una línea no se ilumina, pero una línea nueva o distinta sí.
 */
export function CodigoVista({ lineas, scope, numerar = true, edit }: { lineas: Linea[]; scope: string; numerar?: boolean; edit?: Edicion }) {
  const ref = useRef<Estado>({ scope: '', prev: [], ver: [], contador: 0 });
  const textos = lineas.map((l) => l.t);
  const r = ref.current;

  if (r.scope !== scope) {
    r.scope = scope;
    r.prev = textos;
    r.ver = textos.map(() => 0);
  } else if (r.prev.length !== textos.length || r.prev.some((t, i) => t !== textos[i])) {
    const bolsa = new Map<string, number>();
    r.prev.forEach((t) => bolsa.set(t, (bolsa.get(t) ?? 0) + 1));
    r.ver = textos.map((t) => {
      const n = bolsa.get(t) ?? 0;
      if (n > 0 && t.trim() !== '') {
        bolsa.set(t, n - 1);
        return 0;
      }
      return t.trim() === '' ? 0 : ++r.contador;
    });
    r.prev = textos;
  }

  const ancho = String(lineas.length).length;
  return (
    <div className="codigo">
      {lineas.map((l, i) => {
        const v = r.ver[i] ?? 0;
        return (
          <div key={`${i}-${v}`} className={`group flex rounded-sm ${v ? 'linea-nueva' : ''}`}>
            {numerar && (
              <span className="select-none pr-3 text-right text-[#5B6B84]" style={{ minWidth: `${ancho + 1}ch` }}>
                {i + 1}
              </span>
            )}
            <span className="min-w-0 flex-1 whitespace-pre-wrap break-words">
              <LineaCodigo texto={l.t} lang={l.lang} edit={edit} k={l.k} />
            </span>
            {edit && l.k && (
              <button
                onClick={() => edit.borrar(l.k!)}
                title="Borrar esta línea"
                aria-label="Borrar esta línea"
                className="ml-1 grid h-6 w-6 shrink-0 place-items-center self-start rounded-md text-white/30 transition hover:bg-llama hover:text-white focus-visible:text-white"
              >
                <X size={15} strokeWidth={3} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
