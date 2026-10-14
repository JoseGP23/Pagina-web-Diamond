/**
 * Imágenes y videos de fondo de cada escena.
 *
 * Todo sale de `originales/` (material de Diamante) y está optimizado en
 * `public/images/` y `public/media/`. Las versiones `mobile` son verticales
 * (9:16) y se usan en pantallas de hasta 768px.
 */

const GENERIC_BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBxQKFA0KDBQNFhYWKQklJSUoJSg8ODg4KDwbGxsbGxsbHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc/8AAEQgACAAKAwEiAAIRAQMRAf/EABUAAQEAAAAAAAAAAAAAAAAAAAcI/8QAIhAAAAUEAgMAAAAAAAAAAAAAAgMEBQYAAQcREhMhIzFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAaEQADAQADAAAAAAAAAAAAAAAAARECEjFB/9oADAMBAAIRAxEAPwCe2Zt/RtM0zTKbpsMkNvpJHDG2NrGgcAABgAf/2Q==';

export type SceneImage = {
  url: string;
  alt: string;
  blurDataURL: string;
};

export const images: Record<string, SceneImage> = {
  qrPlaceholder: {
    url: 'https://picsum.photos/seed/diamante-qr/400/400',
    alt: 'Código QR de contacto Diamante (placeholder)',
    blurDataURL: GENERIC_BLUR,
  },
};

/** Finca de Historia separada en capas por profundidad (parallax 3D). */
export const historiaLayers = {
  alt: 'Finca familiar en blanco y negro: un árbol solitario sobre las colinas y una cerca de madera',
  desktop: {
    back: '/images/historia/finca-16x9.webp',
    mid: '/images/historia/mid-16x9.webp',
    front: '/images/historia/fg-16x9.webp',
  },
  mobile: {
    back: '/images/historia/finca-9x16.webp',
    mid: '/images/historia/mid-9x16.webp',
    front: '/images/historia/fg-9x16.webp',
  },
};

/** Capas de la tabla de Daily Selection (se arma con el scroll). */
export const dailyLayers = {
  board: '/images/daily/tabla.webp',
  meat: '/images/daily/carne.webp',
  garlic: '/images/daily/ajo.webp',
  pepper: '/images/daily/pimienta.webp',
  rosemary: '/images/daily/romero.webp',
};

export const sceneVideos = {
  fire: {
    src: '/media/fire-llamas-16x9.mp4',
    mobileSrc: '/media/fire-llamas-9x16.mp4',
    poster: '/media/fire-llamas-16x9.webp',
    mobilePoster: '/media/fire-llamas-9x16.webp',
    alt: 'Parrilla de brasas que se enciende en llamas',
  },
  blackReserve: {
    src: '/media/black-marmoleo-16x9.mp4',
    mobileSrc: '/media/black-marmoleo-9x16.mp4',
    poster: '/media/black-marmoleo-16x9.webp',
    mobilePoster: '/media/black-marmoleo-9x16.webp',
    alt: 'Ribeye madurado en seco con marmoleo intenso',
  },
  chef: {
    src: '/media/chef-emplatado.mp4',
    poster: '/media/chef-emplatado.webp',
    alt: 'Chef terminando el emplatado de un corte en tajadas',
  },
  smoke: {
    poster: '/media/smoke-brisket-16x9.webp',
    mobilePoster: '/media/smoke-brisket-9x16.webp',
    alt: 'Brisket ahumado sobre papel de carnicero',
  },
};
