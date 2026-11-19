import { useEffect, useRef } from 'react';

const COLORES = ['#FEC400', '#FE9100', '#FE5208', '#FFFFFF', '#7DD3FC'];

/** Confeti en canvas (sin librerías). Se apaga solo; respeta "reducir movimiento". */
export function Confeti() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const piezas = Array.from({ length: 170 }, () => {
      const lado = Math.random() < 0.5 ? 0 : 1;
      return {
        x: lado ? w : 0, y: h * 0.75,
        vx: (lado ? -1 : 1) * (4 + Math.random() * 11), vy: -(9 + Math.random() * 15),
        r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4,
        t: 7 + Math.random() * 8, c: COLORES[Math.floor(Math.random() * COLORES.length)],
      };
    });
    let id = 0;
    const ini = performance.now();
    const paso = (ahora: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of piezas) {
        p.vy += 0.38;
        p.vx *= 0.992;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.t / 2, -p.t / 4, p.t, p.t / 2);
        ctx.restore();
      }
      if (ahora - ini < 4500) id = requestAnimationFrame(paso);
      else ctx.clearRect(0, 0, w, h);
    };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[60]" />;
}
