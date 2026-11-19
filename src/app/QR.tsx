import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import logo from '../assets/logo_lmn.png';

/**
 * QR generado localmente en SVG (sin internet) con el logo del Liceo en medio.
 * El logo tapa ~4% del código; la corrección de errores lo compensa (se probó con links de hasta 1,200 caracteres).
 */
export function QR({ texto, className = '' }: { texto: string; className?: string }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let vivo = true;
    // Links muy largos: menos corrección = cuadritos más grandes y fáciles de leer en pantalla
    const ec = texto.length > 600 ? 'M' : 'Q';
    QRCode.toString(texto, { type: 'svg', margin: 2, errorCorrectionLevel: ec, color: { dark: '#001F34', light: '#FFFFFF' } })
      .then((s) => vivo && setSvg(s))
      .catch(() => vivo && setSvg(''));
    return () => {
      vivo = false;
    };
  }, [texto]);
  return (
    <div role="img" aria-label="Código QR de tu página" className={`relative aspect-square rounded-2xl bg-white p-1 ${className}`}>
      <div className="h-full w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      {svg && (
        <div className="absolute left-1/2 top-1/2 grid aspect-square w-[20%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl bg-white p-[1.2%] shadow-sm ring-1 ring-black/10">
          <img src={logo} alt="" className="h-full w-full rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}
