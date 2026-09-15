import type { ReactNode } from 'react';

type GoldButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

const NOTCH = 14;

/**
 * CTA con esquinas cortadas (evoca una etiqueta de carnicería) y un
 * relleno dorado que "barre" de izquierda a derecha al hacer hover, en vez
 * del cambio de color instantáneo de un botón genérico. Todo vía CSS
 * (transform + color), sin JS, para que sea barato de animar.
 */
export default function GoldButton({ href, children, className = '' }: GoldButtonProps) {
  return (
    <a
      href={href}
      className={`group relative inline-flex items-center gap-2 overflow-hidden border border-gold/60 px-6 py-3 font-condensed text-[12px] font-medium tracking-[0.15em] text-gold transition-colors active:scale-[0.97] ${className}`}
      style={{
        clipPath: `polygon(${NOTCH}px 0, 100% 0, 100% calc(100% - ${NOTCH}px), calc(100% - ${NOTCH}px) 100%, 0 100%, 0 ${NOTCH}px)`,
      }}
    >
      <span
        className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        aria-hidden="true"
      />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-charcoal">
        {children}
      </span>
      <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1 group-hover:text-charcoal">
        →
      </span>
    </a>
  );
}
