'use client';

import React from 'react';
import { useTranslation } from '../i18n';

export default function LanguageSwitcher() {
  const { language, toggleLanguage, t } = useTranslation();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-colors"
      aria-label={t.language.switchTo}
      title={t.language.switchTo}
    >
      <span className="text-sm font-medium">
        {language === 'en' ? '🇺🇸 EN' : '🇨🇳 中文'}
      </span>
    </button>
  );
}
