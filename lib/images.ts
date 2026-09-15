/**
 * Configuración centralizada de imágenes.
 *
 * Todas las imágenes de la landing viven aquí. Son URLs de placeholder
 * (Unsplash / Picsum) verificadas como activas. Cuando tengas las fotos
 * reales de Diamante, reemplaza únicamente los valores de `url` en este
 * archivo — ningún otro archivo del proyecto necesita cambios.
 *
 * `blurDataURL` es un placeholder base64 genérico (gradiente oscuro) usado
 * mientras carga cada imagen, para que la transición se sienta premium.
 */

const GENERIC_BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBxQKFA0KDBQNFhYWKQklJSUoJSg8ODg4KDwbGxsbGxsbHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc/8AAEQgACAAKAwEiAAIRAQMRAf/EABUAAQEAAAAAAAAAAAAAAAAAAAcI/8QAIhAAAAUEAgMAAAAAAAAAAAAAAgMEBQYAAQcREhMhIzFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAaEQADAQADAAAAAAAAAAAAAAAAARECEjFB/9oADAMBAAIRAxEAPwCe2Zt/RtM0zTKbpsMkNvpJHDG2NrGgcAABgAf/2Q==';

export type SceneImage = {
  url: string;
  alt: string;
  blurDataURL: string;
};

export const images: Record<string, SceneImage> = {
  heroSteak: {
    url: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=1600&q=80',
    alt: 'Corte premium crudo, protagonista de la selección Diamante',
    blurDataURL: GENERIC_BLUR,
  },
  historia: {
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80',
    alt: 'Campo dorado al atardecer, origen de la tradición familiar Diamante',
    blurDataURL: GENERIC_BLUR,
  },
  dailySelection: {
    url: '/images/corte-ribeye.jpg',
    alt: 'Corte Diamante directo en la parrilla, listo para servir',
    blurDataURL: GENERIC_BLUR,
  },
  smokeSeries: {
    url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1600&q=80',
    alt: 'Costillas ahumadas lentamente, textura oscura y humo',
    blurDataURL: GENERIC_BLUR,
  },
  chefProgram: {
    url: '/images/chef-cortando-carne.jpg',
    alt: 'Chef profesional cortando un corte Diamante en cocina',
    blurDataURL: GENERIC_BLUR,
  },
  blackReserve: {
    url: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?auto=format&fit=crop&w=1600&q=80',
    alt: 'Corte madurado de exclusiva selección, plato de alta gama',
    blurDataURL: GENERIC_BLUR,
  },
  qrPlaceholder: {
    url: 'https://picsum.photos/seed/diamante-qr/400/400',
    alt: 'Código QR de contacto Diamante (placeholder)',
    blurDataURL: GENERIC_BLUR,
  },
};
