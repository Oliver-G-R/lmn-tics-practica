import { SearchX } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { configADoc, decode, INFO_URL } from '../lib/codec';
import { PALETAS } from '../lib/paletas';
import { PaginaEstatica } from './Pagina';

/** Visor (/s#datos): lo que se abre al escanear el QR. Pensado primero para celular. */
export function Visor() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const f = () => setHash(location.hash);
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);

  const doc = useMemo(() => {
    const cfg = decode(hash);
    return cfg ? configADoc(cfg) : null;
  }, [hash]);

  useEffect(() => {
    if (!doc) return;
    const p = PALETAS[doc.p];
    document.title = doc.n || 'Mi página';
    document.body.style.background = p.bg;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', p.accent);
  }, [doc]);

  if (!doc) {
    return (
      <div className="grid min-h-full place-items-center bg-marino px-6 py-10 text-center">
        <div className="grid max-w-sm gap-4">
          <SearchX size={84} className="mx-auto text-amarillo" />
          <h1 className="text-3xl font-extrabold">No pudimos abrir esta página</h1>
          <p className="text-lg text-white/75">El link parece estar incompleto o dañado. Vuelve a escanear el QR con calma.</p>
          <a href={INFO_URL} className="flama rounded-2xl px-6 py-4 text-xl font-extrabold text-marino">
            Conoce la especialidad TIC
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: PALETAS[doc.p].bg }}>
      <PaginaEstatica doc={doc} altoMin="100dvh" />
      <p className="px-4 py-5 text-center text-sm" style={{ color: PALETAS[doc.p].muted }}>
        Hecho en el Taller Web TIC · Liceo Metropolitano del Norte
      </p>
    </div>
  );
}
