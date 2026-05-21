// Single re-export entry
export { type Lang, LANG_COOKIE, DEFAULT_LANG, isLang } from './types';
export { lookup, makeT, interpolate } from './dict';
export { getServerLang, getServerT } from './server';
export { I18nProvider, useI18n, LangSwitch, LangSwitchLight } from './client';
