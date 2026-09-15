/**
 * Configuración centralizada de videos.
 *
 * Todos los videos reales de Diamante viven en `public/videos/` y se
 * referencian únicamente desde aquí (además de `lib/cuts.ts` para los
 * videos de cada corte en el carrusel de Fire Selection). Para reemplazar
 * un video, sobrescribe el archivo en `public/videos/` (mismo nombre) o
 * cambia el valor de `src`.
 */

export type SceneVideo = {
  src: string;
  poster?: string;
};

export const videos: Record<string, SceneVideo> = {
  heroSteak: {
    src: '/videos/hero.mp4',
  },
};
