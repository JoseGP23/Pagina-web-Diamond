'use client';

import { useState } from 'react';
import Image from 'next/image';
import { m } from 'framer-motion';
import { LINES, productsByLine, type LineId, type Product } from '@/lib/catalog';
import { MIN_ORDER_COP } from '@/lib/order';
import { CINEMATIC_EASE, EASE_OUT, VIEWPORT_ONCE, revealVariants, staggerContainer } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';
import { CHEF_ADVISOR_MESSAGE, SMOKE_CUSTOM_MESSAGE, chefOrderMessage, whatsappLink } from '@/lib/whatsapp';
import { CutIcon, WhatsAppIcon } from '@/components/Icons';
import { useOrder } from '@/components/order/OrderProvider';

/** Resumen corto de cómo se vende un producto, para la tarjeta. */
function saleSummary(product: Product): string {
  if (product.pending) return 'Presentación pendiente de confirmación';
  const [first] = product.presentations;
  if (product.presentations.length > 1) {
    const grams = product.presentations.filter((p) => p.unit === 'portion').map((p) => p.grams);
    const hasPiece = product.presentations.some((p) => p.unit === 'piece');
    return `Porciones de ${grams.join(', ').replace(/, (\d+)$/, ' y $1')} g${hasPiece ? ' · posta completa' : ''}`;
  }
  switch (first?.unit) {
    case 'halfKilo':
      return product.portioning ? 'Desde 500 g · porcionado opcional' : 'Desde 500 g';
    case 'kilo':
      return 'Por kilo entero';
    case 'piece':
      return `${first.label}${first.approx ? ` · aprox. ${first.approx}` : ''}`;
    default:
      return '';
  }
}

const INFO = [
  { title: 'Pedido mínimo', text: `$${MIN_ORDER_COP.toLocaleString('es-CO')} COP para despacho.` },
  { title: 'Formas de pago', text: '100 % anticipado, o 60 % de anticipo y 40 % contra entrega.' },
  { title: 'Domicilio', text: 'El asesor confirma cobertura, costo y tiempo de entrega.' },
  { title: 'Precio por porción', text: 'Una porción anunciada conserva su precio aunque pese un poco más.' },
];

/**
 * Armador de pedidos: línea → subcategoría → producto. La ficha de cada
 * producto pide la presentación y lo agrega al pedido, que se conserva al
 * cambiar de línea. CHEF no usa carrito: va directo al asesor.
 */
export default function CatalogScene() {
  const reducedMotion = usePrefersReducedMotion();
  const { activeLine, setActiveLine, openProduct } = useOrder();
  const [sub, setSub] = useState<string | null>(null);
  const [chefRequest, setChefRequest] = useState('');

  const line = LINES.find((l) => l.id === activeLine)!;
  const products = productsByLine(activeLine).filter((p) => !sub || p.sub === sub);

  function selectLine(id: LineId) {
    setActiveLine(id);
    setSub(null);
  }

  const fade = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        initial: { opacity: 0, transform: 'translateY(6px)' },
        animate: { opacity: 1, transform: 'translateY(0px)', transition: { duration: 0.25, ease: EASE_OUT } },
      };

  return (
    <section id="pedido" className="relative w-full scroll-mt-0 bg-charcoal-light py-24 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <m.header
          className="max-w-3xl"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <m.p className="font-condensed text-[12px] tracking-[0.35em] text-gold" variants={revealVariants(reducedMotion)}>
            HAZ TU PEDIDO
          </m.p>
          <m.h2
            className="mt-5 font-serif text-[clamp(2.5rem,5vw,4.25rem)] font-medium leading-[1.02] text-bone"
            variants={revealVariants(reducedMotion)}
          >
            Bienvenido a DIAMANTE.
          </m.h2>
          <m.p className="mt-4 font-serif text-xl leading-relaxed text-bone/75" variants={revealVariants(reducedMotion)}>
            ¿Qué línea deseas explorar: DAILY, SMOKE, FIRE o CHEF?
          </m.p>
        </m.header>

        {/* Líneas */}
        <div role="tablist" aria-label="Líneas de producto" className="mt-12 grid grid-cols-2 gap-px bg-bone/10 sm:grid-cols-4">
          {LINES.map((l) => {
            const active = l.id === activeLine;
            return (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="pedido-panel"
                onClick={() => selectLine(l.id)}
                className={`group relative flex min-h-[64px] flex-col sm:min-h-[96px] items-start justify-center gap-1 px-5 py-4 text-left transition-colors duration-200 ease-out ${
                  active ? 'bg-charcoal' : 'bg-charcoal-light hover:bg-charcoal/60'
                }`}
              >
                <span className={`font-condensed text-2xl tracking-[0.18em] transition-colors duration-200 ${active ? 'text-gold' : 'text-bone/80 group-hover:text-bone'}`}>
                  {l.name}
                </span>
                <span className="hidden font-serif text-[15px] leading-snug text-bone/55 sm:block">{l.tagline}</span>
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold transition-transform duration-300 ease-out ${active ? 'scale-x-100' : 'scale-x-0'}`}
                />
              </button>
            );
          })}
        </div>

        <div id="pedido-panel" role="tabpanel" aria-label={`Línea ${line.name}`} className="mt-8">
          <p className="font-serif text-lg text-bone/65 sm:hidden">{line.tagline}</p>

          {line.id === 'chef' ? (
            <m.div key="chef" {...fade} className="grid gap-10 border border-bone/10 bg-charcoal p-6 sm:p-10 md:grid-cols-[1fr_1.2fr]">
              <div>
                <h3 className="font-serif text-3xl font-medium leading-tight text-bone">Escribe tu pedido</h3>
                <p className="mt-4 font-serif text-lg leading-relaxed text-bone/70">
                  Cuéntanos el corte, la cantidad y la unidad que necesitas. Un asesor revisa disponibilidad, condiciones y
                  precio, y cierra el pedido contigo por WhatsApp.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                  <span className="font-condensed text-[12px] tracking-[0.25em] text-bone/65">TU PEDIDO</span>
                  <textarea
                    value={chefRequest}
                    onChange={(e) => setChefRequest(e.target.value)}
                    rows={5}
                    placeholder="Ej.: 10 kg de lomo fino en porciones de 200 g, empacado al vacío."
                    className="w-full border border-bone/20 bg-charcoal-light px-4 py-3 font-serif text-lg text-bone placeholder:text-bone/35 focus:border-gold focus:outline-none"
                  />
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={chefRequest.trim() ? whatsappLink(chefOrderMessage(chefRequest)) : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!chefRequest.trim()}
                    className="flex min-h-[52px] flex-1 items-center justify-center gap-3 bg-gold px-6 font-condensed text-[14px] font-medium tracking-[0.2em] text-charcoal transition-[transform,background-color,opacity] duration-150 ease-out hover:bg-bone active:scale-[0.98] aria-disabled:pointer-events-none aria-disabled:opacity-40"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    ENVIAR AL ASESOR
                  </a>
                  <a
                    href={whatsappLink(CHEF_ADVISOR_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[52px] flex-1 items-center justify-center border border-gold/50 px-6 font-condensed text-[14px] tracking-[0.2em] text-gold transition-colors duration-150 ease-out hover:bg-gold/10"
                  >
                    CONSULTAR CON UN ASESOR
                  </a>
                </div>
              </div>
            </m.div>
          ) : (
            <>
              {/* Subcategorías: filtran la lista para no desplegar todo a la vez */}
              <div className="flex flex-wrap gap-2" role="group" aria-label="Subcategorías">
                {[null, ...line.subs].map((s) => {
                  const active = s === sub;
                  return (
                    <button
                      key={s ?? 'all'}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSub(s)}
                      className={`min-h-[44px] border px-4 font-condensed text-[13px] tracking-[0.15em] transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] ${
                        active ? 'border-gold bg-gold/15 text-bone' : 'border-bone/15 text-bone/65 hover:border-bone/40 hover:text-bone'
                      }`}
                    >
                      {(s ?? 'Todos').toUpperCase()}
                    </button>
                  );
                })}
              </div>

              <m.ul key={`${activeLine}-${sub}`} {...fade} className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                {products.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => openProduct(product.id)}
                      className="group flex h-full w-full flex-col overflow-hidden border border-bone/10 bg-charcoal text-left transition-[border-color,transform] duration-200 ease-out hover:border-gold/50 active:scale-[0.99]"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 1024px) 50vw, 380px"
                          className="object-cover transition-transform duration-500 ease-cinematic group-hover:scale-[1.04]"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-5">
                        <span className="hidden font-condensed text-[12px] tracking-[0.25em] text-bone/55 sm:block">{product.sub.toUpperCase()}</span>
                        <span className="font-serif text-xl leading-tight text-bone sm:text-2xl">{product.name}</span>
                        <span className={`mt-1 font-serif text-sm leading-snug sm:text-[15px] ${product.pending ? 'text-gold/85' : 'text-bone/60'}`}>
                          {saleSummary(product)}
                        </span>
                        <span className="mt-auto hidden pt-4 font-condensed text-[12px] tracking-[0.25em] text-gold sm:block">
                          ELEGIR PRESENTACIÓN →
                        </span>
                      </div>
                    </button>
                  </li>
                ))}

                {activeLine === 'smoke' ? (
                  <li>
                    <a
                      href={whatsappLink(SMOKE_CUSTOM_MESSAGE)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-full min-h-[220px] flex-col justify-between gap-4 border border-dashed border-gold/40 bg-charcoal p-4 sm:min-h-[280px] sm:gap-6 sm:p-6 transition-colors duration-200 ease-out hover:border-gold hover:bg-gold/5"
                    >
                      <CutIcon className="h-10 w-10 text-gold" />
                      <span>
                        <span className="block font-serif text-xl leading-tight text-bone sm:text-2xl">Personaliza tu corte</span>
                        <span className="mt-2 block font-serif text-sm leading-snug text-bone/60 sm:text-[15px]">
                          ¿Buscas algo distinto? Un asesor te cotiza y cierra el pedido directamente por WhatsApp.
                        </span>
                      </span>
                      <span className="flex items-center gap-2 font-condensed text-[12px] tracking-[0.2em] text-gold sm:tracking-[0.25em]">
                        <WhatsAppIcon className="h-4 w-4" /> HABLAR CON UN ASESOR
                      </span>
                    </a>
                  </li>
                ) : null}
              </m.ul>
            </>
          )}
        </div>

        {/* Condiciones confirmadas en el guion */}
        <m.dl
          className="mt-16 grid gap-px bg-bone/10 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
        >
          {INFO.map((item) => (
            <div key={item.title} className="bg-charcoal-light p-5">
              <dt className="font-condensed text-[12px] tracking-[0.25em] text-gold">{item.title.toUpperCase()}</dt>
              <dd className="mt-2 font-serif text-base leading-snug text-bone/70">{item.text}</dd>
            </div>
          ))}
        </m.dl>
      </div>
    </section>
  );
}
