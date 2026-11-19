import { Rocket, TriangleAlert, User, Users } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo_lmn.png';
import { MSG_PALABRA, tieneGroseria } from '../lib/filtro';
import { Boton } from './ui';
import { BotonSonido } from './BotonSonido';
import { useTaller } from './store';

export function Inicio() {
  const { empezar } = useTaller();
  const [modo, setModo] = useState<'solo' | 'equipo'>('equipo');
  const [nombre, setNombre] = useState('');
  const malo = tieneGroseria(nombre);
  const listo = nombre.trim().length > 0 && !malo;

  return (
    <div className="relative grid h-full place-items-center overflow-hidden px-6">
      <motion.div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-naranja/20 blur-3xl" animate={{ x: [-60, 60, -60], scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }} />
      <motion.div className="pointer-events-none absolute -bottom-52 -left-24 h-[460px] w-[620px] rounded-full bg-llama/15 blur-3xl" animate={{ x: [0, 90, 0], y: [0, -40, 0] }} transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }} />
      <BotonSonido className="absolute right-5 top-5 z-10" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative flex w-full max-w-2xl flex-col items-center gap-5 text-center">
        <motion.img src={logo} alt="Liceo Metropolitano del Norte" className="h-24 w-24 rounded-2xl" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }} />
        <div>
          <h1 className="text-6xl font-extrabold tracking-tight">
            Taller <span className="texto-flama">Web TIC</span>
          </h1>
          <p className="mt-3 text-2xl text-white/80">Crea tu página web y descubre el código que hay detrás</p>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          {(
            [
              ['equipo', Users, 'Somos equipo', 'Hasta 5 personas'],
              ['solo', User, 'Voy solo', 'Yo solo(a)'],
            ] as const
          ).map(([m, Ico, t, s]) => (
            <button
              key={m}
              onClick={() => setModo(m)}
              className={`rounded-2xl border-[3px] px-4 py-3 text-left transition ${modo === m ? 'border-amarillo bg-amarillo/15' : 'border-white/15 bg-white/5 hover:border-white/40'}`}
            >
              <Ico size={34} className="text-amarillo" />
              <div className="text-xl font-extrabold">{t}</div>
              <div className="text-base text-white/70">{s}</div>
            </button>
          ))}
        </div>

        <div className="w-full text-left">
          <label htmlFor="equipo" className="mb-1 block text-lg font-bold">
            {modo === 'equipo' ? 'Nombre del equipo' : 'Tu apodo'}
          </label>
          <input
            id="equipo"
            value={nombre}
            maxLength={24}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && listo && empezar(modo, nombre)}
            placeholder={modo === 'equipo' ? 'Ej. Los Programadores' : 'Ej. Alex'}
            className={`w-full rounded-2xl border-2 bg-marino-2 px-4 py-3 text-xl font-semibold outline-none focus:border-amarillo ${malo ? 'border-llama' : 'border-white/20'}`}
          />
          {malo && (
            <p className="mt-1 text-base font-bold text-[#FF8A5C]">
              <TriangleAlert size={18} className="mr-1 inline -translate-y-px" />
              {MSG_PALABRA}
            </p>
          )}
        </div>

        <Boton grande disabled={!listo} onClick={() => empezar(modo, nombre)} className="w-full">
          Empezar <Rocket size={28} />
        </Boton>
      </motion.div>
    </div>
  );
}
