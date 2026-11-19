import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type Props = Omit<HTMLMotionProps<'button'>, 'children'> & { variante?: 'flama' | 'suave' | 'borde'; grande?: boolean; children: ReactNode };

export function Boton({ variante = 'flama', grande, className = '', children, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold transition disabled:opacity-40 disabled:saturate-50';
  const tam = grande ? 'px-10 py-5 text-2xl' : 'px-6 py-3 text-lg';
  const v =
    variante === 'flama'
      ? 'flama text-marino shadow-lg shadow-naranja/30 enabled:hover:brightness-110'
      : variante === 'suave'
        ? 'bg-white/10 text-white enabled:hover:bg-white/20'
        : 'border-2 border-white/30 text-white enabled:hover:border-amarillo enabled:hover:text-amarillo';
  return (
    <motion.button
      whileHover={rest.disabled ? undefined : { y: -2, scale: 1.02 }}
      whileTap={rest.disabled ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      className={`${base} ${tam} ${v} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function Pastilla({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`rounded-full bg-white/10 px-3 py-1 text-base font-semibold ${className}`}>{children}</span>;
}

/** Entrada suave para pantallas completas. */
export function Aparece({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
      {children}
    </motion.div>
  );
}
