import { findProduct, LINES, type Presentation, type Product } from '@/lib/catalog';

/**
 * Reglas comerciales del guion y armado del mensaje de pedido.
 *
 * El sitio no cobra ni calcula precios: arma un resumen claro y lo envía al
 * WhatsApp del asesor, que valida existencias, precio final, descuentos,
 * domicilio y pago.
 */

/** Mínimo para despacho, en pesos colombianos. */
export const MIN_ORDER_COP = 150_000;

/** Versión de los términos que acepta el cliente (se envía con el pedido). */
export const TERMS_VERSION = '2026-10-29';

export const PAYMENT_MODES = [
  { id: 'A', label: 'Pago anticipado del 100 %' },
  { id: 'B', label: 'Anticipo del 60 % y 40 % contra entrega' },
] as const;

export type PaymentMode = (typeof PAYMENT_MODES)[number]['id'];

export type CartItem = {
  /** Identifica la combinación producto + presentación + opciones. */
  key: string;
  productId: string;
  presentationId?: string;
  qty: number;
  portion?: string;
  vacuum?: boolean;
  detail?: string;
};

export type Customer = {
  name: string;
  phone: string;
  city: string;
  address: string;
  neighborhood: string;
  property: string;
};

export const EMPTY_CUSTOMER: Customer = {
  name: '',
  phone: '',
  city: '',
  address: '',
  neighborhood: '',
  property: '',
};

export function itemKey(item: Omit<CartItem, 'key' | 'qty'>): string {
  return [item.productId, item.presentationId, item.portion, item.vacuum, item.detail?.trim().toLowerCase()].join('|');
}

const kilos = (n: number) => `${n.toLocaleString('es-CO', { maximumFractionDigits: 1 })} kg`;

/** "1,5 kg", "2 porciones de 350 g", "1 pieza"… */
export function quantityLabel(presentation: Presentation | undefined, qty: number): string {
  if (!presentation) return `${qty}`;
  switch (presentation.unit) {
    case 'halfKilo':
      return qty === 1 ? '500 g' : kilos(qty / 2);
    case 'kilo':
      return kilos(qty);
    case 'portion':
      return `${qty} ${qty === 1 ? 'porción' : 'porciones'} de ${presentation.grams} g`;
    case 'piece': {
      const [one, many] = presentation.piece ?? ['unidad', 'unidades'];
      return `${qty} ${qty === 1 ? one : many}`;
    }
  }
}

export function findPresentation(product: Product | undefined, id: string | undefined) {
  return product?.presentations.find((p) => p.id === id);
}

/**
 * Descripción de una línea del carrito, sin el nombre del producto.
 * `withQty: false` omite la cantidad (el panel del pedido ya la muestra).
 */
export function itemSummary(item: CartItem, withQty = true): string {
  const product = findProduct(item.productId);
  const presentation = findPresentation(product, item.presentationId);
  const parts: string[] = [];

  if (product?.pending) {
    parts.push(`${item.detail} (presentación pendiente de confirmación)`);
  } else {
    if (product?.detailLabel && item.detail) parts.push(`Corte: ${item.detail}`);
    if (withQty) parts.push(quantityLabel(presentation, item.qty));
    if (presentation?.unit === 'piece' && presentation.label !== 'Por unidad') parts.push(presentation.label.toLowerCase());
    if (item.portion && item.portion !== 'Sin porcionar') parts.push(item.portion.toLowerCase());
  }
  if (product?.vacuum) parts.push(`empaque al vacío: ${item.vacuum ? 'sí' : 'no'}`);
  return parts.join(' · ');
}

/** Código corto para identificar el pedido en el chat, p. ej. DIA-2910-K7Q2. */
export function newOrderId(date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `DIA-${dd}${mm}-${suffix}`;
}

type OrderMessageInput = {
  orderId: string;
  items: CartItem[];
  customer: Customer;
  coupon: string;
  payment: PaymentMode;
  notes: string;
};

/** Resumen que llega al WhatsApp del asesor. */
export function orderMessage({ orderId, items, customer, coupon, payment, notes }: OrderMessageInput): string {
  const lineName = (id: string) => LINES.find((l) => l.id === id)?.name ?? '';
  const products = items.map((item, i) => {
    const product = findProduct(item.productId);
    return `${i + 1}. ${lineName(product?.line ?? '')} · ${product?.name ?? item.productId}: ${itemSummary(item)}`;
  });
  const paymentLabel = PAYMENT_MODES.find((p) => p.id === payment)?.label ?? '';
  const location = [customer.neighborhood, customer.city].filter(Boolean).join(', ');

  return [
    `*Nuevo pedido DIAMANTE* · ${orderId}`,
    '',
    '*Productos*',
    ...products,
    '',
    '*Cliente*',
    `Nombre: ${customer.name}`,
    `WhatsApp: ${customer.phone}`,
    `Dirección: ${customer.address}${location ? ` (${location})` : ''}`,
    ...(customer.property ? [`Detalles del inmueble: ${customer.property}`] : []),
    '',
    `*Cupón:* ${coupon ? `${coupon.toUpperCase()} (por validar)` : 'ninguno'}`,
    `*Pago:* ${payment} · ${paymentLabel}`,
    ...(notes ? [`*Notas:* ${notes}`] : []),
    '',
    `Acepté los términos y condiciones de compra de DIAMANTE (versión ${TERMS_VERSION}) y autoricé el tratamiento de mis datos.`,
    'Quedo atento a la confirmación de disponibilidad, peso, precio final, domicilio y pago.',
  ].join('\n');
}
