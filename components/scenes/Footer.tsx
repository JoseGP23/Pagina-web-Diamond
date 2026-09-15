'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { images } from '@/lib/images';
import { VIEWPORT_REPEAT, CINEMATIC_EASE } from '@/lib/motion';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer id="contacto" className="relative w-full border-t border-bone/10 bg-charcoal-light px-6 py-14 sm:px-10 lg:px-16">
      <motion.div
        className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-10 lg:flex-row lg:items-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_REPEAT}
        transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
      >
        <div className="flex items-center gap-4 text-gold">
          <Logo className="h-11 w-11" />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-2xl tracking-wide text-bone">
              DIAMANTE<sup className="ml-0.5 text-xs align-super">®</sup>
            </span>
            <span className="mt-1 font-condensed text-[10px] tracking-[0.4em] text-bone/50">
              SELECTED MEATS
            </span>
            <span className="mt-2 font-condensed text-[10px] tracking-[0.4em] text-gold">
              FIRE • SMOKE • SELECTION
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-10">
          <div className="flex flex-col gap-3 font-serif text-base text-bone/85">
            <a
              href="https://wa.me/573000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold"
            >
              WhatsApp — +57 300 000 0000
            </a>
            <a
              href="https://instagram.com/diamante.meats"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold"
            >
              @diamante.meats
            </a>
            <span>Colombia</span>
          </div>

          <div className="overflow-hidden rounded-lg border border-gold/20">
            <Image
              src={images.qrPlaceholder.url}
              alt={images.qrPlaceholder.alt}
              width={96}
              height={96}
              className="opacity-90"
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>

      <p className="mx-auto mt-10 w-full max-w-6xl border-t border-bone/10 pt-6 text-center font-condensed text-[10px] tracking-[0.3em] text-bone/30 sm:text-left">
        © {new Date().getFullYear()} DIAMANTE SELECTED MEATS
      </p>
    </footer>
  );
}
