import './globals.css';
import type { Metadata } from 'next';
import { Syne, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'daoPayment | Agentic Control on Monad',
  description: 'Secure, non-custodial, and deterministic agentic payment infrastructure for DAOs on the Monad network.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans min-h-screen">
        <Providers>
          {children}
          <Toaster position="bottom-right" toastOptions={{
            style: {
              background: '#131313',
              color: '#f0f0f0',
              border: '1px solid #1a1a1a',
              borderRadius: '0px',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.875rem'
            },
            success: {
              iconTheme: {
                primary: '#00ff66',
                secondary: '#131313',
              },
              style: {
                borderColor: '#00ff66',
              }
            }
          }}/>
        </Providers>
      </body>
    </html>
  );
}
