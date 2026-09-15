'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { images } from '@/lib/images';
import { VIEWPORT_REPEAT, CINEMATIC_EASE } from '@/lib/motion';
import { usePrefersReducedMotion, useIsMobile } from '@/lib/useMediaQuery';
import IconFeatureRow from '@/components/IconFeatureRow';
import { ClockIcon, CutIcon, StarIcon, FamilyIcon } from '@/components/Icons';

const FEATURES = [
  { icon: <ClockIcon />, label: 'COCINA DIARIA' },
  { icon: <CutIcon />, label: 'VERSÁTILES' },
  { icon: <StarIcon />, label: 'DELICIOSOS' },
  { icon: <FamilyIcon />, label: 'PARA TODA LA FAMILIA' },
];

export default function DailyScene() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxRange = reducedMotion ? [0, 0] : isMobile ? [-25, 25] : [-50, 50];
  const y = useTransform(scrollYProgress, [0, 1], parallaxRange);

  return (
    <section ref={ref} className="relative flex h-screen w-full items-center overflow-hidden bg-charcoal">
      <div className="absolute inset-0">
        <motion.div style={{ y, willChange: 'transform' }} className="absolute -top-[10%] -bottom-[10%] inset-x-0">
          <Image
            src={images.dailySelection.url}
            alt={images.dailySelection.alt}
            fill
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={images.dailySelection.blurDataURL}
            loading="lazy"
          />
        </motion.div>
        <div className="scene-gradient-overlay absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-end gap-12 px-6 text-right sm:px-10">
        <motion.div
          initial={{ opacity: 0, x: reducedMotion ? 0 : 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 0.9, ease: CINEMATIC_EASE }}
          className="flex flex-col items-end gap-4"
        >
          <p className="font-condensed text-xs tracking-[0.4em] text-gold">DAILY SELECTION</p>
          <h2 className="max-w-xl font-serif text-3xl italic leading-tight text-bone sm:text-5xl">
            Cortes versátiles para el día a día.
          </h2>
          <p className="max-w-lg font-serif text-lg text-bone/80">
            Seleccionamos opciones que se adaptan a tu cocina, brindando sabor, rendimiento y
            practicidad en cada preparación.
          </p>
        </motion.div>

        <div className="w-full">
          <IconFeatureRow items={FEATURES} />
        </div>
      </div>
    </section>
  );
}
