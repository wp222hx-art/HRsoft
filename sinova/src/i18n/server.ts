// Server-side language helpers (read cookie in RSC / route handlers)
import { cookies } from 'next/headers';
import { LANG_COOKIE, DEFAULT_LANG, isLang, type Lang } from './types';
import { makeT } from './dict';

export function getServerLang(): Lang {
  try {
    const c = cookies().get(LANG_COOKIE)?.value;
    return isLang(c) ? c : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function getServerT() {
  const lang = getServerLang();
  return { t: makeT(lang), lang };
}
