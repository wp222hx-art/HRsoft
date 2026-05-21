/**
 * English (en) translation dictionary.
 * Keys are the original English source strings — this means components
 * can keep using `t('Save')` without ever knowing about translation IDs.
 */
const en: Record<string, string> = {
	// Brand & Top-level
	'app.brand': 'ERPNext Banking & Compliance Suite',
	'app.tagline': 'Powerful, Open-Source ERP — now with multi-country compliance',

	// Navigation
	'nav.dashboard': 'Dashboard',
	'nav.bank_reconciliation': 'Bank Reconciliation',
	'nav.statement_importer': 'Statement Importer',
	'nav.compliance': 'Compliance Hub',
	'nav.indonesia_tax': 'Indonesia Tax',
	'nav.payroll': 'Payroll',
	'nav.language': 'Language',

	// Hero / Dashboard
	'dashboard.welcome': 'Welcome',
	'dashboard.subtitle':
		'A unified workspace for banking, multi-country compliance, Indonesian taxation and payroll management.',
	'dashboard.try_demo': 'Open Bank Reconciliation',
	'dashboard.view_roadmap': 'View Roadmap',

	// Stats
	'stats.countries_supported': 'Countries Supported',
	'stats.tax_modules': 'Tax Modules',
	'stats.payroll_components': 'Payroll Components',
	'stats.languages': 'UI Languages',

	// Roadmap
	'roadmap.title': 'Product Roadmap',
	'roadmap.subtitle': 'Four phases from infrastructure to enterprise-grade modules',

	'roadmap.phase0.title': 'Phase 0 · Foundation & i18n',
	'roadmap.phase0.status': 'Done',
	'roadmap.phase0.desc':
		'Standalone dev server, lightweight i18n framework, and full Chinese / English language switching.',
	'roadmap.phase0.f1': 'Fixed Vite proxy crash in standalone mode',
	'roadmap.phase0.f2': 'React Context-based i18n (zero deps)',
	'roadmap.phase0.f3': 'Persistent language switcher (localStorage)',
	'roadmap.phase0.f4': 'Backwards-compatible with frappe._messages',

	'roadmap.phase1.title': 'Phase 1 · Multi-Country Compliance',
	'roadmap.phase1.status': 'Planned',
	'roadmap.phase1.desc':
		'Pluggable compliance engine covering tax IDs, e-invoicing, and statutory reports for major APAC markets.',
	'roadmap.phase1.f1': 'Indonesia · China · Singapore · Malaysia · Japan',
	'roadmap.phase1.f2': 'Unified ComplianceProfile interface',
	'roadmap.phase1.f3': 'Auto switch by company country',
	'roadmap.phase1.f4': 'Country-specific invoice validators',

	'roadmap.phase2.title': 'Phase 2 · Indonesia Tax',
	'roadmap.phase2.status': 'Planned',
	'roadmap.phase2.desc':
		'End-to-end DJP-compliant tax engine: PPN, PPh 21/23/26/4(2), e-Faktur and e-Bupot.',
	'roadmap.phase2.f1': 'PPN 11% / 12% with NSFP management',
	'roadmap.phase2.f2': 'PPh 21 with TER progressive rates',
	'roadmap.phase2.f3': 'NPWP 16-digit validator',
	'roadmap.phase2.f4': 'Coretax DJP API integration',

	'roadmap.phase3.title': 'Phase 3 · Payroll Management',
	'roadmap.phase3.status': 'Planned',
	'roadmap.phase3.desc':
		'Configurable salary structures, BPJS, automatic PPh 21 withholding and one-click bulk bank payouts.',
	'roadmap.phase3.f1': 'Salary structure & components',
	'roadmap.phase3.f2': 'BPJS Kesehatan + Ketenagakerjaan',
	'roadmap.phase3.f3': 'Annual 1721-A1 reports',
	'roadmap.phase3.f4': 'Direct payout via Bank Reconciliation',

	// Status badges
	'status.done': 'Done',
	'status.planned': 'Planned',
	'status.in_progress': 'In Progress',

	// Bank Reconciliation page
	'br.title': 'Bank Reconciliation',
	'br.subtitle': 'Match bank transactions with accounting entries.',
	'br.demo_notice':
		'You are running in standalone demo mode. Connect a Frappe backend to load live data.',

	// Statement Importer page
	'si.title': 'Bank Statement Importer',
	'si.subtitle': 'Upload CSV/XLSX bank statements and import transactions in bulk.',

	// Common actions
	'action.back_to_dashboard': 'Back to Dashboard',
	'action.learn_more': 'Learn More',

	// Footer
	'footer.copyright': '© 2026 ERPNext Banking Suite · Built on Frappe Framework',
};

export default en;
