'use client';

import { motion } from 'framer-motion';
import { VIEWPORT_REPEAT, CINEMATIC_EASE, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';
import IconBadge from '@/components/IconBadge';

export type FeatureItem = {
  icon: React.ReactNode;
  label: string;
};

export default function IconFeatureRow({
  items,
  accent = 'gold',
}: {
  items: FeatureItem[];
  accent?: 'gold' | 'fire';
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8"
      variants={staggerContainer(0.12)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_REPEAT}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="flex flex-col items-center gap-3 text-center"
          variants={{
            hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: CINEMATIC_EASE },
            },
          }}
        >
          <IconBadge icon={item.icon} accent={accent} />
          <span className="font-condensed text-xs tracking-[0.15em] text-bone/80 sm:text-sm">
            {item.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
