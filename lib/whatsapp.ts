/**
 * WhatsApp Business de Diamante.
 *
 * Todos los botones de compra del sitio abren un chat con este número.
 * Cámbialo aquí, en formato internacional y solo dígitos: código de país
 * (57 para Colombia) seguido del número, sin "+", espacios ni guiones.
 */
export const WHATSAPP_NUMBER = '573000000000';

/** Número para mostrar en pantalla, ej. "+57 300 000 0000". */
export const WHATSAPP_DISPLAY = '+57 300 000 0000';

/** Mensaje inicial cuando no se eligió un corte en particular. */
const DEFAULT_MESSAGE = 'Hola Diamante, quiero hacer un pedido.';

/**
 * Enlace que abre el chat (app en el celular, WhatsApp Web en el
 * computador) con el mensaje ya escrito, listo para enviar.
 */
export function whatsappLink(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function orderCutMessage(cut: string): string {
  return `Hola Diamante, quiero pedir ${cut}. ¿Me cuentan disponibilidad y precio?`;
}
