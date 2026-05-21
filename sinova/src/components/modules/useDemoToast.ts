'use client';
// useDemoToast — 体验流程的轻量反馈（非真实写库）。
// 用于按钮、模拟动作等的"我做了什么"即时回声，避免点击后无反应。
//
// 调用方式：
//   const toast = useDemoToast();
//   toast('AI 催收邮件已生成，3 秒后发送'); // 默认 success
//   toast('已暂停', 'info');

import { useCallback } from 'react';

type Tone = 'success' | 'info' | 'warning';

const TONE_STYLE: Record<Tone, string> = {
  success: 'bg-emerald-500/95 ring-emerald-400/40',
  info:    'bg-nova-500/95    ring-nova-400/40',
  warning: 'bg-amber-500/95   ring-amber-400/40',
};

const TONE_ICON: Record<Tone, string> = {
  success: '✅',
  info:    'ℹ️',
  warning: '⚠️',
};

export function useDemoToast() {
  return useCallback((msg: string, tone: Tone = 'success') => {
    if (typeof document === 'undefined') return;
    const el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.className =
      `pointer-events-none fixed left-1/2 top-6 z-[100] -translate-x-1/2 translate-y-0 ` +
      `rounded-2xl px-4 py-2.5 text-sm font-medium text-white ring-1 shadow-2xl backdrop-blur-md ${TONE_STYLE[tone]}`;
    el.style.transition = 'opacity 220ms ease, transform 220ms ease';
    el.style.opacity = '0';
    el.style.transform = 'translate(-50%, -8px)';
    el.innerHTML = `<span class="mr-2">${TONE_ICON[tone]}</span>${escapeHtml(msg)}`;
    document.body.appendChild(el);
    // animate in
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translate(-50%, 0)';
    });
    // remove after 2.4s
    window.setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -8px)';
      window.setTimeout(() => el.remove(), 280);
    }, 2400);
  }, []);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
