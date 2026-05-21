import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './lib/namespace'
import { DirectionProvider } from './components/ui/direction.tsx'
import { I18nProvider } from './lib/i18n'

/**
 * Bootstraps the React app.
 *
 * There are three execution modes:
 *  1. Production inside a real Frappe site — `window.frappe.boot` is
 *     pre-populated by the server template.
 *  2. Local `vite dev` against a running Frappe bench — we fetch the
 *     boot context from `/api/method/erpnext.www.banking.get_context_for_dev`.
 *  3. **Standalone demo** (no Frappe backend) — the fetch fails, and we
 *     fall back to a synthetic boot so the UI can still render. This is
 *     what powers the bilingual landing page demo.
 */

interface FrappeBoot {
	user?: { name?: string };
	sitename?: string;
	desk_theme?: string;
	layout_direction?: 'ltr' | 'rtl';
	__messages?: Record<string, string>;
	docs?: unknown[];
}

interface FrappeGlobal {
	boot?: FrappeBoot;
	_messages?: Record<string, string>;
	model?: { sync?: (docs: unknown[]) => void };
}

declare global {
	interface Window {
		frappe?: FrappeGlobal;
	}
}

function buildSyntheticBoot(): FrappeBoot {
	return {
		user: { name: 'demo@erpnext.local' },
		sitename: 'demo.localhost',
		desk_theme: 'Automatic',
		layout_direction: 'ltr',
		__messages: {},
		docs: [],
	};
}

function render(direction: 'ltr' | 'rtl' = 'ltr') {
	createRoot(document.getElementById('root') as HTMLElement).render(
		<StrictMode>
			<I18nProvider>
				<DirectionProvider dir={direction}>
					<App />
				</DirectionProvider>
			</I18nProvider>
		</StrictMode>,
	);
}

function bootStandalone() {
	if (!window.frappe) window.frappe = {};
	window.frappe.boot = buildSyntheticBoot();
	window.frappe._messages = window.frappe.boot.__messages ?? {};
	if (window.frappe.model?.sync) {
		try {
			window.frappe.model.sync(window.frappe.boot.docs ?? []);
		} catch {
			/* ignore — synthetic docs are empty anyway */
		}
	}
	document.dir = 'ltr';
	render('ltr');
}

if (import.meta.env.DEV) {
	fetch('/api/method/erpnext.www.banking.get_context_for_dev', {
		method: 'POST',
	})
		.then((response) => {
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			return response.json();
		})
		.then((values) => {
			if (!window.frappe) window.frappe = {};
			window.frappe.boot = JSON.parse(values.message.boot);
			window.frappe._messages = window.frappe.boot?.__messages ?? {};
			document.dir = values.message.layout_direction ?? 'ltr';
			window.frappe.model?.sync?.(window.frappe.boot?.docs ?? []);
			render(values.message.layout_direction ?? 'ltr');
		})
		.catch((err) => {
			// No Frappe backend available — fall back to standalone demo mode.
			// eslint-disable-next-line no-console
			console.info(
				'[banking] Frappe backend not reachable — running in standalone demo mode.',
				err,
			);
			bootStandalone();
		});
} else {
	// Production: assume Frappe template populated window.frappe.boot
	if (window.frappe?.boot) {
		window.frappe._messages = window.frappe.boot.__messages ?? {};
		window.frappe.model?.sync?.(window.frappe.boot.docs ?? []);
		render(window.frappe.boot.layout_direction ?? 'ltr');
	} else {
		// Last resort: also boot standalone in production if boot is missing
		bootStandalone();
	}
}
