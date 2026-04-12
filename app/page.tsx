'use client';

import { useTranslation } from '../i18n';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen p-8 pt-16">
      <h1 className="text-4xl font-bold mb-4">{t.app.title}</h1>
      <p className="text-gray-600 text-lg">{t.app.description}</p>
    </main>
  );
}
