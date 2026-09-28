import type { ReactNode } from 'react';

type IconBadgeProps = {
  icon: ReactNode;
  accent?: 'gold' | 'fire';
  className?: string;
};

// Faceta hexagonal (motivo "gema cortada") en vez del círculo genérico.
const FACET = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

/**
 * Marco facetado para un ícono destacado, con borde en degradado.
 * Es decorativo: no tiene estados de hover.
 */
export default function IconBadge({ icon, accent = 'gold', className = '' }: IconBadgeProps) {
  const color = accent === 'fire' ? '#c0392b' : '#c9a876';

  return (
    <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center ${className}`} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{ clipPath: FACET, background: `linear-gradient(135deg, ${color}, transparent 70%)` }}
      />
      <div className="absolute inset-[1.5px] bg-charcoal" style={{ clipPath: FACET }} />
      <span className="relative z-10 h-6 w-6" style={{ color }}>
        {icon}
      </span>
    </div>
  );
}
