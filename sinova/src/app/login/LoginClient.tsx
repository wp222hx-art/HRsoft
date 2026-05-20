'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const DEMO_ACCOUNTS = [
  { email: 'partner@cpa-firm.sg',     label: '🏛 Sarah · 会计所合伙人 (Pro)',   role: 'Pro' },
  { email: 'indie@cpa.sg',            label: '👤 David · 独立 CPA (Pro)',       role: 'Pro' },
  { email: 'ceo@cookie-island.com',   label: '🛒 王老板 · 跨境电商 (SME)',      role: 'SME' },
  { email: 'founder@meta-loom.io',    label: '🪙 Vitalik · Web3 DAO (SME)',     role: 'SME' },
  { email: 'cto@flexpilot.ai',        label: '🚀 Mei Lin · SaaS 出海 (SME)',    role: 'SME' },
  { email: 'boss@laobao-trading.sg',  label: '🏪 陈伯 · 传统中小 (SME)',         role: 'SME' },
  { email: 'admin@sinova.io',         label: '🐱 猫哥 · Admin',                 role: 'Admin' },
];

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next');
  const [email, setEmail] = useState('partner@cpa-firm.sg');
  const [password, setPassword] = useState('demo1234');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setBusy(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const j = await res.json();
    setBusy(false);
    if (!res.ok) { setErr(j.error || '登录失败'); return; }
    const portal = j.user?.portal as string;
    const target = next || (portal === 'PRO' ? '/pro' : portal === 'SME' ? '/sme' : '/admin');
    router.push(target);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-nova-900/40 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:py-24">
        {/* Form */}
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-2xl">📡</span>
            <span className="bg-gradient-to-r from-white via-nova-200 to-gold-400 bg-clip-text text-transparent">
              司诺 SiNova
            </span>
          </Link>
          <h1 className="mt-10 text-3xl font-bold md:text-4xl">欢迎回来 👋</h1>
          <p className="mt-2 text-slate-400">登录后系统会按您的门户类型 (Pro / SME) 自动跳转。</p>

          <form onSubmit={submit} className="mt-8 max-w-md space-y-4">
            <div>
              <label className="text-sm text-slate-300">邮箱</label>
              <input className="nova-input-dark mt-1" type="email" required value={email}
                     onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div>
              <label className="text-sm text-slate-300">密码</label>
              <input className="nova-input-dark mt-1" type="password" required value={password}
                     onChange={(e) => setPassword(e.target.value)} placeholder="demo1234" />
            </div>
            {err && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {err}
              </div>
            )}
            <button className="nova-btn-primary w-full" disabled={busy}>
              {busy ? '登录中…' : '登录 →'}
            </button>
            <div className="text-center text-sm text-slate-400">
              还没有账号? <Link href="/register" className="text-nova-300 hover:underline">立即注册</Link>
            </div>
          </form>
        </div>

        {/* Demo accounts panel */}
        <div className="md:w-[420px]">
          <div className="nova-card-dark p-6">
            <div className="text-sm uppercase tracking-widest text-slate-400">一键登录 Demo 账号</div>
            <div className="mt-1 text-xs text-slate-500">点击任一账号 · 密码已预填 demo1234</div>
            <div className="mt-4 space-y-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button key={a.email}
                  onClick={() => { setEmail(a.email); setPassword('demo1234'); }}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <span>{a.label}</span>
                    <span className="nova-chip bg-nova-500/15 text-nova-200 ring-nova-400/40">{a.role}</span>
                  </div>
                  <div className="text-xs text-slate-500">{a.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
