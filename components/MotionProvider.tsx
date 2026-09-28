'use client';

import { LazyMotion } from 'framer-motion';

// Las funciones de animación de Framer Motion (incluido el drag del carrusel)
// se descargan en un chunk aparte después de la carga inicial, en vez de ir
// dentro del bundle principal. Los componentes usan `m.*` en lugar de `motion.*`.
const loadFeatures = () => import('@/lib/motionFeatures').then((mod) => mod.default);

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
