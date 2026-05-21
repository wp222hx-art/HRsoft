'use client';
// HelperHint — 在每个步骤旁边的「✨ AI 助手解说」气泡，
// 点击/悬停后展开一段解释当前面板「在做什么 / 可以做什么 / 下一步」的卡片。
// 通过 i18n 词典驱动，所有文案 = t(`hint.${id}.title`) / t(`hint.${id}.body`) / t(`hint.${id}.next`).

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/i18n/client';

type Variant = 'inline' | 'corner';

export function HelperHint({
  id,
  variant = 'inline',
  className = '',
}: {
  id: string;            // dict key suffix, e.g. "taxshield.workbench"
  variant?: Variant;     // inline: 跟在标题旁边; corner: 卡片右上角浮标
  className?: string;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const title = t(`hint.${id}.title`);
  const body  = t(`hint.${id}.body`);
  const next  = t(`hint.${id}.next`);
  // 如果词典没命中，t() 会回落为 key — 此时不渲染
  const hasContent = title && !title.startsWith('hint.');
  if (!hasContent) return null;

  const positionCls =
    variant === 'corner'
      ? 'absolute right-3 top-3 z-20'
      : 'relative inline-flex';

  return (
    <div ref={ref} className={`${positionCls} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={t('hint.btn.help')}
        className={`group inline-flex items-center gap-1.5 rounded-full border border-nova-500/40 bg-nova-500/10 px-2.5 py-1 text-[11px] font-medium text-nova-200 ring-1 ring-nova-500/20 transition hover:bg-nova-500/20 hover:text-white ${
          open ? 'bg-nova-500/30 text-white' : ''
        }`}
      >
        <span className="text-sm leading-none">✨</span>
        <span>{t('hint.btn.label')}</span>
      </button>

      {open && (
        <div
          role="dialog"
          className={`absolute z-30 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-nova-500/30 bg-ink-900/95 p-4 text-sm shadow-2xl shadow-nova-500/20 backdrop-blur-md ${
            variant === 'corner' ? 'right-0 top-full' : 'left-0 top-full'
          }`}
          style={{ animation: 'helperPop 180ms ease-out' }}
        >
          <div className="flex items-start gap-2">
            <div className="text-lg leading-none">🤖</div>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-widest text-nova-300">
                {t('hint.assistantName')}
              </div>
              <div className="mt-0.5 font-semibold text-white">{title}</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white"
              aria-label={t('common.close')}
            >
              ×
            </button>
          </div>

          <p className="mt-3 leading-relaxed text-slate-300">{body}</p>

          {next && !next.startsWith('hint.') && (
            <div className="mt-3 rounded-lg border border-nova-500/20 bg-nova-500/5 p-2.5 text-[12px] text-nova-200">
              <span className="mr-1 font-semibold">{t('hint.nextLabel')}</span>
              <span className="text-slate-200">{next}</span>
            </div>
          )}

          <div className="mt-3 text-[11px] text-slate-500">
            {t('hint.footer')}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes helperPop {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
