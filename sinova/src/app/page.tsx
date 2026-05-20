import Link from 'next/link';
import { MODULES, JURISDICTION_META, JURISDICTIONS } from '@/lib/enums';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink-950 text-white">
      {/* ─── Top nav ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="text-2xl">📡</span>
            <span className="bg-gradient-to-r from-white via-nova-200 to-gold-400 bg-clip-text text-transparent">
              司诺 SiNova
            </span>
            <span className="ml-2 nova-chip bg-nova-500/15 text-nova-200 ring-nova-400/40">
              v0.1 Demo · MVP-0
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#manifesto"  className="text-slate-300 hover:text-white">战略</a>
            <a href="#modules"    className="text-slate-300 hover:text-white">10 大模块</a>
            <a href="#foundation" className="text-slate-300 hover:text-white">平台底座</a>
            <a href="#moat"       className="text-slate-300 hover:text-white">6 大护城河</a>
            <a href="#opensource" className="text-slate-300 hover:text-white">开源生态</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="nova-btn-ghost text-slate-200">登录</Link>
            <Link href="/register" className="nova-btn-primary">免费体验 →</Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="nova-grid absolute inset-0 opacity-30" />
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-nova-600/20 blur-3xl" />
        <div className="absolute -right-40 top-40 h-[500px] w-[500px] rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="flex flex-col items-start">
            <span className="nova-chip bg-white/5 text-slate-200 ring-white/10">
              Project SiNova · 作战级产品规划书 v1.0
            </span>
            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
              <span className="bg-gradient-to-br from-white via-nova-200 to-gold-400 bg-clip-text text-transparent">
                让全球任何一家公司
              </span>
              <br />
              <span className="text-white">都像点外卖一样完成跨国合规。</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-slate-300">
              当 Copi 还在卖 &quot;AI 助手&quot;, 我们直接造一艘
              <span className="font-semibold text-gold-400"> 全球合规航母</span>——
              <br className="hidden md:block" />
              <span className="text-nova-300">双门户</span> ×
              <span className="text-nova-300"> 全球护照</span> ×
              <span className="text-nova-300"> 主动雷达</span> ×
              <span className="text-nova-300"> 生态飞轮</span> ×
              <span className="text-nova-300"> Token 经济</span>
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/register?portal=PRO" className="nova-btn-primary text-base">
                🛠 服务商入口 (Pro Dashboard)
              </Link>
              <Link href="/register?portal=SME" className="nova-btn-outline text-base">
                ✨ SME 自助入口 (Smart Hub)
              </Link>
              <Link href="/login" className="nova-btn-ghost text-slate-300">
                直接体验 Demo 账号 →
              </Link>
            </div>

            {/* 5-jurisdiction strip */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-slate-400">
                NovaPassport · 一次 KYB → 通行
              </span>
              {JURISDICTIONS.map((j) => {
                const meta = JURISDICTION_META[j];
                return (
                  <div key={j} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm">
                    <span className="text-base">{meta.flag}</span>
                    <span>{meta.name}</span>
                    <span className="text-slate-400">· {meta.regulator}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Manifesto / vs Copi ───────────────────────────────────── */}
      <section id="manifesto" className="border-t border-white/5 bg-gradient-to-b from-ink-950 to-ink-900">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">
                Copi 在卖<span className="text-slate-400"> AI 助手 </span>;
                <br />
                <span className="text-gold-400">SiNova 在造合规文明。</span>
              </h2>
              <p className="mt-6 leading-relaxed text-slate-300">
                Copi 用 5 个 AI 子产品做出了 &quot;合规服务商的外骨骼&quot;——但它有 4 个
                <span className="font-semibold text-white"> 不敢做 </span>的事:
              </p>
              <ul className="mt-4 space-y-2 text-slate-300">
                <li>· 不敢得罪服务商, 所以不敢直连 SME</li>
                <li>· 不敢离开新加坡, 因为没有规则引擎</li>
                <li>· 不敢做 AR, 因为会被 Stripe 比下去</li>
                <li>· 不敢开放生态, 因为怕被分流</li>
              </ul>
              <p className="mt-6 leading-relaxed text-slate-300">
                <span className="font-semibold text-white">司诺 SiNova</span>, 恰好把这 4 件
                <span className="text-gold-400"> 它不敢做的</span>全部做掉, 再叠上
                <span className="text-nova-300"> 主动雷达 / 游戏化 / Token 经济 / 数据资产 </span>
                四把杀手锏。
              </p>
            </div>

            {/* vs Copi dimension table */}
            <div className="nova-card-dark p-6">
              <div className="mb-4 text-sm uppercase tracking-widest text-slate-400">
                八维差异 · 8-Dimension Diff
              </div>
              <div className="grid gap-3 text-sm">
                {[
                  { d: '目标用户',  copi: '仅服务商 B2B2B',           nova: '双门户:服务商 + SME' },
                  { d: '地理覆盖',  copi: '主要新加坡',               nova: 'SG/HK/US/UK/AE 一键' },
                  { d: '服务模式',  copi: 'AI 辅助 + 人类主导',        nova: 'AI 主导 + 人类背书' },
                  { d: '资金闭环',  copi: '仅 AP (应付)',             nova: 'AR + AP 双闭环 + 票据贴现' },
                  { d: '风险姿态',  copi: '被动响应',                  nova: '主动雷达 30/60/90 天预警' },
                  { d: '付费方式',  copi: '订阅 + 申报量',             nova: '免费 + 订阅 + Token + 数据' },
                  { d: '生态形态',  copi: '封闭自营',                  nova: '开放 App Store 70/30 分润' },
                  { d: '终极愿景',  copi: '提效 80% 的合规工具',       nova: '全球合规网络 + DAO 治理' },
                ].map((row) => (
                  <div key={row.d} className="grid grid-cols-[100px_1fr_1fr] gap-3 border-b border-white/5 pb-2.5">
                    <div className="font-medium text-slate-300">{row.d}</div>
                    <div className="text-slate-400">{row.copi}</div>
                    <div className="text-nova-300">{row.nova}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 10 modules ────────────────────────────────────────────── */}
      <section id="modules" className="border-t border-white/5 bg-ink-950">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="nova-chip bg-nova-500/15 text-nova-200 ring-nova-400/40">
                第二部分 · 产品层
              </span>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">10 大子产品矩阵</h2>
              <p className="mt-2 text-slate-400">
                5 个对标层 (超越 Copi 现有产品) + 5 个杀手锏层 (Copi 完全没有)
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {MODULES.map((m) => (
              <div key={m.slug}
                   className={`group nova-card-dark relative overflow-hidden p-5 transition hover:-translate-y-1 hover:nova-glow ${m.killer ? 'ring-1 ring-gold-500/30' : ''}`}>
                {m.killer && (
                  <div className="absolute right-3 top-3 nova-chip bg-gold-500/15 text-gold-400 ring-gold-500/40">
                    🔥 杀手锏
                  </div>
                )}
                <div className="text-3xl">{m.emoji}</div>
                <div className="mt-2 text-sm font-mono text-nova-300">{m.code}</div>
                <div className="text-lg font-semibold">{m.cn}</div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">{m.tagline}</p>
                <div className="mt-3 text-xs text-slate-500">vs Copi: {m.copi}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Foundation 4 ──────────────────────────────────────────── */}
      <section id="foundation" className="border-t border-white/5 bg-gradient-to-b from-ink-950 to-ink-900">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <span className="nova-chip bg-gold-500/15 text-gold-400 ring-gold-500/40">
              §1.4 平台底座
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">4 大基础设施</h2>
            <p className="mt-2 text-slate-400">
              如果做扎实, 10 个产品就是 4 件底座长出来的&quot;枝叶&quot;——这才是 SiNova 真正的护城河。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { code: 'NovaVault',    cn: '智能保险库', emoji: '🔐', desc: '跨 10 产品 × 5 国 × 链上哈希存证的统一文档底座', value: '数据资产沉淀, 迁移成本无穷大' },
              { code: 'NovaPassport', cn: '全球合规护照', emoji: '🛂', desc: '一次 KYC/KYB → 多国通用主体身份',                  value: '跨境护城河, TAM × 50' },
              { code: 'NovaCopilot',  cn: 'AI 中枢',     emoji: '🤖', desc: 'Multi-Agent 编排器 + 自然语言入口',                value: '用户体验降维打击' },
              { code: 'NovaChain',    cn: '区块链存证层', emoji: '⛓', desc: '关键合规事件哈希上链, 对接监管沙箱',                value: '信任层 + 未来 Token 基础' },
            ].map((x) => (
              <div key={x.code} className="nova-card-dark p-6">
                <div className="text-3xl">{x.emoji}</div>
                <div className="mt-3 font-mono text-sm text-nova-300">{x.code}</div>
                <div className="text-lg font-semibold">{x.cn}</div>
                <p className="mt-3 text-sm text-slate-400">{x.desc}</p>
                <div className="mt-4 border-t border-white/5 pt-3 text-xs text-gold-400">
                  💡 {x.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6 moats ───────────────────────────────────────────────── */}
      <section id="moat" className="border-t border-white/5 bg-ink-950">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <span className="nova-chip bg-nova-500/15 text-nova-200 ring-nova-400/40">
              第四部分 · 决胜层
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">6 大护城河</h2>
            <p className="mt-2 text-slate-400">为什么是 SiNova, 不是 Copi 2.0?</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { n: '①', t: '双门户覆盖',   d: '用户基数 × 5 — Copi 不敢直连 SME, 我们靠 SME 飞轮反向赋能服务商' },
              { n: '②', t: '全球合规护照', d: '地理范围 × 50 — DSL 规则引擎让新国家 4 周上线 + 本地专家网络' },
              { n: '③', t: 'AR + AP 双闭环', d: '资金链 100% — SME 死掉 90% 的原因是收不回钱不是付不出钱' },
              { n: '④', t: 'Compliance Radar', d: '从被动到主动 — 30/60/90 天罚款概率预测 + 合规险联合产品' },
              { n: '⑤', t: '开放生态飞轮', d: '速度差 10× — Copi 自做 5 个产品要 3 年, 我们 3 个月能上 50 个' },
              { n: '⑥', t: 'Token + 数据双增值', d: '估值倍数从 8x 跳到 20x ARR — 客户即股东 + 第二增长曲线' },
            ].map((x) => (
              <div key={x.n} className="nova-card-dark p-6">
                <div className="text-4xl font-bold text-gold-400">{x.n}</div>
                <div className="mt-2 text-lg font-semibold">{x.t}</div>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Open source stack ─────────────────────────────────────── */}
      <section id="opensource" className="border-t border-white/5 bg-gradient-to-b from-ink-900 to-ink-950">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <span className="nova-chip bg-emerald-500/15 text-emerald-300 ring-emerald-500/40">
              第七部分 · 开源生态选型
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">站在巨人肩上 · 节省 50% 工时</h2>
            <p className="mt-2 max-w-3xl text-slate-400">
              没有任何一个开源项目能直接对标完整的 SiNova—— 但底层 60-70% 工作量都可以站在成熟开源项目肩膀上完成,
              把研发周期从 3 年压缩到 12 个月。
            </p>
          </div>

          <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
            {[
              { mod: 'TaxShield 税盾',    base: 'Odoo/ERPNext 财会模块',        diff: '多国税法 DSL + AI 筹划',   save: '60%' },
              { mod: 'PayFlow 薪流',      base: 'Odoo HR + OrangeHRM',          diff: 'ESOP + 多国劳动法',        save: '55%' },
              { mod: 'CashLoop 收付通',   base: 'Invoice Ninja + AWS P2P 蓝图', diff: '票据贴现 + AI 催收',       save: '70%' },
              { mod: 'GovHub 司治',       base: 'DocuSeal + Odoo',              diff: '多国注册编排 + DAO',       save: '50%' },
              { mod: 'TaxNet 税络',       base: 'OpenTaxSolver + Lago',          diff: '全球 VAT/GST 引擎',        save: '40%' },
              { mod: 'Radar 雷达',        base: 'Comp AI + Wazuh + Prometheus', diff: '风险评分 ML + 合规险',     save: '30%' },
              { mod: 'Partner 合伙人',    base: 'LangGraph + CrewAI + LiveKit', diff: '三套人格 + 责任险',        save: '50%' },
              { mod: 'Market 集市',       base: 'n8n / Zapier 模式',             diff: '应用沙箱 + 70/30 分润',    save: '40%' },
              { mod: 'Arena 战场',        base: 'OpenBadges + Phaser',           diff: '徽章逻辑 + HCS 评分',      save: '30%' },
              { mod: 'Insight 智库',      base: 'Superset + Privacy-on-Beam',    diff: '行业基准产品化',           save: '60%' },
            ].map((row) => (
              <div key={row.mod} className="nova-card-dark p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{row.mod}</div>
                  <span className="nova-chip bg-emerald-500/15 text-emerald-300 ring-emerald-500/40">
                    省 {row.save}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">开源地基</div>
                <div className="text-sm text-slate-300">{row.base}</div>
                <div className="mt-2 text-xs text-slate-500">自研护城河</div>
                <div className="text-sm text-gold-400">{row.diff}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-gradient-to-br from-nova-900/40 via-ink-950 to-ink-900">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-white via-nova-200 to-gold-400 bg-clip-text text-transparent">
              干就完了, 猫哥! 🚀
            </span>
          </h2>
          <p className="mt-5 mx-auto max-w-2xl text-slate-300">
            司诺出击 — 现在就用 Demo 账号体验完整双门户、10 大模块、Radar 主动雷达、AI Partner 三人格。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/login" className="nova-btn-primary text-base">登录 Demo 账号 →</Link>
            <Link href="/register" className="nova-btn-outline text-base">创建新账号</Link>
          </div>
          <div className="mt-6 text-xs text-slate-500">
            Demo 密码:<code className="rounded bg-white/10 px-1.5 py-0.5">demo1234</code>
            &nbsp;· 7 个示例账号涵盖 Pro 服务商 / 4 类 SME 客户
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-ink-950 py-8 text-center text-xs text-slate-500">
        Project SiNova · v0.1 Demo · 猫哥战略研究院 © 2026
        <span className="mx-2">·</span>
        基于战略文档《司诺 SiNova · 下一代全球合规 AI 平台产品规划书》构建
      </footer>
    </main>
  );
}
