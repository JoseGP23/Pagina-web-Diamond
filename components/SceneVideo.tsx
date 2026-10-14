'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';

type SceneVideoProps = {
  /** Video horizontal (escritorio). */
  src: string;
  /** Video vertical para celular; si no hay, se usa `src`. */
  mobileSrc?: string;
  poster: string;
  mobilePoster?: string;
  alt: string;
  /**
   * 'loop': se repite completo. 'once': se reproduce una vez y se queda en
   * el último cuadro (vuelve a empezar al regresar a la escena).
   * número: se reproduce entero y luego repite desde ese segundo (ej. un
   * fuego que se enciende y después sigue ardiendo).
   */
  playback?: 'loop' | 'once' | number;
  className?: string;
};

const MOBILE_QUERY = '(max-width: 768px)';

/**
 * Video de fondo de una escena.
 *
 * - En el HTML va solo el póster (una imagen liviana); el video se descarga
 *   cuando la escena está por entrar en pantalla, no en la carga inicial.
 * - Se reproduce solo mientras se ve y se pausa al salir.
 * - Aparece con un fundido sobre el póster cuando ya está corriendo, así
 *   nunca se ve un cuadro negro mientras carga.
 * - Con movimiento reducido se queda el póster fijo.
 */
export default function SceneVideo({
  src,
  mobileSrc,
  poster,
  mobilePoster,
  alt,
  playback = 'loop',
  className = '',
}: SceneVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const nearView = useInView(containerRef, { margin: '300px 0px', once: true });
  const inView = useInView(containerRef, { amount: 0.15 });
  const [source, setSource] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  // La fuente se elige al acercarse, leyendo el media query en ese momento.
  useEffect(() => {
    if (!nearView || reducedMotion) return;
    setSource(window.matchMedia(MOBILE_QUERY).matches && mobileSrc ? mobileSrc : src);
  }, [nearView, reducedMotion, src, mobileSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;
    if (inView) {
      if (video.ended) video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, source]);

  function handleEnded() {
    const video = videoRef.current;
    if (!video || typeof playback !== 'number') return;
    video.currentTime = playback;
    video.play().catch(() => {});
  }

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <picture>
        {mobilePoster ? <source media={MOBILE_QUERY} srcSet={mobilePoster} /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      {source ? (
        <video
          ref={videoRef}
          src={source}
          muted
          playsInline
          preload="auto"
          loop={playback === 'loop'}
          onPlaying={() => setPlaying(true)}
          onEnded={handleEnded}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            playing ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}
    </div>
  );
}
