// Pro Dashboard shell — dark professional theme (doc §2.3 A)
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { CopilotDock } from './CopilotDock';
import { useI18n, LangSwitch } from '@/i18n/client';
import {
  Home, Users, ListChecks, Radar, Store, FileBox, Trophy, Settings,
  Search, Bell, ChevronDown, LogOut, Sparkles, HelpCircle,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/pro',                 key: 'pro.nav.home',     icon: Home },
  { href: '/pro/clients',         key: 'pro.nav.clients',  icon: Users },
  { href: '/pro/tasks',           key: 'pro.nav.tasks',    icon: ListChecks },
  { href: '/pro/modules/radar',   key: 'pro.nav.radar',    icon: Radar },
  { href: '/pro/modules/market',  key: 'pro.nav.market',   icon: Store },
  { href: '/pro/vault',           key: 'pro.nav.vault',    icon: FileBox },
  { href: '/pro/modules/arena',   key: 'pro.nav.arena',    icon: Trophy },
  { href: '/pro/help',            key: 'help.nav',         icon: HelpCircle },
  { href: '/pro/settings',        key: 'pro.nav.settings', icon: Settings },
] as const;

const MODULE_TABS = [
  { slug: 'taxshield', emoji: '🛡' },
  { slug: 'payflow',   emoji: '💸' },
  { slug: 'cashloop',  emoji: '🔁' },
  { slug: 'govhub',    emoji: '🏛' },
  { slug: 'taxnet',    emoji: '🌐' },
  { slug: 'radar',     emoji: '📡' },
  { slug: 'partner',   emoji: '🤝' },
  { slug: 'market',    emoji: '🛒' },
  { slug: 'arena',     emoji: '🎮' },
  { slug: 'insight',   emoji: '📊' },
];

export function ProShell({
  user,
  children,
}: {
  user: { id: string; name: string; email: string; novaTokens: number; streakDays: number };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router   = useRouter();
  const { t, lang } = useI18n();
  const [copilotOpen, setCopilotOpen] = useState(false);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      {/* ── Top bar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-950/85 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/pro" className="flex items-center gap-2 text-base font-bold">
              <span className="text-xl">📡</span>
              <span className="bg-gradient-to-r from-white via-nova-200 to-gold-400 bg-clip-text text-transparent">
                {t('app.name')}
              </span>
              <span className="nova-chip ml-2 bg-nova-500/15 text-nova-200 ring-nova-400/40">Pro</span>
            </Link>
            <nav className="hidden items-center gap-1 lg:flex">
              {MODULE_TABS.map((tab) => {
                const active = pathname.startsWith(`/pro/modules/${tab.slug}`);
                return (
                  <Link key={tab.slug} href={`/pro/modules/${tab.slug}`}
                    className={`rounded-lg px-2.5 py-1.5 text-xs transition ${active
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                    <span className="mr-1">{tab.emoji}</span>{t(`mod.${tab.slug}.cn`)}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm md:flex">
              <Search className="h-4 w-4 text-slate-400" />
              <span className="text-slate-400">{t('common.search')}…</span>
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">⌘K</kbd>
            </div>
            <LangSwitch />
            <Link
              href="/pro/help"
              title={t('help.nav')}
              className="rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <HelpCircle className="h-4 w-4" />
            </Link>
            <button className="relative rounded-lg p-2 hover:bg-white/5">
              <Bell className="h-4 w-4 text-slate-300" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-risk-red"></span>
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs">
              <span className="text-gold-400">🚀</span>
              <span className="font-mono">{user.novaTokens}</span>
              <span className="text-slate-500">$NOVA</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs">
              <span>🔥</span><span className="font-mono">{user.streakDays}</span>
              <span className="text-slate-500">{lang === 'en' ? 'streak' : '连胜'}</span>
            </div>
            <UserMenu user={user} onLogout={logout} logoutLabel={t('common.logout')} />
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="mx-auto flex max-w-[1500px] gap-4 p-4">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-[72px] space-y-1">
            {NAV_ITEMS.map((it) => {
              const Icon = it.icon;
              const active = pathname === it.href ||
                (it.href !== '/pro' && pathname.startsWith(it.href));
              return (
                <Link key={it.href} href={it.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${active
                    ? 'bg-nova-500/15 text-nova-200 ring-1 ring-inset ring-nova-400/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                  <Icon className="h-4 w-4" />
                  {t(it.key)}
                </Link>
              );
            })}
            <div className="mt-6 rounded-xl border border-white/10 bg-gradient-to-br from-nova-900/40 to-ink-900 p-4">
              <div className="text-xs uppercase tracking-widest text-slate-400">
                {lang === 'en' ? 'This month’s rank' : '本月排名'}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gold-400">#7</span>
                <span className="text-xs text-slate-400">{lang === 'en' ? '/ 1,240 providers' : '/ 1,240 服务商'}</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                {lang === 'en' ? 'Close 50 alerts to reach TOP 5' : '关闭 50 个预警可冲到 TOP 5'}
              </div>
            </div>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* ── NovaCopilot floating button ─────────────────── */}
      <button
        onClick={() => setCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-600 to-nova-400 px-5 py-3 text-sm font-medium text-white shadow-xl shadow-nova-700/40 transition hover:scale-105"
      >
        <Sparkles className="h-4 w-4" />
        NovaCopilot
      </button>
      <CopilotDock open={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  );
}

function UserMenu({ user, onLogout, logoutLabel }: { user: { name: string; email: string }; onLogout: () => void; logoutLabel: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-sm hover:bg-white/10">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-nova-500 to-gold-500 text-xs font-bold">
          {user.name.charAt(0)}
        </div>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-ink-900 p-2 shadow-2xl">
          <div className="px-3 py-2 text-sm">
            <div className="font-medium">{user.name}</div>
            <div className="truncate text-xs text-slate-400">{user.email}</div>
          </div>
          <hr className="my-1 border-white/5" />
          <button onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5">
            <LogOut className="h-4 w-4" /> {logoutLabel}
          </button>
        </div>
      )}
    </div>
  );
}
