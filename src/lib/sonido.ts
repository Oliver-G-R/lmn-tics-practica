// Sonidos sintetizados con Web Audio: no hay archivos, funcionan sin internet.
export type Sonido = 'clic' | 'pop' | 'quitar' | 'whoosh' | 'exito' | 'cuenta' | 'alarma' | 'error' | 'tic';

let ctx: AudioContext | null = null;
let mudo = (() => {
  try {
    return localStorage.getItem('taller-web-tic:mudo') === '1';
  } catch {
    return false;
  }
})();
const subs = new Set<() => void>();

export const estaMudo = () => mudo;
export const suscribirSonido = (f: () => void) => {
  subs.add(f);
  return () => void subs.delete(f);
};

export function alternarMudo() {
  mudo = !mudo;
  try {
    localStorage.setItem('taller-web-tic:mudo', mudo ? '1' : '0');
  } catch {
    /* sin almacenamiento */
  }
  subs.forEach((f) => f());
  if (!mudo) sonar('pop');
}

function audio(): AudioContext | null {
  try {
    if (!ctx) {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

type Nota = { f: number; hasta?: number; t?: number; d: number; tipo?: OscillatorType; v?: number };

function tocar(notas: Nota[]) {
  const a = audio();
  if (!a) return;
  const base = a.currentTime;
  for (const n of notas) {
    const t0 = base + (n.t ?? 0);
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = n.tipo ?? 'sine';
    osc.frequency.setValueAtTime(n.f, t0);
    if (n.hasta) osc.frequency.exponentialRampToValueAtTime(n.hasta, t0 + n.d);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(n.v ?? 0.12, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.d);
    osc.connect(g).connect(a.destination);
    osc.start(t0);
    osc.stop(t0 + n.d + 0.03);
  }
}

export function sonar(s: Sonido) {
  if (mudo) return;
  switch (s) {
    case 'clic':
      return tocar([{ f: 720, hasta: 520, d: 0.05, tipo: 'triangle', v: 0.06 }]);
    case 'tic':
      return tocar([{ f: 1300, d: 0.04, tipo: 'square', v: 0.04 }]);
    case 'pop':
      return tocar([{ f: 520, hasta: 980, d: 0.11, v: 0.12 }]);
    case 'quitar':
      return tocar([{ f: 520, hasta: 200, d: 0.16, tipo: 'triangle', v: 0.1 }]);
    case 'whoosh':
      return tocar([
        { f: 250, hasta: 1400, d: 0.28, tipo: 'sawtooth', v: 0.035 },
        { f: 500, hasta: 1900, d: 0.3, tipo: 'sine', v: 0.06 },
      ]);
    case 'cuenta':
      return tocar([{ f: 523, d: 0.2, tipo: 'triangle', v: 0.18 }]);
    case 'error':
      return tocar([
        { f: 190, hasta: 120, d: 0.2, tipo: 'sawtooth', v: 0.08 },
        { f: 150, hasta: 100, t: 0.12, d: 0.2, tipo: 'sawtooth', v: 0.08 },
      ]);
    case 'exito':
      return tocar([
        { f: 523, d: 0.18, tipo: 'triangle', v: 0.16 },
        { f: 659, t: 0.1, d: 0.18, tipo: 'triangle', v: 0.16 },
        { f: 784, t: 0.2, d: 0.18, tipo: 'triangle', v: 0.16 },
        { f: 1047, t: 0.3, d: 0.6, tipo: 'triangle', v: 0.2 },
        { f: 1319, t: 0.34, d: 0.6, tipo: 'sine', v: 0.1 },
      ]);
    case 'alarma': {
      // Campanita doble repetida: suave pero que se escuche en el salón
      const notas: Nota[] = [];
      for (let r = 0; r < 3; r++)
        for (let i = 0; i < 2; i++) notas.push({ f: i ? 1175 : 880, t: r * 0.75 + i * 0.22, d: 0.3, tipo: 'square', v: 0.07 });
      return tocar(notas);
    }
  }
}
