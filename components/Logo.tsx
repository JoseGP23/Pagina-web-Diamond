/**
 * Isotipo de Diamante: la "D" con el corte en faceta arriba a la izquierda
 * (originales/marca/logo-d.svg). Los trazos se exportan para poder
 * dibujarlos con animación (ver la firma del Hero).
 */
export const LOGO_VIEWBOX = '180 60 315 426';
export const LOGO_PATHS = [
  'M195 75 H315 A165 198 0 0 1 315 471 H195 Z',
  'M210 137 H318 A105 139 0 0 1 318 415 H242 V262 Z',
];

export default function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      fill="none"
      stroke="currentColor"
      strokeWidth={10}
      strokeLinejoin="miter"
      className={className}
      aria-hidden="true"
    >
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
