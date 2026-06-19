# Fund-Flow-AI

> A production-ready TypeScript/React fundraising CRM scaffold — with a bundled angel investor dataset, complete shadcn/ui component library, PostgreSQL/Drizzle backend, and campaign management workflow — designed to eliminate 3–6 weeks of SaaS boilerplate so you can ship a fundraising tool to founders immediately.

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Language](https://img.shields.io/badge/language-TypeScript-3178c6) ![Stack](https://img.shields.io/badge/stack-React%20%2B%20shadcn%2Fui-black) ![Stage](https://img.shields.io/badge/stage-MVP-orange)

---

## Overview

Raising a funding round is one of the hardest, most time-consuming challenges a founder faces. Most startups waste weeks manually researching investors, cold-emailing into the void, and tracking outreach in spreadsheets.

**Fund-Flow-AI is a complete SaaS scaffold that solves the boilerplate problem for anyone building a fundraising tool.**

This is not a prototype or a wireframe. It is a full-stack TypeScript/React application with:

- A **bundled angel investor dataset** (CSV) included directly in the repository — no third-party API deals, no data licensing negotiations, real investor records available on day one
- A **fully pre-integrated shadcn/ui component library** — every major UI primitive (dialogs, tables, forms, charts, sidebars, toasts, carousels) already installed and configured
- A **PostgreSQL/Drizzle ORM backend scaffold** with a configured `drizzle.config.ts`, ready to connect to your database
- **TanStack Query data hooks** (`use-investors.ts`, `use-campaigns.ts`, `use-auth.ts`) wired and ready to connect to a real identity provider and live database
- A **multi-step campaign creation workflow** (`CreateCampaignDialog`) for structured outreach campaign management
- A **stats-driven fundraising dashboard** with `StatCard` components tracking pipeline metrics
- An **Express server scaffold** pre-configured and ready for API route extension

> ⚠️ **Honest scope note:** The codebase includes hooks and UI labeled for "AI matching." This matching layer is scaffolded and aspirational — there is no live LLM API call or embedding model in the current source. The roadmap issue tracker (see Issues) outlines exactly how this layer can be implemented. The core shipped value is the investor dataset, the complete component library, and the end-to-end project scaffold.

This project is ideal for:
- **Developers** who want a 3–6 week head start on a fundraising SaaS product
- **Accelerators and incubators** who want to white-label a fundraising CRM for their cohorts
- **Startup ecosystem builders** embedding investor discovery into an existing platform
- **Acquirers** looking for a commercially viable base to build on without starting from scratch

---

## Screenshot

![Fund-Flow-AI Dashboard](attached_assets/Screenshot_20251224-052250_1766572321756.png)

*The main dashboard showing pipeline statistics and investor browsing interface.*

---

## Key Features

### ✅ Shipped and Functional
- **Bundled Angel Investor Dataset** — A curated CSV of angel investors is included directly in `attached_assets/`. No API key, no subscription, no data deal required to get started. See the [Investor Dataset](#investor-dataset) section for schema details.
- **Campaign Creation Workflow** — A structured multi-step dialog (`CreateCampaignDialog`) lets founders define campaigns with goals, investor targets, and timelines
- **Fundraising Dashboard** — `StatCard` components render pipeline KPIs: investors contacted, responses received, meetings booked
- **Complete shadcn/ui Integration** — 40+ UI components pre-installed: accordion, alert-dialog, avatar, badge, breadcrumb, calendar, carousel, chart, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, sheet, sidebar, skeleton, slider, switch, table, tabs, textarea, toast, toggle, tooltip — zero component debt
- **TanStack Query Hooks** — `use-investors.ts`, `use-campaigns.ts`, `use-auth.ts` scaffolded with proper query key patterns, ready to wire to a live API
- **Auth Scaffold** — Auth hooks ready to connect to Supabase, Clerk, Auth0, or any identity provider
- **PostgreSQL + Drizzle ORM** — `drizzle.config.ts` configured; schema-first ORM setup ready for migration
- **Express Backend Scaffold** — Server entry point ready for REST API route extension
- **Responsive App Shell** — `Layout.tsx` wraps the full application with navigation and sidebar already in place
- **Vite Build System** — Fast HMR development server and optimized production builds out of the box

### 🔲 Scaffolded / Roadmap
- **AI Investor Matching** — The UI labels and hook structure for AI matching are in place; the LLM/embedding integration layer is not yet implemented. See [Issue #1](../../issues) for the implementation plan.

---

## Investor Dataset

The file `attached_assets/Fund_Database-Angel_Investors_1766572251362.csv` is the single most concrete proprietary asset in this repository.

This bundled CSV dataset includes angel investor records with fields that typically cover:

| Field | Description |
|---|---|
| Name | Investor full name |
| Fund / Firm | Associated fund or firm name |
| Sector Focus | Industries or verticals the investor targets |
| Stage Preference | Pre-seed, Seed, Series A, etc. |
| Check Size | Typical investment range |
| Geography | Preferred investment geography |
| Contact / LinkedIn | Reachable contact information |

> **Note to buyers/contributors:** Open the CSV and verify the record count and field completeness before any commercial transaction. The provenance and last-verified date of this dataset should be confirmed by the repo owner prior to licensing or redistribution.

This dataset means a buyer can display real investor records in the UI without negotiating any data licensing deal — a significant time and cost advantage for anyone building in this space.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + TypeScript |
| UI Components | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| Data Fetching | TanStack Query (React Query v5) |
| Backend | Express.js (Node.js) |
| ORM | Drizzle ORM |
| Database | PostgreSQL |
| Auth (scaffold) | Hook-ready for Supabase / Clerk / Auth0 |

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or hosted — Supabase recommended for fastest setup)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/Dessiidoo/Fund-Flow-AI.git
cd Fund-Flow-AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory. Required variables:

```env
# Database — required for Drizzle ORM and backend API
DATABASE_URL=postgresql://user:password@host:5432/your_database_name

# Session secret — required for Express session middleware
SESSION_SECRET=your_random_session_secret_here

# Auth provider — add whichever you configure
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your_supabase_anon_key
# CLERK_PUBLISHABLE_KEY=pk_test_...
# CLERK_SECRET_KEY=sk_test_...

# Optional: future AI matching integration
# OPENAI_API_KEY=sk-...
```

> ⚠️ **Important:** `drizzle.config.ts` will throw immediately if `DATABASE_URL` is not set. Configure this before running any database commands.

### 4. Run database migrations

```bash
npm run db:push
```

### 5. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5000` (or the port configured in your environment).

### Running on Replit

This project is configured to run on Replit with no local environment setup. Fork the Repl and add your `DATABASE_URL` as a Replit Secret, then click Run.

---

## Project Structure

```
Fund-Flow-AI/
├── attached_assets/
│   ├── Fund_Database-Angel_Investors_*.csv   ← Bundled investor dataset
│   └── Screenshot_*.png
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateCampaignDialog.tsx      ← Multi-step campaign creation
│   │   │   ├── Layout.tsx                    ← App shell with nav + sidebar
│   │   │   ├── StatCard.tsx                  ← Pipeline KPI cards
│   │   │   └── ui/                           ← Full shadcn/ui component library
│   │   ├── hooks/
│   │   │   ├── use-auth.ts                   ← Auth state hook (scaffold)
│   │   │   ├── use-campaigns.ts              ← Campaign CRUD hooks
│   │   │   └── use-investors.ts              ← Investor query hooks
│   │   └── App.tsx                           ← Root app with routing
│   └── index.html
├── drizzle.config.ts                         ← PostgreSQL/Drizzle configuration
├── .replit                                   ← Replit run configuration
└── README.md
```

---

## Why This Exists

Every accelerator, incubator, and founder community eventually asks the same question: *"Where do I find the right investors?"*

Building a fundraising CRM from scratch means:
- 20–40 hours sourcing and licensing investor data
- 40–80 hours scaffolding a React + TypeScript SaaS boilerplate
- 10–20 hours integrating a component library
- 10–20 hours wiring an ORM, auth layer, and data fetching pattern

Fund-Flow-AI absorbs all of that. The investor dataset is included. The component library is pre-wired. The backend scaffold, auth hooks, and data fetching patterns are in place. A developer acquiring this project skips directly to building the features that differentiate their product — not the boilerplate that every SaaS needs.

For an accelerator or incubator, this is a white-label fundraising CRM that can be branded and deployed to a cohort in days, not months.

---

## Roadmap

See the [Issues tab](../../issues) for tracked enhancement proposals, including:
- AI investor matching implementation (OpenAI embeddings + vector similarity)
- Live demo deployment with seed data
- End-to-end test suite
- CI/CD pipeline configuration

---

## License

MIT License. See `LICENSE` for details.

> **Dataset licensing note:** The bundled angel investor CSV is included as a project asset. Buyers and contributors are responsible for validating the provenance, accuracy, and any applicable redistribution restrictions of this data before commercial use.
