/**
 * Lightweight i18n framework for the Banking module.
 *
 * Design goals:
 *   1. Zero external dependencies (no react-intl, no i18next).
 *   2. Backwards compatible with Frappe's `frappe._messages` lookup —
 *      if a key is not in our local dictionary we fall back to it,
 *      then to the original string. This means existing components
 *      that already use `_()` from `lib/translate.ts` keep working.
 *   3. Persistent: chosen locale is saved to localStorage.
 *   4. Reactive: components re-render automatically on switch.
 */
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react';

import en from './locales/en';
import zhCN from './locales/zh-CN';

export type Locale = 'en' | 'zh-CN';

export const LOCALE_LABELS: Record<Locale, string> = {
	en: 'English',
	'zh-CN': '中文',
};

const DICTIONARIES: Record<Locale, Record<string, string>> = {
	en,
	'zh-CN': zhCN,
};

const STORAGE_KEY = 'erpnext.banking.locale';

function detectInitialLocale(): Locale {
	if (typeof window === 'undefined') return 'en';
	const stored = window.localStorage?.getItem(STORAGE_KEY);
	if (stored === 'en' || stored === 'zh-CN') return stored;
	const lang = window.navigator?.language ?? 'en';
	return lang.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
}

interface I18nContextValue {
	locale: Locale;
	setLocale: (l: Locale) => void;
	t: (key: string, replace?: Record<string, string | number> | string[]) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/** Format `{0}` / `{name}` placeholders. Mirrors lib/translate.ts. */
function format(
	str: string,
	args?: Record<string, string | number> | string[],
): string {
	if (!args) return str;
	let unkeyed = 0;
	return str.replace(/\{(\w*)\}/g, (match, key) => {
		if (key === '') {
			const idx = unkeyed++;
			return Array.isArray(args) ? String(args[idx] ?? match) : match;
		}
		if (Array.isArray(args)) {
			const n = Number(key);
			return Number.isNaN(n) ? match : String(args[n] ?? match);
		}
		return key in args ? String(args[key]) : match;
	});
}

export function I18nProvider({ children }: { children: ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>(() => detectInitialLocale());

	const setLocale = useCallback((l: Locale) => {
		setLocaleState(l);
		try {
			window.localStorage?.setItem(STORAGE_KEY, l);
		} catch {
			/* ignore quota / privacy errors */
		}
		// Reflect on <html lang> for accessibility & screen readers
		if (typeof document !== 'undefined') {
			document.documentElement.lang = l;
		}
	}, []);

	useEffect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.lang = locale;
		}
	}, [locale]);

	const t = useCallback(
		(key: string, replace?: Record<string, string | number> | string[]) => {
			if (!key) return key;

			const dict = DICTIONARIES[locale];
			let translated = dict[key];

			// Fallback chain: current dict → english dict → frappe._messages → raw key
			if (!translated && locale !== 'en') translated = en[key];
			if (!translated) {
				const frappeMessages = window.frappe?._messages;
				if (frappeMessages && frappeMessages[key]) {
					translated = frappeMessages[key];
				}
			}
			if (!translated) translated = key;

			return format(translated, replace);
		},
		[locale],
	);

	const value = useMemo<I18nContextValue>(
		() => ({ locale, setLocale, t }),
		[locale, setLocale, t],
	);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
	const ctx = useContext(I18nContext);
	if (!ctx) {
		throw new Error('useI18n must be used within an <I18nProvider>');
	}
	return ctx;
}

/** Convenience hook returning just the translate function. */
export function useT() {
	return useI18n().t;
}
