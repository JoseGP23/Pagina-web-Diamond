'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { m, useInView } from 'framer-motion';
import { sceneVideos } from '@/lib/images';
import { SMOKE_CUTS } from '@/lib/cuts';
import { VIEWPORT_REPEAT, CINEMATIC_EASE, revealVariants, staggerContainer } from '@/lib/motion';
import { orderCutMessage, whatsappLink } from '@/lib/whatsapp';
import { usePrefersReducedMotion, useIsMobile } from '@/lib/useMediaQuery';
import SmokeParticles from '@/components/SmokeParticles';

const ROTATE_MS = 3500;

export default function SmokeScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const inView = useInView(sectionRef, { amount: 0.3 });
  // Producto cuya foto ocupa el fondo (null = el brisket de portada).
  const [active, setActive] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  // Sin mouse (celular/tablet) no hay hover: las fotos rotan solas mientras
  // la escena está en pantalla.
  useEffect(() => {
    if (canHover || reducedMotion || !inView) return;
    const id = setInterval(() => {
      setActive((i) => (i === null ? 0 : (i + 1) % SMOKE_CUTS.length));
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [canHover, reducedMotion, inView]);

  // Los productos se "condensan" desde el humo: desenfoque fuerte a nítido.
  const productVariants = reducedMotion
    ? revealVariants(true)
    : {
        hidden: { opacity: 0, transform: 'translateY(18px)', filter: 'blur(10px)' },
        visible: {
          opacity: 1,
          transform: 'translateY(0px)',
          filter: 'blur(0px)',
          transition: { duration: 1, ease: CINEMATIC_EASE },
        },
      };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-charcoal py-24"
    >
      {/* Fondo: portada + una foto por producto, superpuestas. Solo cambia la
          opacidad (500ms), así el cambio es un fundido barato de pintar. */}
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 768px)" srcSet={sceneVideos.smoke.mobilePoster} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sceneVideos.smoke.poster}
            alt={sceneVideos.smoke.alt}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
              active === null ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </picture>
        {SMOKE_CUTS.map((cut, i) => (
          <Image
            key={cut.name}
            src={cut.image}
            alt=""
            fill
            sizes="100vw"
            className={`object-cover transition-opacity duration-500 ease-out ${active === i ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-charcoal/70" />
      </div>

      {/* Capa de humo que se disipa al entrar, revelando la imagen */}
      {reducedMotion ? null : (
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-charcoal"
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 1.6, ease: CINEMATIC_EASE }}
        />
      )}

      <SmokeParticles variant="smoke" intensity={isMobile ? 'low' : 'high'} active={inView && !reducedMotion} />

      <m.div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center"
        variants={staggerContainer(0.07, 0.2)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_REPEAT}
      >
        <m.h2 className="font-condensed text-[12px] tracking-[0.35em] text-gold" variants={revealVariants(reducedMotion)}>
          SMOKE SERIES
        </m.h2>
        <m.p
          className="mt-6 font-serif text-[clamp(2.25rem,4.6vw,4rem)] font-medium leading-[1.02] text-bone"
          variants={revealVariants(reducedMotion)}
        >
          Cocción lenta. Sabor profundo.
        </m.p>
        <m.p
          className="mx-auto mt-6 max-w-[44ch] font-serif text-xl leading-relaxed text-bone/80"
          variants={revealVariants(reducedMotion)}
        >
          Nuestra línea de ahumados premium está diseñada para quienes buscan intensidad, textura y
          experiencias únicas alrededor del humo.
        </m.p>

        <ul
          className="mt-12 flex flex-col items-center gap-x-10 gap-y-2 sm:flex-row sm:flex-wrap sm:justify-center"
          onMouseLeave={() => canHover && setActive(null)}
        >
          {SMOKE_CUTS.map((cut, i) => (
            <m.li key={cut.name} variants={productVariants}>
              <a
                href={whatsappLink(orderCutMessage(cut.name))}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-label={`Pedir ${cut.name} por WhatsApp`}
                className={`inline-flex min-h-[48px] items-center font-serif text-[clamp(1.75rem,3vw,2.5rem)] italic leading-tight transition-colors duration-200 ease-out ${
                  active === i ? 'text-bone' : 'text-gold'
                }`}
              >
                {cut.name}
              </a>
            </m.li>
          ))}
        </ul>

        {/* Qué es el producto que se está viendo (cambia con el hover o la rotación) */}
        <p className="mt-4 min-h-[1.75rem] font-serif text-lg italic text-bone/70" aria-live="polite">
          {active === null ? '' : SMOKE_CUTS[active].description}
        </p>

        <m.p
          className="mt-10 font-condensed text-[12px] tracking-[0.35em] text-bone/55"
          variants={revealVariants(reducedMotion)}
        >
          TIEMPO • HUMO • CARÁCTER
        </m.p>
      </m.div>
    </section>
  );
}
