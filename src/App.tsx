import { Editor } from './app/Editor';
import { Visor } from './app/Visor';

/** Enrutamiento mínimo: /s = visor (QR), cualquier otra ruta = editor.
 *  En el build de USB (file://) solo existe el editor. */
export function App() {
  const usb = import.meta.env.MODE === 'usb';
  const ruta = location.pathname.replace(/\/+$/, '');
  if (!usb && ruta === '/s') return <Visor />;
  return <Editor />;
}
