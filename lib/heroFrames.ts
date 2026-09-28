/**
 * Secuencia de fotogramas del Hero (se reproduce con el scroll).
 *
 * Los fotogramas salen de `media/hero.mp4` y viven en `public/hero-frames/`:
 * una versión horizontal para escritorio y una vertical para celular.
 * Para cambiar el video del Hero, regenera ambas carpetas con los comandos
 * de ffmpeg del README (sección "Video del Hero") y ajusta FRAME_COUNT si
 * cambia la cantidad de fotogramas.
 */

export const FRAME_COUNT = 61;

export type FrameSet = 'desktop' | 'mobile';

export function frameSrc(set: FrameSet, index: number): string {
  return `/hero-frames/${set}/${String(index + 1).padStart(3, '0')}.webp`;
}
