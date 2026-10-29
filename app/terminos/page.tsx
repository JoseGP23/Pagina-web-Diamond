import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { MIN_ORDER_COP, TERMS_VERSION } from '@/lib/order';
import { WHATSAPP_DISPLAY } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Términos y condiciones — DIAMANTE',
  description: 'Condiciones de compra y tratamiento de datos personales de DIAMANTE Selected Meats.',
};

/**
 * Términos de compra y política de datos.
 *
 * BORRADOR: solo recoge reglas que el guion del cliente da por confirmadas.
 * Cambios y devoluciones, tiempos de entrega, tarifas de domicilio y los datos
 * legales del responsable siguen pendientes de validación comercial y legal.
 * Al cambiar este texto, actualiza TERMS_VERSION en lib/order.ts.
 */
export default function TerminosPage() {
  return (
    <main className="min-h-svh bg-charcoal px-6 py-16 text-bone sm:px-10 sm:py-24">
      <article className="mx-auto max-w-3xl">
        <a href="/" className="inline-flex min-h-[44px] items-center font-condensed text-[12px] tracking-[0.3em] text-gold hover:text-bone">
          ← VOLVER A DIAMANTE
        </a>
        <h1 className="mt-8 font-serif text-[clamp(2.5rem,6vw,4rem)] font-medium leading-none">Términos y condiciones de compra</h1>
        <p className="mt-4 font-condensed text-[12px] tracking-[0.3em] text-bone/60">VERSIÓN {TERMS_VERSION}</p>
        <p className="mt-6 border-l-2 border-gold/60 pl-4 font-serif text-lg leading-snug text-bone/75">
          Documento en revisión. Las secciones marcadas como pendientes se completarán cuando DIAMANTE las confirme.
        </p>

        <Section title="1. Cómo funciona un pedido">
          <p>
            Eliges tus productos en el sitio y envías el resumen por WhatsApp. El pedido no queda confirmado al enviarlo:
            un asesor de DIAMANTE valida la disponibilidad, el precio final, el domicilio y el pago, y te confirma por el
            mismo chat.
          </p>
          <p>Los pedidos de la línea CHEF y los cortes personalizados de SMOKE los cotiza y cierra directamente el asesor.</p>
        </Section>

        <Section title="2. Precios y peso">
          <p>
            El precio de cada porción es el anunciado para ese gramaje. Si una porción de 350 g pesa un poco más, conserva
            el precio publicado para 350 g. Preparamos cada corte con la mayor precisión posible y procuramos que cualquier
            variación sea a tu favor.
          </p>
          <p>
            En las piezas completas de peso variable (por ejemplo brisket, costillares o postas), el asesor te confirma el
            peso y el valor real antes de cerrar el pedido.
          </p>
        </Section>

        <Section title="3. Pedido mínimo">
          <p>El pedido mínimo para despacho es de ${MIN_ORDER_COP.toLocaleString('es-CO')} COP.</p>
        </Section>

        <Section title="4. Cupones de descuento">
          <p>
            Cada cupón aplica solo sobre los productos de las líneas que cubre; los productos de otras líneas conservan su
            precio completo. Los cupones no son acumulables: se usa uno por pedido. El asesor valida el código antes de
            aplicar el descuento.
          </p>
        </Section>

        <Section title="5. Domicilios y entregas">
          <p>El asesor confirma la cobertura, el costo y el tiempo de entrega de cada pedido.</p>
          <Pending>Tarifas, cobertura y tiempos de entrega.</Pending>
        </Section>

        <Section title="6. Pagos">
          <p>Puedes pagar de dos formas:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Pago anticipado del 100 %.</li>
            <li>Anticipo del 60 % para confirmar el pedido y 40 % contra entrega.</li>
          </ul>
          <p>
            Enviar un comprobante no confirma el pago: el pedido se da por pagado cuando el asesor verifica que el dinero
            fue acreditado.
          </p>
          <Pending>Cuentas y medios de pago habilitados.</Pending>
        </Section>

        <Section title="7. Cambios y devoluciones">
          <Pending>Política de cambios y devoluciones.</Pending>
        </Section>

        <Section title="8. Tratamiento de datos personales" id="datos">
          <p>
            Al hacer un pedido nos compartes tu nombre, número de WhatsApp, ciudad, dirección, barrio y detalles del
            inmueble. Usamos estos datos únicamente para gestionar tu pedido, coordinar la entrega y comunicarnos contigo
            sobre él, de acuerdo con la Ley 1581 de 2012 y sus decretos reglamentarios.
          </p>
          <p>
            El sitio no guarda tus datos en ningún servidor: viajan dentro del mensaje que tú envías por WhatsApp. Tu
            navegador los recuerda para tu próximo pedido y puedes editarlos en cualquier momento antes de enviarlo.
          </p>
          <p>
            Puedes conocer, actualizar, rectificar o pedir la eliminación de tus datos, y revocar esta autorización,
            escribiéndonos al WhatsApp {WHATSAPP_DISPLAY}.
          </p>
          <Pending>Razón social, NIT, domicilio y correo del responsable del tratamiento.</Pending>
        </Section>
      </article>
    </main>
  );
}

function Section({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-8">
      <h2 className="font-serif text-2xl font-medium text-gold">{title}</h2>
      <div className="mt-4 space-y-4 font-serif text-lg leading-relaxed text-bone/80">{children}</div>
    </section>
  );
}

function Pending({ children }: { children: ReactNode }) {
  return (
    <p className="font-condensed text-[13px] tracking-[0.15em] text-bone/50">
      PENDIENTE DE CONFIRMACIÓN: {String(children).toUpperCase()}
    </p>
  );
}
