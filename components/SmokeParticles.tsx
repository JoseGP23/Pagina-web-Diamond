type ParticleVariant = 'smoke' | 'spark';

type SmokeParticlesProps = {
  variant?: ParticleVariant;
  /** low = mobile (14 partículas), high = desktop (32 partículas) */
  intensity: 'low' | 'high';
  active: boolean;
  className?: string;
};

type Particle = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  rise: number;
};

const COUNTS: Record<'low' | 'high', number> = {
  low: 14,
  high: 32,
};

// Valores deterministas (sin Math.random) para que el HTML del servidor y el
// del cliente coincidan. Se calculan una sola vez por combinación.
const cache = new Map<string, Particle[]>();

function getParticles(count: number, variant: ParticleVariant): Particle[] {
  const key = `${variant}-${count}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const seed = variant === 'spark' ? 100 : 0;
  const particles = Array.from({ length: count }, (_, i) => {
    const n = i + seed;
    const size = 40 + ((n * 53) % 90);
    return {
      id: n,
      left: (n * 37) % 100,
      size,
      delay: (n % 10) * 0.35,
      duration: variant === 'smoke' ? 5 + (n % 5) : 1.3 + (n % 3) * 0.35,
      drift: ((n % 7) - 3) * 12,
      rise: variant === 'smoke' ? -(220 + size) : -(140 + (n % 60)),
    };
  });
  cache.set(key, particles);
  return particles;
}

/**
 * Sistema de partículas liviano para humo/chispas, 100% CSS (sin JS por
 * frame). Solo anima transform + opacity. Cuando `active` es false se pausa
 * en vez de desmontarse, así no hay que recrear el DOM al volver a la escena.
 */
export default function SmokeParticles({
  variant = 'smoke',
  intensity,
  active,
  className = '',
}: SmokeParticlesProps) {
  const particles = getParticles(COUNTS[intensity], variant);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${active ? '' : 'particles-paused'} ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={`particle ${variant === 'smoke' ? 'particle-smoke' : 'particle-spark'}`}
          style={
            {
              left: `${p.left}%`,
              width: variant === 'smoke' ? p.size : undefined,
              height: variant === 'smoke' ? p.size : undefined,
              animationDuration: `${p.duration}s`,
              animationDelay: `${variant === 'smoke' ? p.delay : p.delay * 0.4}s`,
              '--drift': `${p.drift}px`,
              '--rise': `${p.rise}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
