import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DAO Payment',
  description: 'Web3 DAO Payment Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
