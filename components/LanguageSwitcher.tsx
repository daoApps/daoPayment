'use client';

import { useI18nStore } from '@/src/i18n/store';
import { Language } from '@/src/i18n/translations';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18nStore();

  const toggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'zh' : 'en';
    setLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="group relative px-4 py-2 bg-black/50 border border-emerald-500/20 hover:border-emerald-400/50 rounded overflow-hidden transition-all duration-300 flex items-center gap-2"
    >
      <div className="absolute inset-0 bg-emerald-500/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      <div className="absolute left-0 top-0 w-[2px] h-full bg-emerald-500/50 group-hover:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      
      <span className="relative z-10 font-mono text-sm tracking-widest text-emerald-400/70 group-hover:text-emerald-300 transition-colors">
        {language === 'en' ? 'EN / 中文' : '中文 / EN'}
      </span>
      
      <div className="relative z-10 w-2 h-2 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all" />
    </button>
  );
}
