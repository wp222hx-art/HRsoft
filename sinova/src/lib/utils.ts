import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(n: number, currency = 'SGD'): string {
  if (Math.abs(n) >= 1_000_000) return `${currency} ${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000)     return `${currency} ${(n / 1_000).toFixed(1)}K`;
  return `${currency} ${n.toFixed(0)}`;
}

export function fmtDate(d: Date | string): string {
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toISOString().slice(0, 10);
}

export function relativeDays(d: Date | string): string {
  const dt = typeof d === 'string' ? new Date(d) : d;
  const diff = Math.round((dt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `T+${diff} 天`;
  if (diff < 0) return `逾期 ${-diff} 天`;
  return '今日';
}
