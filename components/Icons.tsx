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

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}
