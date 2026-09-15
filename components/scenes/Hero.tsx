'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePrefersReducedMotion, useIsMobile } from '@/lib/useMediaQuery';
import { videos } from '@/lib/videos';
import Logo from '@/components/Logo';
import GoldButton from '@/components/GoldButton';

const NAV_LINKS = [
  { label: 'Historia', href: '#historia' },
  { label: 'Fire Selection', href: '#fire-selection' },
  { label: 'Chef Program', href: '#chef-program' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const smokeActive = !reducedMotion;

  const stageRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 18, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 18, mass: 0.4 });
  // "3D" reactivo: inclinación que sigue al cursor (solo transform, sin repintar).
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  // Capas a distinta profundidad para reforzar la sensación 3D (parallax).
  const glowX = useTransform(springX, [-0.5, 0.5], [-18, 18]);
  const glowY = useTransform(springY, [-0.5, 0.5], [-18, 18]);

  // El rect del stage se mide una sola vez (y en resize), nunca dentro del
  // handler de mousemove: leerlo ahí forzaría un reflow síncrono en cada
  // evento y es justo lo que hacía sentir "trabado" el hero al mover el
  // mouse o iniciar el scroll a la vez.
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (isMobile || reducedMotion) return;
    function measure() {
      rectRef.current = stageRef.current?.getBoundingClientRect() ?? null;
    }
    measure();
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, reducedMotion]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (isMobile || reducedMotion) return;
    pendingRef.current = { x: e.clientX, y: e.clientY };
    if (rafRef.current !== null) return;
    // Se agrupan todos los mousemove del frame en un solo update (rAF),
    // en vez de recalcular el spring en cada evento nativo.
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const rect = rectRef.current;
      const p = pendingRef.current;
      if (!rect || !p) return;
      mouseX.set((p.x - rect.left) / rect.width - 0.5);
      mouseY.set((p.y - rect.top) / rect.height - 0.5);
    });
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      id="inicio"
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen overflow-hidden bg-charcoal"
    >
      {/* Escenario de fondo: el corte, con inclinación 3D reactiva + flotación autónoma.
          El listener de mouse vive en la <section> completa (no en esta capa) porque el
          contenido en primer plano (nav + texto) la cubre entera y bloquearía el evento. */}
      <div className="absolute inset-0" style={{ perspective: 1200 }}>
        <motion.div
          className="absolute inset-0"
          animate={
            isMobile || reducedMotion
              ? undefined
              : { rotateZ: [-1.2, 1.2, -1.2], y: [0, -10, 0] }
          }
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={
            isMobile || reducedMotion
              ? { transformStyle: 'preserve-3d' }
              : { transformStyle: 'preserve-3d', willChange: 'transform' }
          }
        >
          <motion.div
            className="absolute inset-0 scale-110"
            style={
              isMobile || reducedMotion
                ? undefined
                : { rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }
            }
          >
            <video
              className="absolute inset-0 h-full w-full object-cover contrast-[1.15] saturate-[1.25] brightness-[0.85]"
              src={videos.heroSteak.src}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            {/* Lavado cálido dorado para unificar la colorimetría premium */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/25 via-transparent to-fire/20 mix-blend-overlay" />
          </motion.div>
        </motion.div>

        {/* Resplandor cálido flotante, se mueve a una profundidad distinta (parallax) */}
        {!isMobile && !reducedMotion && (
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[50%] w-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fire/25 blur-[110px]"
            style={{ x: glowX, y: glowY, willChange: 'transform' }}
          />
        )}

        {/* Viñeta cinematográfica */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(10,10,10,0) 35%, rgba(10,10,10,0.55) 78%, rgba(10,10,10,0.85) 100%)',
          }}
        />
        <div className="scene-gradient-overlay pointer-events-none absolute inset-0" />

        {smokeActive && (
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="hero-smoke hero-smoke-a" />
            {!isMobile && <div className="hero-smoke hero-smoke-b" />}
          </div>
        )}
      </div>

      {/* Contenido en primer plano */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navbar centrado en píldoras */}
        <nav className="flex items-center justify-center gap-2 px-4 pt-4 sm:gap-3 sm:px-8 sm:pt-6">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/20 backdrop-blur-md sm:h-11 sm:w-11"
            style={{ backgroundColor: 'rgba(20,20,20,0.55)' }}
          >
            <Logo className="h-5 w-5 text-gold" />
          </div>
          <div
            className="flex items-center gap-4 rounded-xl border border-gold/10 px-4 py-2.5 backdrop-blur-md sm:gap-10 sm:px-8 sm:py-3"
            style={{ backgroundColor: 'rgba(20,20,20,0.55)' }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group/nav relative font-condensed text-[11px] tracking-[0.15em] text-bone/70 transition-colors duration-200 hover:text-gold sm:text-[12px]"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-center scale-x-0 bg-gold transition-transform duration-300 ease-cinematic group-hover/nav:scale-x-100" />
              </a>
            ))}
          </div>
        </nav>

        {/* Bloque hero, alineado abajo a la izquierda */}
        <div className="flex flex-1 items-end px-6 pb-10 sm:px-12 sm:pb-16 md:px-20 lg:px-28 lg:pb-20">
          <div className="max-w-sm">
            <motion.a
              href="#historia"
              className="group mb-3 inline-flex items-center gap-1.5 font-condensed text-[11px] font-medium tracking-[0.1em] text-gold transition-colors hover:text-bone"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Tradición familiar desde 2020
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </motion.a>

            <motion.h1
              className="mb-3 font-serif text-[1.9rem] italic leading-[1.15] tracking-tight text-bone sm:text-[2.4rem]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              Family Tradition,
              <br />
              Modern Selection.
            </motion.h1>

            <motion.p
              className="mb-3 font-serif text-[13px] text-bone/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Selección curada de cortes premium para quienes reconocen la diferencia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <GoldButton href="#fire-selection">Ver nuestra selección</GoldButton>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        className="absolute bottom-8 right-6 z-10 flex flex-col items-center gap-3 sm:right-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <span className="font-condensed text-[10px] tracking-[0.4em] text-bone/50">SCROLL</span>
        <motion.div
          className="h-10 w-px bg-gold/50"
          style={{ transformOrigin: 'top' }}
          animate={reducedMotion ? {} : { scaleY: [0.2, 1, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <style jsx>{`
        .hero-smoke {
          position: absolute;
          width: 140%;
          height: 140%;
          left: -20%;
          top: -20%;
          background: radial-gradient(
            ellipse at center,
            rgba(201, 168, 118, 0.08) 0%,
            rgba(10, 10, 10, 0) 60%
          );
          will-change: transform, opacity;
        }
        .hero-smoke-a {
          animation: drift-a 18s ease-in-out infinite;
        }
        .hero-smoke-b {
          animation: drift-b 24s ease-in-out infinite;
          opacity: 0.6;
        }
        @keyframes drift-a {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate3d(3%, -2%, 0) scale(1.08); opacity: 0.8; }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1.05); opacity: 0.4; }
          50% { transform: translate3d(-4%, 3%, 0) scale(1); opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}
