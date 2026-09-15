'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useInView, type PanInfo } from 'framer-motion';
import { CUTS } from '@/lib/cuts';
import { CINEMATIC_EASE, VIEWPORT_REPEAT } from '@/lib/motion';
import { usePrefersReducedMotion, useIsMobile } from '@/lib/useMediaQuery';
import { FlameIcon } from '@/components/Icons';
import IconBadge from '@/components/IconBadge';
import SmokeParticles from '@/components/SmokeParticles';

const AUTOPLAY_MS = 4500;
const NOTCH = 20;
const PANEL_CLIP = `polygon(${NOTCH}px 0, 100% 0, 100% calc(100% - ${NOTCH}px), calc(100% - ${NOTCH}px) 100%, 0 100%, 0 ${NOTCH}px)`;

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 70 : -70, scale: 0.97 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -70 : 70, scale: 0.97 }),
};

const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function FireSelectionScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const sectionInView = useInView(sectionRef, { amount: 0.2 });
  const pausedRef = useRef(false);

  const [[index, direction], setSlide] = useState<[number, number]>([0, 1]);
  const cut = CUTS[index];

  const paginate = useCallback((dir: number) => {
    setSlide(([i]) => [(i + dir + CUTS.length) % CUTS.length, dir]);
  }, []);

  const goToIndex = useCallback((target: number) => {
    setSlide(([i]) => [target, target > i ? 1 : -1]);
  }, []);

  useEffect(() => {
    if (reducedMotion || !sectionInView) return;
    const id = setInterval(() => {
      if (!pausedRef.current) paginate(1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reducedMotion, sectionInView, paginate]);

  function handleDragEnd(_e: unknown, info: PanInfo) {
    const threshold = 60;
    if (info.offset.x < -threshold) paginate(1);
    else if (info.offset.x > threshold) paginate(-1);
  }

  const particlesActive = sectionInView && !reducedMotion;
  const variants = reducedMotion ? fadeVariants : slideVariants;

  return (
    <section
      id="fire-selection"
      ref={sectionRef}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-charcoal py-16"
    >
      <div className="scene-gradient-overlay pointer-events-none absolute inset-0" />

      {/* Título con ícono de flama */}
      <div className="relative z-10 mb-4 flex flex-col items-center gap-2 sm:mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 0.6, ease: 'backOut' }}
        >
          <IconBadge icon={<FlameIcon />} accent="fire" />
        </motion.div>
        <motion.h2
          className="font-condensed text-3xl tracking-[0.2em] text-bone sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        >
          FIRE SELECTION
        </motion.h2>
        <motion.p
          className="hidden max-w-md text-center font-serif text-base text-bone/80 sm:block"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_REPEAT}
          transition={{ duration: 0.7, ease: CINEMATIC_EASE, delay: 0.1 }}
        >
          Cortes seleccionados para parrilla y fuego directo, con el balance perfecto entre sabor
          y terneza.
        </motion.p>
      </div>

      {/* Carrusel de cortes */}
      <div
        className="relative z-10 w-full max-w-2xl sm:max-w-3xl lg:max-w-5xl"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        <motion.div
          className="relative h-[46vh] w-full overflow-hidden bg-charcoal-light sm:h-[56vh] lg:h-[60vh]"
          style={{ clipPath: PANEL_CLIP }}
          drag={!reducedMotion ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={handleDragEnd}
        >
          <SmokeParticles variant="spark" intensity={isMobile ? 'low' : 'high'} active={particlesActive} />
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={cut.name}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reducedMotion ? 0.4 : 0.6, ease: CINEMATIC_EASE }}
              className="absolute inset-0"
            >
              {cut.video ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={cut.video}
                  poster={cut.image}
                  autoPlay={sectionInView}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <Image
                  src={cut.image}
                  alt={`Corte ${cut.name} Diamante`}
                  fill
                  sizes="(max-width: 768px) 90vw, 600px"
                  className="object-cover"
                  draggable={false}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/10 to-transparent" />
              <div className="pointer-events-none absolute bottom-0 left-0 p-6 sm:p-10">
                <p className="font-condensed text-xs tracking-[0.35em] text-gold">
                  {String(index + 1).padStart(2, '0')} / {String(CUTS.length).padStart(2, '0')}
                </p>
                <h3 className="font-serif text-4xl italic text-bone sm:text-5xl lg:text-6xl">{cut.name}</h3>
                <p className="mt-2 max-w-sm font-serif text-base text-bone/70">{cut.description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Controles: flechas + puntos */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label="Corte anterior"
            onClick={() => paginate(-1)}
            className="flex h-9 w-9 items-center justify-center border border-gold/30 font-condensed text-gold transition-colors duration-200 hover:border-gold hover:bg-gold/10"
          >
            ‹
          </button>
          <div className="flex items-center gap-2">
            {CUTS.map((c, i) => (
              <button
                key={c.name}
                type="button"
                aria-label={`Ver corte ${c.name}`}
                onClick={() => goToIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-gold' : 'w-1.5 bg-bone/25 hover:bg-bone/50'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Siguiente corte"
            onClick={() => paginate(1)}
            className="flex h-9 w-9 items-center justify-center border border-gold/30 font-condensed text-gold transition-colors duration-200 hover:border-gold hover:bg-gold/10"
          >
            ›
          </button>
        </div>
      </div>

      <motion.p
        className="relative z-10 mt-10 font-condensed text-xs tracking-[0.35em] text-bone/60"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT_REPEAT}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        FUEGO • SABOR • EXPERIENCIA
      </motion.p>
    </section>
  );
}
