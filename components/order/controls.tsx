'use client';

import type { ReactNode } from 'react';

type ChoiceProps = {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
};

/** Opción tipo "chip" (un radio nativo por dentro, accesible con teclado). */
export function Choice({ name, checked, onChange, children }: ChoiceProps) {
  return (
    <label
      className={`relative inline-flex min-h-[44px] cursor-pointer items-center border px-4 font-serif text-base transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
        checked ? 'border-gold bg-gold/15 text-bone' : 'border-bone/20 text-bone/75 hover:border-bone/45'
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  /** Texto de la cantidad (p. ej. "1,5 kg"). */
  label: string;
  size?: 'md' | 'sm';
};

export function QuantityStepper({ value, onChange, label, size = 'md' }: QuantityStepperProps) {
  const button = `flex items-center justify-center text-gold transition-[transform,background-color] duration-150 ease-out hover:bg-gold/10 active:scale-[0.94] disabled:opacity-30 ${
    size === 'md' ? 'h-12 w-12' : 'h-11 w-11'
  }`;
  return (
    <div className="inline-flex items-center border border-bone/20">
      <button type="button" className={button} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Menos">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
          <path d="M5 12h14" strokeLinecap="round" />
        </svg>
      </button>
      <output
        aria-live="polite"
        className={`whitespace-nowrap text-center font-serif tabular-nums text-bone ${size === 'md' ? 'min-w-[11rem] px-3 text-lg' : 'min-w-[7rem] px-1 text-[15px]'}`}
      >
        {label}
      </output>
      <button type="button" className={button} onClick={() => onChange(value + 1)} aria-label="Más">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
