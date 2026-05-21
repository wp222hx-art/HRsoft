/**
 * Language switcher (EN ⇄ 中文).
 *
 * Compact pill-toggle styled with Espresso design tokens
 * (bg-surface-white / text-ink-gray-*) so it visually matches the rest
 * of the ERPNext banking module.
 */
import { Globe } from 'lucide-react';
import { LOCALE_LABELS, useI18n, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const LOCALES: Locale[] = ['en', 'zh-CN'];

interface Props {
	className?: string;
}

export function LanguageSwitcher({ className }: Props) {
	const { locale, setLocale, t } = useI18n();

	return (
		<div
			className={cn(
				'inline-flex items-center gap-1 rounded-full border border-outline-gray-modals bg-surface-white p-1 shadow-xs',
				className,
			)}
			role="group"
			aria-label={t('nav.language')}
		>
			<Globe className="ml-2 size-4 text-ink-gray-5" aria-hidden="true" />
			{LOCALES.map((l) => {
				const active = locale === l;
				return (
					<button
						key={l}
						type="button"
						onClick={() => setLocale(l)}
						aria-pressed={active}
						className={cn(
							'rounded-full px-3 py-1 text-xs font-medium transition-colors',
							active
								? 'bg-ink-gray-8 text-surface-white shadow-sm'
								: 'text-ink-gray-6 hover:text-ink-gray-8',
						)}
					>
						{LOCALE_LABELS[l]}
					</button>
				);
			})}
		</div>
	);
}

export default LanguageSwitcher;
