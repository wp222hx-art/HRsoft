'use client';
// Insight — k-anonymity data products. Second growth curve.
import { useState } from 'react';
import { formatMoney } from '@/lib/utils';

type Report = {
  id: string; slug: string; title: string; tagline: string;
  category: string; pricesgd: number; sampleSize: number; updatedAt: string;
};

export function InsightView({ reports, stats }: { reports: Report[]; stats: { entityCount: number; filingCount: number } }) {
  const [eps, setEps]   = useState(1.0);
  const [k, setK]       = useState(10);

  // simulate Laplace-noised stat
  const laplace = (mean: number, scale: number) => {
    const u = Math.random() - 0.5;
    return Math.round(mean - scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u)));
  };
  const simulatedAvg = 14233;
  const noisy = laplace(simulatedAvg, 1 / eps * 30);

  return (
    <div className="space-y-5">
      {/* Strategy banner */}
      <section className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-ink-900/50 to-ink-900/50 p-5">
        <div className="flex items-start gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <div className="font-semibold text-cyan-300">SiNova Insight · 第二增长曲线</div>
            <div className="mt-1 text-[12px] text-slate-300">
              <span className="text-cyan-300">软件收入(70%)</span> + <span className="text-emerald-300">数据资产收入(30%)</span> ·
              k-匿名脱敏(k≥10) + Laplace 差分隐私(ε=1.0) + 用户授权 + Token 激励 — 完全合 GDPR/PDPA。
            </div>
          </div>
        </div>
      </section>

      {/* Privacy budget controls */}
      <section className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">🔐 隐私预算实时演示</div>
          <span className="text-[11px] text-slate-400">数据来源:{stats.entityCount} 家匿名 entity · {stats.filingCount.toLocaleString()} 笔脱敏申报</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-white">k-匿名 阈值</span>
              <span className="font-mono text-cyan-300">k = {k}</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-500">每个分组至少 k 条记录,&lt; k 自动丢弃</div>
            <input type="range" min={2} max={50} value={k} onChange={(e) => setK(Number(e.target.value))} className="mt-2 w-full accent-cyan-500" />
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-white">差分隐私 ε</span>
              <span className="font-mono text-emerald-300">ε = {eps.toFixed(2)}</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-500">越小越隐私,越大越精确(推荐 1.0)</div>
            <input type="range" min={0.1} max={5} step={0.1} value={eps} onChange={(e) => setEps(Number(e.target.value))} className="mt-2 w-full accent-emerald-500" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Mini label="真实均值"     v={`SGD ${simulatedAvg.toLocaleString()}`} hint="原始数据(永不离开 SiNova)" gray />
          <Mini label={`Laplace 噪声 (ε=${eps.toFixed(2)})`} v={`SGD ${noisy.toLocaleString()}`} hint="Δ ≈ ±30/ε,数学上不可还原个体" accent="text-cyan-300" />
          <Mini label="可释出"       v={k <= 10 ? '✅ 通过 k=10 阈值' : `⚠️ 需 k≤10 (当前 ${k})`} hint={k <= 10 ? '可上架数据集市' : '需扩大样本'} accent={k <= 10 ? 'text-emerald-300' : 'text-amber-300'} />
        </div>
      </section>

      {/* Report grid */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">📚 行业基准报告 · 已上架 {reports.length} 份</div>
          <button className="nova-btn-outline text-xs">📡 申请数据 API</button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <div key={r.id} className="flex flex-col rounded-2xl border border-white/10 bg-ink-900/50 p-4">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-2xl">
                  📈
                </div>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300">
                  {r.category}
                </span>
              </div>
              <div className="mt-3 text-base font-semibold text-white">{r.title}</div>
              <div className="mt-1 flex-1 text-[12px] text-slate-400">{r.tagline}</div>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/5 pt-3 text-[11px]">
                <div>
                  <div className="text-slate-500">样本量</div>
                  <div className="font-mono text-slate-200">{r.sampleSize.toLocaleString()} 家</div>
                </div>
                <div>
                  <div className="text-slate-500">价格</div>
                  <div className="font-semibold text-gold-400">{r.pricesgd === 0 ? 'Free' : formatMoney(r.pricesgd)}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button className="nova-btn-primary flex-1 text-xs">购买 PDF</button>
                <button className="nova-btn-outline text-xs">API</button>
              </div>
            </div>
          ))}
        </div>
        {reports.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
            暂无报告 — 当样本量达 k=10 时自动生成
          </div>
        )}
      </section>

      {/* Token incentive */}
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🎁</span>
          <div>
            <div className="font-semibold text-emerald-300">贡献数据 → 获得 $NOVA 分润</div>
            <div className="mt-1 text-[12px] text-slate-300">
              每笔脱敏数据进入基准库 +5 $NOVA · 贡献者按季度分享 30% 数据销售收入 · 双向飞轮启动
            </div>
          </div>
          <button className="nova-btn-primary text-xs">⚙️ 我的数据贡献</button>
        </div>
      </section>
    </div>
  );
}

function Mini({ label, v, hint, accent, gray }: { label: string; v: string; hint?: string; accent?: string; gray?: boolean }) {
  return (
    <div className={`rounded-xl border border-white/5 p-3 ${gray ? 'bg-white/5' : 'bg-ink-950/60'}`}>
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className={`mt-1 text-lg font-bold ${accent || 'text-white'}`}>{v}</div>
      {hint && <div className="mt-0.5 text-[10px] text-slate-500">{hint}</div>}
    </div>
  );
}
