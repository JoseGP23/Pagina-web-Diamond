import type { Variants } from 'framer-motion';

type Bezier = [number, number, number, number];

/** Entradas de escena: arranca rápido y se asienta lento. */
export const CINEMATIC_EASE: Bezier = [0.16, 1, 0.3, 1];
/** Respuestas de UI (botones, controles, cambios de estado): ease-out fuerte. */
export const EASE_OUT: Bezier = [0.23, 1, 0.32, 1];
/** Movimiento de algo que ya está en pantalla (cambio de diapositiva). */
export const EASE_IN_OUT: Bezier = [0.77, 0, 0.175, 1];

/**
 * `once:false` para que cada escena reproduzca su animación de entrada
 * tanto al bajar como al subir (se revierte a "hidden" al salir del
 * viewport y vuelve a animar al re-entrar).
 */
export const VIEWPORT_REPEAT = { once: false, amount: 0.3 } as const;

/**
 * Entrada estándar de texto: desplazamiento corto (14px) con un desenfoque
 * leve que se enfoca al llegar. Con movimiento reducido queda solo el fade.
 * Se anima `transform` como string (no `y`) para que el navegador pueda
 * hacerlo en el compositor aunque el hilo principal esté ocupado.
 */
export function revealVariants(reducedMotion: boolean, delay = 0): Variants {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.4, delay } },
    };
  }
  return {
    hidden: { opacity: 0, transform: 'translateY(14px)', filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      transform: 'translateY(0px)',
      filter: 'blur(0px)',
      transition: { duration: 0.8, delay, ease: CINEMATIC_EASE },
    },
  };
}

export function staggerContainer(stagger = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  };
}
