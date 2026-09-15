'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { images } from '@/lib/images';
import { VIEWPORT_REPEAT, CINEMATIC_EASE, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';
import { DiamondIcon, CutIcon, SmokeIcon, HandshakeIcon, ShieldCheckIcon } from '@/components/Icons';

const FEATURES = [
  { icon: <DiamondIcon />, label: 'SELECCIÓN PREMIUM' },
  { icon: <CutIcon />, label: 'CORTES PERSONALIZADOS' },
  { icon: <SmokeIcon />, label: 'SMOKE PROGRAM' },
  { icon: <HandshakeIcon />, label: 'ATENCIÓN PERSONALIZADA' },
  { icon: <ShieldCheckIcon />, label: 'CONFIANZA Y RESPALDO' },
];

export default function ChefScene() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="chef-program" className="relative flex h-screen w-full flex-col overflow-hidden bg-charcoal md:flex-row">
      <motion.div
        className="relative h-1/2 w-full md:h-full md:w-1/2"
        initial={{ opacity: 0, x: reducedMotion ? 0 : -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={VIEWPORT_REPEAT}
        transition={{ duration: 0.9, ease: CINEMATIC_EASE }}
      >
        <Image
          src={images.chefProgram.url}
          alt={images.chefProgram.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={images.chefProgram.blurDataURL}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent md:bg-gradient-to-r" />
      </motion.div>

      <motion.div
        className="flex w-full flex-1 flex-col justify-center gap-8 px-6 py-10 sm:px-10 md:w-1/2 md:px-16"
        initial={{ opacity: 0, x: reducedMotion ? 0 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={VIEWPORT_REPEAT}
        transition={{ duration: 0.9, ease: CINEMATIC_EASE, delay: 0.1 }}
      >
        <div>
          <p className="mb-4 font-condensed text-xs tracking-[0.4em] text-gold">CHEF PROGRAM</p>
          <h2 className="max-w-lg font-serif text-3xl italic leading-tight text-bone sm:text-4xl">
            Soluciones premium para restaurantes y profesionales.
          </h2>
          <p className="mt-4 max-w-md font-serif text-lg text-bone/80">
            Ofrecemos selección, cortes especiales y programas a la medida para elevar cada
            experiencia gastronómica.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-2 gap-6 sm:grid-cols-3"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_REPEAT}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-start gap-2"
              variants={{
                hidden: { opacity: 0, y: reducedMotion ? 0 : 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: CINEMATIC_EASE } },
              }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 p-2.5 text-gold">
                {f.icon}
              </span>
              <span className="font-condensed text-xs tracking-[0.1em] text-bone/80">{f.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="font-condensed text-xs tracking-[0.35em] text-bone/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          TU VISIÓN, NUESTRA CARNE.
        </motion.p>
      </motion.div>
    </section>
  );
}
