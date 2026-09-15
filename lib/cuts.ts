/**
 * Cortes mostrados en el carrusel de "Fire Selection".
 *
 * Cada corte puede tener una foto y, opcionalmente, un video real (se
 * reproduce en loop mientras esa diapositiva está activa). Para agregar o
 * cambiar un corte, edita únicamente este archivo.
 */

export type Cut = {
  name: string;
  description: string;
  image: string;
  video?: string;
};

export const CUTS: Cut[] = [
  {
    name: 'Ribeye',
    description: 'Marmoleo generoso, jugoso al fuego directo.',
    image: '/images/corte-ribeye.jpg',
    video: '/videos/corte-ribeye.mp4',
  },
  {
    name: 'Picanha',
    description: 'Capa de grasa dorada, sabor intenso y tierno.',
    image: '/images/corte-picanha.webp',
    video: '/videos/corte-picanha.mp4',
  },
  {
    name: 'Tomahawk',
    description: 'El corte más imponente, hueso largo y sabor profundo.',
    image: '/images/corte-tomahawk.jpg',
    video: '/videos/corte-tomahawk.mp4',
  },
  {
    name: 'Short Rib',
    description: 'Costilla ancha, textura suave tras cocción lenta.',
    image: '/images/corte-short-rib.webp',
  },
  {
    name: 'Flat Iron',
    description: 'Corte versátil, tierno y de sabor equilibrado.',
    image: '/images/corte-flat-iron.jpg',
  },
  {
    name: 'New York Strip',
    description: 'Firme y sabroso, un clásico de parrilla.',
    image: '/images/corte-new-york-strip.jpg',
  },
];
