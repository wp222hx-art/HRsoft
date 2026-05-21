'use client';
// ProductMatrix — 首页的「产品矩阵」入口
// 10 个产品模块,每张卡片可点击进入对应模块,
// 卡片右上角带 ✨ AI 助手解说气泡 (matrix.${slug})。
// 复用同一份模块元数据,给 /sme 和 /pro 两端共用 (portalBase 决定跳转路径)。

import Link from 'next/link';
import { useI18n } from '@/i18n/client';
import { HelperHint } from './HelperHint';

type ModuleMeta = {
  slug: string;
  emoji: string;
  /** 主题色 (Tailwind border + ring 用) */
  accent: string;
  /** 卡片背景渐变 */
  gradient: string;
};

// 10 大产品模块 — 与侧边栏 / ModuleRenderer 完全一致
const MODULES: ModuleMeta[] = [
  { slug: 'taxshield', emoji: '🛡', accent: 'border-blue-500/30 ring-blue-500/20',     gradient: 'from-blue-500/15 via-ink-900/40 to-ink-900/20' },
  { slug: 'payflow',   emoji: '💸', accent: 'border-purple-500/30 ring-purple-500/20', gradient: 'from-purple-500/15 via-ink-900/40 to-ink-900/20' },
  { slug: 'cashloop',  emoji: '🔁', accent: 'border-emerald-500/30 ring-emerald-500/20', gradient: 'from-emerald-500/15 via-ink-900/40 to-ink-900/20' },
  { slug: 'govhub',    emoji: '🏛', accent: 'border-amber-500/30 ring-amber-500/20',   gradient: 'from-amber-500/15 via-ink-900/40 to-ink-900/20' },
  { slug: 'taxnet',    emoji: '🌐', accent: 'border-cyan-500/30 ring-cyan-500/20',     gradient: 'from-cyan-500/15 via-ink-900/40 to-ink-900/20' },
  { slug: 'radar',     emoji: '📡', accent: 'border-rose-500/30 ring-rose-500/20',     gradient: 'from-rose-500/15 via-ink-900/40 to-ink-900/20' },
  { slug: 'partner',   emoji: '🤝', accent: 'border-pink-500/30 ring-pink-500/20',     gradient: 'from-pink-500/15 via-ink-900/40 to-ink-900/20' },
  { slug: 'market',    emoji: '🛒', accent: 'border-gold-500/30 ring-gold-500/20',     gradient: 'from-gold-500/15 via-ink-900/40 to-ink-900/20' },
  { slug: 'arena',     emoji: '🎮', accent: 'border-yellow-500/30 ring-yellow-500/20', gradient: 'from-yellow-500/15 via-ink-900/40 to-ink-900/20' },
  { slug: 'insight',   emoji: '📊', accent: 'border-teal-500/30 ring-teal-500/20',     gradient: 'from-teal-500/15 via-ink-900/40 to-ink-900/20' },
];

export function ProductMatrix({ portalBase }: { portalBase: '/sme' | '/pro' }) {
  const { t } = useI18n();

  return (
    <section className="rounded-2xl border border-white/10 bg-ink-900/40 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">{t('matrix.title')}</h2>
            <HelperHint id="matrix.overview" />
          </div>
          <p className="mt-1 text-[12px] text-slate-400">{t('matrix.subtitle')}</p>
        </div>
        <span className="rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-[11px] text-gold-300">
          {t('matrix.countLabel', { n: MODULES.length })}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {MODULES.map((m, i) => {
          const href = `${portalBase}/modules/${m.slug}`;
          const name   = t(`matrix.${m.slug}.name`);
          const tagline= t(`matrix.${m.slug}.tag`);
          const desc   = t(`matrix.${m.slug}.desc`);
          const cta    = t('matrix.enterCta');
          return (
            <Link
              key={m.slug}
              href={href}
              className={`group relative flex flex-col rounded-2xl border bg-gradient-to-br ${m.gradient} ${m.accent} p-4 ring-1 ring-inset transition hover:-translate-y-0.5 hover:ring-2`}
            >
              {/* 序号 + emoji */}
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl ring-1 ring-white/10">
                  {m.emoji}
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* 名称 + 副标题 */}
              <div className="mt-3 text-base font-semibold text-white">{name}</div>
              <div className="mt-0.5 text-[11px] text-slate-300">{tagline}</div>

              {/* 一句话描述 */}
              <div className="mt-2 flex-1 text-[11px] leading-relaxed text-slate-400 line-clamp-3">
                {desc}
              </div>

              {/* CTA 行 */}
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
                <span className="text-[11px] text-slate-300 transition group-hover:text-white">
                  {cta}
                </span>
                <span className="text-base text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-white">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 底部小提示 */}
      <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-[11px] text-slate-400">
        💡 {t('matrix.tip')}
      </div>
    </section>
  );
}
