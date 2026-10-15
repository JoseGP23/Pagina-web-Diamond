'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, m, useInView, type PanInfo } from 'framer-motion';
import { CUTS } from '@/lib/cuts';
import { CINEMATIC_EASE, EASE_OUT, VIEWPORT_ONCE, revealVariants, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion, useIsMobile } from '@/lib/useMediaQuery';
import { FlameIcon, WhatsAppIcon } from '@/components/Icons';
import GoldButton from '@/components/GoldButton';
import { orderCutMessage, whatsappLink } from '@/lib/whatsapp';
import IconBadge from '@/components/IconBadge';
import SmokeParticles from '@/components/SmokeParticles';
import SceneVideo from '@/components/SceneVideo';
import { sceneVideos } from '@/lib/images';

const AUTOPLAY_MS = 5000;
const NOTCH = 20;
const PANEL_CLIP = `polygon(${NOTCH}px 0, 100% 0, 100% calc(100% - ${NOTCH}px), calc(100% - ${NOTCH}px) 100%, 0 100%, 0 ${NOTCH}px)`;
const pad = (n: number) => String(n).padStart(2, '0');

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-4 w-4" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FireSelectionScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const sectionInView = useInView(sectionRef, { amount: 0.25 });
  const [hovered, setHovered] = useState(false);

  // [índice, dirección, ¿lo cambió el avance automático?]
  const [[index, direction, auto], setSlide] = useState<[number, number, boolean]>([0, 1, true]);
  const cut = CUTS[index];

  const paginate = useCallback((dir: number, fromAutoplay = false) => {
    setSlide(([i]) => [(i + dir + CUTS.length) % CUTS.length, dir, fromAutoplay]);
  }, []);

  const goToIndex = useCallback((target: number) => {
    setSlide(([i]) => (target === i ? [i, 1, false] : [target, target > i ? 1 : -1, false]));
  }, []);

  // Cuando la persona cambia el corte (flechas, puntos, teclado, arrastre)
  // la transición es corta para que responda enseguida; el avance
  // automático puede ser más lento y cinematográfico.
  const mediaDuration = auto ? 0.9 : 0.5;
  const textDuration = auto ? 0.7 : 0.35;
  const textDelay = auto ? 0.12 : 0;

  function handleDragEnd(_e: unknown, info: PanInfo) {
    // Un gesto rápido basta aunque sea corto: se mira distancia o velocidad.
    const swipe = Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 400;
    if (!swipe) return;
    paginate(info.offset.x < 0 ? 1 : -1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') paginate(1);
    else if (e.key === 'ArrowLeft') paginate(-1);
  }

  // El avance automático lo marca la barra de progreso del punto activo
  // (animación CSS): al terminar pasa al siguiente corte. Pausar la barra
  // con el mouse encima o fuera de pantalla pausa también el carrusel, sin
  // timers que se desincronicen.
  const autoplay = !reducedMotion;
  const autoplayRunning = autoplay && sectionInView && !hovered;

  return (
    <section
      id="fire-selection"
      ref={sectionRef}
      className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden bg-charcoal py-20 sm:py-24"
    >
      {/* Fondo: la parrilla se enciende al llegar a la escena y luego sigue
          ardiendo (repite desde el segundo 4, cuando ya está en llamas). */}
      <SceneVideo {...sceneVideos.fire} playback={4} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.7) 35%, rgba(10,10,10,0.55) 70%, rgba(10,10,10,0.8) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10">
        {/* Encabezado */}
        <m.header
          className="mb-8 flex flex-col gap-5 sm:mb-10 md:flex-row md:items-end md:justify-between"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <div className="flex items-center gap-5">
            <m.div
              className="relative"
              variants={
                reducedMotion
                  ? revealVariants(true)
                  : {
                      hidden: { opacity: 0, transform: 'scale(0.9)' },
                      visible: { opacity: 1, transform: 'scale(1)', transition: { duration: 0.6, ease: EASE_OUT } },
                    }
              }
            >
              {/* "Encendido" de la flama: el resplandor sube una vez al entrar */}
              <span
                aria-hidden="true"
                className="absolute -inset-6"
                style={{ background: 'radial-gradient(circle, rgba(192,57,43,0.45) 0%, rgba(192,57,43,0) 65%)' }}
              />
              <IconBadge icon={<FlameIcon />} accent="fire" />
            </m.div>
            <h2 className="overflow-hidden font-condensed text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-none tracking-[0.08em] text-bone">
              <m.span
                className="block"
                variants={
                  reducedMotion
                    ? revealVariants(true)
                    : {
                        hidden: { transform: 'translateY(105%)' },
                        visible: { transform: 'translateY(0%)', transition: { duration: 0.9, ease: CINEMATIC_EASE } },
                      }
                }
              >
                FIRE SELECTION
              </m.span>
            </h2>
          </div>
          <m.p
            className="max-w-[38ch] font-serif text-xl leading-snug text-bone/75"
            variants={revealVariants(reducedMotion)}
          >
            Cortes seleccionados para parrilla y fuego directo, con el balance perfecto entre sabor
            y terneza.
          </m.p>
        </m.header>

        {/* Carrusel de cortes */}
        <div
          role="region"
          aria-roledescription="carrusel"
          aria-label="Cortes Fire Selection"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <m.div
            className="relative h-[68svh] w-full touch-pan-y overflow-hidden bg-black sm:h-[66svh] lg:h-[74svh]"
            style={{ clipPath: PANEL_CLIP }}
            drag={reducedMotion ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={handleDragEnd}
          >
            <AnimatePresence initial={false} custom={direction}>
              <m.div
                key={cut.name}
                className="absolute inset-0"
                // Sin filter: blur. Animarlo sobre una foto de todo el panel la repinta
                // en cada cuadro; escala + opacidad corren en el compositor.
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(1.04)' }}
                animate={{
                  opacity: 1,
                  transform: 'scale(1)',
                  transition: { duration: mediaDuration, ease: CINEMATIC_EASE },
                }}
                // La salida es más rápida que la entrada: el corte nuevo toma el protagonismo enseguida.
                exit={{ opacity: 0, transition: { duration: 0.45, ease: EASE_OUT } }}
              >
                {/* El corte es el protagonista: ocupa casi todo el panel (en
                    escritorio, el 68% derecho; en celular, la parte de arriba).
                    Las fotos vienen sobre negro y el panel también lo es, así que
                    `object-cover` solo recorta fondo negro y agranda el corte. */}
                <div className="absolute inset-x-0 top-0 h-[72%] md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[68%]">
                  <Image
                    src={cut.image}
                    alt={`Corte ${cut.name} Diamante`}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="scale-[1.08] object-cover object-center"
                    draggable={false}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent md:bg-gradient-to-r md:from-black md:via-black/40 md:via-35% md:to-transparent md:to-55%" />
              </m.div>
            </AnimatePresence>

            <SmokeParticles variant="spark" intensity={isMobile ? 'low' : 'high'} active={sectionInView && !reducedMotion} />

            {/* Nombre del corte: entra desde el lado hacia el que se avanzó */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 sm:p-10 md:right-auto md:w-[46%]" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <m.div
                  key={cut.name}
                  custom={direction}
                  variants={{
                    enter: (dir: number) =>
                      reducedMotion ? { opacity: 0 } : { opacity: 0, transform: `translateX(${dir * 28}px)` },
                    center: {
                      opacity: 1,
                      transform: 'translateX(0px)',
                      transition: { duration: textDuration, delay: textDelay, ease: CINEMATIC_EASE },
                    },
                    exit: (dir: number) =>
                      reducedMotion
                        ? { opacity: 0, transition: { duration: 0.2 } }
                        : { opacity: 0, transform: `translateX(${dir * -20}px)`, transition: { duration: 0.25, ease: EASE_OUT } },
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <h3 className="font-serif text-[clamp(2.75rem,7vw,5.5rem)] font-medium italic leading-none text-bone">
                    {cut.name}
                  </h3>
                  <p className="mt-3 max-w-[34ch] font-serif text-lg text-bone/75 sm:text-xl">{cut.description}</p>
                  {/* El texto de la diapositiva no recibe clics (para no estorbar el
                      arrastre); solo el botón de pedido los vuelve a activar. */}
                  <div className="pointer-events-auto mt-6">
                    <GoldButton
                      href={whatsappLink(orderCutMessage(cut.name))}
                      external
                      icon={<WhatsAppIcon className="h-4 w-4" />}
                    >
                      Pedir {cut.name}
                    </GoldButton>
                  </div>
                </m.div>
              </AnimatePresence>
            </div>
          </m.div>

          {/* Controles. En celular las flechas van a la izquierda: a la derecha
              queda el botón flotante de WhatsApp y las taparía. */}
          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="order-last whitespace-nowrap font-condensed sm:order-none text-[13px] tracking-[0.3em] text-bone/60">
              <span className="text-gold">{pad(index + 1)}</span> / {pad(CUTS.length)}
            </p>

            <div className="flex items-center" role="tablist" aria-label="Elegir corte">
              {CUTS.map((c, i) => {
                const active = i === index;
                return (
                  <button
                    key={c.name}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Ver corte ${c.name}`}
                    onClick={() => goToIndex(i)}
                    className="group/dot flex h-11 w-5 items-center justify-center sm:w-10"
                  >
                    <span className="relative block h-[2px] overflow-hidden bg-bone/20 transition-colors duration-200 ease-out group-hover/dot:bg-bone/40 w-3.5 sm:w-8">
                      {active ? (
                        <span
                          key={index}
                          className={`absolute inset-0 origin-left bg-gold ${autoplay ? 'fire-progress' : ''}`}
                          style={{
                            animationDuration: `${AUTOPLAY_MS}ms`,
                            animationPlayState: autoplayRunning ? 'running' : 'paused',
                          }}
                          onAnimationEnd={() => paginate(1, true)}
                        />
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="order-first flex items-center gap-2 sm:order-none">
              {(['left', 'right'] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  aria-label={dir === 'left' ? 'Corte anterior' : 'Siguiente corte'}
                  onClick={() => paginate(dir === 'left' ? -1 : 1)}
                  className="flex h-11 w-11 items-center justify-center border border-gold/30 text-gold transition-[transform,border-color,background-color] duration-150 ease-out hover:border-gold hover:bg-gold/10 active:scale-[0.97]"
                >
                  <Chevron direction={dir} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <m.p
          className="mt-12 text-center font-condensed text-[12px] tracking-[0.35em] text-bone/55"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          FUEGO • SABOR • EXPERIENCIA
        </m.p>
      </div>

      <style jsx>{`
        .fire-progress {
          animation-name: fire-progress;
          animation-timing-function: linear;
          animation-fill-mode: both;
        }
        @keyframes fire-progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
}
