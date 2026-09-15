'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { images } from '@/lib/images';
import { VIEWPORT_REPEAT, CINEMATIC_EASE, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion, useIsMobile } from '@/lib/useMediaQuery';
import SmokeParticles from '@/components/SmokeParticles';

const PRODUCTS = ['Smoked Short Rib', 'Hawaiian Style', 'Brisket', 'Beef Pastrami', 'Smoke Selection'];

export default function SmokeScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const inView = useInView(sectionRef, { amount: 0.2 });

  return (
    <section ref={sectionRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-charcoal">
      <div className="absolute inset-0">
        <Image
          src={images.smokeSeries.url}
          alt={images.smokeSeries.alt}
          fill
          sizes="100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={images.smokeSeries.blurDataURL}
          loading="lazy"
        />
        <div className="scene-gradient-overlay absolute inset-0" />
      </div>

      {/* Capa de humo que se disipa al entrar, revelando la imagen */}
      {!reducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-charcoal"
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 1.6, ease: CINEMATIC_EASE }}
        />
      )}

      <SmokeParticles variant="smoke" intensity={isMobile ? 'low' : 'high'} active={inView && !reducedMotion} />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-10 px-6 text-center">
        <motion.p
          className="font-condensed text-xs tracking-[0.4em] text-gold"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        >
          SMOKE SERIES
        </motion.p>

        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 0.8, ease: CINEMATIC_EASE, delay: 0.1 }}
        >
          <h2 className="font-serif text-2xl italic text-bone sm:text-3xl">
            Cocción lenta. Sabor profundo.
          </h2>
          <p className="mx-auto max-w-lg font-serif text-lg text-bone/80">
            Nuestra línea de ahumados premium está diseñada para quienes buscan intensidad,
            textura y experiencias únicas alrededor del humo.
          </p>
        </motion.div>

        <motion.ul
          className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-8"
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_REPEAT}
        >
          {PRODUCTS.map((product) => (
            <motion.li
              key={product}
              className="font-serif text-2xl italic text-gold sm:text-3xl"
              variants={{
                hidden: { opacity: 0, y: reducedMotion ? 0 : 24, filter: reducedMotion ? 'blur(0px)' : 'blur(6px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.8, ease: CINEMATIC_EASE },
                },
              }}
            >
              {product}
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          className="font-condensed text-xs tracking-[0.35em] text-bone/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          TIEMPO • HUMO • CARÁCTER
        </motion.p>
      </div>
    </section>
  );
}
