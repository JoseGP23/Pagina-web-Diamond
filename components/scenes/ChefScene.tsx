'use client';

import Image from 'next/image';
import { m } from 'framer-motion';
import { images } from '@/lib/images';
import { VIEWPORT_REPEAT, CINEMATIC_EASE, revealVariants, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';
import { DiamondIcon, CutIcon, SmokeIcon, HandshakeIcon, ShieldCheckIcon } from '@/components/Icons';
import IconFeatureRow from '@/components/IconFeatureRow';

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
    <section
      id="chef-program"
      className="relative grid min-h-svh w-full overflow-hidden bg-charcoal md:grid-cols-2"
    >
      {/* Split-screen: una cortina carbón se retira hacia la derecha y
          descubre la foto (transform, no clip-path: un clip-path total hace
          que el navegador crea que la imagen es invisible y no la cargue). */}
      <m.div
        className="relative h-[50svh] w-full overflow-hidden md:h-auto"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_REPEAT}
      >
        <m.div
          className="absolute inset-0"
          variants={
            reducedMotion
              ? undefined
              : {
                  hidden: { transform: 'scale(1.12)' },
                  visible: { transform: 'scale(1)', transition: { duration: 1.4, ease: CINEMATIC_EASE } },
                }
          }
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
        </m.div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-charcoal/60" />
        <m.span
          aria-hidden="true"
          className="absolute inset-0 origin-right bg-charcoal"
          variants={
            reducedMotion
              ? {
                  hidden: { opacity: 1 },
                  visible: { opacity: 0, transition: { duration: 0.5 } },
                }
              : {
                  hidden: { transform: 'scaleX(1)' },
                  visible: { transform: 'scaleX(0)', transition: { duration: 1.1, ease: CINEMATIC_EASE } },
                }
          }
        />
      </m.div>

      <m.div
        className="flex flex-col justify-center gap-12 px-6 py-16 sm:px-10 md:px-14 lg:px-20"
        variants={staggerContainer(0.08, 0.15)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_REPEAT}
      >
        <div>
          <m.h2 className="mb-6 font-condensed text-[12px] tracking-[0.35em] text-gold" variants={revealVariants(reducedMotion)}>
            CHEF PROGRAM
          </m.h2>
          <m.p
            className="max-w-[18ch] font-serif text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-[1.04] text-bone"
            variants={revealVariants(reducedMotion)}
          >
            Soluciones premium para restaurantes y profesionales.
          </m.p>
          <m.p
            className="mt-6 max-w-[40ch] font-serif text-xl leading-relaxed text-bone/80"
            variants={revealVariants(reducedMotion)}
          >
            Ofrecemos selección, cortes especiales y programas a la medida para elevar cada
            experiencia gastronómica.
          </m.p>
        </div>

        <IconFeatureRow items={FEATURES} columns={2} />

        <m.p
          className="font-serif text-2xl italic text-gold"
          variants={revealVariants(reducedMotion)}
        >
          Tu visión, nuestra carne.
        </m.p>
      </m.div>
    </section>
  );
}
