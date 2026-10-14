'use client';

import Image from 'next/image';
import { m } from 'framer-motion';
import { images } from '@/lib/images';
import { VIEWPORT_REPEAT, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';
import { DiamondIcon, ClockIcon, StarIcon, TargetIcon, HeartHandIcon } from '@/components/Icons';
import IconFeatureRow from '@/components/IconFeatureRow';

// Black Reserve va más lento y suave que el resto: es la escena de mayor exclusividad.
const SLOW_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FEATURES = [
  { icon: <ClockIcon />, label: 'MADURADOS' },
  { icon: <TargetIcon />, label: 'SELECCIÓN LIMITADA' },
  { icon: <StarIcon />, label: 'MÁXIMA CALIDAD' },
  { icon: <HeartHandIcon />, label: 'EXPERIENCIA ÚNICA' },
];

export default function BlackReserveScene() {
  const reducedMotion = usePrefersReducedMotion();

  const slowReveal = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }
    : {
        hidden: { opacity: 0, transform: 'translateY(20px)', filter: 'blur(6px)' },
        visible: {
          opacity: 1,
          transform: 'translateY(0px)',
          filter: 'blur(0px)',
          transition: { duration: 1.3, ease: SLOW_EASE },
        },
      };

  return (
    <section className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-charcoal py-24">
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
        <div className="absolute inset-0 bg-charcoal/80" />
      </div>

      {/* Spotlight: un degradado radial que se enciende (opacidad + escala).
          Sin filter: blur, así pintarlo cuesta casi nada. */}
      {/* El centrado va en un contenedor aparte: Framer Motion escribe el
          `transform` del spotlight y pisaría un translate de Tailwind. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <m.div
          className="h-[110vmin] w-[110vmin] shrink-0"
          style={{ background: 'radial-gradient(circle, rgba(201,168,118,0.28) 0%, rgba(201,168,118,0.08) 35%, rgba(201,168,118,0) 65%)' }}
          initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 2, ease: SLOW_EASE }}
        />
      </div>

      <m.div
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center"
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_REPEAT}
      >
        <m.span className="relative mb-8 block overflow-hidden text-gold" variants={slowReveal}>
          <DiamondIcon className="h-14 w-14" />
          {/* Destello: una sola pasada al entrar, no un loop */}
          {reducedMotion ? null : (
            <m.span
              aria-hidden="true"
              className="absolute -inset-y-4 left-0 w-5 skew-x-[-20deg] bg-bone/70"
              variants={{
                hidden: { transform: 'translateX(-40px) skewX(-20deg)' },
                visible: {
                  transform: 'translateX(90px) skewX(-20deg)',
                  transition: { duration: 0.9, delay: 0.9, ease: [0.77, 0, 0.175, 1] },
                },
              }}
            />
          )}
        </m.span>
        <m.h2 className="font-condensed text-[12px] tracking-[0.45em] text-gold" variants={slowReveal}>
          BLACK RESERVE
        </m.h2>
        <m.p
          className="mt-6 font-serif text-[clamp(2.5rem,5.4vw,4.75rem)] font-medium italic leading-[1.02] text-bone"
          variants={slowReveal}
        >
          Nuestra selección más exclusiva.
        </m.p>
        <m.p className="mt-6 max-w-[42ch] font-serif text-xl leading-relaxed text-bone/80" variants={slowReveal}>
          Cortes premium de alto marmoleo y procesos especiales para quienes buscan lo
          extraordinario.
        </m.p>

        <IconFeatureRow items={FEATURES} className="mt-14 w-full text-left" />

        <m.p className="mt-12 font-condensed text-[12px] tracking-[0.35em] text-bone/55" variants={slowReveal}>
          EXCLUSIVIDAD • CALIDAD • PRESTIGIO
        </m.p>
      </m.div>
    </section>
  );
}
