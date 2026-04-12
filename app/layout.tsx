import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Sora, Space_Mono } from 'next/font/google';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'daoPayment - Agentic Payment on Monad',
  description:
    'Secure, agent-native payment system for DAOs on Monad blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${sora.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
