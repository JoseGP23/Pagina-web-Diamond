'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { m, useScroll, useTransform } from 'framer-motion';
import { images } from '@/lib/images';
import { VIEWPORT_REPEAT, CINEMATIC_EASE, revealVariants, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion, useIsMobile } from '@/lib/useMediaQuery';
import { DiamondIcon, FamilyIcon, ShieldCheckIcon, FlameIcon } from '@/components/Icons';
import IconFeatureRow from '@/components/IconFeatureRow';

const LEAD =
  'DIAMANTE nace de una tradición familiar enfocada en la selección y comercialización de productos cárnicos premium.';

const PARAGRAPHS = [
  'Desde 2020 hemos evolucionado hacia una propuesta contemporánea enfocada en calidad, cuidando cada experiencia gastronómica alrededor de la parrilla y el ahumado.',
  'Combinamos tradición, técnica y una selección cuidadosamente curada para ofrecer productos premium para hogares, restaurantes y experiencias alrededor del fuego.',
];

const FEATURES = [
  { icon: <DiamondIcon />, label: 'SELECCIÓN PREMIUM' },
  { icon: <FamilyIcon />, label: 'TRADICIÓN FAMILIAR' },
  { icon: <ShieldCheckIcon />, label: 'CALIDAD Y CONFIANZA' },
  { icon: <FlameIcon />, label: 'PASIÓN POR EL FUEGO' },
];

export default function HistoriaScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax del campo: se mueve más lento que el texto y se "asienta"
  // (de 1.12 a 1) mientras la escena llega al centro. Los rangos son fijos
  // (useTransform se queda con los del primer render); celular y movimiento
  // reducido eligen qué valores aplicar.
  const yDesktop = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const yMobile = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.12, 1]);
  const parallax = reducedMotion ? undefined : { y: isMobile ? yMobile : yDesktop, scale };

  return (
    <section
      id="historia"
      ref={sectionRef}
      className="relative flex min-h-svh w-full items-center overflow-hidden bg-charcoal py-24"
    >
      <div className="absolute inset-0">
        <m.div className="absolute -inset-y-[10%] inset-x-0" style={parallax}>
          <Image
            src={images.historia.url}
            alt={images.historia.alt}
            fill
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={images.historia.blurDataURL}
            loading="lazy"
          />
        </m.div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.75) 45%, rgba(10,10,10,0.35) 100%), linear-gradient(180deg, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0) 30%, rgba(10,10,10,0) 70%, rgba(10,10,10,0.8) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 sm:px-10">
        <m.div
          className="max-w-3xl"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_REPEAT}
        >
          <m.div className="mb-8 flex items-center gap-4" variants={revealVariants(reducedMotion)}>
            <m.span
              aria-hidden="true"
              className="block h-px w-12 origin-left bg-gold"
              variants={{
                hidden: { transform: 'scaleX(0)' },
                visible: { transform: 'scaleX(1)', transition: { duration: 0.9, ease: CINEMATIC_EASE } },
              }}
            />
            <h2 className="font-condensed text-[12px] tracking-[0.35em] text-gold">NUESTRA HISTORIA</h2>
          </m.div>

          <m.p
            className="font-serif text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.08] text-bone"
            variants={revealVariants(reducedMotion)}
          >
            {LEAD}
          </m.p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-10">
            {PARAGRAPHS.map((p) => (
              <m.p
                key={p}
                className="max-w-[42ch] font-serif text-xl leading-relaxed text-bone/80"
                variants={revealVariants(reducedMotion)}
              >
                {p}
              </m.p>
            ))}
          </div>
        </m.div>

        <IconFeatureRow items={FEATURES} className="max-w-4xl" />
      </div>
    </section>
  );
}
