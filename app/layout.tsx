import type { Metadata } from 'next';
import { Playfair_Display, Antonio } from 'next/font/google';
import LenisProvider from '@/components/LenisProvider';
import './globals.css';

// Solo se cargan los pesos que el sitio realmente usa (400 y 500) — el
// resto era peso muerto en la carga inicial y no se veía en ninguna parte.
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-playfair',
  display: 'swap',
});

// Antonio: condensa igual que una "impact" clásica pero con letras más
// editoriales/premium — reemplaza a Bebas Neue, que se sentía genérica.
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${antonio.variable}`}>
      <body className="bg-charcoal font-sans antialiased">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
