'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { images } from '@/lib/images';
import { VIEWPORT_REPEAT, CINEMATIC_EASE, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion, useIsMobile } from '@/lib/useMediaQuery';
import { DiamondIcon, FamilyIcon, ShieldCheckIcon, FlameIcon } from '@/components/Icons';
import IconBadge from '@/components/IconBadge';

const PARAGRAPHS = [
  'DIAMANTE nace de una tradición familiar enfocada en la selección y comercialización de productos cárnicos premium.',
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
  const skip3D = isMobile || reducedMotion;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax vertical de la imagen de fondo (capa 1 de profundidad).
  const parallaxRange = reducedMotion ? [0, 0] : isMobile ? [-30, 30] : [-60, 60];
  const y = useTransform(scrollYProgress, [0, 1], parallaxRange);

  // La imagen "se asienta" en 3D: entra inclinada/alejada y se endereza al centrarse.
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.5], [skip3D ? 0 : 10, 0]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.5], [skip3D ? 1 : 1.14, 1]);

  // Resplandor de fondo a una profundidad distinta (capa 2 de profundidad, parallax más lento).
  const glowY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [30, -30]);

  // Inclinación 3D reactiva al cursor, sutil (la protagonista sigue siendo el Hero).
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 90, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 20, mass: 0.5 });
  const tiltX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const tiltY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (skip3D || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      id="historia"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-screen w-full items-center overflow-hidden bg-charcoal"
    >
      <div className="absolute inset-0" style={{ perspective: 1400 }}>
        <motion.div
          className="absolute inset-0 -top-[10%] -bottom-[10%]"
          style={{
            y,
            rotateX: scrollRotateX,
            scale: scrollScale,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={skip3D ? undefined : { rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
          >
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
          </motion.div>
        </motion.div>

        {/* Resplandor cálido a otra profundidad, refuerza la sensación de capas en 3D */}
        {!skip3D && (
          <motion.div
            className="pointer-events-none absolute -left-[10%] top-1/3 h-[45%] w-[40%] rounded-full bg-gold/15 blur-[100px]"
            style={{ y: glowY, willChange: 'transform' }}
          />
        )}

        <div className="scene-gradient-overlay absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 sm:px-10">
        <div>
          <motion.div
            className="mb-4 flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT_REPEAT}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="block h-px bg-gold"
              style={{ transformOrigin: 'left', perspective: 400 }}
              initial={{ scaleX: 0, rotateY: skip3D ? 0 : -70 }}
              whileInView={{ scaleX: 1, rotateY: 0 }}
              viewport={VIEWPORT_REPEAT}
              transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
            >
              <span className="block h-px w-10" />
            </motion.span>
            <p className="font-condensed text-xs tracking-[0.4em] text-gold">NUESTRA HISTORIA</p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-5"
            variants={staggerContainer(0.18)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_REPEAT}
          >
            {PARAGRAPHS.map((p, i) => (
              <motion.p
                key={i}
                className={`max-w-2xl font-serif text-xl leading-relaxed text-bone sm:text-2xl ${
                  i === 0 ? 'font-medium' : 'text-bone/85'
                }`}
                variants={{
                  hidden: { opacity: 0, x: reducedMotion ? 0 : -30 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.8, ease: CINEMATIC_EASE },
                  },
                }}
              >
                {p}
              </motion.p>
            ))}
          </motion.div>
        </div>

        {/* Fila de features con entrada 3D (flip sobre el eje X), propia de esta escena */}
        <motion.div
          className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_REPEAT}
          style={{ perspective: 800 }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-3 text-center"
              style={{ transformOrigin: 'bottom center' }}
              variants={{
                hidden: { opacity: 0, rotateX: reducedMotion ? 0 : -75, y: reducedMotion ? 0 : 16 },
                visible: {
                  opacity: 1,
                  rotateX: 0,
                  y: 0,
                  transition: { duration: 0.7, ease: CINEMATIC_EASE },
                },
              }}
            >
              <IconBadge icon={f.icon} />
              <span className="font-condensed text-xs tracking-[0.15em] text-bone/80 sm:text-sm">
                {f.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
