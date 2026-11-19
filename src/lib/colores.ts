// Colores de CSS que se pueden escribir en el código: nombres (red, tomato...), hex, rgb() y hsl().
const NOMBRES = new Set(
  (
    'aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan ' +
    'darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet ' +
    'deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki ' +
    'lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow ' +
    'lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin ' +
    'navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue ' +
    'saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato transparent turquoise violet wheat white whitesmoke yellow yellowgreen'
  ).split(' '),
);

const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FUNC = /^(rgb|rgba|hsl|hsla)\(\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?\s*[,\s]\s*[\d.]+(deg|%)?\s*([,/]\s*[\d.]+%?\s*)?\)$/i;

/** ¿Es un color de CSS válido y seguro? */
export function esColorCss(v: string): boolean {
  const t = v.trim();
  return t.length <= 40 && (HEX.test(t) || NOMBRES.has(t.toLowerCase()) || FUNC.test(t));
}

/** Como se guarda: sin espacios; los hex de 6 en mayúsculas ("ff8800" también vale). */
export function normalizarColor(v: string): string {
  const t = v.trim();
  if (/^[0-9a-f]{6}$/i.test(t)) return '#' + t.toUpperCase();
  if (/^#[0-9a-f]{6}$/i.test(t)) return t.toUpperCase();
  return t;
}

export const MSG_COLOR = 'Escribe un color: red, tomato, #FF8800 o rgb(255, 0, 0)';
