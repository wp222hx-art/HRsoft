// SME module page — wraps ModuleRenderer with portal=SME
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MODULE_BY_SLUG } from '@/lib/enums';
import { ModuleRenderer } from '@/components/modules/ModuleRenderer';
import { getServerT } from '@/i18n/server';

export default function SmeModulePage({ params }: { params: { slug: string } }) {
  const meta = MODULE_BY_SLUG[params.slug];
  if (!meta) notFound();
  const { t } = getServerT();
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{meta.emoji}</span>
            <h1 className="text-xl font-bold text-white">{t(`mod.${params.slug}.cn`)}</h1>
            {meta.killer && (
              <span className="rounded-full border border-gold-500/30 bg-gold-500/10 px-2 py-0.5 text-[10px] text-gold-300">
                Killer Module
              </span>
            )}
          </div>
          <div className="mt-1 text-xs text-slate-400">{t(`mod.${params.slug}.tagline`)}</div>
        </div>
        <Link href="/sme" className="text-xs text-nova-300 hover:text-nova-200">{t('modules.backToSmeHome')}</Link>
      </div>
      <ModuleRenderer slug={params.slug} portal="SME" />
    </div>
  );
}
