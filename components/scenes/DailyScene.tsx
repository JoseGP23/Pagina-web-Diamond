'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { m, useScroll, useTransform } from 'framer-motion';
import { images } from '@/lib/images';
import { VIEWPORT_ONCE, CINEMATIC_EASE, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion, useIsMobile } from '@/lib/useMediaQuery';
import GoldButton from '@/components/GoldButton';
import { productsByLine } from '@/lib/catalog';
import { useOrderActions } from '@/components/order/OrderProvider';

/** Productos de la línea Daily: cada uno abre su ficha para agregarlo al pedido. */
const DAILY_PRODUCTS = productsByLine('daily');

export default function DailyScene() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const { openProduct, browseLine } = useOrderActions();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // Rangos fijos (useTransform se queda con los del primer render).
  const yDesktop = useTransform(scrollYProgress, [0, 1], [-55, 55]);
  const yMobile = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  // El elemento se vuelve a montar (key) cuando cambian estos valores:
  // Framer Motion se queda con los MotionValues del primer render.
  const parallax = reducedMotion ? undefined : { y: isMobile ? yMobile : yDesktop };

  // Esta escena entra de lado (desde la derecha) para diferenciarse de las verticales.
  const slideIn = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        hidden: { opacity: 0, transform: 'translateX(40px)' },
        visible: { opacity: 1, transform: 'translateX(0px)', transition: { duration: 0.9, ease: CINEMATIC_EASE } },
      };

  return (
    <section ref={ref} className="relative flex min-h-svh w-full items-center overflow-hidden bg-charcoal py-24">
      <div className="absolute inset-0">
        <m.div key={`parallax-${isMobile}-${reducedMotion}`} style={parallax} className="absolute -inset-y-[10%] inset-x-0">
          <Image
            src={images.dailySelection.url}
            alt={images.dailySelection.alt}
            fill
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={images.dailySelection.blurDataURL}
            loading="lazy"
          />
        </m.div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(270deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.65) 45%, rgba(10,10,10,0.25) 100%), linear-gradient(180deg, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0) 30%, rgba(10,10,10,0) 70%, rgba(10,10,10,0.75) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-end gap-14 px-6 sm:px-10">
        <m.div
          className="flex max-w-2xl flex-col items-end text-right"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <m.h2 className="mb-6 font-condensed text-[12px] tracking-[0.35em] text-gold" variants={slideIn}>
            DAILY SELECTION
          </m.h2>
          <m.p
            className="font-serif text-[clamp(2.25rem,4.6vw,4rem)] font-medium leading-[1.02] text-bone"
            variants={slideIn}
          >
            Cortes versátiles para el día a día.
          </m.p>
          <m.p className="mt-6 max-w-[40ch] font-serif text-xl leading-relaxed text-bone/80" variants={slideIn}>
            Seleccionamos opciones que se adaptan a tu cocina, brindando sabor, rendimiento y
            practicidad en cada preparación.
          </m.p>
        </m.div>

        <m.div
          className="flex w-full max-w-2xl flex-col items-end gap-8"
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <ul className="flex flex-wrap justify-end gap-x-8 gap-y-1 border-t border-bone/15 pt-5">
            {DAILY_PRODUCTS.map((product) => (
              <m.li key={product.id} variants={slideIn}>
                <button
                  type="button"
                  onClick={() => openProduct(product.id)}
                  className="inline-flex min-h-[44px] items-center font-serif text-2xl italic text-bone transition-colors duration-200 ease-out hover:text-gold sm:text-3xl"
                >
                  {product.sub === 'Res' || product.sub === 'Cerdo' ? product.sub : product.name}
                </button>
              </m.li>
            ))}
          </ul>
          <m.div variants={slideIn}>
            <GoldButton onClick={() => browseLine('daily')}>Ver la línea Daily</GoldButton>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
