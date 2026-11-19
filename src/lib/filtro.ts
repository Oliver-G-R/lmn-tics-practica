// Filtro de palabras: son menores de edad en un evento público.

// Mapa de números/símbolos a letras (4→a, 3→e, 1→i, 0→o, 5→s) más algunos extras comunes.
const MAPA: Record<string, string> = { '4': 'a', '3': 'e', '1': 'i', '0': 'o', '5': 's', '7': 't', '@': 'a', '$': 's' };

const colapsar = (s: string) => s.replace(/(.)\1+/g, '$1'); // "puuuta" -> "puta"

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[0-9@$]/g, (c) => MAPA[c] ?? c);
}

// Groserías y palabras fuertes comunes en español de México (y un poco de inglés).
const LISTA = [
  'puta', 'puto', 'putas', 'putos', 'putita', 'putito', 'putisima', 'putazo', 'putamadre',
  'pendejo', 'pendeja', 'pendejos', 'pendejas', 'pendejada', 'pendejadas',
  'cabron', 'cabrona', 'cabrones', 'cabronas', 'cabronazo',
  'chinga', 'chingar', 'chingas', 'chingue', 'chingado', 'chingada', 'chingados', 'chingadas', 'chingadera', 'chingaderas', 'chingon', 'chingona', 'chingones', 'chingonas', 'chingatumadre',
  'verga', 'vergas', 'vergon', 'vergota', 'vergazo',
  'pinche', 'pinches',
  'mierda', 'mierdas', 'mierdero',
  'culo', 'culos', 'culero', 'culera', 'culeros', 'culeras',
  'cagar', 'cagada', 'cagado', 'cagon',
  'maricon', 'maricones', 'marica', 'joto', 'jotos', 'puñeta', 'puneta', 'punetas', 'puñetero',
  'mamada', 'mamadas', 'mamon', 'mamona', 'mamones', 'mamar',
  'huevon', 'huevona', 'zorra', 'zorras', 'ramera', 'prostituta', 'prostituto',
  'coger', 'cogiendo', 'cogida', 'cogidas', 'cogete',
  'imbecil', 'imbeciles', 'idiota', 'idiotas', 'estupido', 'estupida', 'estupidos', 'retrasado', 'retrasada', 'mongolo',
  'pene', 'penes', 'vagina', 'vaginas', 'tetas', 'nalgas', 'porno', 'porn', 'pornografia', 'xxx', 'sexo', 'sexual',
  'cocaina', 'marihuana', 'heroina', 'metanfetamina',
  'hdp', 'hijueputa', 'hijoputa', 'ptm', 'ctm', 'csm', 'vrg', 'hpt',
  'fuck', 'fucking', 'fucker', 'shit', 'bitch', 'dick', 'pussy', 'asshole', 'bastard', 'cunt',
];

const SET = new Set(LISTA.map((w) => colapsar(normalizar(w))));

// Raíces largas y sin ambigüedad que también se buscan "pegadas" (p. ej. "pen dejo").
const RAICES = ['pendej', 'chingad', 'mierda', 'cabron'].map((w) => colapsar(normalizar(w)));

export const MSG_PALABRA = 'Esa palabra no va en una página de negocio';
export const MSG_PERSONAL = 'No pongas tu teléfono, dirección ni datos personales';
export const PISTA_PERSONAL = 'No pongas tu teléfono, dirección ni datos personales';

export function tieneGroseria(texto: string): boolean {
  if (!texto) return false;
  const norm = normalizar(texto);
  let tokens = norm.split(/[^a-zñ]+/).filter(Boolean);

  // Une letras sueltas: "p u t a" -> "puta" (solo si son 3 o más seguidas)
  const unidos: string[] = [];
  let racha = '';
  const cerrar = () => {
    if (racha.length >= 3) unidos.push(racha);
    racha = '';
  };
  for (const t of tokens) {
    if (t.length === 1) racha += t;
    else cerrar();
  }
  cerrar();
  tokens = [...tokens, ...unidos];

  if (tokens.some((t) => SET.has(colapsar(t)))) return true;

  const pegado = colapsar(norm.replace(/[^a-z]/g, ''));
  return RAICES.some((r) => pegado.includes(r));
}

/** Teléfonos, correos y otros datos personales. */
export function tieneDatoPersonal(texto: string): boolean {
  if (/(\d[\s.\-()]*){8,}/.test(texto)) return true; // 8 o más dígitos seguidos
  if (/\S+@\S+\.\S+/.test(texto)) return true; // correo
  if (/https?:\/\/|www\./i.test(texto)) return true; // links
  return false;
}

/** Devuelve el mensaje de error para un texto, o null si está bien. */
export function validarTexto(texto: string): string | null {
  if (tieneGroseria(texto)) return MSG_PALABRA;
  if (tieneDatoPersonal(texto)) return MSG_PERSONAL;
  return null;
}

/** Busca el primer texto con problema dentro de cualquier valor (recorre objetos y listas). */
export function primerProblema(valor: unknown): string | null {
  if (typeof valor === 'string') return validarTexto(valor);
  if (Array.isArray(valor)) {
    for (const v of valor) {
      const r = primerProblema(v);
      if (r) return r;
    }
  } else if (valor && typeof valor === 'object') {
    for (const v of Object.values(valor)) {
      const r = primerProblema(v);
      if (r) return r;
    }
  }
  return null;
}
