import type { Variants } from 'framer-motion';

type Bezier = [number, number, number, number];

/** Entradas de escena: arranca rápido y se asienta lento. */
export const CINEMATIC_EASE: Bezier = [0.16, 1, 0.3, 1];
/** Respuestas de UI (botones, controles, cambios de estado): ease-out fuerte. */
export const EASE_OUT: Bezier = [0.23, 1, 0.32, 1];
/** Movimiento de algo que ya está en pantalla (cambio de diapositiva). */
export const EASE_IN_OUT: Bezier = [0.77, 0, 0.175, 1];

/**
 * Entradas de contenido (textos, listas, fotos): se animan una sola vez.
 * Si se repitieran en cada pasada, al volver hacia arriba el contenido
 * desaparecería y habría que esperar a que se anime de nuevo.
 */
/** Curva tipo iOS para paneles que entran desde un borde (bottom sheet, cajón lateral). */
export const EASE_DRAWER: [number, number, number, number] = [0.32, 0.72, 0, 1];

export const VIEWPORT_ONCE = { once: true, amount: 0.3 } as const;

/**
 * Solo para efectos decorativos que no esconden contenido (ej. el
 * spotlight de Black Reserve): se vuelven a encender en cada pasada.
 */
export const VIEWPORT_REPEAT = { once: false, amount: 0.3 } as const;

/**
 * Entrada estándar de texto: desplazamiento corto (14px) + opacidad. Sin
 * desenfoque: animar `filter` en párrafos grandes obliga a repintarlos en
 * cada cuadro. Con movimiento reducido queda solo el fade.
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
    hidden: { opacity: 0, transform: 'translateY(14px)' },
    visible: {
      opacity: 1,
      transform: 'translateY(0px)',
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
