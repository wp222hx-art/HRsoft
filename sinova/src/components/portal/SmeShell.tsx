// SME Smart Hub shell — light, friendly, AI Partner-first theme (doc §2.3 B)
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { CopilotDock } from './CopilotDock';
import { PERSONA_PROFILES, type Persona } from '@/lib/enums';
import { useI18n, LangSwitchLight } from '@/i18n/client';
import {
  Home, MessageSquare, Receipt, Wallet, Globe, Shield, Trophy, Settings,
  Sparkles, ChevronDown, LogOut, ShoppingBag, BarChart3, HelpCircle,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/sme',                  key: 'sme.nav.hub',      icon: Home },
  { href: '/sme/modules/partner',  key: 'sme.nav.partner',  icon: MessageSquare },
  { href: '/sme/modules/cashloop', key: 'sme.nav.cashloop', icon: Wallet },
  { href: '/sme/modules/taxshield',key: 'sme.nav.tax',      icon: Receipt },
  { href: '/sme/modules/taxnet',   key: 'sme.nav.taxnet',   icon: Globe },
  { href: '/sme/modules/radar',    key: 'sme.nav.radar',    icon: Shield },
  { href: '/sme/modules/market',   key: 'sme.nav.market',   icon: ShoppingBag },
  { href: '/sme/modules/arena',    key: 'sme.nav.arena',    icon: Trophy },
  { href: '/sme/modules/insight',  key: 'sme.nav.insight',  icon: BarChart3 },
  { href: '/sme/help',             key: 'help.nav',         icon: HelpCircle },
  { href: '/sme/settings',         key: 'sme.nav.settings', icon: Settings },
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

export function SmeShell({
  user,
  children,
}: {
  user: { id: string; name: string; email: string; novaTokens: number; streakDays: number; aiPersona?: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router   = useRouter();
  const { t, lang } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  const persona = PERSONA_PROFILES[(user.aiPersona as Persona) || 'MAYA'];

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-nova-50/40 text-slate-800">
      {/* ── Top bar ───────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/sme" className="flex items-center gap-2 text-base font-bold">
              <span className="text-xl">📡</span>
              <span className="bg-gradient-to-r from-nova-700 via-nova-500 to-gold-500 bg-clip-text text-transparent">
                {t('app.name')}
              </span>
              <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-300/50">
                Smart Hub
              </span>
            </Link>
            <nav className="hidden items-center gap-1 lg:flex">
              {MODULE_TABS.map((tab) => {
                const active = pathname.startsWith(`/sme/modules/${tab.slug}`);
                return (
                  <Link key={tab.slug} href={`/sme/modules/${tab.slug}`}
                    className={`rounded-lg px-2.5 py-1.5 text-xs transition ${active
                      ? 'bg-nova-100 text-nova-700 font-medium'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                    <span className="mr-1">{tab.emoji}</span>{t(`mod.${tab.slug}.cn`)}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <LangSwitchLight />
            <Link
              href="/sme/help"
              title={t('help.nav')}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <HelpCircle className="h-4 w-4" />
            </Link>
            <div className="hidden items-center gap-1 rounded-full border border-gold-300/60 bg-gold-50 px-2.5 py-1 text-xs text-gold-700 sm:flex">
              <Sparkles className="h-3 w-3" /> {user.novaTokens.toLocaleString()} $NOVA
            </div>
            <div className="hidden items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs text-orange-700 sm:flex">
              🔥 {user.streakDays}{t('common.days')}
            </div>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-sm hover:bg-slate-50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-nova-200 to-nova-400 text-white">
                  {user.name.charAt(0)}
                </span>
                <span className="hidden text-xs md:inline">{user.name}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <div className="px-2 py-1.5 text-xs text-slate-500">{user.email}</div>
                  <div className="px-2 py-1 text-[11px] text-slate-400">
                    {t('settings.row.persona')}: {persona.emoji} {persona.name}
                  </div>
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> {t('common.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main area: side nav + content ── */}
      <div className="mx-auto flex max-w-[1400px] gap-5 px-4 py-5">
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/sme' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? 'bg-nova-50 text-nova-700 font-medium ring-1 ring-nova-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Persona card */}
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-nova-100 to-pink-100 p-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{persona.emoji}</span>
              <div>
                <div className="font-semibold text-slate-800">{persona.name}</div>
                <div className="text-[10px] text-slate-500">
                  {lang === 'en' ? 'Your AI Partner' : '你的 AI 合伙人'}
                </div>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-600">{t(`persona.${user.aiPersona || 'MAYA'}.tagline`)}</div>
            <Link href="/sme/modules/partner" className="mt-2 block rounded-lg bg-white px-2 py-1.5 text-center text-[11px] font-medium text-nova-700 hover:bg-nova-50">
              {lang === 'en' ? 'Chat now →' : '立即对话 →'}
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {/* SME views are designed dark, but we wrap in a light card so they render legibly */}
          <div className="rounded-2xl bg-ink-950 text-slate-100 p-5 shadow-sm ring-1 ring-slate-200">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Copilot — same component, persona-aware */}
      <CopilotDock open={copilotOpen} onClose={() => setCopilotOpen(false)} />

      {/* Floating trigger button (light theme) */}
      <button
        onClick={() => setCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-nova-500 to-nova-700 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-nova-500/40 transition hover:scale-105"
      >
        <Sparkles className="h-4 w-4" /> {persona.name}
      </button>
    </div>
  );
}
