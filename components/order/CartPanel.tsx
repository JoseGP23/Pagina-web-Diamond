'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { findProduct, LINES } from '@/lib/catalog';
import {
  EMPTY_CUSTOMER,
  MIN_ORDER_COP,
  PAYMENT_MODES,
  findPresentation,
  itemSummary,
  newOrderId,
  orderMessage,
  quantityLabel,
  type Customer,
  type PaymentMode,
} from '@/lib/order';
import { whatsappLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/Icons';
import { useOrder } from '@/components/order/OrderProvider';
import Sheet from '@/components/order/Sheet';
import { Choice, QuantityStepper } from '@/components/order/controls';

const CUSTOMER_STORAGE_KEY = 'diamante-customer-v1';

type CartPanelProps = {
  open: boolean;
  onClose: () => void;
};

type Errors = Partial<Record<keyof Customer | 'payment' | 'dataConsent' | 'terms', string>>;

const FIELDS: { key: keyof Customer; label: string; autoComplete: string; type?: string; optional?: boolean }[] = [
  { key: 'name', label: 'Nombre completo', autoComplete: 'name' },
  { key: 'phone', label: 'WhatsApp', autoComplete: 'tel', type: 'tel' },
  { key: 'city', label: 'Ciudad', autoComplete: 'address-level2' },
  { key: 'address', label: 'Dirección', autoComplete: 'street-address' },
  { key: 'neighborhood', label: 'Barrio', autoComplete: 'address-level3' },
  { key: 'property', label: 'Detalles del inmueble (torre, apto, casa…)', autoComplete: 'address-line2', optional: true },
];

/**
 * Pedido: carrito → datos → cupón → pago → términos → resumen a WhatsApp.
 * El asesor confirma precio, peso real, descuento, domicilio y pago; el
 * sitio no cobra ni da por pagado nada.
 */
export default function CartPanel({ open, onClose }: CartPanelProps) {
  const { items, setQty, removeItem, clearCart, browseLine, activeLine } = useOrder();

  const [orderId, setOrderId] = useState(() => newOrderId());
  const [customer, setCustomer] = useState<Customer>(EMPTY_CUSTOMER);
  const [coupon, setCoupon] = useState('');
  const [payment, setPayment] = useState<PaymentMode | ''>('');
  const [notes, setNotes] = useState('');
  const [dataConsent, setDataConsent] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Datos guardados de un pedido anterior (en este navegador), editables.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (saved) setCustomer({ ...EMPTY_CUSTOMER, ...JSON.parse(saved) });
    } catch {
      // Sin almacenamiento disponible: el formulario empieza vacío.
    }
  }, []);

  const href = useMemo(
    () =>
      whatsappLink(
        orderMessage({ orderId, items, customer, coupon: coupon.trim(), payment: payment || 'A', notes: notes.trim() }),
      ),
    [orderId, items, customer, coupon, payment, notes],
  );

  function validate(): Errors {
    const next: Errors = {};
    for (const field of FIELDS) {
      if (!field.optional && !customer[field.key].trim()) next[field.key] = 'Campo obligatorio.';
    }
    if (customer.phone.trim() && customer.phone.replace(/\D/g, '').length < 10) {
      next.phone = 'Escribe un número de al menos 10 dígitos.';
    }
    if (!payment) next.payment = 'Elige una modalidad de pago.';
    if (!dataConsent) next.dataConsent = 'Necesitamos tu autorización para gestionar el pedido.';
    if (!terms) next.terms = 'Debes aceptar los términos y condiciones.';
    return next;
  }

  function handleSend(e: React.MouseEvent<HTMLAnchorElement>) {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      e.preventDefault();
      // Lleva al primer campo con error.
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
    } catch {
      // Ignorado: solo es una comodidad para el próximo pedido.
    }
    setSent(true);
  }

  function startOver() {
    clearCart();
    setOrderId(newOrderId());
    setCoupon('');
    setNotes('');
    setTerms(false);
    setErrors({});
    setSent(false);
    browseLine(activeLine);
  }

  const updateCustomer = (key: keyof Customer, value: string) => {
    setCustomer((c) => ({ ...c, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  return (
    <Sheet open={open} onClose={onClose} label="Tu pedido" variant="side">
      <div className="flex flex-col gap-8 px-6 pb-10 pt-6 sm:px-8">
        <header className="pr-12">
          <p className="font-condensed text-[12px] tracking-[0.3em] text-gold">TU PEDIDO · {orderId}</p>
          <h3 className="mt-2 font-serif text-4xl font-medium leading-none text-bone">
            {sent ? 'Pedido listo en WhatsApp' : 'Resumen'}
          </h3>
        </header>

        {sent ? (
          <div className="flex flex-col gap-6">
            <p className="font-serif text-lg leading-relaxed text-bone/80">
              Abrimos WhatsApp con tu pedido <strong className="font-medium text-gold">{orderId}</strong>. Envía el
              mensaje desde el chat: un asesor valida existencias, precio final, domicilio y pago. Tu pedido queda
              confirmado cuando el asesor verifique el pago.
            </p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] items-center justify-center gap-3 border border-gold/50 px-6 font-condensed text-[14px] tracking-[0.2em] text-gold transition-colors duration-150 ease-out hover:bg-gold/10"
            >
              <WhatsAppIcon className="h-5 w-5" />
              ABRIR WHATSAPP DE NUEVO
            </a>
            <button
              type="button"
              onClick={startOver}
              className="min-h-[48px] font-condensed text-[13px] tracking-[0.2em] text-bone/70 underline-offset-4 transition-colors duration-150 ease-out hover:text-bone hover:underline"
            >
              EMPEZAR UN PEDIDO NUEVO
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-start gap-6">
            <p className="font-serif text-lg text-bone/75">Aún no has agregado productos.</p>
            <button
              type="button"
              onClick={() => browseLine(activeLine)}
              className="min-h-[52px] bg-gold px-6 font-condensed text-[14px] font-medium tracking-[0.2em] text-charcoal transition-[transform,background-color] duration-150 ease-out hover:bg-bone active:scale-[0.98]"
            >
              EXPLORAR PRODUCTOS
            </button>
          </div>
        ) : (
          <>
            {/* Productos */}
            <ul className="flex flex-col divide-y divide-bone/10 border-y border-bone/10">
              {items.map((item) => {
                const product = findProduct(item.productId);
                const presentation = findPresentation(product, item.presentationId);
                const line = LINES.find((l) => l.id === product?.line);
                return (
                  <li key={item.key} className="flex gap-4 py-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-black">
                      {product ? <Image src={product.image} alt="" fill sizes="80px" className="object-cover" /> : null}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div>
                        <p className="font-condensed text-[12px] tracking-[0.25em] text-gold">{line?.name}</p>
                        <p className="font-serif text-xl leading-tight text-bone">{product?.name}</p>
                        {itemSummary(item, false) ? (
                          <p className="mt-1 font-serif text-[15px] leading-snug text-bone/60">{itemSummary(item, false)}</p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {product?.pending ? (
                          <span />
                        ) : (
                          <QuantityStepper
                            size="sm"
                            value={item.qty}
                            onChange={(qty) => setQty(item.key, qty)}
                            label={quantityLabel(presentation, item.qty)}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          className="min-h-[44px] px-1 font-condensed text-[12px] tracking-[0.2em] text-bone/55 transition-colors duration-150 ease-out hover:text-bone"
                        >
                          QUITAR
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => browseLine(activeLine)}
              className="-mt-4 inline-flex min-h-[44px] items-center self-start font-condensed text-[13px] tracking-[0.2em] text-gold underline-offset-4 hover:underline"
            >
              + AGREGAR MÁS PRODUCTOS
            </button>

            <Notice>
              Pedido mínimo para despacho: <strong className="font-medium text-bone">${MIN_ORDER_COP.toLocaleString('es-CO')} COP</strong>.
              El asesor te confirma el precio final, el peso real de las piezas y el costo del domicilio.
            </Notice>

            <div ref={formRef} className="flex flex-col gap-8">
              {/* Datos de entrega */}
              <Section title="TUS DATOS DE ENTREGA">
                <div className="grid gap-4 sm:grid-cols-2">
                  {FIELDS.map((field) => (
                    <label key={field.key} className={`flex flex-col gap-1.5 ${field.key === 'address' || field.key === 'property' ? 'sm:col-span-2' : ''}`}>
                      <span className="font-serif text-base text-bone/75">
                        {field.label}
                        {field.optional ? <span className="text-bone/45"> (opcional)</span> : null}
                      </span>
                      <input
                        type={field.type ?? 'text'}
                        inputMode={field.type === 'tel' ? 'tel' : undefined}
                        autoComplete={field.autoComplete}
                        value={customer[field.key]}
                        onChange={(e) => updateCustomer(field.key, e.target.value)}
                        aria-invalid={Boolean(errors[field.key])}
                        className={inputClass}
                      />
                      <FieldError message={errors[field.key]} />
                    </label>
                  ))}
                </div>
                <Check
                  checked={dataConsent}
                  onChange={(v) => {
                    setDataConsent(v);
                    setErrors((e) => ({ ...e, dataConsent: undefined }));
                  }}
                  invalid={Boolean(errors.dataConsent)}
                >
                  Autorizo a DIAMANTE el tratamiento de mis datos personales para gestionar mi pedido y su entrega, según
                  la{' '}
                  <a href="/terminos#datos" target="_blank" className="text-gold underline underline-offset-2">
                    política de tratamiento de datos
                  </a>
                  .
                </Check>
                <FieldError message={errors.dataConsent} />
              </Section>

              {/* Cupón */}
              <Section title="CUPÓN DE DESCUENTO">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Escribe tu código (opcional)"
                  autoCapitalize="characters"
                  className={`${inputClass} uppercase placeholder:normal-case`}
                />
                <p className="font-serif text-[15px] leading-snug text-bone/55">
                  Cada cupón aplica solo a las líneas que cubre y no es acumulable. El asesor lo valida y aplica el
                  descuento.
                </p>
              </Section>

              {/* Pago */}
              <Section title="MODALIDAD DE PAGO">
                <div role="radiogroup" aria-invalid={Boolean(errors.payment)} tabIndex={-1} className="flex flex-col gap-2 outline-none">
                  {PAYMENT_MODES.map((mode) => (
                    <Choice
                      key={mode.id}
                      name="payment"
                      checked={payment === mode.id}
                      onChange={() => {
                        setPayment(mode.id);
                        setErrors((e) => ({ ...e, payment: undefined }));
                      }}
                    >
                      {mode.label}
                    </Choice>
                  ))}
                </div>
                <FieldError message={errors.payment} />
              </Section>

              <Section title="NOTAS PARA EL ASESOR">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Horario de entrega, indicaciones… (opcional)"
                  className={`${inputClass} py-3`}
                />
              </Section>

              <div className="flex flex-col gap-2">
                <Check
                  checked={terms}
                  onChange={(v) => {
                    setTerms(v);
                    setErrors((e) => ({ ...e, terms: undefined }));
                  }}
                  invalid={Boolean(errors.terms)}
                >
                  He leído y acepto los{' '}
                  <a href="/terminos" target="_blank" className="text-gold underline underline-offset-2">
                    términos y condiciones de compra de DIAMANTE
                  </a>
                  .
                </Check>
                <FieldError message={errors.terms} />
              </div>

              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSend}
                className="flex min-h-[56px] items-center justify-center gap-3 bg-gold px-6 font-condensed text-[14px] font-medium tracking-[0.2em] text-charcoal transition-[transform,background-color] duration-150 ease-out hover:bg-bone active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                ENVIAR PEDIDO POR WHATSAPP
              </a>
              <p className="-mt-4 text-center font-serif text-[15px] text-bone/55">
                El pedido se confirma cuando el asesor valida disponibilidad y verifica el pago.
              </p>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}

const inputClass =
  'min-h-[48px] w-full border border-bone/20 bg-charcoal px-4 font-serif text-lg text-bone placeholder:text-bone/35 focus:border-gold focus:outline-none aria-[invalid=true]:border-alert';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h4 className="font-condensed text-[12px] tracking-[0.25em] text-bone/65">{title}</h4>
      {children}
    </section>
  );
}

function Notice({ children }: { children: ReactNode }) {
  return <p className="border-l-2 border-gold/60 pl-4 font-serif text-base leading-snug text-bone/75">{children}</p>;
}

function FieldError({ message }: { message?: string }) {
  return message ? <span className="font-serif text-[15px] text-alert">{message}</span> : null;
}

function Check({
  checked,
  onChange,
  invalid,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  invalid: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 font-serif text-base leading-snug text-bone/80">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-invalid={invalid}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#c9a876]"
      />
      <span>{children}</span>
    </label>
  );
}
