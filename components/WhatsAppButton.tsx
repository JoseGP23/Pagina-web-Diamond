import { whatsappLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/Icons';

/**
 * Botón flotante de compra por WhatsApp, visible en todo el sitio.
 * En celular es solo el ícono (no tapa el contenido); en pantallas más
 * anchas muestra también el texto. Aparece una vez al cargar, con un fade
 * corto, y respeta el área segura de los iPhone con notch.
 */
export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Comprar por WhatsApp"
      className="whatsapp-fab group fixed z-50 flex h-14 min-w-14 items-center justify-center gap-3 rounded-full border border-gold/40 bg-charcoal/85 px-4 text-gold shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition-[transform,background-color,border-color] duration-150 ease-out hover:border-gold hover:bg-charcoal active:scale-[0.96] sm:px-5"
      style={{
        right: 'max(1.25rem, env(safe-area-inset-right))',
        bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
      }}
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span className="hidden font-condensed text-[13px] tracking-[0.18em] sm:inline">COMPRAR POR WHATSAPP</span>
    </a>
  );
}
