'use client';

import { m } from 'framer-motion';
import { VIEWPORT_ONCE, CINEMATIC_EASE } from '@/lib/motion';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-bone/10 bg-charcoal-light px-6 pb-10 pt-20 sm:px-10 lg:px-16">
      <m.div
        className="mx-auto w-full max-w-6xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.9, ease: CINEMATIC_EASE }}
      >
        <div>
          <div className="flex items-center gap-4 text-gold">
            <Logo className="h-11 w-11" />
            <span className="font-condensed text-[12px] tracking-[0.4em] text-gold">FIRE • SMOKE • SELECTION</span>
          </div>
          <p className="mt-8 font-serif text-[clamp(3rem,8vw,6.5rem)] font-medium leading-none tracking-[0.12em] text-bone">
            DIAMANTE<sup className="ml-1 align-super text-[0.25em] tracking-normal text-bone/60">®</sup>
          </p>
          <p className="mt-3 font-condensed text-[12px] tracking-[0.4em] text-bone/65">SELECTED MEATS</p>
        </div>
      </m.div>

      <div className="mx-auto mt-16 flex w-full max-w-6xl flex-col gap-3 border-t border-bone/10 pt-6 font-condensed text-[12px] tracking-[0.3em] text-bone/60 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} DIAMANTE SELECTED MEATS</p>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-6">
          <a href="/terminos" className="inline-flex min-h-[44px] items-center transition-colors duration-200 ease-out hover:text-bone">
            TÉRMINOS Y CONDICIONES
          </a>
          <a href="/terminos#datos" className="inline-flex min-h-[44px] items-center transition-colors duration-200 ease-out hover:text-bone">
            DATOS PERSONALES
          </a>
        </nav>
      </div>
    </footer>
  );
}
