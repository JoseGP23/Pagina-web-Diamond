'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { findProduct, LINES, PORTION_OPTIONS } from '@/lib/catalog';
import { quantityLabel } from '@/lib/order';
import { useOrderActions } from '@/components/order/OrderProvider';
import Sheet from '@/components/order/Sheet';
import { Choice, QuantityStepper } from '@/components/order/controls';

type ProductSheetProps = {
  productId: string | null;
  onClose: () => void;
};

/**
 * Ficha de producto: presentación → cantidad → opciones → agregar al pedido.
 * Solo ofrece lo que el guion da por confirmado; lo pendiente se pide como
 * texto libre y lo confirma el asesor.
 */
export default function ProductSheet({ productId, onClose }: ProductSheetProps) {
  const requested = productId ? findProduct(productId) : undefined;
  // Se conserva el último producto para que la ficha no quede vacía
  // mientras se anima el cierre.
  const [product, setProduct] = useState(requested);
  useEffect(() => {
    if (requested) setProduct(requested);
  }, [requested]);
  const { addItem } = useOrderActions();

  const [presentationId, setPresentationId] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [portion, setPortion] = useState(PORTION_OPTIONS[0]);
  const [vacuum, setVacuum] = useState(false);
  const [detail, setDetail] = useState('');
  const [error, setError] = useState('');

  // Cada vez que se abre una ficha empieza limpia.
  useEffect(() => {
    if (!product) return;
    setPresentationId(product.presentations[0]?.id);
    setQty(product.presentations[0]?.unit === 'halfKilo' ? 2 : 1);
    setPortion(PORTION_OPTIONS[0]);
    setVacuum(false);
    setDetail('');
    setError('');
  }, [product]);

  const presentation = product?.presentations.find((p) => p.id === presentationId);
  const line = LINES.find((l) => l.id === product?.line);
  const needsDetail = Boolean(product?.pending || product?.detailLabel);

  function handleAdd() {
    if (!product) return;
    if (needsDetail && !detail.trim()) {
      setError(product.pending ? 'Escribe cuánto necesitas.' : 'Escribe qué corte buscas.');
      return;
    }
    addItem({
      productId: product.id,
      presentationId: product.pending ? undefined : presentationId,
      qty: product.pending ? 1 : qty,
      portion: product.portioning ? portion : undefined,
      vacuum: product.vacuum ? vacuum : undefined,
      detail: needsDetail ? detail.trim() : undefined,
    });
    onClose();
  }

  return (
    <Sheet open={Boolean(requested)} onClose={onClose} label={product?.name ?? 'Producto'} variant="center">
      {product ? (
        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-[4/3] bg-black md:aspect-auto md:min-h-[520px]">
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover" />
          </div>

          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <div>
              <p className="font-condensed text-[12px] tracking-[0.3em] text-gold">
                {line?.name} · {product.sub.toUpperCase()}
              </p>
              <h3 className="mt-2 font-serif text-4xl font-medium leading-none text-bone">{product.name}</h3>
              <p className="mt-3 font-serif text-lg leading-snug text-bone/70">{product.description}</p>
            </div>

            {product.pending ? (
              <p className="border-l-2 border-gold/60 pl-4 font-serif text-base leading-snug text-bone/80">
                Presentaciones y gramajes <strong className="font-medium text-gold">pendientes de confirmación</strong>.
                Cuéntanos cuánto necesitas y el asesor te confirma por WhatsApp.
              </p>
            ) : null}

            {!product.pending && product.presentations.length > 1 ? (
              <fieldset>
                <legend className="mb-2 font-condensed text-[12px] tracking-[0.25em] text-bone/65">PRESENTACIÓN</legend>
                <div className="flex flex-wrap gap-2">
                  {product.presentations.map((p) => (
                    <Choice
                      key={p.id}
                      name="presentation"
                      checked={p.id === presentationId}
                      onChange={() => {
                        setPresentationId(p.id);
                        setQty(1);
                      }}
                    >
                      {p.label}
                    </Choice>
                  ))}
                </div>
              </fieldset>
            ) : null}

            {!product.pending && presentation ? (
              <div>
                <p className="mb-2 font-condensed text-[12px] tracking-[0.25em] text-bone/65">
                  {presentation.unit === 'halfKilo' || presentation.unit === 'kilo' ? 'PESO' : 'CANTIDAD'}
                  {product.presentations.length === 1 ? ` · ${presentation.label.toUpperCase()}` : ''}
                </p>
                <QuantityStepper value={qty} onChange={setQty} label={quantityLabel(presentation, qty)} />
                {presentation.approx ? (
                  <p className="mt-2 font-serif text-base text-bone/60">Peso aproximado por pieza: {presentation.approx}.</p>
                ) : null}
              </div>
            ) : null}

            {needsDetail ? (
              <label className="flex flex-col gap-2">
                <span className="font-condensed text-[12px] tracking-[0.25em] text-bone/65">
                  {(product.pending ? '¿Cuánto necesitas?' : product.detailLabel ?? '').toUpperCase()}
                </span>
                <input
                  type="text"
                  value={detail}
                  onChange={(e) => {
                    setDetail(e.target.value);
                    setError('');
                  }}
                  placeholder={product.pending ? 'Ej.: 2 piezas, 1 kg…' : 'Ej.: muchacho, lomo…'}
                  aria-invalid={Boolean(error)}
                  className="min-h-[48px] border border-bone/20 bg-charcoal px-4 font-serif text-lg text-bone placeholder:text-bone/35 focus:border-gold focus:outline-none"
                />
                {error ? <span className="font-serif text-base text-alert">{error}</span> : null}
              </label>
            ) : null}

            {product.portioning ? (
              <fieldset>
                <legend className="mb-2 font-condensed text-[12px] tracking-[0.25em] text-bone/65">PORCIONADO</legend>
                <div className="flex flex-wrap gap-2">
                  {PORTION_OPTIONS.map((option) => (
                    <Choice key={option} name="portion" checked={portion === option} onChange={() => setPortion(option)}>
                      {option}
                    </Choice>
                  ))}
                </div>
              </fieldset>
            ) : null}

            {product.vacuum ? (
              <fieldset>
                <legend className="mb-2 font-condensed text-[12px] tracking-[0.25em] text-bone/65">EMPAQUE AL VACÍO</legend>
                <div className="flex gap-2">
                  <Choice name="vacuum" checked={vacuum} onChange={() => setVacuum(true)}>
                    Sí
                  </Choice>
                  <Choice name="vacuum" checked={!vacuum} onChange={() => setVacuum(false)}>
                    No
                  </Choice>
                </div>
              </fieldset>
            ) : null}

            {product.variableWeight && !product.pending ? (
              <p className="font-serif text-base leading-snug text-bone/60">
                Pieza de peso variable: el asesor te confirma el peso y el valor real antes de cerrar el pedido.
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleAdd}
              className="mt-auto min-h-[52px] bg-gold px-6 font-condensed text-[14px] font-medium tracking-[0.2em] text-charcoal transition-[transform,background-color] duration-150 ease-out hover:bg-bone active:scale-[0.98]"
            >
              AGREGAR AL PEDIDO
            </button>
          </div>
        </div>
      ) : null}
    </Sheet>
  );
}
