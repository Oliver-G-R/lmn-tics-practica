import { describe, it, expect } from 'vitest';
import { tieneGroseria, validarTexto, tieneDatoPersonal } from './filtro';

describe('filtro de palabras', () => {
  it('detecta groserías simples, con acentos y mayúsculas', () => {
    expect(tieneGroseria('Eres un pendejo')).toBe(true);
    expect(tieneGroseria('CABRÓN')).toBe(true);
    expect(tieneGroseria('Qué verga')).toBe(true);
  });
  it('detecta trucos con números y letras repetidas', () => {
    expect(tieneGroseria('p3nd3j0')).toBe(true);
    expect(tieneGroseria('ch1ng4d4')).toBe(true);
    expect(tieneGroseria('puuuuta')).toBe(true);
    expect(tieneGroseria('m13rd4')).toBe(true);
  });
  it('detecta letras separadas', () => {
    expect(tieneGroseria('p u t a')).toBe(true);
    expect(tieneGroseria('p.u.t.o')).toBe(true);
  });
  it('no marca palabras normales (sin falsos positivos)', () => {
    [
      'Café-Libre', 'Computadora', 'Capuchino', 'Pastel de zanahoria', 'Escultura', 'Mari Café',
      'Cocina y café', 'Coca-Cola', 'Pizza y a la vez', 'Tacos al pastor', 'Particular', 'Hijo y padre',
      'Papelería', 'Peluquería', 'Aspirador', 'Gym Power', 'Ropa 2x1 $35', 'Plaza Skate, local 7',
    ].forEach((t) => expect(tieneGroseria(t), t).toBe(false));
  });
  it('los números normales de precios no estorban', () => {
    expect(validarTexto('Combo 2x1 por $150')).toBeNull();
  });
  it('detecta datos personales', () => {
    expect(tieneDatoPersonal('Llámame al 55 1234 5678')).toBe(true);
    expect(tieneDatoPersonal('mi correo es a@b.com')).toBe(true);
    expect(tieneDatoPersonal('Calle Imaginaria 123')).toBe(false);
  });
  it('devuelve el mensaje correcto', () => {
    expect(validarTexto('pinche café')).toBe('Esa palabra no va en una página de negocio');
    expect(validarTexto('Café bonito')).toBeNull();
  });
});
