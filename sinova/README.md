# 📡 SiNova · 司诺 — Next-Gen Global Compliance AI Platform (v0.1 Demo)

**作战级原型 (MVP-0) · 2026-05-20**

> *从税务计算器升级为税务筹划顾问,从被动合规升级为主动预警 — 不与 Copi 拼软件,而是建造合规界的航空母舰。*

This is a **fully working v0.1 demo** of the SiNova platform — every model from the strategy doc is wired up: 10 modules × 4 foundations × 2 portals × 5 jurisdictions, on top of a seeded SQLite database.

---

## 🚀 Quick Start (60 seconds)

```bash
cd sinova
npm install                # ~60s
npm run db:push            # creates dev.db
npm run db:seed            # 7 users, 8 entities, 12 radar alerts, etc.
npm run build              # production build
npm run start              # http://localhost:3000
```

Or in dev mode:

```bash
npm run dev                # hot-reload at http://localhost:3000
```

### Demo logins (password: `demo1234`)

| Email                       | Portal | Type                 | Persona  | Highlights                                  |
| --------------------------- | ------ | -------------------- | -------- | ------------------------------------------- |
| `admin@sinova.io`           | ADMIN  | —                    | —        | Sees everything                             |
| `partner@cpa-firm.sg`       | Pro    | CPA 合伙人            | —        | 3 客户主体 · 12 Radar 预警                  |
| `indie@cpa.sg`              | Pro    | 独立 CPA              | —        | 2 客户主体                                  |
| `ceo@cookie-island.com`     | SME    | 跨境电商             | Maya     | 跨境电商演示                                 |
| `founder@meta-loom.io`      | SME    | Web3                 | Dr. Chen | DAO 实体 + 加密税                           |
| `cto@flexpilot.ai`          | SME    | SaaS                 | Maya     | ESOP 期权 + 多国发薪                        |
| `boss@laobao-trading.sg`    | SME    | 传统中小             | Alex     | AI Partner Lite 永久免费                    |

---

## 🧱 What's Inside

### 10 Modules (5 Mirror + 5 Killer)

| Slug         | CN              | Layer   | Killer | Demo Highlights                                       |
| ------------ | --------------- | ------- | :----: | ----------------------------------------------------- |
| `taxshield`  | 司诺 · 税盾     | MIRROR  |        | 多国税法引擎 + AI 节税建议                            |
| `payflow`    | 司诺 · 薪流     | MIRROR  |        | 薪酬日历 + ESOP timeline                              |
| `cashloop`   | 司诺 · 收付通   | MIRROR  |   ✓    | **AR + AP 双闭环**(Copi 最大缺口)· 票据贴现 · 多语种催收 |
| `govhub`     | 司诺 · 司治     | MIRROR  |        | 跨 5 国主体架构图 + 状态机进度条                      |
| `taxnet`     | 司诺 · 税络     | MIRROR  |        | 全球间接税地图 (9 个税制)                             |
| `radar`      | 司诺 · 雷达     | KILLER  |   ✓    | **3 维实时评分** + 警报关闭 → Token 奖励循环         |
| `partner`    | 司诺 · 合伙人   | KILLER  |   ✓    | **3 套人格** Alex / Maya / Dr.Chen 切换 + 实时对话   |
| `market`     | 司诺 · 集市     | KILLER  |   ✓    | App Store · 70/30 分润 · 8 个种子 App                 |
| `arena`      | 司诺 · 战场     | KILLER  |   ✓    | HCS 仪表盘 + 12 徽章 + 排行榜 + 战场动态              |
| `insight`    | 司诺 · 智库     | KILLER  |   ✓    | k-匿名 + 差分隐私 ε 实时演算 + 报告集市               |

### 4 Foundations

- **NovaVault** — 加密文件保险柜,SHA-256 + NovaChain 上链存证
- **NovaPassport** — 跨境身份与 KYB(SG / HK / US / UK / AE)
- **NovaCopilot** — Multi-Agent 编排(8 个 Agent + 7 路由规则 + 可选 LLM 优化)
- **NovaChain** — 哈希存证 + 合成 Polygon-style TX ID

### Dual Portals

- **Pro Dashboard**(深色专业风)— 客户中枢 / 任务台 / 10 模块 / Vault / 设置
- **SME Smart Hub**(亮色友好风)— "👋 早安, 王老板!你的 ABC Pte Ltd 健康度 87 ✨" + AI 合伙人优先

---

## 🧮 Algorithms Implemented (per strategy doc)

### Radar 三维评分 (§2.2.6)

```
composite = history × 0.4 + benchmark × 0.3 + regulatory × 0.3
80-100 → HEALTHY  · 60-79 → WATCH  · 40-59 → ALERT  · 0-39 → CRITICAL
```

Live demo: drag the 3 sliders in `Radar` module to see the wheel + level + recommended actions update.

### HCS 健康度评分 (§2.2.9)

```
HCS = punctuality × 40% + finance × 30% + governance × 20% + improvement × 10%
```

### k-匿名 + 差分隐私 (Insight)

```
k ≥ 10            (groups smaller than k are dropped)
Laplace noise     (ε = 1.0 default, scale = 30/ε)
```

### Token Reward Loop

Closing a Radar alert calls `POST /api/radar/{id}/close` → awards **+200 / +100 / +50 / +10 $NOVA** (by severity) and bumps HCS by +3.

---

## 🛠 Tech Stack

| Layer    | Stack                                                                       |
| -------- | --------------------------------------------------------------------------- |
| Runtime  | **Next.js 14** (App Router) · **TypeScript** · **Tailwind 3.4**             |
| Data     | **Prisma 5.22** + **SQLite** (`prisma/dev.db`) · 19 models                  |
| Auth     | **JWT** (`jose`, Edge-safe) + **bcryptjs** + HTTP-only cookies              |
| Multi-AI | **LangGraph + CrewAI** inspired router · 8 agents · optional OpenAI polish |
| Charts   | recharts (foundation imported)                                              |
| Icons    | lucide-react                                                                |

### Open-source integration plan (per doc §4)

- **ERPNext** — multi-jurisdiction core (currency / tax / asset)
- **Odoo** — accounting ledger + invoice
- **Invoice Ninja / Lago** — billing
- **OpenAttestation + Hyperledger Fabric** — chain anchoring (mocked in demo)
- **OPA (Open Policy Agent)** — compliance rules engine (DSL stubbed)
- **DocuSeal** — e-signature
- **LangGraph / CrewAI** — agent orchestration

---

## 📂 Project Layout

```
sinova/
├── prisma/
│   ├── schema.prisma       # 19 models (User, Entity, 10 modules, 4 foundations)
│   ├── seed.ts             # 7 users × 8 entities × 12 alerts × 12 badges × 8 apps
│   └── dev.db              # generated
├── src/
│   ├── lib/
│   │   ├── enums.ts        # MODULES / PERSONAS / JURISDICTION_META / RADAR_LEVEL_META
│   │   ├── radar.ts        # 3-dimension composite scoring
│   │   ├── arena.ts        # HCS + 12 badges
│   │   ├── token.ts        # $NOVA ledger
│   │   ├── novachain.ts    # SHA-256 + synthetic TX
│   │   ├── anonymize.ts    # k-anonymity + Laplace
│   │   ├── auth.ts         # JWT (jose) + bcrypt
│   │   └── copilot/        # agents.ts (8) · router.ts (7 rules) · llm.ts
│   ├── app/
│   │   ├── page.tsx        # Landing (vs Copi 8-dim · 10 modules · 4 foundations · 6 moats · OSS)
│   │   ├── login/          # 7 demo accounts
│   │   ├── register/       # 3-step wizard with persona pick
│   │   ├── pro/            # PRO portal: home · clients · tasks · vault · settings · modules/[slug]
│   │   ├── sme/            # SME portal: smart hub · settings · modules/[slug]
│   │   └── api/            # auth · copilot · radar · me · modules
│   ├── components/
│   │   ├── portal/         # ProShell · SmeShell · CopilotDock
│   │   └── modules/
│   │       ├── ModuleRenderer.tsx
│   │       └── views/      # 10 view components (one per module)
│   └── middleware.ts       # JWT gate for /pro /sme /admin
├── tailwind.config.js      # nova / gold / ink / risk palettes + radar-sweep keyframe
└── README.md
```

---

## 🔌 API Surface

| Method | Endpoint                          | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| POST   | `/api/auth/login`                 | email + password → JWT cookie                |
| POST   | `/api/auth/register`              | new user (+ optional Entity for SME)         |
| POST   | `/api/auth/logout`                | clear cookie                                 |
| GET    | `/api/auth/me`                    | current user                                 |
| POST   | `/api/copilot/chat`               | router → agents → persona polish             |
| POST   | `/api/radar/score`                | live 3-dimension recompute                   |
| GET    | `/api/radar/alerts`               | portal-filtered alert list                   |
| POST   | `/api/radar/{id}/close`           | close alert + award $NOVA + bump HCS         |
| GET    | `/api/me/tokens`                  | balance + ledger                             |
| GET    | `/api/me/entities`                | entities with module counts                  |
| GET    | `/api/modules/{slug}`             | per-module data slice (10 modules)           |

---

## 🎬 Suggested Demo Walkthrough (5 min)

1. **Landing** (`/`) — 战略页:8 维 vs Copi 表 · 10 模块 · 6 大护城河
2. **Login** as `partner@cpa-firm.sg` → Pro Dashboard
   - 看 Radar 早安预警 + 今日待办 + 实时 Agent 流
   - 进入 `Radar` 模块 → 拖动 3 个滑杆 → 点击实时评分
   - **关闭一个 CRITICAL 警报 → 拿到 +200 $NOVA**
3. 进入 `Partner` → 切换 Dr. Chen → 点击"我的 SG 公司今年要交多少税?" → 看 OECD 学术派语气回复
4. 进入 `Market` → 看 8 款 App + 70/30 分润策略
5. 进入 `Arena` → HCS 仪表盘 + 徽章库 + 排行榜
6. 进入 `Insight` → 拖动 ε 滑杆 → 看 Laplace 噪声实时变化
7. 退出登录 → Login as `ceo@cookie-island.com` → SME Smart Hub
   - 看亮色友好的 "早安, Maya 👋" + 单一公司视角
   - 同样 10 模块,但视角是企业主而非服务商

---

## ✅ Build Status

- `npx tsc --noEmit` — **clean**
- `npm run build` — **22 routes compiled**
- `npm run db:seed` — **7 users · 8 entities · 12 alerts · 12 badges · 8 apps · 3 reports · 24 vault docs**
- Smoke test: login → /api/auth/me → /api/modules/radar → /api/copilot/chat — **all green**

---

## ⚠️ Demo-Scope Caveats

- SQLite (no enums) — schema uses `String` fields with allowed-value comments. **Postgres-ready** when production.
- NovaChain anchoring is **mocked** (SHA-256 + synthetic Polygon TX ID). Real Hyperledger Fabric integration is in roadmap §4.
- LLM polish is **optional** — set `OPENAI_API_KEY` in `.env` to enable Maya/Alex/Dr.Chen tone polishing; otherwise local persona `voice()` wrapper is used.
- Open-source integrations (ERPNext / Odoo / OPA / Hyperledger) are **architectural stubs**; the demo runs purely on the SiNova schema. Each integration is documented in `lib/copilot/agents.ts` comments.

---

## 📚 Strategy Doc Reference

This implementation maps directly to the v1.0 battle-grade product blueprint (《司诺 SiNova · 下一代全球合规 AI 平台产品规划书》). Section mappings:

- §2.2.6 Radar 算法 → `src/lib/radar.ts`
- §2.2.9 HCS / Arena → `src/lib/arena.ts`
- §2.3 双门户 → `src/components/portal/{ProShell,SmeShell}.tsx`
- §2.4 NovaCopilot → `src/lib/copilot/`
- §3.1 数据模型 → `prisma/schema.prisma`
- §4 OSS 集成 → README + agents.ts comments

---

> Built with ⚡ in one session. — *司诺,拒绝平庸的合规未来。*
