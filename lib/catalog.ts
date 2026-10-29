/**
 * Catálogo de DIAMANTE, según el guion del cliente (versión del 9 de octubre de 2026).
 *
 * Es la única fuente de productos del sitio: las escenas y el armador de
 * pedidos leen de aquí. Para agregar un corte, cambiar una presentación o
 * confirmar un gramaje pendiente, edita solo este archivo.
 *
 * Regla del cliente: lo que no está confirmado NO se inventa. Un producto sin
 * presentación confirmada lleva `pending: true`; el cliente escribe cuánto
 * quiere y el asesor confirma por WhatsApp.
 *
 * Los precios no se publican: el asesor confirma precio, peso real,
 * descuentos y domicilio al recibir el pedido.
 */

export type LineId = 'daily' | 'smoke' | 'fire' | 'chef';

/** Cómo se cuenta la cantidad de una presentación. */
export type Unit =
  /** Incrementos de 500 g (500 g, 1 kg, 1,5 kg…). */
  | 'halfKilo'
  /** Kilos enteros (1, 2, 3 kg…). */
  | 'kilo'
  /** Piezas, racks o postas completas. */
  | 'piece'
  /** Porciones de un gramaje fijo. */
  | 'portion';

export type Presentation = {
  id: string;
  label: string;
  unit: Unit;
  /** Gramos por porción (solo `portion`). */
  grams?: number;
  /** Nombre de la pieza en singular/plural (solo `piece`). */
  piece?: [string, string];
  /** Peso orientativo, p. ej. "5 a 7 kg". */
  approx?: string;
};

export type Product = {
  id: string;
  name: string;
  line: Exclude<LineId, 'chef'>;
  sub: string;
  image: string;
  description: string;
  presentations: Presentation[];
  /** Sin presentación confirmada: el cliente escribe la cantidad. */
  pending?: boolean;
  /** Ofrecer porcionado de 150, 200 o 250 g. */
  portioning?: boolean;
  /** Ofrecer empaque al vacío Sí/No. */
  vacuum?: boolean;
  /** Peso variable: el asesor confirma el peso y el valor real. */
  variableWeight?: boolean;
  /** Pide un dato extra al cliente (p. ej. qué corte de res). */
  detailLabel?: string;
};

export type Line = {
  id: LineId;
  name: string;
  tagline: string;
  subs: string[];
};

export const LINES: Line[] = [
  {
    id: 'daily',
    name: 'DAILY',
    tagline: 'Cortes versátiles para el día a día.',
    subs: ['Res', 'Cerdo', 'Carne molida', 'Sobrebarriga', 'Costilla'],
  },
  {
    id: 'smoke',
    name: 'SMOKE',
    tagline: 'Piezas ahumadas lentamente, listas para compartir.',
    subs: ['Piezas enteras', 'Panceta', 'Costillas de res', 'Costillas de cerdo'],
  },
  {
    id: 'fire',
    name: 'FIRE',
    tagline: 'Cortes seleccionados para parrilla y fuego directo.',
    subs: ['Cortes con hueso', 'Cortes sin hueso'],
  },
  {
    id: 'chef',
    name: 'CHEF',
    tagline: 'Pedidos a la medida, gestionados por un asesor.',
    subs: [],
  },
];

export const PORTION_OPTIONS = ['Sin porcionar', 'Porciones de 150 g', 'Porciones de 200 g', 'Porciones de 250 g'];

const img = (slug: string) => `/images/productos/${slug}.webp`;
const byHalfKilo: Presentation[] = [{ id: 'kg', label: 'Por peso (de 500 g en 500 g)', unit: 'halfKilo' }];

export const PRODUCTS: Product[] = [
  // ─── DAILY ──────────────────────────────────────────────────────────────
  // El listado completo de cortes de res y cerdo sigue pendiente de la
  // matriz comercial: por ahora el cliente escribe qué corte busca.
  {
    id: 'daily-res',
    name: 'Cortes de res',
    line: 'daily',
    sub: 'Res',
    image: img('res'),
    description: 'Cortes de res para la cocina de todos los días.',
    presentations: byHalfKilo,
    portioning: true,
    vacuum: true,
    detailLabel: '¿Qué corte de res buscas?',
  },
  {
    id: 'daily-cerdo',
    name: 'Cortes de cerdo',
    line: 'daily',
    sub: 'Cerdo',
    image: img('cerdo'),
    description: 'Cortes de cerdo frescos, listos para tu preparación.',
    presentations: byHalfKilo,
    portioning: true,
    vacuum: true,
    detailLabel: '¿Qué corte de cerdo buscas?',
  },
  {
    id: 'daily-molida-magra',
    name: 'Molida Magra 90/10',
    line: 'daily',
    sub: 'Carne molida',
    image: img('molida'),
    description: '90 % carne, 10 % grasa.',
    presentations: byHalfKilo,
    vacuum: true,
  },
  {
    id: 'daily-molida-estandar',
    name: 'Molida Estándar 80/20',
    line: 'daily',
    sub: 'Carne molida',
    image: img('molida'),
    description: '80 % carne, 20 % grasa.',
    presentations: byHalfKilo,
    vacuum: true,
  },
  {
    id: 'daily-sobrebarriga',
    name: 'Sobrebarriga',
    line: 'daily',
    sub: 'Sobrebarriga',
    image: img('sobrebarriga'),
    description: 'Ideal para cocción lenta y preparaciones tradicionales.',
    presentations: byHalfKilo,
    vacuum: true,
  },
  {
    id: 'daily-costilla',
    name: 'Costilla de res',
    line: 'daily',
    sub: 'Costilla',
    image: img('costilla-res'),
    description: 'Costilla para sudados, caldos y horno.',
    presentations: byHalfKilo,
    vacuum: true,
  },

  // ─── SMOKE ──────────────────────────────────────────────────────────────
  {
    id: 'smoke-brisket',
    name: 'Brisket',
    line: 'smoke',
    sub: 'Piezas enteras',
    image: img('brisket'),
    description: 'Pieza completa ahumada, corteza de pimienta negra.',
    presentations: [{ id: 'pieza', label: 'Pieza completa', unit: 'piece', piece: ['pieza', 'piezas'], approx: '5 a 7 kg' }],
    vacuum: true,
    variableWeight: true,
  },
  {
    id: 'smoke-morrillo',
    name: 'Morrillo',
    line: 'smoke',
    sub: 'Piezas enteras',
    image: img('morrillo'),
    description: 'Pieza completa ahumada.',
    // Peso específico pendiente de confirmación.
    presentations: [{ id: 'pieza', label: 'Pieza completa', unit: 'piece', piece: ['pieza', 'piezas'] }],
    vacuum: true,
    variableWeight: true,
  },
  {
    id: 'smoke-panceta',
    name: 'Panceta de cerdo',
    line: 'smoke',
    sub: 'Panceta',
    image: img('panceta'),
    description: 'Panceta ahumada, capas de carne y grasa.',
    presentations: [{ id: 'kilo', label: 'Por kilo entero', unit: 'kilo' }],
    vacuum: true,
    variableWeight: true,
  },
  {
    id: 'smoke-ventanita',
    name: 'Ventanita',
    line: 'smoke',
    sub: 'Costillas de res',
    image: img('ventanita'),
    description: 'Costilla de res ahumada, pieza completa.',
    presentations: [{ id: 'pieza', label: 'Pieza completa', unit: 'piece', piece: ['pieza', 'piezas'], approx: '2 a 3 kg' }],
    vacuum: true,
    variableWeight: true,
  },
  {
    id: 'smoke-escudo-res',
    name: 'Escudo de res',
    line: 'smoke',
    sub: 'Costillas de res',
    image: img('escudo-res'),
    description: 'Costillar de res ahumado, pieza completa.',
    presentations: [{ id: 'pieza', label: 'Pieza completa', unit: 'piece', piece: ['pieza', 'piezas'], approx: '5 a 6 kg' }],
    vacuum: true,
    variableWeight: true,
  },
  {
    id: 'smoke-spareribs',
    name: 'Spareribs',
    line: 'smoke',
    sub: 'Costillas de cerdo',
    image: img('spareribs'),
    description: 'Costillas de cerdo ahumadas, rack completo.',
    presentations: [{ id: 'rack', label: 'Rack completo', unit: 'piece', piece: ['rack', 'racks'] }],
    vacuum: true,
    variableWeight: true,
  },
  {
    id: 'smoke-escudo-cerdo',
    name: 'Escudo de cerdo',
    line: 'smoke',
    sub: 'Costillas de cerdo',
    image: img('escudo-cerdo'),
    description: 'Costillar de cerdo ahumado, rack completo.',
    presentations: [{ id: 'rack', label: 'Rack completo', unit: 'piece', piece: ['rack', 'racks'] }],
    vacuum: true,
    variableWeight: true,
  },

  // ─── FIRE · Cortes con hueso ────────────────────────────────────────────
  {
    id: 'fire-tomahawk',
    name: 'Tomahawk',
    line: 'fire',
    sub: 'Cortes con hueso',
    image: img('tomahawk'),
    description: 'El corte más imponente, hueso largo y sabor profundo.',
    // Peso específico pendiente de matriz.
    presentations: [{ id: 'unidad', label: 'Por unidad', unit: 'piece', piece: ['unidad', 'unidades'] }],
    variableWeight: true,
  },
  {
    id: 'fire-porterhouse',
    name: 'Porterhouse',
    line: 'fire',
    sub: 'Cortes con hueso',
    image: img('porterhouse'),
    description: 'Lomo fino y lomo ancho en un solo corte, unidos por el hueso.',
    // Peso específico pendiente de matriz.
    presentations: [{ id: 'unidad', label: 'Por unidad', unit: 'piece', piece: ['unidad', 'unidades'] }],
    variableWeight: true,
  },
  {
    // El documento previo menciona 300 y 400 g: el cliente pidió validarlo antes de publicar.
    id: 'fire-t-bone',
    name: 'T-bone',
    line: 'fire',
    sub: 'Cortes con hueso',
    image: img('t-bone'),
    description: 'Clásico de parrilla con hueso en T.',
    presentations: [],
    pending: true,
  },
  {
    id: 'fire-ribeye',
    name: 'Ribeye',
    line: 'fire',
    sub: 'Cortes con hueso',
    image: img('ribeye'),
    description: 'Marmoleo generoso, jugoso al fuego directo.',
    presentations: [
      { id: 'p350', label: 'Porción de 350 g', unit: 'portion', grams: 350 },
      { id: 'p400', label: 'Porción de 400 g', unit: 'portion', grams: 400 },
    ],
  },
  {
    id: 'fire-asado-de-tira',
    name: 'Asado de tira',
    line: 'fire',
    sub: 'Cortes con hueso',
    image: img('asado-de-tira'),
    description: 'Costilla cortada en tira, tradición de parrilla.',
    presentations: [],
    pending: true,
  },

  // ─── FIRE · Cortes sin hueso ────────────────────────────────────────────
  {
    id: 'fire-new-york',
    name: 'New York',
    line: 'fire',
    sub: 'Cortes sin hueso',
    image: img('new-york'),
    description: 'Firme y sabroso, un clásico de parrilla.',
    presentations: [],
    pending: true,
  },
  {
    id: 'fire-bife-chorizo',
    name: 'Bife chorizo',
    line: 'fire',
    sub: 'Cortes sin hueso',
    image: img('bife-chorizo'),
    description: 'Corte alto y compacto, al estilo argentino.',
    presentations: [],
    pending: true,
  },
  {
    id: 'fire-punta-de-anca',
    name: 'Punta de anca',
    line: 'fire',
    sub: 'Cortes sin hueso',
    image: img('punta-de-anca'),
    description: 'Capa de grasa dorada, sabor intenso.',
    presentations: [],
    pending: true,
  },
  {
    // El documento previo menciona pieza completa de 1 a 1,5 kg: pendiente de validar.
    id: 'fire-picana',
    name: 'Picaña',
    line: 'fire',
    sub: 'Cortes sin hueso',
    image: img('picana'),
    description: 'Tierna y jugosa, protegida por su capa de grasa.',
    presentations: [],
    pending: true,
  },
  {
    id: 'fire-chata',
    name: 'Chata',
    line: 'fire',
    sub: 'Cortes sin hueso',
    image: img('chata'),
    description: 'Corte amplio y parejo, rendidor en la parrilla.',
    presentations: [],
    pending: true,
  },
  {
    id: 'fire-churrasco',
    name: 'Churrasco',
    line: 'fire',
    sub: 'Cortes sin hueso',
    image: img('churrasco'),
    description: 'Grueso y abierto en mariposa, para fuego alto.',
    presentations: [],
    pending: true,
  },
  {
    id: 'fire-ojo-de-bife',
    name: 'Ojo de bife',
    line: 'fire',
    sub: 'Cortes sin hueso',
    image: img('ojo-de-bife'),
    description: 'El centro del lomo ancho, marmoleo y terneza.',
    presentations: [
      { id: 'p300', label: 'Porción de 300 g', unit: 'portion', grams: 300 },
      { id: 'p350', label: 'Porción de 350 g', unit: 'portion', grams: 350 },
      { id: 'p400', label: 'Porción de 400 g', unit: 'portion', grams: 400 },
      { id: 'posta', label: 'Posta completa', unit: 'piece', piece: ['posta', 'postas'], approx: '1.700 a 2.200 g' },
    ],
  },
  {
    id: 'fire-lomo-fino',
    name: 'Lomo fino',
    line: 'fire',
    sub: 'Cortes sin hueso',
    image: img('lomo-fino'),
    description: 'El corte más tierno, en posta completa.',
    // Peso específico pendiente.
    presentations: [{ id: 'posta', label: 'Posta completa', unit: 'piece', piece: ['posta', 'postas'] }],
    variableWeight: true,
  },
];

export const productsByLine = (line: LineId) => PRODUCTS.filter((p) => p.line === line);

export const findProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
