// SiNova — single source of truth for enum-like string values.
// All Prisma string fields that represent enums get their typings & metadata here.

// ─── User & portal ────────────────────────────────────────────────────────────
export const PORTALS = ['PRO', 'SME', 'ADMIN'] as const;
export type Portal = (typeof PORTALS)[number];

export const PRO_TYPES = ['P1_CPA_FIRM', 'P2_INDIE_CPA', 'P3_PAYROLL', 'P4_CORPSEC'] as const;
export type ProType = (typeof PRO_TYPES)[number];

export const PRO_TYPE_LABELS: Record<ProType, { name: string; desc: string; emoji: string }> = {
  P1_CPA_FIRM:  { name: '会计所合伙人 / 税务经理', desc: '50-2000 客户 · TaxShield 多国税法 + Radar 预警', emoji: '🏛' },
  P2_INDIE_CPA: { name: 'CPA 独立顾问',           desc: '20-100 客户 · Freemium + 按 entity 阶梯',     emoji: '👤' },
  P3_PAYROLL:   { name: 'HR / Payroll 服务商',    desc: '30-500 客户 · PayFlow 福利期权 + 多国劳动法',  emoji: '💼' },
  P4_CORPSEC:   { name: 'Corp Sec 公司秘书机构',   desc: '100-3000 客户 · GovHub 多国主体 + AGM 全自动', emoji: '🗂' },
};

export const SME_TYPES = ['S1_ECOMMERCE', 'S2_WEB3', 'S3_SAAS', 'S4_TRADITIONAL'] as const;
export type SmeType = (typeof SME_TYPES)[number];

export const SME_TYPE_LABELS: Record<SmeType, { name: string; desc: string; emoji: string }> = {
  S1_ECOMMERCE:   { name: '跨境电商卖家',  desc: '1-50 人 · TaxNet 全球间接税 + AI Partner',    emoji: '🛒' },
  S2_WEB3:        { name: 'Web3 / 加密公司', desc: '5-30 人 · GovHub DAO 实体 + 加密税 App',      emoji: '🪙' },
  S3_SAAS:        { name: 'SaaS 出海团队',  desc: '10-100 人 · PayFlow 全球发薪 + Passport',     emoji: '🚀' },
  S4_TRADITIONAL: { name: '传统中小企业',    desc: '5-200 人 · AI Partner Lite 永久免费体验',     emoji: '🏪' },
};

// ─── AI Partner personas ─────────────────────────────────────────────────────
export const PERSONAS = ['ALEX', 'MAYA', 'DR_CHEN'] as const;
export type Persona = (typeof PERSONAS)[number];

export const PERSONA_PROFILES: Record<Persona, {
  name:      string;
  tagline:   string;
  style:     string;
  audience:  string;
  emoji:     string;
  accent:    string;     // tailwind text accent color class
  bgAccent:  string;     // tailwind bg accent class
  voice:     (msg: string) => string; // wraps a default reply with tone
}> = {
  ALEX: {
    name:     'Alex',
    tagline:  '稳健派 · 西装中年男性',
    style:    '严谨、保守、用数据说话',
    audience: '传统中小企业、家族企业',
    emoji:    '🧑‍💼',
    accent:   'text-slate-700',
    bgAccent: 'bg-slate-100',
    voice:    (m) => `按照过往三年的数据来看,${m} 我建议先稳一手。`,
  },
  MAYA: {
    name:     'Maya',
    tagline:  '创业派 · 时尚年轻女性',
    style:    '活泼、激进、用故事说话',
    audience: '跨境电商、SaaS 出海',
    emoji:    '👩‍🚀',
    accent:   'text-pink-600',
    bgAccent: 'bg-pink-50',
    voice:    (m) => `走起!${m} 这事我帮你 3 分钟搞定 ✨`,
  },
  DR_CHEN: {
    name:     'Dr. Chen',
    tagline:  '专业派 · 学者气质东亚',
    style:    '学术、深度、用案例说话',
    audience: 'Web3 / 加密、咨询类公司',
    emoji:    '🧑‍🎓',
    accent:   'text-indigo-700',
    bgAccent: 'bg-indigo-50',
    voice:    (m) => `从 OECD Pillar 2 与 MAS DT-12 的视角看,${m}`,
  },
};

// ─── Jurisdictions (NovaPassport) ────────────────────────────────────────────
export const JURISDICTIONS = ['SG', 'HK', 'US', 'UK', 'AE'] as const;
export type Jurisdiction = (typeof JURISDICTIONS)[number];

export const JURISDICTION_META: Record<Jurisdiction, {
  name: string; flag: string; regulator: string; corpTax: string; vat: string;
}> = {
  SG: { name: '新加坡',   flag: '🇸🇬', regulator: 'IRAS / ACRA',         corpTax: '17% (CIT)',     vat: 'GST 9%' },
  HK: { name: '香港',     flag: '🇭🇰', regulator: 'IRD / CR',            corpTax: '16.5% (Profits)', vat: '— (无 GST)' },
  US: { name: '美国',     flag: '🇺🇸', regulator: 'IRS / Delaware DOS',  corpTax: '21% Federal',   vat: 'Sales Tax (州税)' },
  UK: { name: '英国',     flag: '🇬🇧', regulator: 'HMRC / CH',           corpTax: '25% (Corp Tax)',vat: 'VAT 20%' },
  AE: { name: '阿联酋',   flag: '🇦🇪', regulator: 'FTA / DMCC',          corpTax: '9% (CT)',       vat: 'VAT 5%' },
};

// ─── Entity kind ─────────────────────────────────────────────────────────────
export const ENTITY_KINDS = ['PRIVATE_LTD', 'LLC', 'DAO_LLC', 'FOUNDATION', 'BRANCH'] as const;
export type EntityKind = (typeof ENTITY_KINDS)[number];

// ─── Radar levels ────────────────────────────────────────────────────────────
export const RADAR_LEVELS = ['HEALTHY', 'WATCH', 'ALERT', 'CRITICAL'] as const;
export type RadarLevel = (typeof RADAR_LEVELS)[number];

export const RADAR_LEVEL_META: Record<RadarLevel, {
  label: string; emoji: string; color: string; bg: string; ring: string; ahead: string;
}> = {
  HEALTHY:  { label: '健康',  emoji: '🟢', color: 'text-risk-green',  bg: 'bg-emerald-500/10',  ring: 'ring-emerald-500/40',  ahead: '—' },
  WATCH:    { label: '关注',  emoji: '🟡', color: 'text-risk-yellow', bg: 'bg-amber-500/10',    ring: 'ring-amber-500/40',    ahead: '90 天' },
  ALERT:    { label: '警告',  emoji: '🟠', color: 'text-risk-orange', bg: 'bg-orange-500/10',   ring: 'ring-orange-500/40',   ahead: '60 天' },
  CRITICAL: { label: '危急',  emoji: '🔴', color: 'text-risk-red',    bg: 'bg-red-500/10',      ring: 'ring-red-500/40',      ahead: '30 天' },
};

// ─── Arena health states ─────────────────────────────────────────────────────
export const HEALTH_STATES = ['HEALTHY', 'AT_RISK', 'WARNING', 'CRITICAL', 'DEFAULTED'] as const;
export type HealthState = (typeof HEALTH_STATES)[number];

// ─── 10 modules — branding & metadata ────────────────────────────────────────
export const MODULES = [
  // Mirror layer (5)
  { slug: 'taxshield', code: 'SiNova.TaxShield', cn: '司诺 · 税盾',     emoji: '🛡',  killer: false, layer: 'MIRROR',
    tagline: '从税务计算器升级为税务筹划顾问',  copi: 'AI.TaxAssist · 仅 SG',
    super:   '多国税法引擎(SG/HK/US/UK/AE) + 跨年度调整 AI + 税务筹划建议' },
  { slug: 'payflow',   code: 'SiNova.PayFlow',   cn: '司诺 · 薪流',     emoji: '💸',  killer: false, layer: 'MIRROR',
    tagline: '薪酬全栈:发薪 + 福利 + 期权 + 工时 + 多国劳动法', copi: 'AI.Payroll',
    super:   '+ 期权 ESOP + 福利管理 + 工时打卡 + 多国劳动法' },
  { slug: 'cashloop',  code: 'SiNova.CashLoop',  cn: '司诺 · 收付通',   emoji: '🔁',  killer: true,  layer: 'MIRROR',
    tagline: 'AR + AP 双向资金闭环(Copi 最大缺口)', copi: 'AI.BillPay · 仅 AP',
    super:   'AR 应收 + AP 应付双闭环 + 票据贴现 + AI 多语种催收' },
  { slug: 'govhub',    code: 'SiNova.GovHub',    cn: '司诺 · 司治',     emoji: '🏛',  killer: false, layer: 'MIRROR',
    tagline: '跨国公司治理中枢',                      copi: 'AI.CorpSec · 仅 SG',
    super:   '+ 多国主体注册(HK/US/UK/AE) + AGM 全自动 + DAO 实体' },
  { slug: 'taxnet',    code: 'SiNova.TaxNet',    cn: '司诺 · 税络',     emoji: '🌐',  killer: false, layer: 'MIRROR',
    tagline: '全球间接税统一引擎',                    copi: 'AI.GST · 仅 SG',
    super:   '+ 全球 VAT/GST/Sales Tax 统一引擎 + 行业异常基准' },
  // Killer layer (5)
  { slug: 'radar',     code: 'SiNova.Radar',     cn: '司诺 · 雷达',     emoji: '📡',  killer: true,  layer: 'KILLER',
    tagline: '从被动合规 → 主动预警(Copi 完全没有)', copi: '—',
    super:   'Compliance Radar:30/60/90 天罚款预警 + 风险评分 + 合规险' },
  { slug: 'partner',   code: 'SiNova.Partner',   cn: '司诺 · 合伙人',   emoji: '🤝',  killer: true,  layer: 'KILLER',
    tagline: '拟人化 AI 合伙人,SME 跳过服务商直连',   copi: '—',
    super:   '三套人格(Alex/Maya/Dr.Chen) · 按结果付费 · 责任险兜底' },
  { slug: 'market',    code: 'SiNova.Market',    cn: '司诺 · 集市',     emoji: '🛒',  killer: true,  layer: 'KILLER',
    tagline: '合规界的 Slack App Store',              copi: '—',
    super:   '开放 API + 70/30 分润 + 应用沙箱 + 开发者大赛' },
  { slug: 'arena',     code: 'SiNova.Arena',     cn: '司诺 · 战场',     emoji: '🎮',  killer: true,  layer: 'KILLER',
    tagline: '把"加班合规"变成"打怪升级"',            copi: '—',
    super:   '30+ 徽章 + HCS 评分 + 季度赛季 + 服务商排行榜' },
  { slug: 'insight',   code: 'SiNova.Insight',   cn: '司诺 · 智库',     emoji: '📊',  killer: true,  layer: 'KILLER',
    tagline: '数据资产反向变现(第二增长曲线)',       copi: '—',
    super:   'k-匿名脱敏 + 行业基准报告 + 数据 API + Token 激励' },
] as const;

export type ModuleSlug = (typeof MODULES)[number]['slug'];
export const MODULE_BY_SLUG: Record<string, (typeof MODULES)[number]> =
  Object.fromEntries(MODULES.map((m) => [m.slug, m]));
