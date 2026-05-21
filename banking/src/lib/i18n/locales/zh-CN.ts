/**
 * Simplified Chinese (zh-CN) translation dictionary.
 * Keys must match those in en.ts.
 */
const zhCN: Record<string, string> = {
	// 品牌
	'app.brand': 'ERPNext 银行与合规一体化平台',
	'app.tagline': '强大、开源的 ERP 系统 —— 现已支持多国合规',

	// 导航
	'nav.dashboard': '主控台',
	'nav.bank_reconciliation': '银行对账',
	'nav.statement_importer': '流水导入',
	'nav.compliance': '合规中心',
	'nav.indonesia_tax': '印尼税务',
	'nav.payroll': '薪酬管理',
	'nav.language': '语言',

	// Hero / Dashboard
	'dashboard.welcome': '欢迎使用',
	'dashboard.subtitle':
		'集银行对账、多国法规合规、印尼税务申报与企业薪酬管理于一体的统一工作台。',
	'dashboard.try_demo': '进入银行对账',
	'dashboard.view_roadmap': '查看产品规划',

	// 数据指标
	'stats.countries_supported': '支持国家',
	'stats.tax_modules': '税务模块',
	'stats.payroll_components': '薪酬组件',
	'stats.languages': '界面语言',

	// 路线图
	'roadmap.title': '产品规划路线图',
	'roadmap.subtitle': '从基础设施到企业级模块的四阶段实施方案',

	'roadmap.phase0.title': '阶段 0 · 基础设施与中英双语',
	'roadmap.phase0.status': '已完成',
	'roadmap.phase0.desc': '可独立运行的开发服务器、轻量级 i18n 框架，以及完整的中英文切换能力。',
	'roadmap.phase0.f1': '修复脱离 Frappe 后端的 Vite 启动崩溃',
	'roadmap.phase0.f2': '基于 React Context 的零依赖 i18n',
	'roadmap.phase0.f3': '语言切换持久化（localStorage）',
	'roadmap.phase0.f4': '向后兼容 frappe._messages 体系',

	'roadmap.phase1.title': '阶段 1 · 多国法律法规融合',
	'roadmap.phase1.status': '规划中',
	'roadmap.phase1.desc':
		'可插拔的合规引擎，覆盖亚太主要市场的税号校验、电子发票与法定报表。',
	'roadmap.phase1.f1': '印尼 · 中国 · 新加坡 · 马来西亚 · 日本',
	'roadmap.phase1.f2': '统一的 ComplianceProfile 接口',
	'roadmap.phase1.f3': '依据公司国别自动切换合规集',
	'roadmap.phase1.f4': '各国差异化的发票校验器',

	'roadmap.phase2.title': '阶段 2 · 印尼税务报税机制',
	'roadmap.phase2.status': '规划中',
	'roadmap.phase2.desc':
		'端到端符合 DJP 规范的税务引擎：PPN、PPh 21/23/26/4(2)、e-Faktur 与 e-Bupot。',
	'roadmap.phase2.f1': 'PPN 11% / 12% 增值税与 NSFP 序号管理',
	'roadmap.phase2.f2': 'PPh 21 累进 TER 税率代扣',
	'roadmap.phase2.f3': 'NPWP 16 位新格式校验',
	'roadmap.phase2.f4': '对接 Coretax DJP 申报 API',

	'roadmap.phase3.title': '阶段 3 · 企业内部薪酬管理',
	'roadmap.phase3.status': '规划中',
	'roadmap.phase3.desc':
		'可配置的薪酬结构、BPJS 社保、自动 PPh 21 代扣，一键批量银行代发工资。',
	'roadmap.phase3.f1': '薪酬结构与工资项配置',
	'roadmap.phase3.f2': 'BPJS 健康险 + 雇佣保险',
	'roadmap.phase3.f3': '年度 1721-A1 报表',
	'roadmap.phase3.f4': '直接通过银行对账模块代发',

	// 状态徽章
	'status.done': '已完成',
	'status.planned': '规划中',
	'status.in_progress': '进行中',

	// 银行对账页
	'br.title': '银行对账',
	'br.subtitle': '将银行流水与会计凭证进行智能匹配。',
	'br.demo_notice': '当前为独立演示模式，连接 Frappe 后端后即可加载真实数据。',

	// 流水导入页
	'si.title': '银行流水导入',
	'si.subtitle': '上传 CSV / XLSX 格式的银行对账单，批量导入交易记录。',

	// 通用动作
	'action.back_to_dashboard': '返回主控台',
	'action.learn_more': '了解更多',

	// 页脚
	'footer.copyright': '© 2026 ERPNext 银行套件 · 基于 Frappe 框架构建',
};

export default zhCN;
