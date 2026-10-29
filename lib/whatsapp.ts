/**
 * WhatsApp Business de Diamante.
 *
 * Todos los botones de compra del sitio abren un chat con este número.
 * Cámbialo aquí, en formato internacional y solo dígitos: código de país
 * (57 para Colombia) seguido del número, sin "+", espacios ni guiones.
 */
export const WHATSAPP_NUMBER = '573222474145';

/** Número para mostrar en pantalla. */
export const WHATSAPP_DISPLAY = '+57 322 247 4145';

/** Mensaje inicial cuando no se eligió un corte en particular. */
const DEFAULT_MESSAGE = 'Hola Diamante, quiero hacer un pedido.';

/**
 * Enlace que abre el chat (app en el celular, WhatsApp Web en el
 * computador) con el mensaje ya escrito, listo para enviar.
 */
export function whatsappLink(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** «Personaliza tu corte» (SMOKE): el asesor cotiza y cierra fuera del carrito. */
export const SMOKE_CUSTOM_MESSAGE =
  'Hola Diamante, quiero personalizar un corte de la línea SMOKE. ¿Me ayudan con la cotización?';

/** Consulta general para la línea CHEF. */
export const CHEF_ADVISOR_MESSAGE =
  'Hola Diamante, quiero hablar con un asesor sobre un pedido de la línea CHEF.';

/** Pedido CHEF escrito por el cliente: lo gestiona por completo el asesor. */
export function chefOrderMessage(request: string): string {
  return `Hola Diamante, quiero hacer este pedido de la línea CHEF:\n\n${request.trim()}\n\nQuedo atento a disponibilidad y condiciones.`;
}
