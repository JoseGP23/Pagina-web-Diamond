'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { m, useMotionTemplate, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { dailyLayers } from '@/lib/images';
import { DAILY_CUTS } from '@/lib/cuts';
import { VIEWPORT_REPEAT, CINEMATIC_EASE, staggerContainer } from '@/lib/motion';
import { orderCutMessage, whatsappLink } from '@/lib/whatsapp';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';
import IconFeatureRow from '@/components/IconFeatureRow';
import { ClockIcon, CutIcon, StarIcon, FamilyIcon } from '@/components/Icons';

const FEATURES = [
  { icon: <ClockIcon />, label: 'COCINA DIARIA' },
  { icon: <CutIcon />, label: 'VERSÁTILES' },
  { icon: <StarIcon />, label: 'DELICIOSOS' },
  { icon: <FamilyIcon />, label: 'PARA TODA LA FAMILIA' },
];

/**
 * Cada ingrediente llega a su lugar sobre la tabla desde fuera de cuadro,
 * en orden, mientras la escena sube hacia el centro de la pantalla.
 * `from` está en % del tamaño del propio elemento; `at` es el tramo del
 * scroll (0–1) en que hace el recorrido.
 */
const INGREDIENTS = [
  { key: 'meat', src: dailyLayers.meat, box: 'left-[21%] top-[21%] w-[58%]', from: [0, -70, -8], at: [0.12, 0.5] },
  { key: 'garlic', src: dailyLayers.garlic, box: 'left-[71%] top-[2%] w-[27%]', from: [90, -90, 35], at: [0.3, 0.68] },
  { key: 'pepper', src: dailyLayers.pepper, box: 'left-[4%] top-[71%] w-[27%]', from: [-90, 80, -25], at: [0.38, 0.76] },
  { key: 'rosemary', src: dailyLayers.rosemary, box: 'left-[69%] top-[67%] w-[29%]', from: [90, 90, -30], at: [0.46, 0.84] },
] as const;

function Ingredient({
  progress,
  item,
  still,
}: {
  progress: MotionValue<number>;
  item: (typeof INGREDIENTS)[number];
  still: boolean;
}) {
  const [x0, y0, r0] = item.from;
  const range = [...item.at];
  const x = useTransform(progress, range, [x0, 0]);
  const y = useTransform(progress, range, [y0, 0]);
  const rotate = useTransform(progress, range, [r0, 0]);
  const opacity = useTransform(progress, [item.at[0], item.at[0] + 0.12], [0, 1]);
  const transform = useMotionTemplate`translate3d(${x}%, ${y}%, 0) rotate(${rotate}deg)`;

  return (
    <m.div className={`absolute ${item.box}`} style={still ? undefined : { transform, opacity }}>
      <Image src={item.src} alt="" width={1100} height={1100} sizes="(max-width: 768px) 60vw, 330px" className="h-auto w-full" />
    </m.div>
  );
}

export default function DailyScene() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // 0 cuando la escena asoma por abajo, 1 cuando su centro llega al centro
  // de la pantalla: para entonces la tabla ya está armada.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const boardScale = useTransform(scrollYProgress, [0, 0.35], [0.92, 1]);
  const boardOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const slideIn = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        hidden: { opacity: 0, transform: 'translateX(40px)' },
        visible: { opacity: 1, transform: 'translateX(0px)', transition: { duration: 0.9, ease: CINEMATIC_EASE } },
      };

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-charcoal py-24 sm:py-32">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 sm:px-10 md:grid-cols-[1.05fr_1fr] md:gap-16">
        {/* La tabla, armándose */}
        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          {/* key: Framer Motion no quita un estilo ligado al scroll si deja de
              pasarse, así que al activarse el movimiento reducido se vuelve a montar. */}
          <m.div
            key={`board-${reducedMotion}`}
            className="absolute inset-0"
            style={reducedMotion ? undefined : { scale: boardScale, opacity: boardOpacity }}
          >
            <Image
              src={dailyLayers.board}
              alt="Ribeye y New York sobre una tabla de madera con sal, ajo, pimienta y romero"
              fill
              sizes="(max-width: 768px) 90vw, 560px"
              className="object-contain"
              // Los bordes de la foto se funden con el fondo de la página.
              style={{ maskImage: 'radial-gradient(closest-side, #000 82%, transparent 100%)' }}
            />
          </m.div>
          {INGREDIENTS.map((item) => (
            <Ingredient key={`${item.key}-${reducedMotion}`} progress={scrollYProgress} item={item} still={reducedMotion} />
          ))}
        </div>

        <div className="flex flex-col">
          <m.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_REPEAT}
          >
            <m.h2 className="mb-6 font-condensed text-[12px] tracking-[0.35em] text-gold" variants={slideIn}>
              DAILY SELECTION
            </m.h2>
            <m.p
              className="font-serif text-[clamp(2.25rem,4.2vw,3.75rem)] font-medium leading-[1.02] text-bone"
              variants={slideIn}
            >
              Cortes versátiles para el día a día.
            </m.p>
            <m.p className="mt-6 max-w-[40ch] font-serif text-xl leading-relaxed text-bone/80" variants={slideIn}>
              Seleccionamos opciones que se adaptan a tu cocina, brindando sabor, rendimiento y
              practicidad en cada preparación.
            </m.p>

            {/* Los cortes de la línea: cada uno abre el pedido por WhatsApp */}
            <ul className="mt-10 border-t border-bone/15">
              {DAILY_CUTS.map((cut) => (
                <m.li key={cut.name} variants={slideIn} className="border-b border-bone/15">
                  <a
                    href={whatsappLink(orderCutMessage(cut.name))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[64px] items-center gap-4 py-2"
                  >
                    <Image
                      src={cut.image}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 shrink-0 object-cover"
                    />
                    <span className="flex-1">
                      <span className="block font-serif text-2xl leading-tight text-bone transition-colors duration-200 ease-out group-hover:text-gold">
                        {cut.name}
                      </span>
                      <span className="block font-serif text-base text-bone/60">{cut.description}</span>
                    </span>
                    <span className="font-condensed text-[11px] tracking-[0.25em] text-gold/80 transition-colors duration-200 ease-out group-hover:text-gold">
                      PEDIR
                    </span>
                  </a>
                </m.li>
              ))}
            </ul>
          </m.div>

          <IconFeatureRow items={FEATURES} columns={2} className="mt-10" />
        </div>
      </div>
    </section>
  );
}
