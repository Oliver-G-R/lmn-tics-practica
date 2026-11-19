# CLAUDE.md · Taller Web TIC

## Qué es este proyecto

**Taller Web TIC** es una app web interactiva para la Expo de Especialidades del Liceo Metropolitano del Norte (especialidad de Tecnologías de la Información y la Comunicación).

Alumnos de secundaria (13 a 15 años) la usan durante **15 minutos máximo** en el laboratorio, solos o en equipos de hasta 5 personas por computadora. Inventan su propio negocio y arman su página web con bloques que se arrastran, la personalizan y descubren el código HTML y CSS que hay detrás de cada bloque. Al final la "lanzan": aparece un QR, lo escanean con su celular y ven su página funcionando en el teléfono.

**Lección central:** lo que arrastras y personalizas es código. Nadie les enseña HTML; lo descubren al ver que cada decisión suya cambia una línea de código.

**Restricciones duras:**
- El laboratorio puede no tener internet. El editor debe funcionar 100% offline (PWA + respaldo de un solo archivo HTML).
- No hay base de datos ni backend. Toda la configuración de la página viaja dentro del link del QR (en el hash).
- La expo es inmediata: prioriza que funcione y se vea pulido sobre agregar funciones.

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- Framer Motion (animaciones y transiciones)
- @dnd-kit/core + @dnd-kit/sortable (arrastrar y reordenar bloques)
- lz-string (comprimir la configuración para el link)
- qrcode (generar el QR localmente en SVG, sin internet)
- vite-plugin-pwa (Workbox, precache de todo, modo offline)
- vite-plugin-singlefile (build alterno de un solo archivo HTML para USB)
- Fuentes autoalojadas con @fontsource (nada se carga de CDN en tiempo de ejecución)
- Vitest para pruebas del codec y del filtro de palabras

No uses Next.js ni servicios externos. Ninguna llamada de red en el editor.

## Rutas

- `/` → Editor (el taller). Es lo que se usa en el laboratorio.
- `/s` → Visor. Lee la configuración del hash (`/s#<datos>`) y dibuja la página final, adaptada a celular. Es lo que se abre al escanear el QR.

Usa un enrutamiento mínimo (revisar `location.pathname`) o react-router. En Vercel, `vercel.json` debe reescribir todas las rutas a `index.html`.

La URL pública base sale de `import.meta.env.VITE_PUBLIC_URL` (ej. `https://taller-web-tic.vercel.app`). El QR siempre apunta a `${VITE_PUBLIC_URL}/s#<datos>`, aunque el editor corra desde la USB.

## Flujo del editor (4 fases + lanzamiento)

Pantalla de inicio: título "Taller Web TIC", subtítulo "Crea tu página web y descubre el código que hay detrás", botón grande "Empezar". Opción "Somos equipo" o "Voy solo" y un campo para el nombre del equipo o el apodo (sin apellidos).

Un **reloj visible** arriba muestra la fase y el tiempo restante. El reloj es suave: al llegar a cero muestra un aviso amable ("¡Tiempo! Pasen a la siguiente fase") pero no bloquea.

| Fase | Duración | Qué hacen |
|---|---|---|
| 1. Tu negocio | 1 min | Eligen giro y escriben el nombre del negocio |
| 2. Arma tu página | 4 min | Arrastran, quitan y reordenan bloques |
| 3. Hazla tuya | 4 min | Colores, letra, logo, textos, productos; ven el código cambiar |
| 4. Lánzala | 2 min | Cuenta regresiva, página en pantalla completa y QR |

### Fase 1 · Tu negocio
Tarjetas grandes animadas con los giros. Al elegir uno, la página se precarga con una **plantilla del giro** (bloques, textos de ejemplo, paleta y emoji). Nunca empiezan en blanco.

Giros (cada uno con plantilla):
1. Cafetería
2. Biblioteca y café (ejemplo: "Café-Libre")
3. Tienda de ropa (streetwear)
4. Barbería
5. Gimnasio
6. Pastelería
7. Estudio de música
8. Videojuegos y esports

### Fase 2 · Arma tu página
Layout de tres columnas:
- Izquierda: catálogo de bloques (tarjetas con ícono y nombre).
- Centro: la página en un marco de celular, en vivo.
- Derecha: panel de código (ver abajo).

Se arrastran bloques del catálogo a la página, se reordenan arrastrando y se eliminan con un botón. Máximo 8 bloques. Cada bloque entra con animación.

Catálogo de bloques:
- **Portada** (nombre, slogan, logo emoji, botón)
- **Productos o menú** (3 a 6 artículos con nombre y precio)
- **Galería** (cuadrícula de emojis o ilustraciones incluidas en la app)
- **Sobre nosotros** (texto corto)
- **Horario**
- **Ubicación** (texto + mapa ilustrado decorativo, sin Google Maps)
- **Contacto** (botón tipo WhatsApp; es demostrativo, no pide número real)
- **Reseñas** (2 a 3 reseñas inventadas, con estrellas)
- **Redes sociales** (íconos decorativos)
- **Promoción** (banner con oferta)

### Fase 3 · Hazla tuya
- Paleta: 6 opciones curadas, todas con buen contraste.
- Letra: 3 opciones (Moderna, Elegante, Divertida).
- Logo: selector de unos 30 emojis curados por giro.
- Textos editables con límite de caracteres (nombre 24, slogan 50, textos 120, productos 24 + precio).
- Agregar o quitar productos y reseñas.

### Fase 4 · Lánzala
1. Botón grande "Lanzar mi página".
2. Cuenta regresiva 3, 2, 1 animada a pantalla completa, luego confeti.
3. La página aparece en pantalla completa dentro de un marco de celular.
4. Panel lateral: QR grande, el texto "Escanéalo con tu celular" y el contador "Tu página tiene **N líneas de código**".
5. Tres frases de cierre: "Elegiste tu negocio = definiste el proyecto", "Armaste bloques = estructura HTML", "Personalizaste = estilos CSS".
6. Botón "Nuevo equipo" que limpia todo para el siguiente grupo.

## El panel de código (lo más importante)

Esto es lo que convierte la práctica en aprendizaje. Cuídalo más que cualquier otra cosa.

- Al **dar clic en un bloque** de la página, se despliega con animación y muestra el HTML y CSS de ese bloque, generado a partir de la configuración actual.
- Cuando el usuario cambia algo (color, texto, emoji, orden), **la línea de código correspondiente se ilumina y cambia en vivo** con una animación corta (resaltado amarillo que se desvanece). Esa conexión visual decisión → línea de código es la lección.
- Resaltado de sintaxis sencillo y legible (implementación propia o prism-react-renderer empaquetado). Letra monoespaciada grande (mínimo 15 px).
- Botón "Ver todo el código" que muestra la página completa en HTML + CSS con el contador de líneas.
- **Modo curioso (opcional):** ciertos valores dentro del código (colores, textos, precios) son editables directamente. Si los cambian ahí, la página y los controles visuales se actualizan. Valida la entrada; nunca permitas HTML libre.
- El código mostrado debe ser HTML y CSS reales, limpios y comentados en español (`<!-- Portada de tu negocio -->`), no pseudocódigo.

## Configuración y link (sin base de datos)

Toda la página se describe con un JSON pequeño con claves cortas y IDs en lugar de valores completos:

```ts
type Config = {
  v: 1;                 // versión del esquema
  g: number;            // giro (índice)
  n: string;            // nombre del negocio
  s: string;            // slogan
  e: string;            // emoji del logo
  p: number;            // paleta (índice)
  f: number;            // fuente (índice)
  b: Block[];           // bloques en orden
};
type Block = { t: string; d?: Record<string, unknown> }; // t = tipo corto ("hero","menu","gal","about","hrs","loc","cta","rev","soc","promo")
```

- Codifica con `LZString.compressToEncodedURIComponent(JSON.stringify(config))` y colócalo en el **hash**: `/s#<datos>`. El hash nunca llega al servidor.
- Meta de tamaño: link total menor a 1,200 caracteres para que el QR se lea bien desde una pantalla. Si se excede, recorta textos opcionales y avisa.
- El visor decodifica, valida con un esquema (zod o validación manual) y aplica valores por defecto. Si el link está roto, muestra una página amable: "No pudimos abrir esta página" con un botón a la página de la especialidad (`VITE_INFO_URL`).
- Guarda el progreso en localStorage para que una recarga accidental no borre el trabajo. "Nuevo equipo" lo borra.
- Pon las funciones de codificar y decodificar en `src/lib/codec.ts` con pruebas de ida y vuelta en Vitest.

## Filtro de palabras

Son menores de edad en un evento público y la pantalla la ve todo el stand.
- Lista de groserías comunes en español de México en `src/lib/filtro.ts`.
- Normaliza antes de comparar (minúsculas, sin acentos, números a letras: 4→a, 3→e, 1→i, 0→o, 5→s).
- Si un texto contiene una palabra de la lista, marca el campo en rojo con el mensaje "Esa palabra no va en una página de negocio" y bloquea el lanzamiento hasta que se corrija.
- Pistas en los campos: "No pongas tu teléfono, dirección ni datos personales".

## Diseño y sensación

- Estética: tecnológica, limpia y juvenil. El editor usa los colores institucionales de abajo; las páginas que crean los alumnos usan la paleta que ellos eligen.

**Colores institucionales (tomados del logo del Liceo Metropolitano del Norte):**
- Azul marino `#001F34`: color principal, para fondos y textos fuertes.
- Flama: amarillo `#FEC400`, naranja `#FE9100` y naranja rojizo `#FE5208`. Úsalos como acentos, en botones, detalles y degradados de amarillo a naranja rojizo, como la flama del logo.
- Gris `#979797`: textos secundarios, líneas y detalles.
- Blanco `#FFFFFF`.

El azul marino es la base y la flama es el acento: no llenes todo de naranja. El logo viene en el archivo `logo_lmn.png`; colócalo en `public/` y úsalo en la pantalla de inicio y en la de lanzamiento.

- Animaciones con propósito: entradas de bloques, resaltado del código, transiciones de fase, cuenta regresiva y confeti. Respeta `prefers-reduced-motion`.
- Pensado para monitores de laboratorio de 1366×768: nada importante debe quedar fuera de pantalla. Botones grandes, textos mínimos de 16 px.
- Todo en español, con tono cercano y claro. Nada de jerga técnica en las instrucciones.
- El visor (`/s`) es mobile first: debe verse impecable en un celular.

## Controles para el docente

Atajo `Ctrl + Shift + D` abre un panel oculto con: saltar a la siguiente fase, sumar 2 minutos, pausar el reloj y reiniciar todo. No debe aparecer en la interfaz normal.

## Offline y builds

- `npm run build` → build normal con PWA (manifest, íconos, service worker con precache de todo). Al abrirla una vez con internet, queda disponible sin red.
- `npm run build:usb` → build con vite-plugin-singlefile en `dist-usb/index.html`: un solo archivo que funciona con doble clic desde una USB (`file://`), sin service worker. En este modo solo se usa el editor; el QR apunta igual a `VITE_PUBLIC_URL`.
- Verifica que ningún recurso se pida a internet en el editor (pestaña Network vacía después de la carga).

## Archivos esperados

```
src/
  app/            # pantallas: Inicio, Fase1..Fase4, Visor
  blocks/         # un componente por bloque + su generador de HTML/CSS
  code/           # panel de código, resaltado, diff animado
  lib/codec.ts    # comprimir y descomprimir config
  lib/filtro.ts   # filtro de palabras
  lib/plantillas.ts  # plantillas por giro
  lib/paletas.ts  # paletas y fuentes
vercel.json
```

## Criterios de terminado

- [ ] Un grupo completa las 4 fases en 11 minutos o menos sin explicación previa.
- [ ] El editor funciona con el wifi apagado (PWA instalada y build de USB).
- [ ] Al cambiar cualquier valor, la línea de código correspondiente se ilumina.
- [ ] El QR se escanea desde la pantalla con Android y iPhone y abre la página correcta.
- [ ] El visor se ve bien en un celular de 360 px de ancho.
- [ ] Las pruebas de `codec` y `filtro` pasan.
- [ ] "Nuevo equipo" deja la app limpia para el siguiente grupo.

## Forma de trabajar

- Construye por etapas y deja algo funcional al final de cada una: (1) flujo de fases con plantillas y visor, (2) codec + QR, (3) panel de código con resaltado en vivo, (4) arrastrar y soltar, (5) PWA y build de USB, (6) pulido de animaciones.
- Si algo amenaza el tiempo, recorta el modo curioso y las animaciones secundarias antes que el panel de código o el QR.
- Explica en español los cambios importantes.
