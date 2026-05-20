// Pro module page — dispatches to per-module renderer.
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MODULE_BY_SLUG } from '@/lib/enums';
import { ModuleRenderer } from '@/components/modules/ModuleRenderer';
import { ArrowLeft } from 'lucide-react';

export default function ProModulePage({ params }: { params: { slug: string } }) {
  const meta = MODULE_BY_SLUG[params.slug];
  if (!meta) notFound();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/pro" className="hover:text-white"><ArrowLeft className="inline h-3 w-3" /> Dashboard</Link>
        <span>/</span><span>模块</span><span>/</span><span className="text-white">{meta.cn}</span>
      </div>

      <header className="rounded-2xl border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{meta.emoji}</span>
              <div>
                <div className="font-mono text-xs text-nova-300">{meta.code}</div>
                <h1 className="text-2xl font-bold">{meta.cn}</h1>
              </div>
              {meta.killer && (
                <span className="nova-chip bg-gold-500/15 text-gold-400 ring-gold-500/40">
                  🔥 杀手锏
                </span>
              )}
            </div>
            <p className="mt-3 text-slate-300">{meta.tagline}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              <div className="rounded-lg bg-white/5 px-3 py-1.5">
                <span className="text-slate-500">vs Copi:</span>
                <span className="ml-1 text-slate-300">{meta.copi}</span>
              </div>
              <div className="rounded-lg bg-nova-500/10 px-3 py-1.5">
                <span className="text-slate-400">超越点:</span>
                <span className="ml-1 text-nova-200">{meta.super}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <ModuleRenderer slug={params.slug} portal="PRO" />
    </div>
  );
}
