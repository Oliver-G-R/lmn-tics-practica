export type Lang = 'html' | 'css';
/** Un pedazo de código con su color. `sw` = color de muestra (para los #hex). */
export type Tok = { t: string; c: string; sw?: string };

const C = {
  tag: 'text-[#7AA2F7]',
  attr: 'text-[#E0AF68]',
  str: 'text-[#9ECE6A]',
  com: 'text-[#8896AD] italic',
  txt: 'text-[#E8EEF6]',
  sel: 'text-[#BB9AF7]',
  prop: 'text-[#7DCFFF]',
  val: 'text-[#FF9E64]',
  pun: 'text-[#9AA7BD]',
};

function html(linea: string): Tok[] {
  const re = /(<!--.*?-->)|(<\/?[A-Za-z!][\w-]*)|("[^"]*")|(\/?>)|(=)|([^<>"=\s]+|\s+)/g;
  const out: Tok[] = [];
  let dentro = false;
  let m: RegExpExecArray | null;
  while ((m = re.exec(linea))) {
    if (m[1]) out.push({ t: m[1], c: C.com });
    else if (m[2]) {
      dentro = true;
      out.push({ t: m[2], c: C.tag });
    } else if (m[3]) out.push({ t: m[3], c: dentro ? C.str : C.txt });
    else if (m[4]) {
      dentro = false;
      out.push({ t: m[4], c: C.tag });
    } else if (m[5]) out.push({ t: m[5], c: dentro ? C.pun : C.txt });
    else out.push({ t: m[6], c: dentro && m[6].trim() ? C.attr : C.txt });
  }
  return out;
}

function valorCss(v: string): Tok[] {
  return v
    .split(/(#[0-9A-Fa-f]{3,8}\b)/)
    .filter((x) => x !== '')
    .map((t) => (/^#[0-9A-Fa-f]{3,8}$/.test(t) ? { t, c: C.val, sw: t } : { t, c: C.val }));
}

function css(linea: string): Tok[] {
  if (/^\s*\/\*.*\*\/\s*$/.test(linea)) return [{ t: linea, c: C.com }];
  if (/\{\s*$/.test(linea)) return [{ t: linea.replace(/\{\s*$/, ''), c: C.sel }, { t: '{', c: C.pun }];
  if (/^\s*\}\s*$/.test(linea)) return [{ t: linea, c: C.pun }];
  const m = /^(\s*)([\w-]+)(\s*:\s*)(.*?)(;?)$/.exec(linea);
  if (m) {
    return [
      { t: m[1], c: C.txt },
      { t: m[2], c: C.prop },
      { t: m[3], c: C.pun },
      ...valorCss(m[4]),
      { t: m[5], c: C.pun },
    ].filter((x) => x.t !== '');
  }
  return [{ t: linea, c: C.txt }];
}

export const tokenizar = (linea: string, lang: Lang): Tok[] => (lang === 'css' ? css(linea) : html(linea));

/** En el código completo, las líneas entre <style> y </style> son CSS; el resto es HTML. */
export function lenguajes(lineas: string[]): Lang[] {
  let enCss = false;
  return lineas.map((l) => {
    const t = l.trim();
    if (t === '<style>') {
      enCss = true;
      return 'html';
    }
    if (t === '</style>') {
      enCss = false;
      return 'html';
    }
    return enCss ? 'css' : 'html';
  });
}
