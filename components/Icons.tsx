type IconProps = { className?: string };

const base = 'currentColor';

export function DiamondIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth={1.2} className={className}>
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" strokeLinejoin="round" />
      <path d="M2 9h20M8 3l4 6-4 12M16 3l-4 6 4 12" strokeLinejoin="round" />
    </svg>
  );
}

export function FlameIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth={1.2} className={className}>
      <path
        d="M12 2c1 3-3 4-3 8a3 3 0 006 0c0-1-1-2-1-2 2 1 4 3 4 6a6 6 0 11-12 0c0-4 3-6 3-9 0-1 1-2 3-3z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth={1.2} className={className}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" strokeLinejoin="round" />
      <path d="M8.5 12l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FamilyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth={1.2} className={className}>
      <circle cx="8" cy="7" r="2.5" />
      <circle cx="16" cy="7" r="2.5" />
      <path d="M3 19c0-3 2.5-5 5-5s5 2 5 5M11 19c0-3 2.5-5 5-5s5 2 5 5" strokeLinecap="round" />
    </svg>
  );
}

export function CutIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth={1.2} className={className}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8 7.5L20 19M20 5L8 16.5" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth={1.2} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChefHatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth={1.2} className={className}>
      <path d="M7 21h10M8 21v-6M16 21v-6" strokeLinecap="round" />
      <path d="M6 10a4 4 0 018-1.2 3.2 3.2 0 014 3.2c0 2-1.5 3-3 3H9c-2 0-4-1-4-3 0-1 .4-1.8 1-2z" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth={1.2} className={className}>
      <path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.9 6.4 20l1.4-6.2-4.8-4.3 6.4-.6L12 3z" strokeLinejoin="round" />
    </svg>
  );
}

export function HandshakeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth={1.2} className={className}>
      <path d="M2 12l4-4 4 2 3-2 3 2 3-2 3 4-3 3-2-1-3 3-3-2-3 2-2-1-4-4z" strokeLinejoin="round" />
    </svg>
  );
}

export function SmokeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth={1.2} className={className}>
      <path
        d="M6 21c1-1.5-1-2 0-4s-1-2.5 0-4M12 21c1-1.5-1-2 0-4s-1-2.5 0-4 -1-2.5 0-4M18 21c1-1.5-1-2 0-4s-1-2.5 0-4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TargetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth={1.2} className={className}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill={base} />
    </svg>
  );
}

export function HeartHandIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth={1.2} className={className}>
      <path d="M12 8.5c-1-2-4-2-4.8-.2-.8 1.8.6 3 4.8 6.2 4.2-3.2 5.6-4.4 4.8-6.2-.8-1.8-3.8-1.8-4.8.2z" />
      <path d="M3 19c1.5-1.5 3-2 5-1l4 1 4-1c1.3-.3 2 .2 2 1" strokeLinecap="round" />
    </svg>
  );
}
