import type { Metadata } from 'next';
import './globals.css';
import I18nClientLayout from './I18nClientLayout';
import WagmiProviderWrapper from './WagmiProvider';

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
      <body>
        <WagmiProviderWrapper>
          <I18nClientLayout>{children}</I18nClientLayout>
        </WagmiProviderWrapper>
      </body>
    </html>
  );
}
