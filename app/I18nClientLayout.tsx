'use client';

import React from 'react';
import { I18nProvider } from '../i18n';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function I18nClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      {children}
    </I18nProvider>
  );
}
