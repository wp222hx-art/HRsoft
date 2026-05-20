'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PRO_TYPES, PRO_TYPE_LABELS,
  SME_TYPES, SME_TYPE_LABELS,
  PERSONAS, PERSONA_PROFILES,
  JURISDICTIONS, JURISDICTION_META,
  type Portal, type ProType, type SmeType, type Persona, type Jurisdiction,
} from '@/lib/enums';

export default function RegisterPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const initial = (sp.get('portal') as Portal) || 'SME';

  const [portal, setPortal]   = useState<Portal>(initial);
  const [step, setStep]       = useState(1);
  const [proType, setProType] = useState<ProType>('P1_CPA_FIRM');
  const [smeType, setSmeType] = useState<SmeType>('S1_ECOMMERCE');
  const [aiPersona, setAiPersona] = useState<Persona>('MAYA');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('SG');

  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setStep(1); }, [portal]);

  async function submit() {
    setErr(null); setBusy(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        portal, name, email, password,
        proType: portal === 'PRO' ? proType : undefined,
        smeType: portal === 'SME' ? smeType : undefined,
        aiPersona: portal === 'SME' ? aiPersona : undefined,
        companyName: portal === 'SME' ? companyName : undefined,
        jurisdiction: portal === 'SME' ? jurisdiction : undefined,
      }),
    });
    const j = await res.json();
    setBusy(false);
    if (!res.ok) { setErr(j.error || '注册失败'); return; }
    router.push(portal === 'PRO' ? '/pro' : '/sme');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-nova-900/30 text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl">📡</span>
          <span className="bg-gradient-to-r from-white via-nova-200 to-gold-400 bg-clip-text text-transparent">
            司诺 SiNova
          </span>
        </Link>

        <h1 className="mt-8 text-3xl font-bold md:text-4xl">3 分钟创建 SiNova 账号</h1>
        <p className="mt-2 text-slate-400">免费体验 30 天 · 永久保留 1 个 entity 配额 · 完成 Onboarding 奖 100 $NOVA</p>

        {/* Portal switch */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={() => setPortal('PRO')}
            className={`rounded-2xl border p-5 text-left transition ${portal === 'PRO' ? 'border-nova-400 bg-nova-500/10 nova-glow' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
            <div className="text-2xl">🛠</div>
            <div className="mt-2 text-lg font-semibold">服务商门户 (Pro)</div>
            <div className="mt-1 text-sm text-slate-400">CPA / Payroll / CorpSec · 管理多家客户</div>
          </button>
          <button
            onClick={() => setPortal('SME')}
            className={`rounded-2xl border p-5 text-left transition ${portal === 'SME' ? 'border-gold-500 bg-gold-500/10 nova-glow' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
            <div className="text-2xl">✨</div>
            <div className="mt-2 text-lg font-semibold">SME 自助门户</div>
            <div className="mt-1 text-sm text-slate-400">跨境电商 / Web3 / SaaS · 直连 AI Partner</div>
          </button>
        </div>

        {/* Step 1: type */}
        {step === 1 && portal === 'PRO' && (
          <Section title="选择您的服务商类型">
            <div className="grid gap-3 md:grid-cols-2">
              {PRO_TYPES.map((t) => {
                const m = PRO_TYPE_LABELS[t];
                return (
                  <button key={t} onClick={() => setProType(t)}
                    className={`rounded-xl border p-4 text-left transition ${proType === t ? 'border-nova-400 bg-nova-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <div className="text-2xl">{m.emoji}</div>
                    <div className="mt-1 font-semibold">{m.name}</div>
                    <div className="mt-1 text-xs text-slate-400">{m.desc}</div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setStep(3)} className="nova-btn-primary">下一步 →</button>
            </div>
          </Section>
        )}

        {step === 1 && portal === 'SME' && (
          <Section title="选择您的企业类型">
            <div className="grid gap-3 md:grid-cols-2">
              {SME_TYPES.map((t) => {
                const m = SME_TYPE_LABELS[t];
                return (
                  <button key={t} onClick={() => setSmeType(t)}
                    className={`rounded-xl border p-4 text-left transition ${smeType === t ? 'border-gold-500 bg-gold-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <div className="text-2xl">{m.emoji}</div>
                    <div className="mt-1 font-semibold">{m.name}</div>
                    <div className="mt-1 text-xs text-slate-400">{m.desc}</div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setStep(2)} className="nova-btn-primary">下一步 →</button>
            </div>
          </Section>
        )}

        {/* Step 2: SME persona */}
        {step === 2 && portal === 'SME' && (
          <Section title="选择您的 AI Partner 人格">
            <p className="mb-4 text-sm text-slate-400">
              这是司诺第二把杀手锏 · 三套人格随时切换 · 按结果付费 + 责任险兜底
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {PERSONAS.map((p) => {
                const m = PERSONA_PROFILES[p];
                return (
                  <button key={p} onClick={() => setAiPersona(p)}
                    className={`rounded-2xl border p-5 text-left transition ${aiPersona === p ? 'border-gold-500 bg-gold-500/10 nova-glow' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <div className="text-3xl">{m.emoji}</div>
                    <div className="mt-2 text-lg font-semibold">{m.name}</div>
                    <div className="text-xs text-slate-400">{m.tagline}</div>
                    <div className="mt-3 text-xs text-slate-500">沟通调性</div>
                    <div className="text-sm text-slate-300">{m.style}</div>
                    <div className="mt-2 text-xs text-slate-500">适配客户</div>
                    <div className="text-sm text-slate-300">{m.audience}</div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button onClick={() => setStep(1)} className="nova-btn-ghost">← 上一步</button>
              <button onClick={() => setStep(3)} className="nova-btn-primary">下一步 →</button>
            </div>
          </Section>
        )}

        {/* Step 3: account info */}
        {step === 3 && (
          <Section title="完善账号信息">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="您的姓名">
                <input className="nova-input-dark" value={name} onChange={(e) => setName(e.target.value)} placeholder="张三" />
              </Field>
              <Field label="工作邮箱">
                <input className="nova-input-dark" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
              </Field>
              <Field label="设置密码">
                <input className="nova-input-dark" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="至少 6 位" />
              </Field>
              {portal === 'SME' && (
                <>
                  <Field label="公司法定名称">
                    <input className="nova-input-dark" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="如:Cookie Island Pte Ltd" />
                  </Field>
                  <Field label="主要管辖地" full>
                    <div className="flex flex-wrap gap-2">
                      {JURISDICTIONS.map((j) => {
                        const m = JURISDICTION_META[j];
                        return (
                          <button key={j}
                            onClick={() => setJurisdiction(j)}
                            className={`rounded-xl border px-3 py-2 text-sm transition ${jurisdiction === j ? 'border-gold-500 bg-gold-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                            {m.flag} {m.name} <span className="text-slate-500">· {m.regulator}</span>
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </>
              )}
            </div>
            {err && (
              <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {err}
              </div>
            )}
            <div className="mt-6 flex items-center justify-between">
              <button onClick={() => setStep(portal === 'SME' ? 2 : 1)} className="nova-btn-ghost">← 上一步</button>
              <button onClick={submit} className="nova-btn-primary" disabled={busy}>
                {busy ? '创建中…' : '创建账号 + 100 $NOVA 🚀'}
              </button>
            </div>
          </Section>
        )}

        <div className="mt-6 text-center text-sm text-slate-500">
          已有账号? <Link href="/login" className="text-nova-300 hover:underline">直接登录 →</Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 nova-card-dark p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="text-sm text-slate-300">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
