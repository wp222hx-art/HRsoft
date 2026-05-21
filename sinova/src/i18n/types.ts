// SiNova i18n — types and constants
export const LANGS = ['zh', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_COOKIE = 'sinova_lang';
export const DEFAULT_LANG: Lang = 'zh';

export function isLang(v: unknown): v is Lang {
  return v === 'zh' || v === 'en';
}
