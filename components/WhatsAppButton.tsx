'use client';

import { m } from 'framer-motion';
import { whatsappLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/Icons';
import { useOrder } from '@/components/order/OrderProvider';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';

const fabClass =
  'whatsapp-fab group fixed z-50 flex h-14 min-w-14 items-center justify-center gap-3 rounded-full border border-gold/40 bg-charcoal/85 px-4 text-gold shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition-[transform,background-color,border-color] duration-150 ease-out hover:border-gold hover:bg-charcoal active:scale-[0.96] sm:px-5';

const fabPosition = {
  right: 'max(1.25rem, env(safe-area-inset-right))',
  bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
};

/**
 * Botón flotante, visible en todo el sitio. Sin productos abre el chat de
 * WhatsApp; en cuanto hay algo en el pedido se convierte en "Tu pedido"
 * (con el número de productos) y abre el resumen para enviarlo.
 * En celular es solo el ícono; en pantallas más anchas muestra el texto.
 */
export default function WhatsAppButton() {
  const { count, openCart, addedTick } = useOrder();
  const reducedMotion = usePrefersReducedMotion();

  if (count > 0) {
    return (
      <button type="button" onClick={openCart} aria-label={`Ver tu pedido, ${count} productos`} className={fabClass} style={fabPosition}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
          <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8z" strokeLinejoin="round" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
        </svg>
        <span className="hidden font-condensed text-[13px] tracking-[0.18em] sm:inline">TU PEDIDO</span>
        {/* El contador "salta" cada vez que se agrega un producto */}
        <m.span
          key={addedTick}
          initial={reducedMotion ? false : { transform: 'scale(1.25)' }}
          animate={{ transform: 'scale(1)', transition: { type: 'spring', duration: 0.35, bounce: 0.3 } }}
          className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-gold px-1.5 font-condensed text-[12px] font-medium text-charcoal sm:static sm:h-6"
        >
          {count}
        </m.span>
      </button>
    );
  }

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className={fabClass}
      style={fabPosition}
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span className="hidden font-condensed text-[13px] tracking-[0.18em] sm:inline">ESCRÍBENOS</span>
    </a>
  );
}
