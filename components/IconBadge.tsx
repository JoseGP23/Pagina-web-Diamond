import type { ReactNode } from 'react';

type IconBadgeProps = {
  icon: ReactNode;
  accent?: 'gold' | 'fire';
  className?: string;
};

// Faceta hexagonal (motivo "gema cortada") en vez del círculo genérico.
const FACET = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

/**
 * Marco facetado para íconos, con borde en degradado y un glow que se
 * enciende en hover — reemplaza el círculo plano con borde que se sentía
 * genérico/de plantilla.
 */
export default function IconBadge({ icon, accent = 'gold', className = '' }: IconBadgeProps) {
  const color = accent === 'fire' ? '#c0392b' : '#c9a876';

  return (
    <div
      className={`group/badge relative flex h-14 w-14 shrink-0 items-center justify-center transition-transform duration-300 ease-cinematic hover:-translate-y-1 hover:scale-105 ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 scale-110 opacity-0 blur-md transition-opacity duration-300 group-hover/badge:opacity-40"
        style={{ clipPath: FACET, background: color }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70 transition-opacity duration-300 group-hover/badge:opacity-100"
        style={{ clipPath: FACET, background: `linear-gradient(135deg, ${color}, transparent 65%)` }}
      />
      <div aria-hidden="true" className="absolute inset-[1.5px] bg-charcoal" style={{ clipPath: FACET }} />
      <span className="relative z-10 h-6 w-6" style={{ color }}>
        {icon}
      </span>
    </div>
  );
}
