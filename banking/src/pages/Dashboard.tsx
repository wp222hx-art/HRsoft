/**
 * Demo Dashboard — landing page for the standalone Banking & Compliance suite.
 *
 * Showcases:
 *   • Bilingual hero (EN / 中文)
 *   • KPI stats
 *   • Roadmap (Phases 0 → 3)
 *   • Quick links into Bank Reconciliation / Statement Importer
 *
 * Uses the project's Espresso design tokens (ink-* / surface-* / outline-*)
 * so the visual language stays consistent with the rest of ERPNext.
 */
import { Link } from 'react-router-dom';
import {
	ArrowRight,
	Banknote,
	CheckCircle2,
	Clock,
	FileSpreadsheet,
	Globe2,
	Landmark,
	Languages,
	ListChecks,
	Receipt,
	Sparkles,
	Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface PhaseInfo {
	key: 'phase0' | 'phase1' | 'phase2' | 'phase3';
	icon: React.ComponentType<{ className?: string }>;
	bgClass: string;
	iconColor: string;
	statusKey: 'status.done' | 'status.planned' | 'status.in_progress';
	badgeTheme: 'gray' | 'blue' | 'green' | 'orange' | 'violet';
	badgeVariant: 'solid' | 'subtle' | 'outline' | 'ghost';
}

const PHASES: PhaseInfo[] = [
	{
		key: 'phase0',
		icon: Languages,
		bgClass: 'bg-surface-green-1',
		iconColor: 'text-ink-green-4',
		statusKey: 'status.done',
		badgeVariant: 'solid',
		badgeTheme: 'green',
	},
	{
		key: 'phase1',
		icon: Globe2,
		bgClass: 'bg-surface-blue-1',
		iconColor: 'text-ink-blue-4',
		statusKey: 'status.planned',
		badgeVariant: 'subtle',
		badgeTheme: 'blue',
	},
	{
		key: 'phase2',
		icon: Receipt,
		bgClass: 'bg-surface-amber-1',
		iconColor: 'text-ink-amber-4',
		statusKey: 'status.planned',
		badgeVariant: 'subtle',
		badgeTheme: 'orange',
	},
	{
		key: 'phase3',
		icon: Users,
		bgClass: 'bg-surface-violet-1',
		iconColor: 'text-ink-violet-4',
		statusKey: 'status.planned',
		badgeVariant: 'subtle',
		badgeTheme: 'violet',
	},
];

export default function Dashboard() {
	const t = useT();

	const stats = [
		{ icon: Globe2, value: '5+', labelKey: 'stats.countries_supported' },
		{ icon: Receipt, value: '12', labelKey: 'stats.tax_modules' },
		{ icon: ListChecks, value: '30+', labelKey: 'stats.payroll_components' },
		{ icon: Languages, value: '2', labelKey: 'stats.languages' },
	];

	return (
		<div className="min-h-screen bg-surface-gray-1 text-ink-gray-8">
			{/* Top bar */}
			<header className="sticky top-0 z-40 border-b border-outline-gray-modals bg-surface-white/85 backdrop-blur">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
					<div className="flex items-center gap-2.5">
						<div className="flex size-9 items-center justify-center rounded-lg bg-ink-gray-8 text-surface-white shadow-sm">
							<Landmark className="size-5" />
						</div>
						<div className="leading-tight">
							<div className="text-sm font-semibold">{t('app.brand')}</div>
							<div className="text-xs text-ink-gray-6">{t('app.tagline')}</div>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<LanguageSwitcher />
					</div>
				</div>
			</header>

			{/* Hero */}
			<section className="mx-auto max-w-7xl px-6 pb-10 pt-16 text-center">
				<Badge
					variant="outline"
					size="lg"
					theme="green"
					className="mb-5 gap-1.5 px-3"
				>
					<Sparkles className="size-3.5" />
					{t('roadmap.phase0.status')}
				</Badge>
				<h1 className="text-3xl font-semibold tracking-tight text-ink-gray-8 sm:text-4xl">
					{t('dashboard.welcome')}
				</h1>
				<p className="mx-auto mt-5 max-w-2xl text-base text-ink-gray-7 sm:text-lg">
					{t('dashboard.subtitle')}
				</p>
				<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
					<Button asChild size="lg" variant="solid" theme="blue" className="bg-ink-blue-3 hover:bg-ink-blue-4">
						<Link to="/bank-reconciliation">
							{t('dashboard.try_demo')}
							<ArrowRight className="ml-1.5 size-4" />
						</Link>
					</Button>
					<Button asChild size="lg" variant="outline" theme="gray">
						<a href="#roadmap">{t('dashboard.view_roadmap')}</a>
					</Button>
				</div>
			</section>

			{/* Stats */}
			<section className="mx-auto max-w-7xl px-6 pb-16">
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{stats.map((s) => (
						<Card key={s.labelKey} className="py-5">
							<CardContent className="flex items-center gap-3 px-5">
								<div className="flex size-10 items-center justify-center rounded-md bg-surface-blue-1 text-ink-blue-4">
									<s.icon className="size-5" />
								</div>
								<div>
									<div className="text-2xl font-semibold leading-none text-ink-gray-8">
										{s.value}
									</div>
									<div className="mt-1 text-xs text-ink-gray-6">{t(s.labelKey)}</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Quick links */}
			<section className="mx-auto max-w-7xl px-6 pb-16">
				<div className="grid gap-4 md:grid-cols-2">
					<QuickLinkCard
						to="/bank-reconciliation"
						icon={Banknote}
						title={t('nav.bank_reconciliation')}
						description={t('br.subtitle')}
					/>
					<QuickLinkCard
						to="/statement-importer"
						icon={FileSpreadsheet}
						title={t('nav.statement_importer')}
						description={t('si.subtitle')}
					/>
				</div>
			</section>

			{/* Roadmap */}
			<section id="roadmap" className="mx-auto max-w-7xl scroll-mt-20 px-6 pb-20">
				<div className="mb-10 text-center">
					<h2 className="text-2xl font-semibold tracking-tight text-ink-gray-8 sm:text-3xl">
						{t('roadmap.title')}
					</h2>
					<p className="mt-2 text-ink-gray-6">{t('roadmap.subtitle')}</p>
				</div>

				<div className="grid gap-5 md:grid-cols-2">
					{PHASES.map((phase) => {
						const Icon = phase.icon;
						const isDone = phase.statusKey === 'status.done';
						return (
							<Card key={phase.key} className={cn('relative overflow-hidden', phase.bgClass)}>
								<CardHeader>
									<div className="flex items-center justify-between gap-3">
										<div className="flex items-center gap-3">
											<div className="flex size-10 items-center justify-center rounded-lg bg-surface-white shadow-sm">
												<Icon className={cn('size-5', phase.iconColor)} />
											</div>
											<CardTitle className="text-lg text-ink-gray-8">
												{t(`roadmap.${phase.key}.title`)}
											</CardTitle>
										</div>
										<Badge
											variant={phase.badgeVariant}
											theme={phase.badgeTheme}
											size="lg"
											className="gap-1"
										>
											{isDone ? (
												<CheckCircle2 className="size-3" />
											) : (
												<Clock className="size-3" />
											)}
											{t(phase.statusKey)}
										</Badge>
									</div>
									<CardDescription className="pt-2 text-sm text-ink-gray-7">
										{t(`roadmap.${phase.key}.desc`)}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-1.5 text-sm">
										{['f1', 'f2', 'f3', 'f4'].map((f) => (
											<li key={f} className="flex items-start gap-2">
												<CheckCircle2
													className={cn(
														'mt-0.5 size-4 shrink-0',
														isDone ? 'text-ink-green-4' : 'text-ink-gray-4',
													)}
												/>
												<span className="text-ink-gray-7">
													{t(`roadmap.${phase.key}.${f}`)}
												</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-outline-gray-modals bg-surface-white/60">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-ink-gray-6 sm:flex-row">
					<div>{t('footer.copyright')}</div>
					<LanguageSwitcher />
				</div>
			</footer>
		</div>
	);
}

interface QuickLinkProps {
	to: string;
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
}

function QuickLinkCard({ to, icon: Icon, title, description }: QuickLinkProps) {
	return (
		<Link to={to} className="group">
			<Card className="h-full transition-all hover:border-ink-blue-3 hover:shadow-md">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center rounded-lg bg-surface-blue-1 text-ink-blue-4">
								<Icon className="size-5" />
							</div>
							<CardTitle className="text-lg text-ink-gray-8">{title}</CardTitle>
						</div>
						<ArrowRight className="size-4 text-ink-gray-5 transition-transform group-hover:translate-x-1" />
					</div>
					<CardDescription className="pt-2 text-ink-gray-6">{description}</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
}
