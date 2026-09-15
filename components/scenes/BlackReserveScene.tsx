'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { images } from '@/lib/images';
import { VIEWPORT_REPEAT, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';
import { DiamondIcon, ClockIcon, StarIcon, TargetIcon, HeartHandIcon } from '@/components/Icons';
import IconBadge from '@/components/IconBadge';

const SLOW_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FEATURES = [
  { icon: <ClockIcon />, label: 'MADURADOS' },
  { icon: <TargetIcon />, label: 'SELECCIÓN LIMITADA' },
  { icon: <StarIcon />, label: 'MÁXIMA CALIDAD' },
  { icon: <HeartHandIcon />, label: 'EXPERIENCIA ÚNICA' },
];

export default function BlackReserveScene() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-charcoal">
      <div className="absolute inset-0">
        <Image
          src={images.blackReserve.url}
          alt={images.blackReserve.alt}
          fill
          sizes="100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={images.blackReserve.blurDataURL}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-charcoal/70" />
      </div>

      {/* Efecto spotlight radial que se enciende al entrar en viewport */}
      {!reducedMotion && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/25 blur-[100px]"
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 0.6, scale: 1 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 2, ease: SLOW_EASE }}
          style={{ willChange: 'transform, opacity' }}
        />
      )}

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-10 px-6 text-center">
        <motion.div
          className="relative flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 1.2, ease: SLOW_EASE }}
        >
          <span className="relative text-gold">
            <DiamondIcon className="h-14 w-14" />
            {!reducedMotion && (
              <motion.span
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={VIEWPORT_REPEAT}
              >
                <motion.span
                  className="absolute -inset-y-4 -left-10 w-6 skew-x-[-20deg] bg-bone/70"
                  initial={{ x: '-40px' }}
                  whileInView={{ x: '90px' }}
                  viewport={VIEWPORT_REPEAT}
                  transition={{ duration: 0.9, delay: 0.6, ease: 'easeInOut' }}
                  style={{ willChange: 'transform' }}
                />
              </motion.span>
            )}
          </span>
          <p className="font-condensed text-xs tracking-[0.45em] text-gold">BLACK RESERVE</p>
          <h2 className="max-w-xl font-serif text-3xl italic leading-tight text-bone sm:text-5xl">
            Nuestra selección más exclusiva.
          </h2>
          <p className="max-w-lg font-serif text-lg text-bone/80">
            Cortes premium de alto marmoleo y procesos especiales para quienes buscan lo
            extraordinario.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          variants={staggerContainer(0.2, 0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_REPEAT}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-3"
              variants={{
                hidden: { opacity: 0, y: reducedMotion ? 0 : 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: SLOW_EASE } },
              }}
            >
              <IconBadge icon={f.icon} />
              <span className="font-condensed text-xs tracking-[0.15em] text-bone/80">{f.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="font-condensed text-xs tracking-[0.35em] text-bone/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 1, delay: 0.6 }}
        >
          EXCLUSIVIDAD • CALIDAD • PRESTIGIO
        </motion.p>
      </div>
    </section>
  );
}
