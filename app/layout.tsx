import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Antonio } from 'next/font/google';
import LenisProvider from '@/components/LenisProvider';
import MotionProvider from '@/components/MotionProvider';
import './globals.css';

// Cormorant Garamond: serif de alto contraste y trazo fino, pensada para
// tamaños grandes; se siente más de joyería/alta cocina que Playfair.
// Solo los pesos y estilos que se usan.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

// Antonio: condensada para categorías y microcopy en mayúsculas.
const antonio = Antonio({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-condensed',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DIAMANTE — Selected Meats',
  description: 'Fire • Smoke • Selection. Alta cocina de cortes a la parrilla.',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${antonio.variable}`}>
      <body className="bg-charcoal font-serif antialiased">
        <MotionProvider>
          <LenisProvider>{children}</LenisProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
