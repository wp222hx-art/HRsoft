// Client component — fetches /api/modules/[slug] and renders the correct view.
'use client';

import { useEffect, useState } from 'react';
import { TaxShieldView } from './views/TaxShieldView';
import { PayFlowView }   from './views/PayFlowView';
import { CashLoopView }  from './views/CashLoopView';
import { GovHubView }    from './views/GovHubView';
import { TaxNetView }    from './views/TaxNetView';
import { RadarView }     from './views/RadarView';
import { PartnerView }   from './views/PartnerView';
import { MarketView }    from './views/MarketView';
import { ArenaView }     from './views/ArenaView';
import { InsightView }   from './views/InsightView';

export function ModuleRenderer({ slug, portal }: { slug: string; portal: 'PRO' | 'SME' }) {
  const [data, setData] = useState<any>(null);
  const [err, setErr]   = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/modules/${slug}`)
      .then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || 'load failed'); return r.json(); })
      .then(setData)
      .catch((e: Error) => setErr(e.message));
  }, [slug]);

  if (err) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
        加载失败: {err}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  const props = { ...data, portal } as any;
  switch (slug) {
    case 'taxshield': return <TaxShieldView {...props} />;
    case 'payflow':   return <PayFlowView   {...props} />;
    case 'cashloop':  return <CashLoopView  {...props} />;
    case 'govhub':    return <GovHubView    {...props} />;
    case 'taxnet':    return <TaxNetView    {...props} />;
    case 'radar':     return <RadarView     {...props} />;
    case 'partner':   return <PartnerView   {...props} />;
    case 'market':    return <MarketView    {...props} />;
    case 'arena':     return <ArenaView     {...props} />;
    case 'insight':   return <InsightView   {...props} />;
    default:          return <div className="text-slate-400">Unknown module.</div>;
  }
}
