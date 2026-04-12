'use client';

import Link from 'next/link';
import { useTranslation } from '../i18n';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen p-8 pt-16">
      <h1 className="text-4xl font-bold mb-4">{t.app.title}</h1>
      <p className="text-gray-600 text-lg">{t.app.description}</p>
      <div className="mt-8">
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
