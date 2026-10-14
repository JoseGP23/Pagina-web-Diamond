/**
 * Productos por línea. Las fotos están en `public/images/cortes/` (salen de
 * `originales/fotos/cortes/`, convertidas a WebP). Para agregar o cambiar un
 * corte, edita solo este archivo.
 */

export type Cut = {
  name: string;
  description: string;
  image: string;
};

const photo = (file: string) => `/images/cortes/${file}.webp`;

/** Fire Selection: cortes para parrilla y fuego directo (carrusel). */
export const CUTS: Cut[] = [
  {
    name: 'Ribeye',
    description: 'Marmoleo generoso, jugoso al fuego directo.',
    image: photo('ribeye'),
  },
  {
    name: 'Picanha',
    description: 'Capa de grasa dorada, sabor intenso y tierno.',
    image: photo('picanha'),
  },
  {
    name: 'Tomahawk',
    description: 'El corte más imponente, hueso largo y sabor profundo.',
    image: photo('tomahawk'),
  },
  {
    name: 'Short Rib',
    description: 'Costilla ancha, textura suave tras cocción lenta.',
    image: photo('short-rib'),
  },
  {
    name: 'Flat Iron',
    description: 'Corte versátil, tierno y de sabor equilibrado.',
    image: photo('flat-iron'),
  },
  {
    name: 'New York Strip',
    description: 'Firme y sabroso, un clásico de parrilla.',
    image: photo('new-york-strip'),
  },
];

/** Daily Selection: cortes para la cocina de todos los días. */
export const DAILY_CUTS: Cut[] = [
  { name: 'Chatas', description: 'Tiernas y rápidas a la plancha.', image: photo('chatas') },
  { name: 'Solomito', description: 'El corte más suave, para ocasiones especiales.', image: photo('solomito') },
  { name: 'Muchacho', description: 'Ideal para asar en horno o sudar lento.', image: photo('muchacho') },
  { name: 'Sobrebarriga', description: 'Sabor profundo, perfecta al horno o en salsa.', image: photo('sobrebarriga') },
  { name: 'Molida Premium', description: 'Para hamburguesas y preparaciones del día a día.', image: photo('molida-premium') },
];

/** Smoke Series: ahumados de cocción lenta. */
export const SMOKE_CUTS: Cut[] = [
  { name: 'Smoked Short Rib', description: 'Costilla ahumada hasta deshacerse.', image: photo('smoked-short-rib') },
  { name: 'Hawaiian Style', description: 'Glaseado dulce con piña asada.', image: photo('hawaiian-style') },
  { name: 'Brisket', description: 'Doce horas de humo y corteza de pimienta.', image: photo('brisket') },
  { name: 'Beef Pastrami', description: 'Curado, especiado y ahumado.', image: photo('beef-pastrami') },
  { name: 'Smoke Selection', description: 'Una tabla con lo mejor del ahumador.', image: photo('smoke-selection') },
];

/** Black Reserve: madurados en seco. */
export const RESERVE_CUTS: Cut[] = [
  { name: 'Ribeye Dry Aged', description: '', image: photo('ribeye-dry-aged') },
  { name: 'New York Dry Aged', description: '', image: photo('new-york-dry-aged') },
  { name: 'Tomahawk Dry Aged', description: '', image: photo('tomahawk-dry-aged') },
];
