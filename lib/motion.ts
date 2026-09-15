import type { Variants } from 'framer-motion';

/** Easing cinematográfico estándar de todo el sitio. */
export const CINEMATIC_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * `once:false` para que cada escena reproduzca su animación de entrada
 * tanto al bajar como al subir (se revierte a "hidden" al salir del
 * viewport y vuelve a animar al re-entrar).
 */
export const VIEWPORT_REPEAT = { once: false, amount: 0.3 } as const;

/**
 * Construye variantes de entrada respetando `prefers-reduced-motion`.
 * Con reducedMotion=true, solo se anima opacity (fade simple, sin transform).
 */
export function buildVariants(
  hidden: Record<string, number>,
  reducedMotion: boolean,
  duration = 0.9,
  delay = 0
): Variants {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.5, delay },
      },
    };
  }

  return {
    hidden: { opacity: 0, ...hidden },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration, delay, ease: CINEMATIC_EASE },
    },
  };
}

export function staggerContainer(stagger = 0.12, delayChildren = 0): Variants {
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
