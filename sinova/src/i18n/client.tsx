// Client-side i18n: Context + provider + hooks + language switcher
'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LANG_COOKIE, type Lang } from './types';
import { makeT } from './dict';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ initialLang, children }: { initialLang: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // Keep <html lang="…"> in sync for accessibility
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof document !== 'undefined') {
      // 1 year cookie, all paths
      document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
    // Refresh the route so server-rendered RSC content swaps language too
    if (typeof window !== 'undefined') {
      // Next.js `router.refresh()` requires a hook — use a soft reload instead
      window.location.reload();
    }
  }, []);

  const t = useMemo(() => makeT(lang), [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Render-time fallback (during partial SSR before provider mounts)
    return { lang: 'zh', setLang: () => {}, t: makeT('zh') };
  }
  return ctx;
}

/** Compact language toggle — drops into any nav. */
export function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/15 bg-white/5 p-0.5 text-xs ${className}`}
      title={t('common.lang.toggleHint')}
    >
      <button
        onClick={() => setLang('zh')}
        className={`rounded-full px-2.5 py-1 transition ${
          lang === 'zh' ? 'bg-white text-ink-900 font-semibold' : 'text-slate-300 hover:text-white'
        }`}
      >
        中
      </button>
      <button
        onClick={() => setLang('en')}
        className={`rounded-full px-2.5 py-1 transition ${
          lang === 'en' ? 'bg-white text-ink-900 font-semibold' : 'text-slate-300 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}

/** Light-theme variant for SME shell. */
export function LangSwitchLight({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      className={`inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 text-xs ${className}`}
      title={t('common.lang.toggleHint')}
    >
      <button
        onClick={() => setLang('zh')}
        className={`rounded-full px-2.5 py-1 transition ${
          lang === 'zh' ? 'bg-nova-500 text-white font-semibold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        中
      </button>
      <button
        onClick={() => setLang('en')}
        className={`rounded-full px-2.5 py-1 transition ${
          lang === 'en' ? 'bg-nova-500 text-white font-semibold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        EN
      </button>
    </div>
  );
}
