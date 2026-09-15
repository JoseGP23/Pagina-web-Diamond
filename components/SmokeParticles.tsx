'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

type ParticleVariant = 'smoke' | 'spark';

type SmokeParticlesProps = {
  variant?: ParticleVariant;
  /** low = mobile (10-15 partículas), high = desktop (30-40 partículas) */
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
};

const COUNTS: Record<'low' | 'high', number> = {
  low: 14,
  high: 36,
};

function createParticles(count: number, seed: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + seed;
    return {
      id: n,
      left: (n * 37) % 100,
      size: 20 + ((n * 53) % 60),
      delay: (n % 10) * 0.3,
      duration: 4 + (n % 5),
      drift: ((n % 7) - 3) * 12,
    };
  });
}

/**
 * Sistema de partículas liviano para humo/chispas.
 * Usa solo transform + opacity (nunca top/left/width/height) para animar,
 * y respeta `active` para pausar el loop cuando la escena sale del viewport.
 */
export default function SmokeParticles({
  variant = 'smoke',
  intensity,
  active,
  className = '',
}: SmokeParticlesProps) {
  const count = COUNTS[intensity];
  const particles = useMemo(() => createParticles(count, variant === 'spark' ? 100 : 0), [count, variant]);

  if (!active) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {particles.map((p) =>
        variant === 'smoke' ? (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-white/10 blur-xl"
            style={{
              left: `${p.left}%`,
              bottom: '-10%',
              width: p.size,
              height: p.size,
              willChange: 'transform, opacity',
            }}
            initial={{ opacity: 0, y: 0, x: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 0.35, 0],
              y: [-20, -220 - p.size],
              x: [0, p.drift],
              scale: [0.8, 1.4],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ) : (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-gold"
            style={{
              left: `${p.left}%`,
              bottom: '0%',
              width: 3,
              height: 3,
              willChange: 'transform, opacity',
            }}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -140 - (p.size % 60)],
              x: [0, p.drift],
            }}
            transition={{
              duration: 1.2 + (p.id % 3) * 0.3,
              delay: p.delay * 0.4,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )
      )}
    </div>
  );
}
