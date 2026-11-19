import type { ReactNode } from 'react';

/** Marco de celular: la página de los alumnos se dibuja adentro. */
export function Celular({ children, ancho = 330 }: { children: ReactNode; ancho?: number }) {
  return (
    <div
      className="relative mx-auto h-full max-h-[690px] rounded-[2.4rem] border-[10px] border-[#05090d] bg-[#05090d] shadow-2xl shadow-black/50 ring-1 ring-white/10"
      style={{ width: ancho }}
    >
      <div className="absolute left-1/2 top-0 z-20 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[#05090d]" />
      <div className="scroll-fino h-full overflow-y-auto overflow-x-hidden rounded-[1.8rem] bg-white">{children}</div>
    </div>
  );
}
