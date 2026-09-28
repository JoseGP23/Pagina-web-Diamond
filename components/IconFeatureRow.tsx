'use client';

import { m } from 'framer-motion';
import { VIEWPORT_REPEAT, revealVariants, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';

export type FeatureItem = {
  icon: React.ReactNode;
  label: string;
};

const COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-3 lg:grid-cols-5',
} as const;

/**
 * Atributos de cada escena: ícono de trazo fino + etiqueta, sobre una línea
 * divisoria. Son información, no botones, así que no reaccionan al hover.
 * Entran con un stagger corto (60ms) para leerse como un solo grupo.
 */
export default function IconFeatureRow({
  items,
  accent = 'gold',
  columns = 4,
  className = '',
}: {
  items: FeatureItem[];
  accent?: 'gold' | 'fire';
  columns?: keyof typeof COLUMNS;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const itemVariants = revealVariants(reducedMotion);

  return (
    <m.ul
      className={`grid grid-cols-2 gap-x-6 gap-y-5 border-t border-bone/15 pt-6 ${COLUMNS[columns]} ${className}`}
      variants={staggerContainer(0.06, 0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_REPEAT}
    >
      {items.map((item) => (
        <m.li key={item.label} className="flex items-center gap-3" variants={itemVariants}>
          <span
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 ${accent === 'fire' ? 'text-fire' : 'text-gold'}`}
          >
            {item.icon}
          </span>
          <span className="font-condensed text-[12px] tracking-[0.18em] text-bone/85">{item.label}</span>
        </m.li>
      ))}
    </m.ul>
  );
}
