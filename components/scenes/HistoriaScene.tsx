'use client';

import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { historiaLayers } from '@/lib/images';
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

type LayerName = 'back' | 'mid' | 'front';

/** Una capa de la finca, horizontal en escritorio y vertical en celular. */
function DepthLayer({ layer }: { layer: LayerName }) {
  return (
    <picture>
      <source media="(max-width: 768px)" srcSet={historiaLayers.mobile[layer]} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={historiaLayers.desktop[layer]}
        alt={layer === 'back' ? historiaLayers.alt : ''}
        aria-hidden={layer === 'back' ? undefined : true}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  );
}

export default function HistoriaScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax por profundidad: la foto está separada en tres capas (cielo y
  // árbol, potrero y cerca, poste cercano) usando su mapa de profundidad.
  // Cada capa se mueve a una velocidad distinta: lo lejano casi no se
  // mueve, lo cercano mucho más, y el poste además se acerca (escala).
  // Rangos fijos: useTransform se queda con los del primer render, así que
  // celular y escritorio tienen sus propios valores y se elige al aplicar.
  const backY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const midY = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const frontY = useTransform(scrollYProgress, [0, 1], [-130, 130]);
  const frontScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const backYMobile = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const midYMobile = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  const frontYMobile = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  const style = (layer: LayerName) => {
    if (reducedMotion) return undefined;
    if (layer === 'back') return { y: isMobile ? backYMobile : backY };
    if (layer === 'mid') return { y: isMobile ? midYMobile : midY };
    return { y: isMobile ? frontYMobile : frontY, scale: frontScale };
  };

  return (
    <section
      id="historia"
      ref={sectionRef}
      className="relative flex min-h-svh w-full items-center overflow-hidden bg-charcoal py-24"
    >
      <div className="absolute inset-0">
        {(['back', 'mid', 'front'] as const).map((layer) => (
          <m.div
            // Se vuelve a montar si cambia el tipo de pantalla o el movimiento
            // reducido: Framer Motion se queda con los MotionValues del primer render.
            key={`${layer}-${isMobile}-${reducedMotion}`}
            className="absolute -inset-y-[12%] inset-x-0 origin-bottom"
            style={style(layer)}
          >
            <DepthLayer layer={layer} />
          </m.div>
        ))}
        {/* Tono cálido muy leve sobre el blanco y negro + contraste para el texto */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.6) 42%, rgba(10,10,10,0.05) 100%), linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0) 28%, rgba(10,10,10,0) 70%, rgba(10,10,10,0.85) 100%), linear-gradient(rgba(201,168,118,0.08), rgba(201,168,118,0.08))',
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
