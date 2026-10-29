'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { EASE_DRAWER, EASE_OUT } from '@/lib/motion';
import { usePrefersReducedMotion, useIsMobile } from '@/lib/useMediaQuery';
import { setScrollLocked } from '@/lib/scroll';

type SheetProps = {
  open: boolean;
  onClose: () => void;
  /** Nombre accesible del diálogo. */
  label: string;
  /** `center`: ficha de producto. `side`: panel del pedido. */
  variant: 'center' | 'side';
  children: ReactNode;
};

/**
 * Panel modal. En celular siempre sube desde abajo (bottom sheet); en
 * pantallas grandes la ficha aparece al centro y el pedido entra por la
 * derecha. Cierra con Escape, con el fondo o con el botón; congela el scroll
 * de la página y devuelve el foco a donde estaba.
 */
export default function Sheet({ open, onClose, label, variant, children }: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    setScrollLocked(true);
    panelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // El foco no se escapa al contenido de atrás mientras el panel está abierto.
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      setScrollLocked(false);
      previous?.focus?.();
    };
  }, [open, onClose]);

  const fromBottom = isMobile || variant === 'center';
  const hidden = reducedMotion
    ? { opacity: 0 }
    : fromBottom
      ? { opacity: isMobile ? 1 : 0, transform: isMobile ? 'translateY(100%)' : 'translateY(16px)' }
      : { opacity: 1, transform: 'translateX(100%)' };
  const shown = { opacity: 1, transform: fromBottom ? 'translateY(0%)' : 'translateX(0%)' };
  // Los paneles que entran desde un borde usan la curva de cajón; la ficha
  // centrada en escritorio, un ease-out normal.
  const ease = isMobile || variant === 'side' ? EASE_DRAWER : EASE_OUT;

  const placement = isMobile
    ? 'inset-x-0 bottom-0 max-h-[92svh] border-t'
    : variant === 'center'
      ? 'left-1/2 top-1/2 max-h-[88svh] w-[min(920px,calc(100vw-4rem))] -translate-x-1/2 -translate-y-1/2 border'
      : 'inset-y-0 right-0 w-[min(520px,100vw)] border-l';

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[60]" key="sheet">
          <m.div
            aria-hidden="true"
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25, ease: EASE_OUT } }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
            onClick={onClose}
          />
          {/* Contenedor de posición aparte: Framer Motion escribe `transform`
              en el panel y pisaría el centrado con translate de Tailwind. */}
          <div className={`absolute flex flex-col ${placement} border-bone/10`}>
            <m.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={label}
              tabIndex={-1}
              data-lenis-prevent
              className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-charcoal-light outline-none"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
              initial={hidden}
              animate={{ ...shown, transition: { duration: reducedMotion ? 0.2 : variant === 'center' && !isMobile ? 0.3 : 0.45, ease } }}
              exit={{ ...hidden, transition: { duration: reducedMotion ? 0.15 : 0.22, ease: EASE_OUT } }}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-charcoal/70 text-bone/80 backdrop-blur transition-[transform,color] duration-150 ease-out hover:text-bone active:scale-[0.96]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
              {children}
            </m.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
