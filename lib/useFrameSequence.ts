'use client';

import { useEffect, type RefObject } from 'react';
import type { MotionValue } from 'framer-motion';
import { FRAME_COUNT, frameSrc, type FrameSet } from '@/lib/heroFrames';

const CONCURRENT_LOADS = 4;

/**
 * Orden de carga "de grueso a fino": primero el primer y el último
 * fotograma, luego el del medio, luego los cuartos, etc. Así el scroll ya
 * funciona (con saltos) a los pocos KB y se va suavizando mientras llegan
 * los demás, en vez de quedarse congelado hasta cargar la secuencia entera.
 */
function coarseToFineOrder(count: number): number[] {
  const order: number[] = [0, count - 1];
  const seen = new Set(order);
  for (let step = count - 1; step >= 1; step = Math.floor(step / 2)) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
    if (step === 1) break;
  }
  return order;
}

/**
 * Dibuja en un <canvas> el fotograma que corresponde a `progress` (0–1).
 *
 * - Nada de estado de React: el progreso se lee de un MotionValue y el
 *   dibujo ocurre como mucho una vez por frame (rAF). React no se vuelve a
 *   renderizar al hacer scroll.
 * - Entre dos fotogramas se mezclan ambos según la fracción de progreso, así
 *   61 fotogramas se sienten tan fluidos como un video completo.
 * - Si un fotograma todavía no llegó, se usa el más cercano ya cargado.
 */
export function useFrameSequence(
  canvasRef: RefObject<HTMLCanvasElement>,
  progress: MotionValue<number>,
  enabled: boolean
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // La versión (horizontal/vertical) se decide aquí leyendo el media query
    // directamente, no con un hook de estado: así nunca se empieza a descargar
    // la equivocada durante el primer render. Si la ventana cruza el límite
    // (girar una tablet, redimensionar), se cambia de secuencia.
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    let set: FrameSet = mobileQuery.matches ? 'mobile' : 'desktop';
    let frames: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    let generation = 0;
    let cancelled = false;
    let rafId = 0;
    let lastDrawn = -1;
    let width = 0;
    let height = 0;

    function nearestLoaded(index: number): HTMLImageElement | null {
      for (let d = 0; d < FRAME_COUNT; d++) {
        const before = frames[index - d];
        if (before) return before;
        const after = frames[index + d];
        if (after) return after;
      }
      return null;
    }

    function drawCover(img: HTMLImageElement) {
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx!.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
    }

    function draw() {
      rafId = 0;
      if (!width || !height) return;
      const position = Math.min(Math.max(progress.get(), 0), 1) * (FRAME_COUNT - 1);
      const key = Math.round(position * 100);
      if (key === lastDrawn) return;

      const index = Math.floor(position);
      const base = frames[index] ?? nearestLoaded(index);
      if (!base) return;

      ctx!.globalAlpha = 1;
      drawCover(base);
      const next = frames[index + 1];
      const fraction = position - index;
      if (base === frames[index] && next && fraction > 0.02) {
        ctx!.globalAlpha = fraction;
        drawCover(next);
        ctx!.globalAlpha = 1;
      }
      lastDrawn = key;
      if (canvas!.dataset.ready !== 'true') canvas!.dataset.ready = 'true';
    }

    function requestDraw(force = false) {
      if (force) lastDrawn = -1;
      if (!rafId) rafId = requestAnimationFrame(draw);
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.round(entry.contentRect.width * dpr);
      height = Math.round(entry.contentRect.height * dpr);
      canvas.width = width;
      canvas.height = height;
      ctx.imageSmoothingQuality = 'high';
      requestDraw(true);
    });
    resizeObserver.observe(canvas);

    const order = coarseToFineOrder(FRAME_COUNT);
    let cursor = 0;
    function loadNext() {
      if (cancelled || cursor >= order.length) return;
      const index = order[cursor++];
      const loadGeneration = generation;
      const img = new Image();
      img.decoding = 'async';
      img.src = frameSrc(set, index);
      // decode() antes de dibujar: la decodificación ocurre fuera del frame
      // de scroll y drawImage no se traba la primera vez que usa la imagen.
      img
        .decode()
        .then(() => {
          if (cancelled || loadGeneration !== generation) return;
          frames[index] = img;
          requestDraw(true);
        })
        .catch(() => {})
        .finally(() => {
          if (loadGeneration === generation) loadNext();
        });
    }
    function startLoading() {
      for (let i = 0; i < CONCURRENT_LOADS; i++) loadNext();
    }
    startLoading();

    function handleQueryChange(event: MediaQueryListEvent) {
      set = event.matches ? 'mobile' : 'desktop';
      generation++;
      frames = new Array(FRAME_COUNT).fill(null);
      cursor = 0;
      startLoading();
    }
    mobileQuery.addEventListener('change', handleQueryChange);

    const unsubscribe = progress.on('change', () => requestDraw());

    return () => {
      cancelled = true;
      mobileQuery.removeEventListener('change', handleQueryChange);
      unsubscribe();
      resizeObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [canvasRef, progress, enabled]);
}
