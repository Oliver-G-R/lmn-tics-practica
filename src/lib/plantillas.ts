// Plantillas por giro: nunca empiezan en blanco.
import type { Data } from '../blocks/spec';

export type Giro = {
  id: string;
  nombre: string;
  emoji: string;
  desc: string;
  negocio: string; // nombre de ejemplo
  slogan: string;
  paleta: number;
  fuente: number;
  bloques: string[]; // bloques con los que arranca
  emojis: string[]; // ~30 emojis curados (logo y galería)
  data: Record<string, Data>; // datos de ejemplo por tipo de bloque
};

const E = (s: string) => s.split(' ');

export const GIROS: Giro[] = [
  {
    id: 'cafe', nombre: 'Cafetería', emoji: '☕', desc: 'Café, pan y buena plática',
    negocio: 'Café Aroma', slogan: 'El mejor café de la colonia', paleta: 0, fuente: 2,
    bloques: ['hero', 'menu', 'about', 'hrs'],
    emojis: E('☕ 🥐 🍰 🧁 🍪 🥤 🍩 🥞 🧇 🍵 🫖 🥛 🍫 🍯 🥯 🍞 🥗 🥪 🍳 🍓 🍋 🍒 🌿 🌱 🪴 🌻 ❤️ ⭐ ✨ 🏡'),
    data: {
      hero: { b: 'Ver el menú' },
      menu: { h: 'Nuestro menú', i: [['Capuchino', '45'], ['Café de olla', '35'], ['Croissant', '30'], ['Pastel de zanahoria', '50']] },
      gal: { h: 'Lo que preparamos', i: ['☕', '🥐', '🍰', '🍪', '🍩', '🥞'] },
      about: { h: 'Sobre nosotros', x: 'Somos un cafecito de barrio donde todos son bienvenidos. Todo se prepara fresquecito cada día.' },
      hrs: { h: 'Horario', i: [['Lunes a viernes', '7:00 - 20:00'], ['Sábado y domingo', '8:00 - 15:00']] },
      loc: { h: 'Ubicación', x: 'Calle Imaginaria 123, Ciudad Futuro' },
      cta: { x: '¿Quieres pedir para llevar?', b: 'Escríbenos por WhatsApp' },
      rev: { h: 'Lo que dicen de nosotros', i: [['Ana', 'El mejor capuchino que he probado.', 5], ['Luis', 'Ambiente padrísimo para estudiar.', 5], ['Sofi', 'Los pasteles están deliciosos.', 4]] },
      soc: { h: 'Síguenos', x: '@cafearoma' },
      promo: { x: '2x1 en capuchinos', y: 'Solo este fin de semana' },
    },
  },
  {
    id: 'biblio', nombre: 'Biblioteca y café', emoji: '📚', desc: 'Lee, toma café y relájate',
    negocio: 'Café-Libre', slogan: 'Lee, sirve y comparte', paleta: 3, fuente: 1,
    bloques: ['hero', 'about', 'menu', 'hrs'],
    emojis: E('📚 📖 ☕ 🔖 ✏️ 🖋️ 📝 🧠 💡 🎓 🕯️ 🪑 🛋️ 🧣 🍵 🍪 🥐 🌙 🌧️ 🍂 🦉 🐈 🪴 🎧 🔍 📕 📗 📘 📙 ✨'),
    data: {
      hero: { b: 'Entra a leer' },
      menu: { h: 'Café y snacks', i: [['Café americano', '35'], ['Chocolate caliente', '40'], ['Galleta de avena', '20'], ['Té chai', '38']] },
      gal: { h: 'Nuestro rincón', i: ['📚', '☕', '🪑', '🕯️', '🦉', '🪴'] },
      about: { h: 'Nuestra historia', x: 'Un espacio tranquilo con libros para todos. Toma uno, siéntate y disfruta tu café.' },
      hrs: { h: 'Horario', i: [['Lunes a sábado', '9:00 - 21:00'], ['Domingo', '10:00 - 16:00']] },
      loc: { h: 'Ubicación', x: 'Avenida Lectura 42, Villa Cuento' },
      cta: { x: '¿Quieres apartar una mesa?', b: 'Escríbenos por WhatsApp' },
      rev: { h: 'Opiniones', i: [['Dani', 'Mi lugar favorito para estudiar.', 5], ['Marco', 'Café rico y libros geniales.', 5], ['Vale', 'Súper tranquilo y acogedor.', 4]] },
      soc: { h: 'Síguenos', x: '@cafelibre' },
      promo: { x: 'Libro + café por $60', y: 'De lunes a jueves' },
    },
  },
  {
    id: 'ropa', nombre: 'Tienda de ropa', emoji: '👕', desc: 'Streetwear con estilo',
    negocio: 'Street Zone', slogan: 'Viste tu estilo', paleta: 5, fuente: 0,
    bloques: ['hero', 'menu', 'gal', 'promo'],
    emojis: E('👕 👖 🧢 👟 🧥 🕶️ 🎒 👜 🧦 🧤 🧣 👒 💎 🔥 ⚡ 🛹 🎧 🎨 🖤 💜 ⭐ 💯 🚀 🌆 🏙️ 🎤 📸 👑 😎 ✨'),
    data: {
      hero: { b: 'Ver la colección' },
      menu: { h: 'Lo más nuevo', i: [['Playera oversize', '299'], ['Gorra snapback', '199'], ['Sudadera urbana', '549'], ['Tenis blancos', '899']] },
      gal: { h: 'Colección', i: ['👕', '🧢', '👟', '🧥', '🕶️', '🎒'] },
      about: { h: 'Quiénes somos', x: 'Ropa para quienes marcan su propio camino. Diseños únicos, edición limitada.' },
      hrs: { h: 'Horario', i: [['Lunes a sábado', '11:00 - 20:00'], ['Domingo', '12:00 - 18:00']] },
      loc: { h: 'Ubicación', x: 'Plaza Skate, local 7, Ciudad Futuro' },
      cta: { x: '¿Buscas tu talla?', b: 'Escríbenos por WhatsApp' },
      rev: { h: 'Opiniones', i: [['Kevin', 'La calidad está increíble.', 5], ['Ari', 'Encontré mi sudadera favorita.', 5], ['Mau', 'Envío rapidísimo.', 4]] },
      soc: { h: 'Síguenos', x: '@streetzone' },
      promo: { x: '2da prenda al 50%', y: 'Solo esta semana' },
    },
  },
  {
    id: 'barberia', nombre: 'Barbería', emoji: '✂️', desc: 'Cortes y estilo',
    negocio: 'Barbería El Corte', slogan: 'Estilo que se nota', paleta: 1, fuente: 0,
    bloques: ['hero', 'menu', 'hrs', 'loc'],
    emojis: E('✂️ 💈 🪒 🧔 👨 😎 💇 🧴 🪞 🔥 ⭐ 💯 👑 🏆 🎯 ⚡ 🖤 💙 🕶️ 🎩 🧼 🪮 🚿 🧢 🎸 🎤 🛋️ 📸 💪 ✨'),
    data: {
      hero: { b: 'Agenda tu corte' },
      menu: { h: 'Servicios', i: [['Corte clásico', '120'], ['Corte y barba', '180'], ['Afeitado', '90'], ['Diseño de cejas', '40']] },
      gal: { h: 'Nuestro trabajo', i: ['✂️', '💈', '🪒', '🧔', '😎', '💇'] },
      about: { h: 'Sobre nosotros', x: 'Barberos con pasión por el detalle. Sal con el mejor look, siempre.' },
      hrs: { h: 'Horario', i: [['Martes a sábado', '10:00 - 20:00'], ['Domingo', '10:00 - 15:00']] },
      loc: { h: 'Ubicación', x: 'Calle Navaja 88, Ciudad Futuro' },
      cta: { x: '¿Quieres cita?', b: 'Escríbenos por WhatsApp' },
      rev: { h: 'Clientes felices', i: [['Rafa', 'Me dejaron el corte perfecto.', 5], ['Toño', 'Buen ambiente y buen servicio.', 5], ['Gabo', 'Siempre salgo satisfecho.', 4]] },
      soc: { h: 'Síguenos', x: '@barberiaelcorte' },
      promo: { x: 'Corte + barba $150', y: 'Los miércoles' },
    },
  },
  {
    id: 'gym', nombre: 'Gimnasio', emoji: '💪', desc: 'Entrena y supérate',
    negocio: 'Gym Power', slogan: 'Tu mejor versión empieza hoy', paleta: 3, fuente: 0,
    bloques: ['hero', 'menu', 'promo', 'hrs'],
    emojis: E('💪 🏋️ 🏃 🚴 🤸 🥇 🏆 🔥 ⚡ 🎯 💯 🥊 🧘 🏊 ⛹️ 🥤 🍌 🥗 🍎 💧 ⏱️ 👟 🎧 ❤️ 🫀 🦾 🚀 ⭐ 👊 ✨'),
    data: {
      hero: { b: 'Únete hoy' },
      menu: { h: 'Planes', i: [['Plan mensual', '400'], ['Plan estudiante', '300'], ['Clase suelta', '60'], ['Entrenador personal', '250']] },
      gal: { h: 'Nuestras clases', i: ['🏋️', '🧘', '🥊', '🚴', '🏃', '🤸'] },
      about: { h: 'Sobre nosotros', x: 'Un gimnasio para todos los niveles. Aquí nadie se queda atrás, ¡te apoyamos!' },
      hrs: { h: 'Horario', i: [['Lunes a viernes', '6:00 - 22:00'], ['Sábado', '8:00 - 14:00']] },
      loc: { h: 'Ubicación', x: 'Avenida Fuerza 300, Ciudad Futuro' },
      cta: { x: '¿Quieres una clase gratis?', b: 'Escríbenos por WhatsApp' },
      rev: { h: 'Resultados reales', i: [['Carla', 'Bajé de peso y gané energía.', 5], ['Omar', 'Los entrenadores son geniales.', 5], ['Lupe', 'Muy buen ambiente.', 4]] },
      soc: { h: 'Síguenos', x: '@gympower' },
      promo: { x: 'Primer mes al 50%', y: 'Inscríbete esta semana' },
    },
  },
  {
    id: 'pasteleria', nombre: 'Pastelería', emoji: '🧁', desc: 'Pasteles y postres',
    negocio: 'Dulce Tentación', slogan: 'Hechos con amor y azúcar', paleta: 4, fuente: 2,
    bloques: ['hero', 'menu', 'gal', 'cta'],
    emojis: E('🧁 🎂 🍰 🍩 🍪 🍫 🍬 🍭 🍮 🥧 🍓 🍒 🍋 🍦 🍨 🧇 🥞 🍯 🥐 🎀 🎈 🎉 ❤️ 💖 🌸 ⭐ ✨ 🍡 🥮 🫐'),
    data: {
      hero: { b: 'Haz tu pedido' },
      menu: { h: 'Nuestros postres', i: [['Cupcake', '35'], ['Rebanada de pastel', '55'], ['Galletas (6 pzas)', '60'], ['Flan napolitano', '45']] },
      gal: { h: 'Antojos', i: ['🧁', '🎂', '🍩', '🍪', '🍓', '🍫'] },
      about: { h: 'Nuestra historia', x: 'Cada pastel se hornea con ingredientes frescos y mucho cariño. Para tus fiestas y antojos.' },
      hrs: { h: 'Horario', i: [['Lunes a sábado', '9:00 - 19:00'], ['Domingo', '10:00 - 14:00']] },
      loc: { h: 'Ubicación', x: 'Calle Dulce 5, Ciudad Futuro' },
      cta: { x: '¿Pastel para tu fiesta?', b: 'Pide por WhatsApp' },
      rev: { h: 'Opiniones', i: [['Mary', 'El pastel de mi cumple quedó hermoso.', 5], ['Jorge', 'Los cupcakes son una delicia.', 5], ['Pau', 'Súper atentos y deliciosos.', 4]] },
      soc: { h: 'Síguenos', x: '@dulcetentacion' },
      promo: { x: '3 cupcakes por $90', y: 'Solo los viernes' },
    },
  },
  {
    id: 'musica', nombre: 'Estudio de música', emoji: '🎧', desc: 'Graba, mezcla y crea',
    negocio: 'Beat Studio', slogan: 'Tu sonido, tu estilo', paleta: 4, fuente: 0,
    bloques: ['hero', 'about', 'menu', 'soc'],
    emojis: E('🎧 🎤 🎸 🎹 🥁 🎷 🎺 🎻 🎼 🎵 🎶 🔊 🎚️ 🎛️ 📻 💿 🪘 🎙️ 🔥 ⚡ 🚀 ⭐ 💜 🖤 🌟 ✨ 🎭 🕺 💃 📀'),
    data: {
      hero: { b: 'Reserva tu sesión' },
      menu: { h: 'Servicios', i: [['Grabación por hora', '250'], ['Mezcla de canción', '400'], ['Beat personalizado', '300'], ['Ensayo por hora', '150']] },
      gal: { h: 'El estudio', i: ['🎧', '🎤', '🎸', '🎹', '🥁', '🎛️'] },
      about: { h: 'Sobre nosotros', x: 'Un estudio hecho por músicos para músicos. Trae tu idea y juntos la hacemos sonar.' },
      hrs: { h: 'Horario', i: [['Lunes a viernes', '12:00 - 22:00'], ['Sábado', '12:00 - 20:00']] },
      loc: { h: 'Ubicación', x: 'Calle Ritmo 9, Ciudad Futuro' },
      cta: { x: '¿Listo para grabar?', b: 'Escríbenos por WhatsApp' },
      rev: { h: 'Artistas dicen', i: [['DJ Nico', 'El sonido quedó brutal.', 5], ['Lia', 'Me ayudaron con mi primera rola.', 5], ['Beto', 'Equipo profesional y buena vibra.', 4]] },
      soc: { h: 'Escúchanos', x: '@beatstudio' },
      promo: { x: 'Primera hora gratis', y: 'Para bandas nuevas' },
    },
  },
  {
    id: 'gamer', nombre: 'Videojuegos y esports', emoji: '🎮', desc: 'Juega, compite, gana',
    negocio: 'Pixel Arena', slogan: 'Juega, compite, gana', paleta: 5, fuente: 0,
    bloques: ['hero', 'promo', 'menu', 'rev'],
    emojis: E('🎮 🕹️ 👾 🎯 🏆 🥇 ⚔️ 🛡️ 🚀 👑 🔥 ⚡ 💥 🧠 🖥️ ⌨️ 🖱️ 🎧 📺 🧩 🎲 🤖 🦾 💎 ⭐ 💜 🟣 🌟 ✨ 🏁'),
    data: {
      hero: { b: 'Únete al torneo' },
      menu: { h: 'Tarifas', i: [['1 hora de juego', '25'], ['3 horas de juego', '60'], ['Torneo semanal', '50'], ['Combo snack + juego', '45']] },
      gal: { h: 'Zona gamer', i: ['🎮', '🕹️', '👾', '🖥️', '🏆', '🎧'] },
      about: { h: 'Sobre nosotros', x: 'El lugar donde los gamers se juntan. Consolas, PC y torneos cada semana.' },
      hrs: { h: 'Horario', i: [['Lunes a viernes', '14:00 - 22:00'], ['Fines de semana', '11:00 - 23:00']] },
      loc: { h: 'Ubicación', x: 'Calle Nivel 99, Ciudad Futuro' },
      cta: { x: '¿Quieres inscribirte?', b: 'Escríbenos por WhatsApp' },
      rev: { h: 'Gamers dicen', i: [['Pro_Alan', 'Las compus vuelan, cero lag.', 5], ['Nay', 'Los torneos son lo máximo.', 5], ['Chuy', 'Buen precio y buena banda.', 4]] },
      soc: { h: 'Síguenos', x: '@pixelarena' },
      promo: { x: 'Torneo este sábado', y: 'Premio para el primer lugar' },
    },
  },
];
