/**
 * Cortes mostrados en el carrusel de "Fire Selection".
 *
 * Las fotos de producto están en `public/images/cortes/` (salen de
 * `originales/fotos/cortes/`, en WebP sobre fondo negro). Para agregar o
 * cambiar un corte, edita únicamente este archivo.
 */

export type Cut = {
  name: string;
  description: string;
  image: string;
};

export const CUTS: Cut[] = [
  {
    name: 'Ribeye',
    description: 'Marmoleo generoso, jugoso al fuego directo.',
    image: '/images/cortes/ribeye.webp',
  },
  {
    name: 'Picanha',
    description: 'Capa de grasa dorada, sabor intenso y tierno.',
    image: '/images/cortes/picanha.webp',
  },
  {
    name: 'Tomahawk',
    description: 'El corte más imponente, hueso largo y sabor profundo.',
    image: '/images/cortes/tomahawk.webp',
  },
  {
    name: 'Short Rib',
    description: 'Costilla ancha, textura suave tras cocción lenta.',
    image: '/images/cortes/short-rib.webp',
  },
  {
    name: 'Flat Iron',
    description: 'Corte versátil, tierno y de sabor equilibrado.',
    image: '/images/cortes/flat-iron.webp',
  },
  {
    name: 'New York Strip',
    description: 'Firme y sabroso, un clásico de parrilla.',
    image: '/images/cortes/new-york-strip.webp',
  },
];
