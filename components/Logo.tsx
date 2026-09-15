export default function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="22.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path
        d="M16 13h8.5c6.5 0 11 4.7 11 11s-4.5 11-11 11H16V13z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M16 13v22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
