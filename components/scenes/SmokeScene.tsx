"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useInView } from "framer-motion";
import { images } from "@/lib/images";
import {
  VIEWPORT_ONCE,
  CINEMATIC_EASE,
  revealVariants,
  staggerContainer,
} from "@/lib/motion";
import { usePrefersReducedMotion, useIsMobile } from "@/lib/useMediaQuery";
import { orderCutMessage, whatsappLink } from '@/lib/whatsapp';
import SmokeParticles from "@/components/SmokeParticles";

const PRODUCTS = [
  "Smoked Short Rib",
  "Hawaiian Style",
  "Brisket",
  "Beef Pastrami",
  "Smoke Selection",
];

export default function SmokeScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const inView = useInView(sectionRef, { amount: 0.2 });

  // Los productos se "condensan" desde el humo: desenfoque fuerte a nítido.
  // En celular sin desenfoque (es lo más caro de pintar): solo sube y aparece.
  const productVariants = reducedMotion
    ? revealVariants(true)
    : isMobile
      ? revealVariants(false)
      : {
          hidden: {
            opacity: 0,
            transform: "translateY(18px)",
            filter: "blur(6px)",
          },
          visible: {
            opacity: 1,
            transform: "translateY(0px)",
            filter: "blur(0px)",
            transition: { duration: 1, ease: CINEMATIC_EASE },
          },
        };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-charcoal py-24"
    >
      <div className="absolute inset-0">
        <Image
          src={images.smokeSeries.url}
          alt={images.smokeSeries.alt}
          fill
          sizes="100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={images.smokeSeries.blurDataURL}
          loading="lazy"
        />
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
        <ul className="mt-12 flex flex-col items-center gap-x-10 gap-y-1 sm:flex-row sm:flex-wrap sm:justify-center">
          {PRODUCTS.map((product) => (
            <m.li key={product} variants={productVariants}>
              <a
                href={whatsappLink(orderCutMessage(product))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Pedir ${product} por WhatsApp`}
                className="group relative inline-flex min-h-[48px] items-center font-serif text-[clamp(1.75rem,3vw,2.5rem)] italic leading-tight text-gold transition-colors duration-200 ease-out hover:text-bone"
              >
                {product}
                <span
                  aria-hidden="true"
                  className="absolute bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-bone/70 transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </a>
            </m.li>
          ))}
        </ul>
        <m.p
          className="mt-4 font-condensed text-[12px] tracking-[0.3em] text-bone/70"
          variants={revealVariants(reducedMotion)}
        >
          TOCA UN PRODUCTO PARA PEDIRLO POR WHATSAPP
        </m.p>

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
