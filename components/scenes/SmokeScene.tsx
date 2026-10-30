"use client";

import { useRef } from "react";
import { m, useInView } from "framer-motion";
import {
  VIEWPORT_ONCE,
  CINEMATIC_EASE,
  revealVariants,
  staggerContainer,
} from "@/lib/motion";
import { usePrefersReducedMotion, useIsMobile } from "@/lib/useMediaQuery";
import { SMOKE_CUSTOM_MESSAGE, whatsappLink } from '@/lib/whatsapp';
import { productsByLine } from '@/lib/catalog';
import { useOrderActions } from '@/components/order/OrderProvider';
import GoldButton from '@/components/GoldButton';
import { WhatsAppIcon } from '@/components/Icons';
import SmokeParticles from "@/components/SmokeParticles";

const PRODUCTS = productsByLine("smoke");

export default function SmokeScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const inView = useInView(sectionRef, { amount: 0.2 });
  const { openProduct } = useOrderActions();

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-charcoal py-24"
    >
      {/* Fondo local (vertical en celular): carga rápido y no depende de un
          servidor externo, que en datos móviles dejaba la foto borrosa. */}
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/smoke-9x16.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/smoke-16x9.webp"
            alt="Brisket ahumado sobre papel de carnicero, con humo"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-charcoal/70" />
      </div>

      {/* Capa de humo que se disipa al entrar, revelando la imagen */}
      {reducedMotion ? null : (
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-charcoal"
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 1.6, ease: CINEMATIC_EASE }}
        />
      )}

      <SmokeParticles
        variant="smoke"
        intensity={isMobile ? "low" : "high"}
        active={inView && !reducedMotion}
      />

      <m.div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center"
        variants={staggerContainer(0.07, 0.2)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <m.h2
          className="font-condensed text-[12px] tracking-[0.35em] text-gold"
          variants={revealVariants(reducedMotion)}
        >
          SMOKE SERIES
        </m.h2>
        <m.p
          className="mt-6 font-serif text-[clamp(2.25rem,4.6vw,4rem)] font-medium leading-[1.02] text-bone"
          variants={revealVariants(reducedMotion)}
        >
          Cocción lenta. Sabor profundo.
        </m.p>
        <m.p
          className="mx-auto mt-6 max-w-[44ch] font-serif text-xl leading-relaxed text-bone/80"
          variants={revealVariants(reducedMotion)}
        >
          Nuestra línea de ahumados premium está diseñada para quienes buscan
          intensidad, textura y experiencias únicas alrededor del humo.
        </m.p>

        {/* Cada producto abre el pedido por WhatsApp con su nombre ya escrito */}
        {/* Los productos entran igual que el resto del texto. Antes llevaban un
            desenfoque solo en escritorio, pero si la página cambiaba de ancho
            (girar el celular, achicar la ventana) la lista se volvía a crear
            después de animarse y quedaba invisible aunque se podía tocar. */}
        <ul className="mt-12 flex flex-col items-center gap-x-10 gap-y-1 sm:flex-row sm:flex-wrap sm:justify-center">
          {PRODUCTS.map((product) => (
            <m.li key={product.id} variants={revealVariants(reducedMotion)}>
              <button
                type="button"
                onClick={() => openProduct(product.id)}
                className="group relative inline-flex min-h-[48px] items-center font-serif text-[clamp(1.6rem,2.6vw,2.25rem)] italic leading-tight text-gold transition-colors duration-200 ease-out hover:text-bone"
              >
                {product.name}
                <span
                  aria-hidden="true"
                  className="absolute bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-bone/70 transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </button>
            </m.li>
          ))}
        </ul>
        <m.p
          className="mt-4 font-condensed text-[12px] tracking-[0.3em] text-bone/70"
          variants={revealVariants(reducedMotion)}
        >
          TOCA UN PRODUCTO PARA AGREGARLO A TU PEDIDO
        </m.p>
        <m.div className="mt-8" variants={revealVariants(reducedMotion)}>
          <GoldButton href={whatsappLink(SMOKE_CUSTOM_MESSAGE)} external icon={<WhatsAppIcon className="h-4 w-4" />}>
            Personaliza tu corte
          </GoldButton>
        </m.div>

        <m.p
          className="mt-10 font-condensed text-[12px] tracking-[0.35em] text-bone/60"
          variants={revealVariants(reducedMotion)}
        >
          TIEMPO • HUMO • CARÁCTER
        </m.p>
      </m.div>
    </section>
  );
}
