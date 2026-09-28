import type { ReactNode } from 'react';

type GoldButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

const NOTCH = 12;
const CLIP = `polygon(${NOTCH}px 0, 100% 0, 100% calc(100% - ${NOTCH}px), calc(100% - ${NOTCH}px) 100%, 0 100%, 0 ${NOTCH}px)`;

/**
 * CTA con esquinas cortadas (evoca una etiqueta de carnicería). Al pasar el
 * mouse, un relleno dorado barre de izquierda a derecha. Al presionar, el
 * botón se hunde levemente (scale 0.97) para confirmar el clic. Todo es CSS
 * (transform + color), sin JS.
 */
export default function GoldButton({ href, children, className = '' }: GoldButtonProps) {
  return (
    <a
      href={href}
      className={`group relative inline-flex min-h-[48px] items-center overflow-hidden px-7 font-condensed text-[13px] font-medium uppercase tracking-[0.2em] text-gold transition-transform duration-150 ease-out active:scale-[0.97] ${className}`}
      style={{ clipPath: CLIP }}
    >
      {/* Borde dibujado con el mismo recorte: un `border` normal se cortaría en las esquinas */}
      <span aria-hidden="true" className="absolute inset-0 bg-gold/50" style={{ clipPath: CLIP }} />
      <span aria-hidden="true" className="absolute inset-px bg-charcoal/40 backdrop-blur-sm" style={{ clipPath: CLIP }} />
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-[400ms] ease-out group-hover:scale-x-100"
      />
      <span className="relative z-10 transition-colors duration-200 ease-out group-hover:text-charcoal">
        {children}
      </span>
    </a>
  );
}
