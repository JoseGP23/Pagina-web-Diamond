import type Lenis from 'lenis';

/**
 * Acceso al smooth scroll (Lenis) desde fuera de LenisProvider: para llevar
 * al armador de pedidos con un desplazamiento suave y para congelar el fondo
 * mientras hay un panel abierto. Sin Lenis (movimiento reducido) se usa el
 * scroll nativo.
 */
let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollToElement(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.2 });
  else el.scrollIntoView({ block: 'start' });
}

export function setScrollLocked(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
