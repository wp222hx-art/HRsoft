// Seed data — gives the SiNova demo the shape of a real platform.
// Creates: 1 admin · 2 Pro users · 4 SME users · 8 entities across 5 jurisdictions
//          · TaxFilings · Payrolls · ESOP · Invoices · Bills · GovActions · VAT
//          · 12 Radar alerts (full HEALTHY → CRITICAL spectrum)
//          · 30+ Badges · MarketApps · InsightReports · VaultDocs

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { BADGE_CATALOG } from '../src/lib/arena';
import { score as radarScore } from '../src/lib/radar';
import { anchor } from '../src/lib/novachain';

const prisma = new PrismaClient();

const today = new Date();
const daysFromNow = (n: number) => new Date(today.getTime() + n * 86400_000);

async function reset() {
  // Delete in FK-safe order
  await prisma.tokenLedgerEntry.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.copilotMessage.deleteMany();
  await prisma.copilotChat.deleteMany();
  await prisma.arenaEvent.deleteMany();
  await prisma.radarAlert.deleteMany();
  await prisma.vaultDoc.deleteMany();
  await prisma.vatReturn.deleteMany();
  await prisma.govAction.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.esopGrant.deleteMany();
  await prisma.payrollRun.deleteMany();
  await prisma.taxFiling.deleteMany();
  await prisma.entity.deleteMany();
  await prisma.user.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.marketApp.deleteMany();
  await prisma.insightReport.deleteMany();
}

async function main() {
  console.log('🌱 Seeding SiNova demo data…');
  await reset();

  // ─── Users ─────────────────────────────────────────────────────────────
  const pw = await bcrypt.hash('demo1234', 10);

  const admin = await prisma.user.create({
    data: { email: 'admin@sinova.io', name: '猫哥 (Admin)', portal: 'ADMIN', passwordHash: pw },
  });

  const proPartner = await prisma.user.create({
    data: {
      email: 'partner@cpa-firm.sg', name: 'Sarah Tan · CPA Partner',
      portal: 'PRO', proType: 'P1_CPA_FIRM', passwordHash: pw,
      novaTokens: 1_240, streakDays: 21,
    },
  });
  const proIndie = await prisma.user.create({
    data: {
      email: 'indie@cpa.sg', name: 'David Lim · 独立 CPA',
      portal: 'PRO', proType: 'P2_INDIE_CPA', passwordHash: pw,
      novaTokens: 320, streakDays: 7,
    },
  });

  const smeEcom = await prisma.user.create({
    data: {
      email: 'ceo@cookie-island.com', name: '王老板 · Cookie Island CEO',
      portal: 'SME', smeType: 'S1_ECOMMERCE', aiPersona: 'MAYA', passwordHash: pw,
      novaTokens: 480, streakDays: 12,
    },
  });
  const smeWeb3 = await prisma.user.create({
    data: {
      email: 'founder@meta-loom.io', name: 'Vitalik Wong · MetaLoom DAO',
      portal: 'SME', smeType: 'S2_WEB3', aiPersona: 'DR_CHEN', passwordHash: pw,
      novaTokens: 1_960, streakDays: 30,
    },
  });
  const smeSaas = await prisma.user.create({
    data: {
      email: 'cto@flexpilot.ai', name: 'Mei Lin · FlexPilot CTO',
      portal: 'SME', smeType: 'S3_SAAS', aiPersona: 'MAYA', passwordHash: pw,
      novaTokens: 720, streakDays: 9,
    },
  });
  const smeTraditional = await prisma.user.create({
    data: {
      email: 'boss@laobao-trading.sg', name: '陈伯 · Lao Bao Trading',
      portal: 'SME', smeType: 'S4_TRADITIONAL', aiPersona: 'ALEX', passwordHash: pw,
      novaTokens: 60, streakDays: 2,
    },
  });

  // ─── Entities (8) ──────────────────────────────────────────────────────
  const E = {
    cookie: await prisma.entity.create({ data: {
      legalName: 'Cookie Island Pte Ltd', jurisdiction: 'SG', kind: 'PRIVATE_LTD',
      industry: 'E-commerce', registrationNo: '202401122K',
      passportStatus: 'VERIFIED', passportCountries: 'SG,US', hcs: 87, hcsState: 'HEALTHY',
      ownerId: smeEcom.id, managerId: proPartner.id,
    }}),
    cookieUS: await prisma.entity.create({ data: {
      legalName: 'Cookie Island US LLC', jurisdiction: 'US', kind: 'LLC',
      industry: 'E-commerce', registrationNo: 'DE-7741992',
      passportStatus: 'VERIFIED', passportCountries: 'US', hcs: 78, hcsState: 'AT_RISK',
      ownerId: smeEcom.id, managerId: proPartner.id,
    }}),
    metaloom: await prisma.entity.create({ data: {
      legalName: 'MetaLoom DAO LLC', jurisdiction: 'AE', kind: 'DAO_LLC',
      industry: 'Web3 / Crypto', registrationNo: 'DMCC-DAO-0421',
      passportStatus: 'VERIFIED', passportCountries: 'AE,SG', hcs: 92, hcsState: 'HEALTHY',
      ownerId: smeWeb3.id,
    }}),
    flex: await prisma.entity.create({ data: {
      legalName: 'FlexPilot Pte Ltd', jurisdiction: 'SG', kind: 'PRIVATE_LTD',
      industry: 'SaaS', registrationNo: '202309998M',
      passportStatus: 'VERIFIED', passportCountries: 'SG,HK,UK', hcs: 71, hcsState: 'AT_RISK',
      ownerId: smeSaas.id, managerId: proPartner.id,
    }}),
    flexHK: await prisma.entity.create({ data: {
      legalName: 'FlexPilot HK Ltd', jurisdiction: 'HK', kind: 'PRIVATE_LTD',
      industry: 'SaaS', registrationNo: 'HK-CR-3045981',
      passportStatus: 'KYB_PENDING', passportCountries: 'HK', hcs: 82, hcsState: 'HEALTHY',
      ownerId: smeSaas.id, managerId: proPartner.id,
    }}),
    flexUK: await prisma.entity.create({ data: {
      legalName: 'FlexPilot UK Ltd', jurisdiction: 'UK', kind: 'PRIVATE_LTD',
      industry: 'SaaS', registrationNo: 'CH-13456789',
      passportStatus: 'VERIFIED', passportCountries: 'UK', hcs: 55, hcsState: 'WARNING',
      ownerId: smeSaas.id, managerId: proPartner.id,
    }}),
    laobao: await prisma.entity.create({ data: {
      legalName: 'Lao Bao Trading Pte Ltd', jurisdiction: 'SG', kind: 'PRIVATE_LTD',
      industry: 'Wholesale', registrationNo: '199822011D',
      passportStatus: 'DRAFT', passportCountries: 'SG', hcs: 38, hcsState: 'CRITICAL',
      ownerId: smeTraditional.id, managerId: proIndie.id,
    }}),
    abc: await prisma.entity.create({ data: {
      legalName: 'ABC Pte Ltd', jurisdiction: 'SG', kind: 'PRIVATE_LTD',
      industry: 'Consulting', registrationNo: '201733221B',
      passportStatus: 'VERIFIED', passportCountries: 'SG', hcs: 65, hcsState: 'AT_RISK',
      ownerId: smeTraditional.id, managerId: proPartner.id,
    }}),
  };
  const allEntities = Object.values(E);

  // ─── Tax Filings (TaxShield) ───────────────────────────────────────────
  await prisma.taxFiling.createMany({ data: [
    { entityId: E.cookie.id,   formType: 'Form C-S',     jurisdiction: 'SG', taxYear: 2025,
      taxableIncome: 480_000, taxPayable: 81_600, status: 'PENDING_HUMAN', dueDate: daysFromNow(45),
      aiSavingHint: '建议申请 R&D 税收抵免,预计可省 SGD 12,400' },
    { entityId: E.cookieUS.id, formType: 'Form 1120',    jurisdiction: 'US', taxYear: 2025,
      taxableIncome: 220_000, taxPayable: 46_200, status: 'AI_REVIEWING', dueDate: daysFromNow(28) },
    { entityId: E.metaloom.id, formType: 'AE Corporate Tax 9%', jurisdiction: 'AE', taxYear: 2025,
      taxableIncome: 1_200_000, taxPayable: 108_000, status: 'APPROVED', dueDate: daysFromNow(80),
      aiSavingHint: 'DMCC 自由区可享受 0% 税率,正在评估搬迁可行性' },
    { entityId: E.flex.id,     formType: 'Form C-S',     jurisdiction: 'SG', taxYear: 2025,
      taxableIncome: 850_000, taxPayable: 144_500, status: 'DRAFT', dueDate: daysFromNow(15),
      aiSavingHint: '可申请 IP 收入豁免(Pioneer),预计可省 SGD 28,000' },
    { entityId: E.flexUK.id,   formType: 'CT600',        jurisdiction: 'UK', taxYear: 2025,
      taxableIncome: 320_000, taxPayable: 80_000, status: 'SUBMITTED', dueDate: daysFromNow(-5) },
    { entityId: E.laobao.id,   formType: 'Form C',       jurisdiction: 'SG', taxYear: 2024,
      taxableIncome: 95_000,  taxPayable: 16_150, status: 'AUDITED', dueDate: daysFromNow(-180),
      aiSavingHint: '⚠️ IRAS 已发起补税通知,需在 14 天内回复' },
    { entityId: E.abc.id,      formType: 'Form C-S',     jurisdiction: 'SG', taxYear: 2025,
      taxableIncome: 180_000, taxPayable: 30_600, status: 'FILED', dueDate: daysFromNow(60) },
  ]});

  // ─── Payroll (PayFlow) ─────────────────────────────────────────────────
  await prisma.payrollRun.createMany({ data: [
    { entityId: E.cookie.id, period: '2026-05', jurisdiction: 'SG', headcount: 12,
      grossTotal: 84_000, cpfTotal: 14_700, netTotal: 69_300, status: 'APPROVED' },
    { entityId: E.flex.id,   period: '2026-05', jurisdiction: 'SG', headcount: 38,
      grossTotal: 285_000, cpfTotal: 49_900, netTotal: 235_100, status: 'PAID' },
    { entityId: E.flexHK.id, period: '2026-05', jurisdiction: 'HK', headcount: 6,
      grossTotal: 92_000, cpfTotal: 4_600, netTotal: 87_400, status: 'DRAFT' },
    { entityId: E.flexUK.id, period: '2026-05', jurisdiction: 'UK', headcount: 4,
      grossTotal: 31_000, cpfTotal: 5_580, netTotal: 25_420, status: 'REPORTED' },
    { entityId: E.metaloom.id, period: '2026-05', jurisdiction: 'AE', headcount: 8,
      grossTotal: 156_000, cpfTotal: 0, netTotal: 156_000, status: 'PAID' },
    { entityId: E.abc.id,    period: '2026-05', jurisdiction: 'SG', headcount: 7,
      grossTotal: 49_000, cpfTotal: 8_575, netTotal: 40_425, status: 'APPROVED' },
  ]});

  await prisma.esopGrant.createMany({ data: [
    { entityId: E.flex.id,     employee: 'Alice Chen',     shares: 5_000, strike: 0.5,
      vestStart: daysFromNow(-540), status: 'EXERCISABLE' },
    { entityId: E.flex.id,     employee: 'Bryan Tan',      shares: 2_000, strike: 0.5,
      vestStart: daysFromNow(-180), status: 'VESTING' },
    { entityId: E.metaloom.id, employee: 'Yuki Nakamura',  shares: 25_000, strike: 0.1,
      vestStart: daysFromNow(-300), status: 'VESTING' },
    { entityId: E.cookie.id,   employee: 'Priya Mehta',    shares: 800, strike: 1.2,
      vestStart: daysFromNow(-60),  status: 'GRANTED' },
  ]});

  // ─── Invoices (CashLoop AR) ────────────────────────────────────────────
  await prisma.invoice.createMany({ data: [
    { entityId: E.cookie.id,   invoiceNo: 'INV-2025-0481', customer: 'X Co Pte Ltd',
      currency: 'SGD', amount: 48_000, issueDate: daysFromNow(-22), dueDate: daysFromNow(-12),
      status: 'OVERDUE', daysOverdue: 12, customerRiskScore: 55, dunningStage: 3 },
    { entityId: E.cookie.id,   invoiceNo: 'INV-2025-0479', customer: 'Bright Stars Ltd',
      currency: 'USD', amount: 12_400, issueDate: daysFromNow(-8), dueDate: daysFromNow(22),
      status: 'SENT', daysOverdue: 0, customerRiskScore: 88, dunningStage: 0 },
    { entityId: E.cookie.id,   invoiceNo: 'INV-2025-0492', customer: 'GreenLeaf Co',
      currency: 'SGD', amount: 7_800, issueDate: daysFromNow(-2), dueDate: daysFromNow(28),
      status: 'VIEWED', daysOverdue: 0, customerRiskScore: 92, dunningStage: 0 },
    { entityId: E.flex.id,     invoiceNo: 'FP-2026-0119', customer: 'NorthStar Capital',
      currency: 'SGD', amount: 95_000, issueDate: daysFromNow(-40), dueDate: daysFromNow(-10),
      status: 'OVERDUE', daysOverdue: 10, customerRiskScore: 70, dunningStage: 2 },
    { entityId: E.flex.id,     invoiceNo: 'FP-2026-0125', customer: 'SeaLion Bank',
      currency: 'SGD', amount: 142_000, issueDate: daysFromNow(-3), dueDate: daysFromNow(27),
      status: 'SENT', daysOverdue: 0, customerRiskScore: 95, dunningStage: 0 },
    { entityId: E.metaloom.id, invoiceNo: 'ML-001', customer: 'Velocity Ventures DAO',
      currency: 'USDC', amount: 240_000, issueDate: daysFromNow(-15), dueDate: daysFromNow(-5),
      status: 'OVERDUE', daysOverdue: 5,  customerRiskScore: 60, dunningStage: 1 },
    { entityId: E.laobao.id,   invoiceNo: 'LB-1099', customer: 'Tan & Sons Wholesale',
      currency: 'SGD', amount: 18_200, issueDate: daysFromNow(-65), dueDate: daysFromNow(-35),
      status: 'OVERDUE', daysOverdue: 35, customerRiskScore: 30, dunningStage: 4 },
    { entityId: E.abc.id,      invoiceNo: 'ABC-200', customer: 'Pearl Hotel Group',
      currency: 'SGD', amount: 32_500, issueDate: daysFromNow(-50), dueDate: daysFromNow(-20),
      status: 'OVERDUE', daysOverdue: 20, customerRiskScore: 65, dunningStage: 3 },
  ]});

  // ─── Bills (CashLoop AP) ───────────────────────────────────────────────
  await prisma.bill.createMany({ data: [
    { entityId: E.cookie.id, vendor: 'AWS Singapore',     amount: 4_220,  dueDate: daysFromNow(7),  status: 'APPROVAL_PENDING' },
    { entityId: E.cookie.id, vendor: 'Ad Agency 9th Wave',amount: 28_000, dueDate: daysFromNow(14), status: 'APPROVED' },
    { entityId: E.flex.id,   vendor: 'Stripe Payments',   amount: 1_900,  dueDate: daysFromNow(3),  status: 'SCHEDULED' },
    { entityId: E.flex.id,   vendor: 'OpenAI Inc.',       amount: 8_400,  dueDate: daysFromNow(10), status: 'APPROVAL_PENDING' },
    { entityId: E.flex.id,   vendor: 'WeWork SG',         amount: 12_000, dueDate: daysFromNow(-1), status: 'PAID' },
    { entityId: E.metaloom.id, vendor: 'Chainlink Oracle Services', amount: 22_000, dueDate: daysFromNow(15), status: 'APPROVED', currency: 'USDC' },
    { entityId: E.laobao.id, vendor: 'Sunrise Logistics', amount: 3_400,  dueDate: daysFromNow(2),  status: 'APPROVAL_PENDING' },
    { entityId: E.abc.id,    vendor: 'Office Lease Co',   amount: 6_500,  dueDate: daysFromNow(8),  status: 'APPROVED' },
  ]});

  // ─── Gov Actions (GovHub) ──────────────────────────────────────────────
  await prisma.govAction.createMany({ data: [
    { entityId: E.cookieUS.id,  kind: 'INCORPORATION',    jurisdiction: 'US', title: '注册 Cookie Island US LLC',  status: 'CONFIRMED',         dueDate: daysFromNow(-60) },
    { entityId: E.flexHK.id,    kind: 'INCORPORATION',    jurisdiction: 'HK', title: '注册 FlexPilot HK Ltd',       status: 'INTERNAL_APPROVED', dueDate: daysFromNow(7)  },
    { entityId: E.metaloom.id,  kind: 'DAO_RESOLUTION',   jurisdiction: 'AE', title: 'DAO Treasury 资金分配决议',    status: 'CLIENT_SIGNED',     dueDate: daysFromNow(2)  },
    { entityId: E.cookie.id,    kind: 'AGM',              jurisdiction: 'SG', title: '2026 年度股东大会(AGM)',     status: 'DRAFTED',           dueDate: daysFromNow(60) },
    { entityId: E.flex.id,      kind: 'SHARE_ALLOTMENT',  jurisdiction: 'SG', title: 'Series A 优先股发行',          status: 'INITIATED',         dueDate: daysFromNow(45) },
    { entityId: E.abc.id,       kind: 'ADDRESS_CHANGE',   jurisdiction: 'SG', title: '注册地址变更:乌节路 88 号',     status: 'FILED',             dueDate: daysFromNow(-3) },
    { entityId: E.flexUK.id,    kind: 'DIRECTOR_CHANGE',  jurisdiction: 'UK', title: '新增独立董事 Mr. Hughes',      status: 'INTERNAL_APPROVED', dueDate: daysFromNow(20) },
  ]});

  // ─── VAT Returns (TaxNet) ──────────────────────────────────────────────
  await prisma.vatReturn.createMany({ data: [
    { entityId: E.cookie.id,   regime: 'SG_GST',       period: '2026Q1', outputTax: 28_400, inputTax: 9_200, netPayable: 19_200, exceptions: 0, status: 'FILED',     dueDate: daysFromNow(-22) },
    { entityId: E.cookie.id,   regime: 'SG_GST',       period: '2026Q2', outputTax: 31_900, inputTax: 11_400,netPayable: 20_500, exceptions: 2, status: 'FILING',    dueDate: daysFromNow(20) },
    { entityId: E.cookieUS.id, regime: 'US_SALES_TAX', period: '2026M5', outputTax: 6_300,  inputTax: 0,     netPayable: 6_300,  exceptions: 1, status: 'COLLECTING',dueDate: daysFromNow(8) },
    { entityId: E.flex.id,     regime: 'SG_GST',       period: '2026Q2', outputTax: 67_400, inputTax: 18_900,netPayable: 48_500, exceptions: 4, status: 'EXCEPTION', dueDate: daysFromNow(20) },
    { entityId: E.flexUK.id,   regime: 'UK_VAT',       period: '2026Q2', outputTax: 18_400, inputTax: 6_900, netPayable: 11_500, exceptions: 0, status: 'COLLECTING',dueDate: daysFromNow(35) },
    { entityId: E.metaloom.id, regime: 'AE_VAT',       period: '2026Q2', outputTax: 12_000, inputTax: 4_400, netPayable: 7_600,  exceptions: 0, status: 'COLLECTING',dueDate: daysFromNow(40) },
    { entityId: E.flex.id,     regime: 'EU_OSS',       period: '2026Q1', outputTax: 9_800,  inputTax: 0,     netPayable: 9_800,  exceptions: 1, status: 'FILING',    dueDate: daysFromNow(12) },
  ]});

  // ─── Radar Alerts (12, full spectrum) ──────────────────────────────────
  const radarSpecs: Array<{
    entity: keyof typeof E;
    title: string; desc: string; module: string;
    history: number; benchmark: number; reg: number;
    remedy: string;
  }> = [
    // CRITICAL
    { entity: 'laobao', title: 'IRAS 补税通知 14 天到期',
      desc: '客户 Lao Bao Trading 收到 IRAS 补税通知,逾期未回复将面临 5% 罚款及每月利息',
      module: 'TaxShield', history: 25, benchmark: 35, reg: 30,
      remedy: '调出 2024 财年明细 → 准备听证材料 → 通过 GovHub 在 7 天内提交补正申报' },
    { entity: 'laobao', title: '应收账款 35 天逾期,坏账风险',
      desc: 'Tan & Sons Wholesale 18,200 SGD 已逾期 35 天,客户信用评分降至 30',
      module: 'CashLoop', history: 30, benchmark: 40, reg: 50,
      remedy: '触发 T+30 升级流程:律师函 + 启用票据贴现回收资金' },
    { entity: 'flexUK', title: 'CT600 已逾期提交,HMRC 罚款累计中',
      desc: 'UK CT600 申报已逾期 5 天,HMRC 起步罚款 £100,90 天后追加 5% 应缴税款',
      module: 'TaxShield', history: 35, benchmark: 30, reg: 25,
      remedy: '立即由本地税务网络专家加急提交,7 天内可申请 reasonable excuse' },
    // ALERT
    { entity: 'flex', title: 'GST 申报仅剩 15 天,4 笔交易异常',
      desc: 'FlexPilot SG 2026Q2 GST 检测到 4 笔跨境数字服务交易税率异常',
      module: 'TaxNet', history: 55, benchmark: 50, reg: 45,
      remedy: '使用 TaxNet 异常处理向导,逐笔确认是否适用 OSS 规则' },
    { entity: 'flex', title: '现金流警告:30 天内净流出 142K',
      desc: 'AR 老化加重叠加 ESOP 行权税款支出,30 天净流出预计 142,000 SGD',
      module: 'CashLoop', history: 50, benchmark: 55, reg: 60,
      remedy: '启用票据贴现 + 加速 NorthStar Capital 95K 应收回款' },
    // WATCH
    { entity: 'cookie',   title: 'GST 申报 90 天到期,准备数据',
      desc: 'Cookie Island Pte Ltd 2026Q3 GST 申报截止日 90 天后到期',
      module: 'TaxNet', history: 78, benchmark: 70, reg: 75,
      remedy: '提前 30 天由 NovaCopilot 自动拉取 Xero 数据并预填' },
    { entity: 'cookie',   title: 'AGM 60 天到期,需召开股东会',
      desc: '2026 年度股东大会必须在财年结束 6 个月内召开',
      module: 'GovHub', history: 80, benchmark: 65, reg: 60,
      remedy: 'GovHub 一键生成议程 + 通过 DocuSeal 完成 e-签' },
    { entity: 'cookieUS', title: 'Delaware Annual Franchise Tax 提醒',
      desc: 'Cookie Island US LLC 年度特许经营税申报截止 60 天',
      module: 'TaxShield', history: 75, benchmark: 70, reg: 75,
      remedy: '走 Delaware Cheap Method,预计应付 USD 175' },
    { entity: 'abc',      title: 'AR 老化加重,客户健康度降至 65',
      desc: 'Pearl Hotel Group 32,500 SGD 逾期 20 天,该客户已连续 3 季拖延',
      module: 'CashLoop', history: 65, benchmark: 60, reg: 70,
      remedy: '建议触发坏账拨备 30% 并停止新订单授信' },
    // HEALTHY (still tracked)
    { entity: 'flexHK',   title: 'HK Profits Tax 时间轴正常',
      desc: 'FlexPilot HK Ltd 利得税轨迹正常,无需干预',
      module: 'TaxShield', history: 92, benchmark: 88, reg: 85,
      remedy: '无需操作,继续保持' },
    { entity: 'metaloom', title: 'DAO 治理记录上链同步',
      desc: 'MetaLoom DAO 所有治理决议已同步至 NovaChain',
      module: 'GovHub', history: 95, benchmark: 90, reg: 88,
      remedy: '— 表彰客户' },
    { entity: 'cookie',   title: '客户合规模型表现优异(TOP 5%)',
      desc: 'Cookie Island Pte Ltd 在 SG 跨境电商行业基准中 HCS 排名 TOP 5%',
      module: 'Insight', history: 90, benchmark: 95, reg: 80,
      remedy: '推荐参与年度合规标杆案例评选' },
  ];

  for (const s of radarSpecs) {
    const r = radarScore({ scoreHistory: s.history, scoreBenchmark: s.benchmark, scoreReg: s.reg });
    await prisma.radarAlert.create({ data: {
      entityId: E[s.entity].id,
      title: s.title, description: s.desc,
      level: r.level,
      scoreHistory: s.history, scoreBenchmark: s.benchmark, scoreReg: s.reg, composite: r.composite,
      daysAhead: r.daysAhead, remedy: s.remedy,
      status: r.level === 'HEALTHY' ? 'CLOSED' : 'OPEN',
      sourceModule: s.module,
    }});
  }

  // ─── Badges + UserBadges ───────────────────────────────────────────────
  for (const b of BADGE_CATALOG) {
    await prisma.badge.create({ data: { ...b } });
  }
  const allBadges = await prisma.badge.findMany();
  const grant = async (userId: string, codes: string[]) => {
    for (const c of codes) {
      const b = allBadges.find((x) => x.code === c);
      if (b) await prisma.userBadge.create({ data: { userId, badgeId: b.id }});
    }
  };
  await grant(proPartner.id,    ['ON_TIME_100','ACCURATE_100','GLOBAL_5','STREAK_30','DIAMOND','RADAR_TAMER']);
  await grant(proIndie.id,      ['ON_TIME_100','SPEED_DEMON']);
  await grant(smeEcom.id,       ['CASH_HERO','SPEED_DEMON','TOKEN_HOLDER']);
  await grant(smeWeb3.id,       ['WEB3_PIONEER','GLOBAL_5','STREAK_30','TOKEN_HOLDER']);
  await grant(smeSaas.id,       ['ESOP_MASTER','GLOBAL_5']);
  await grant(smeTraditional.id,['ON_TIME_100']);

  // ─── Token ledger ──────────────────────────────────────────────────────
  for (const u of [proPartner, proIndie, smeEcom, smeWeb3, smeSaas, smeTraditional]) {
    await prisma.tokenLedgerEntry.createMany({ data: [
      { userId: u.id, delta: 100,  reason: '首次完成 Onboarding' },
      { userId: u.id, delta: 50,   reason: '关闭 1 个 Radar 预警' },
      { userId: u.id, delta: 200,  reason: '季度赛季任务 · 5 国合规' },
    ]});
  }

  // ─── Market apps ───────────────────────────────────────────────────────
  await prisma.marketApp.createMany({ data: [
    { slug: 'auditflow',    name: 'AuditFlow',     category: 'AUDIT',            developer: 'Big4 Labs',           shortDesc: 'AI 驱动的审计工作底稿',                  longDesc: '为四大及独立审计师量身定制,自动生成审计底稿、抽样、风险评估。', iconEmoji: '🔍', rating: 4.8, installs: 1_240, monthlyPrice: 199 },
    { slug: 'tp-ai',        name: 'TP.AI',         category: 'TRANSFER_PRICING', developer: 'CrossBorder Tax Co',  shortDesc: '转让定价 BEPS Pillar 2 自动化',          longDesc: '基于 OECD 指南,自动生成 master file / local file。', iconEmoji: '💱', rating: 4.6, installs: 380, monthlyPrice: 499 },
    { slug: 'greenledger',  name: 'GreenLedger',   category: 'ESG',              developer: 'EcoMetrics Pte Ltd',  shortDesc: 'ESG 报告 + GHG 排放追踪',                longDesc: '上市公司服务商必备,GRI/SASB/TCFD 标准全覆盖。', iconEmoji: '🌱', rating: 4.5, installs: 690, monthlyPrice: 299 },
    { slug: 'cryptotax',    name: 'CryptoTax',     category: 'CRYPTO_TAX',       developer: 'Web3Compliance',      shortDesc: '加密资产税务 + DeFi 收益归类',           longDesc: '500+ DeFi 协议交易解析,自动生成可申报报表。', iconEmoji: '🪙', rating: 4.7, installs: 1_580, monthlyPrice: 99 },
    { slug: 'dunner-ai',    name: 'DunnerAI',      category: 'AR_COLLECT',       developer: 'CollectBot Inc',      shortDesc: '多语种 AI 催收(中/英/马/泰/印)',         longDesc: '基于客户人格自适应催收语调,平均回款提速 40%。', iconEmoji: '📞', rating: 4.4, installs: 920, monthlyPrice: 79 },
    { slug: 'esop-hub',     name: 'ESOP Hub',      category: 'OTHER',            developer: 'EquityWorks',         shortDesc: '期权全生命周期管理 + 行权税自动计算',     longDesc: '集成 PayFlow 期权状态机,支持 5 国行权税。', iconEmoji: '📈', rating: 4.7, installs: 540, monthlyPrice: 149 },
    { slug: 'kyb-pro',      name: 'KYB Pro',       category: 'OTHER',            developer: 'IdentityVault',       shortDesc: '深度 KYB:UBO/制裁名单/PEP 筛查',         longDesc: '对接 Onfido + Sumsub,实时给 NovaPassport 提供受益人核查。', iconEmoji: '🪪', rating: 4.6, installs: 410, monthlyPrice: 0 },
    { slug: 'sandbox-sim',  name: 'Sandbox Simulator', category: 'OTHER',        developer: 'SiNova Labs',         shortDesc: '在沙箱环境模拟跨国架构税负',              longDesc: '免费工具,试算 SG → HK → AE 多国架构税负差异。', iconEmoji: '🧪', rating: 4.9, installs: 3_200, monthlyPrice: 0 },
  ]});

  // ─── Insight reports ───────────────────────────────────────────────────
  await prisma.insightReport.createMany({ data: [
    { slug: 'sg-saas-comp-2026', title: '《新加坡 SaaS 行业薪资基准 · 2026》',
      region: 'SG', pricesgd: 5_000, cadence: 'YEARLY', audience: 'VC',
      summary: '覆盖 380 家 SG SaaS 公司,从工程师到 C-level 的薪酬中位数,含 ESOP 折现估值。' },
    { slug: 'sea-sme-dso-2026q2', title: '《东南亚 SME 应付账期报告 · 2026 Q2》',
      region: 'SEA', pricesgd: 15_000, cadence: 'QUARTERLY', audience: 'IB',
      summary: 'SEA 6 国 5,200 家 SME 应收账期(DSO)趋势,识别坏账高发行业。' },
    { slug: 'apac-cross-border-2026', title: '《亚太跨境合规成本指数 · 2026》',
      region: 'APAC', pricesgd: 50_000, cadence: 'YEARLY', audience: 'GOV',
      summary: '5 国合规成本量化指数 + 监管演变热力图,跨国咨询与政府智库必备。' },
  ]});

  // ─── Vault docs (with NovaChain anchoring) ─────────────────────────────
  for (const e of allEntities) {
    const docs = [
      { name: `${e.legalName}_章程.pdf`, category: 'GOV' },
      { name: `${e.legalName}_2025年税务申报.pdf`, category: 'TAX' },
      { name: `${e.legalName}_工资单_2026-05.pdf`, category: 'PAYROLL' },
    ];
    for (const d of docs) {
      const a = anchor(d.name, e.id);
      await prisma.vaultDoc.create({ data: {
        entityId: e.id, name: d.name, category: d.category, sizeKb: 240,
        chainHash: a.hash, chainTxId: a.txId,
      }});
    }
  }

  // ─── Arena events ──────────────────────────────────────────────────────
  await prisma.arenaEvent.createMany({ data: [
    { entityId: E.cookie.id,   kind: 'FILING_ON_TIME', hcsDelta: +2, tokenDelta: 50, message: 'GST 2026Q1 准时提交' },
    { entityId: E.flex.id,     kind: 'RADAR_RESOLVED', hcsDelta: +3, tokenDelta: 30, message: '关闭现金流警告' },
    { entityId: E.metaloom.id, kind: 'BADGE_EARNED',   hcsDelta: 0,  tokenDelta: 100, message: '获得 Web3 先锋徽章' },
    { entityId: E.laobao.id,   kind: 'FILING_LATE',    hcsDelta: -8, tokenDelta: 0,  message: 'IRAS 补税通知逾期' },
    { entityId: E.flexUK.id,   kind: 'FILING_LATE',    hcsDelta: -5, tokenDelta: 0,  message: 'CT600 提交逾期 5 天' },
  ]});

  console.log(`✅ Seeded:
  · Users: 7 (1 admin / 2 Pro / 4 SME)
  · Entities: ${allEntities.length} across SG/HK/US/UK/AE
  · Tax filings: 7   · Payrolls: 6   · ESOPs: 4
  · Invoices: 8 (4 overdue) · Bills: 8
  · Gov actions: 7   · VAT returns: 7
  · Radar alerts: ${radarSpecs.length}
  · Badges: ${BADGE_CATALOG.length}
  · Market apps: 8   · Insight reports: 3
  · Vault docs (chain-anchored): ${allEntities.length * 3}

🔑 Demo logins (password: demo1234):
  · admin@sinova.io          (Admin)
  · partner@cpa-firm.sg       (Pro · 会计所合伙人)
  · indie@cpa.sg              (Pro · 独立 CPA)
  · ceo@cookie-island.com     (SME · 跨境电商 · Maya)
  · founder@meta-loom.io      (SME · Web3 · Dr. Chen)
  · cto@flexpilot.ai          (SME · SaaS · Maya)
  · boss@laobao-trading.sg    (SME · 传统中小 · Alex)
`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
