import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, translations, TranslationKey } from './translations';

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang: Language) => set({ language: lang }),
      t: (key: TranslationKey) => {
        const { language } = get();
        return translations[language][key] || translations['en'][key] || key;
      },
    }),
    {
      name: 'daopayment-i18n',
    }
  )
);
