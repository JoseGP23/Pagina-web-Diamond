'use client';

import { useRef } from 'react';
import { m, useMotionTemplate, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { usePrefersReducedMotion, useIsMobile } from '@/lib/useMediaQuery';
import { useFrameSequence } from '@/lib/useFrameSequence';
import { frameSrc } from '@/lib/heroFrames';
import GoldButton from '@/components/GoldButton';

const NAV_LINKS = [
  { label: 'Historia', href: '#historia' },
  { label: 'Fire Selection', href: '#fire-selection' },
  { label: 'Chef Program', href: '#chef-program' },
  { label: 'Contacto', href: '#contacto' },
];

const WORDMARK = 'DIAMANTE'.split('');

/**
 * Tramos del scroll dentro del Hero fijado (0 = arriba, 1 = se suelta).
 * La cámara del video recorre tres planos y cada uno tiene su capítulo:
 *   1. Plano abierto (dos cortes)       → titular principal
 *   2. Acercamiento a las llamas        → frase sobre la brasa
 *   3. Plano final (un solo corte)      → firma DIAMANTE
 * Los fotogramas terminan en FRAMES_END; el resto del recorrido deja el
 * plano final quieto mientras se lee la firma.
 */
const FRAMES_END = 0.86;
const CHAPTER_1: [number, number] = [0.14, 0.26];
const CHAPTER_2 = [0.32, 0.4, 0.54, 0.62];
const CHAPTER_3_START = 0.68;

/**
 * Opacidad + desplazamiento (+ enfoque) ligados al scroll.
 *
 * Framer Motion se queda con lo que recibe en el primer render: los rangos
 * de useTransform y los MotionValues del `style`. Como en el primer render
 * todavía no se sabe si es celular, los elementos que dependen de eso se
 * vuelven a montar (con `key`) cuando cambia. Por eso solo se usa en
 * elementos invisibles al cargar (capítulo 2 y firma).
 */
function useScrollChapter(
  progress: MotionValue<number>,
  input: number[],
  opacityOutput: number[],
  yOutput: number[],
  blurOutput: number[],
  withBlur: boolean
) {
  const opacity = useTransform(progress, input, opacityOutput);
  const y = useTransform(progress, input, yOutput);
  const blur = useTransform(progress, input, blurOutput);
  const transform = useMotionTemplate`translate3d(0, ${y}px, 0)`;
  const filter = useMotionTemplate`blur(${blur}px)`;
  return withBlur ? { opacity, transform, filter } : { opacity, transform };
}

function WordmarkLetter({
  progress,
  index,
  sharp,
}: {
  progress: MotionValue<number>;
  index: number;
  sharp: boolean;
}) {
  // Stagger ligado al scroll: cada letra entra un poco después de la anterior.
  const start = CHAPTER_3_START + 0.02 + index * 0.014;
  const range = [start, start + 0.07];
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [40, 0]);
  const blur = useTransform(progress, range, [8, 0]);
  const transform = useMotionTemplate`translate3d(0, ${y}%, 0)`;
  const filter = useMotionTemplate`blur(${blur}px)`;
  return (
    <m.span className="inline-block" style={sharp ? { opacity, transform } : { opacity, transform, filter }}>
      {WORDMARK[index]}
    </m.span>
  );
}

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const scrub = !reducedMotion;

  const trackRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const frameProgress = useTransform(scrollYProgress, [0, FRAMES_END], [0, 1]);
  useFrameSequence(canvasRef, frameProgress, scrub);

  // En celular se omite el desenfoque ligado al scroll (es lo más caro de pintar).
  const withBlur = !isMobile;

  const chapter1 = useScrollChapter(
    scrollYProgress,
    CHAPTER_1,
    [1, 0],
    [0, -48],
    [0, 0],
    // Sin blur: este capítulo es visible al cargar y no se puede volver a montar.
    false
  );
  const chapter2 = useScrollChapter(
    scrollYProgress,
    CHAPTER_2,
    [0, 1, 1, 0],
    [32, 0, 0, -32],
    [6, 0, 0, 6],
    withBlur
  );
  // Cuando el capítulo 1 ya se desvaneció, su botón deja de recibir clics.
  const chapter1PointerEvents = useTransform(scrollYProgress, (v) => (v > CHAPTER_1[1] ? 'none' : 'auto'));
  const chapter3 = useScrollChapter(
    scrollYProgress,
    [CHAPTER_3_START + 0.1, CHAPTER_3_START + 0.18],
    [0, 1],
    [16, 0],
    [0, 0],
    false
  );

  // El plano final se oscurece un poco para que la firma se lea sobre el corte.
  const shade = useTransform(scrollYProgress, [CHAPTER_3_START - 0.04, CHAPTER_3_START + 0.1], [0, 0.55]);
  const logoDraw = useTransform(scrollYProgress, [CHAPTER_3_START, CHAPTER_3_START + 0.14], [0, 1]);
  const hint = useTransform(scrollYProgress, [0, 0.04], [1, 0]);
  const railScale = useMotionTemplate`scaleY(${scrollYProgress})`;

  return (
    <section
      id="inicio"
      ref={trackRef}
      className={`relative bg-charcoal ${scrub ? 'h-[320svh] md:h-[400svh]' : 'h-svh'}`}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Fotograma inicial en HTML: se ve de inmediato (es el LCP) mientras
            el canvas descarga el resto de la secuencia. */}
        <picture>
          <source media="(max-width: 768px)" srcSet={frameSrc('mobile', 0)} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frameSrc('desktop', 0)}
            alt="Dos cortes Diamante sobre la parrilla, entre llamas y humo"
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        {scrub ? (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 ease-out data-[ready=true]:opacity-100"
          />
        ) : null}

        {/* Viñeta y degradado inferior: dan contraste al texto sin apagar el fuego */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 55% 45%, rgba(10,10,10,0) 40%, rgba(10,10,10,0.7) 100%), linear-gradient(90deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0) 55%), linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0) 22%, rgba(10,10,10,0) 55%, rgba(10,10,10,0.85) 100%)',
          }}
        />
        {scrub ? (
          <m.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-charcoal" style={{ opacity: shade }} />
        ) : null}

        {/* Navegación */}
        <nav
          aria-label="Principal"
          className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-5 pt-5 sm:px-10 sm:pt-7"
        >
          <a href="#inicio" className="flex items-baseline gap-2 text-bone" aria-label="Diamante, inicio">
            <span className="font-serif text-xl font-medium tracking-[0.18em] sm:text-2xl">DIAMANTE</span>
            <span className="hidden font-condensed text-[10px] tracking-[0.35em] text-gold sm:inline">
              SELECTED MEATS
            </span>
          </a>
          <ul className="flex items-center gap-4 sm:gap-8">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href} className={i === 0 || i === 2 ? 'hidden md:block' : undefined}>
                <a
                  href={link.href}
                  className="group/nav relative inline-flex min-h-[44px] items-center font-condensed text-[12px] tracking-[0.18em] text-bone/75 transition-colors duration-200 ease-out hover:text-bone"
                >
                  {link.label.toUpperCase()}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover/nav:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Capítulo 1: plano abierto */}
        <m.div
          className="absolute inset-x-0 bottom-0 z-10 px-5 pb-12 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20"
          style={scrub ? { ...chapter1, pointerEvents: chapter1PointerEvents } : undefined}
        >
          <p className="hero-line mb-5 font-condensed text-[12px] tracking-[0.3em] text-gold [animation-delay:80ms]">
            TRADICIÓN FAMILIAR DESDE 2020
          </p>
          <h1 className="font-serif text-[clamp(2.75rem,8.4vw,8rem)] font-medium leading-[0.9] tracking-[-0.015em] text-bone">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="hero-line-mask block [animation-delay:160ms]">Family Tradition,</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="hero-line-mask block italic text-bone/90 [animation-delay:250ms]">
                Modern Selection.
              </span>
            </span>
          </h1>
          <div className="mt-7 flex flex-col items-start gap-6 sm:mt-9 sm:flex-row sm:items-center sm:gap-10">
            <p className="hero-line max-w-[34ch] font-serif text-lg leading-snug text-bone/75 [animation-delay:420ms] sm:text-xl">
              Selección curada de cortes premium para quienes reconocen la diferencia.
            </p>
            <div className="hero-line [animation-delay:520ms]">
              <GoldButton href="#fire-selection">Ver la selección</GoldButton>
            </div>
          </div>
        </m.div>

        {scrub ? (
          <>
            {/* Capítulo 2: las llamas */}
            <m.div
              className="pointer-events-none absolute inset-x-0 top-[16%] z-10 isolate mx-auto max-w-3xl px-6 text-center"
              key={withBlur ? 'blur' : 'sharp'}
              style={chapter2}
            >
              {/* Sombra suave detrás del texto: sobre el humo claro no se leería */}
              <span
                aria-hidden="true"
                className="absolute -inset-x-16 -inset-y-12 -z-10"
                style={{ background: 'radial-gradient(closest-side, rgba(10,10,10,0.72), rgba(10,10,10,0))' }}
              />
              <p className="font-serif text-[clamp(1.9rem,3.6vw,3.25rem)] italic leading-[1.08] text-bone">
                El sabor se decide sobre la brasa.
              </p>
              <p className="mx-auto mt-5 max-w-[36ch] font-serif text-lg leading-snug text-bone/75 sm:text-xl">
                Cada corte se elige por su marmoleo y se termina a fuego directo.
              </p>
            </m.div>

            {/* Capítulo 3: la firma */}
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
              <svg viewBox="0 0 48 48" fill="none" className="mb-6 h-14 w-14 text-gold sm:h-16 sm:w-16" aria-hidden="true">
                <m.circle
                  cx="24"
                  cy="24"
                  r="22.5"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeOpacity="0.6"
                  style={{ pathLength: logoDraw, opacity: logoDraw }}
                />
                <m.path
                  d="M16 13h8.5c6.5 0 11 4.7 11 11s-4.5 11-11 11H16V13z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  style={{ pathLength: logoDraw, opacity: logoDraw }}
                />
              </svg>
              <p
                className="overflow-hidden font-serif text-[clamp(3rem,11vw,10rem)] font-medium leading-none tracking-[0.14em] text-bone">
                {WORDMARK.map((_, i) => (
                  <WordmarkLetter key={`${i}-${isMobile}`} progress={scrollYProgress} index={i} sharp={isMobile} />
                ))}
              </p>
              <m.div className="mt-6 flex flex-col items-center gap-3" style={chapter3}>
                <p className="font-condensed text-[13px] tracking-[0.45em] text-gold sm:text-sm">
                  FIRE • SMOKE • SELECTION
                </p>
                <p className="max-w-[32ch] font-serif text-lg italic text-bone/70 sm:text-xl">
                  Selected Meats, desde Colombia.
                </p>
              </m.div>
            </div>

            {/* Progreso del recorrido + pista de scroll */}
            <div aria-hidden="true" className="absolute bottom-10 right-6 z-10 hidden flex-col items-center gap-3 md:flex lg:right-10">
              <m.span className="font-condensed text-[10px] tracking-[0.4em] text-bone/60" style={{ opacity: hint }}>
                DESLIZA
              </m.span>
              <span className="relative block h-24 w-px overflow-hidden bg-bone/15">
                <m.span className="absolute inset-0 origin-top bg-gold" style={{ transform: railScale }} />
              </span>
            </div>
          </>
        ) : null}
      </div>

      <style jsx>{`
        .hero-line,
        .hero-line-mask {
          animation-duration: 1s;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: both;
        }
        .hero-line {
          animation-name: hero-fade-up;
        }
        .hero-line-mask {
          animation-name: hero-mask-up;
          animation-duration: 1.1s;
        }
        @keyframes hero-fade-up {
          from {
            opacity: 0;
            transform: translate3d(0, 14px, 0);
          }
        }
        @keyframes hero-mask-up {
          from {
            transform: translate3d(0, 105%, 0);
          }
        }
      `}</style>
    </section>
  );
}
