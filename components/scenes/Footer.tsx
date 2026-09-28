'use client';

import Image from 'next/image';
import { m } from 'framer-motion';
import { images } from '@/lib/images';
import { VIEWPORT_REPEAT, CINEMATIC_EASE } from '@/lib/motion';
import Logo from '@/components/Logo';

const CONTACT_LINKS = [
  { label: 'WhatsApp', value: '+57 300 000 0000', href: 'https://wa.me/573000000000' },
  { label: 'Instagram', value: '@diamante.meats', href: 'https://instagram.com/diamante.meats' },
];

export default function Footer() {
  return (
    <footer id="contacto" className="relative w-full border-t border-bone/10 bg-charcoal-light px-6 pb-10 pt-20 sm:px-10 lg:px-16">
      <m.div
        className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[1.4fr_1fr] lg:items-end"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT_REPEAT}
        transition={{ duration: 0.9, ease: CINEMATIC_EASE }}
      >
        <div>
          <div className="flex items-center gap-4 text-gold">
            <Logo className="h-11 w-11" />
            <span className="font-condensed text-[11px] tracking-[0.4em] text-gold">FIRE • SMOKE • SELECTION</span>
          </div>
          <p className="mt-8 font-serif text-[clamp(3rem,8vw,6.5rem)] font-medium leading-none tracking-[0.12em] text-bone">
            DIAMANTE<sup className="ml-1 align-super text-[0.25em] tracking-normal text-bone/60">®</sup>
          </p>
          <p className="mt-3 font-condensed text-[12px] tracking-[0.4em] text-bone/50">SELECTED MEATS</p>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between lg:justify-end lg:gap-12">
          <ul className="flex flex-col gap-4">
            {CONTACT_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1"
                >
                  <span className="font-condensed text-[11px] tracking-[0.3em] text-bone/50">{link.label.toUpperCase()}</span>
                  <span className="font-serif text-2xl text-bone transition-colors duration-200 ease-out group-hover:text-gold">
                    {link.value}
                  </span>
                </a>
              </li>
            ))}
            <li className="flex flex-col gap-1">
              <span className="font-condensed text-[11px] tracking-[0.3em] text-bone/50">UBICACIÓN</span>
              <span className="font-serif text-2xl text-bone">Colombia</span>
            </li>
          </ul>

          <div className="w-fit border border-gold/20 p-2">
            <Image
              src={images.qrPlaceholder.url}
              alt={images.qrPlaceholder.alt}
              width={96}
              height={96}
              className="block opacity-90"
              loading="lazy"
            />
          </div>
        </div>
      </m.div>

      <p className="mx-auto mt-16 w-full max-w-6xl border-t border-bone/10 pt-6 font-condensed text-[11px] tracking-[0.3em] text-bone/40">
        © {new Date().getFullYear()} DIAMANTE SELECTED MEATS
      </p>
    </footer>
  );
}
