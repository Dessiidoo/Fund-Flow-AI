# Fund-Flow-AI

> An AI-powered fundraising intelligence platform that helps startups discover angel investors, build outreach campaigns, and manage their entire funding pipeline from a single dashboard.

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Language](https://img.shields.io/badge/language-TypeScript-3178c6) ![Stack](https://img.shields.io/badge/stack-React%20%2B%20shadcn%2Fui-black) ![Stage](https://img.shields.io/badge/stage-MVP-orange)

---

## Overview

Raising a funding round is one of the hardest, most time-consuming challenges a founder faces. Most startups waste weeks manually researching investors, cold-emailing into the void, and tracking outreach in spreadsheets that fall apart immediately.

**Fund-Flow-AI changes that.**

This is a full-stack TypeScript/React web application that gives founders an intelligent dashboard to:

- **Discover** angel investors from a curated, bundled investor database
- **Match** their startup to the right investors using an AI-powered compatibility layer
- **Create and manage** outreach campaigns with structured workflows
- **Track** their entire funding pipeline in one place

Built on a modern React + TypeScript stack with the complete **shadcn/ui** component library already integrated, Fund-Flow-AI is an MVP-stage SaaS product with real bones. The hard front-end scaffolding is done. The angel investor database is included. The campaign creation workflow is built. What you have here is a working platform — not a prototype, not a wireframe.

This project is ideal for:
- **Founders** who want a private tool to manage their own fundraise
- **Developers** looking to acquire a head start on a SaaS fundraising product
- **Accelerators and incubators** who want to white-label a fundraising intelligence tool for their cohorts
- **Startup ecosystem builders** who want to embed investor-matching into an existing platform

---

## Key Features

- **Angel Investor Database** — A curated CSV dataset of angel investors is bundled directly into the application, giving you real data out of the box with no third-party API dependency to get started
- **AI Investor Matching** — An intelligent matching layer analyzes your startup's profile and surfaces the most relevant investors from the database based on sector fit, stage, and other compatibility signals
- **Campaign Creation Workflow** — A structured, multi-step dialog flow (`CreateCampaignDialog`) lets founders build outreach campaigns with defined goals, targets, and timelines
- **Fundraising Dashboard** — A stats-driven overview (`StatCard` components) gives founders a real-time snapshot of their pipeline: investors contacted, responses received, meetings booked
- **Authentication Layer** — Auth hooks (`use-auth.ts`) are scaffolded and ready to be wired to your identity provider of choice (Supabase, Clerk, Auth0, etc.)
- **Campaign State Management** — Dedicated campaign hooks (`use-campaigns.ts`) manage campaign lifecycle state across the application
- **Full shadcn/ui Component Library** — Every major UI primitive is already installed and configured: dialogs, forms, tables, badges, carousels, charts, sidebars, toasts, and more — no component debt
- **Responsive Layout** — A polished app shell (`Layout.tsx`) wraps the full application with navigation and sidebar structure already in place
- **Replit-Ready** — Configured to run instantly on Replit with no local environment setup required for evaluation

---

## How It Works

```
Founder Profile → AI Matching Layer → Investor Database → Ranked Results
                                                              ↓
                                              Campaign Creation Workflow
                                                              ↓
                                              Outreach Tracking Dashboard
```

1. **Investor Database Layer** — The bundled `Fund_Database-Angel_Investors.csv` (located in `attached_assets/`) serves as the core data source. It contains structured angel investor records that the application reads, filters, and ranks.

2. **AI Matching Layer** — The application applies AI-driven logic to score and rank investors against a founder's startup profile. This layer is designed to be extended with any LLM API (OpenAI, Anthropic, Gemini) to generate compatibility scores, personalized outreach drafts, and investor insights.

3. **Campaign Management** — Once investors are identified, founders use the campaign creation workflow to organize outreach into discrete campaigns with trackable states (draft → active → closed).

4. **Dashboard Reporting** — The stats dashboard aggregates pipeline data into actionable metrics so founders always know where their fundraise stands.

**Tech Stack:**
- **Frontend:** React 18, TypeScript
- **UI Components:** shadcn/ui (Radix UI primitives + Tailwind CSS)
- **State/Hooks:** Custom React hooks for auth and campaign management
- **Data:** CSV-based angel investor database (extensible to PostgreSQL, Supabase, or any database)
- **Runtime:** Node.js, Vite
- **Deployment:** Replit (primary), adaptable to Vercel, Railway, or any Node host

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Dessiidoo/Fund-Flow-AI.git
cd Fund-Flow-AI

# Install dependencies
cd client
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` by default.

### Environment Variables

Create a `.env` file in the `client/` directory and configure the following as needed:

```env
# AI Provider (extend the matching layer with your preferred LLM)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Authentication Provider (wire to Supabase, Clerk, or Auth0)
VITE_AUTH_PROVIDER_URL=your_auth_provider_url
VITE_AUTH_CLIENT_ID=your_auth_client_id

# Database (optional — defaults to bundled CSV)
VITE_DATABASE_URL=your_database_url
```

### Running on Replit

This project is pre-configured for Replit via `.replit`. Simply fork the Repl and hit **Run** — no additional configuration required for evaluation.

---

## Usage

### Exploring the Investor Database
1. Launch the application
2. Navigate to the **Investors** section from the sidebar
3. Browse, search, and filter the bundled angel investor database
4. Use the AI matching feature to rank investors by fit with your startup profile

### Creating a Campaign
1. From the dashboard, click **Create Campaign**
2. The `CreateCampaignDialog` walks you through naming your campaign, selecting target investors, and setting outreach goals
3. Save the campaign — it will appear in your pipeline dashboard

### Tracking Your Pipeline
- The main dashboard (`StatCard` components) displays live metrics: investors targeted, outreach sent, responses, and meetings scheduled
- Update campaign and investor statuses as your fundraise progresses

---

## Why This Exists

The venture fundraising process is opaque, relationship-driven, and deeply inefficient for first-time founders who lack warm introductions. Existing tools are either:
- **Too expensive** (Visible.vc, Affinity CRM) for pre-seed startups
- **Too generic** (Notion templates, Airtable bases) with no intelligence layer
- **Too fragmented** — investor databases live in one tool, CRM in another, email in a third

Fund-Flow-AI consolidates discovery, matching, and pipeline management into a single intelligent interface. By bundling a real investor database and scaffolding the AI matching layer, it dramatically lowers the barrier to entry for founders who need to move fast and can't afford enterprise fundraising software.

The platform is also a natural white-label candidate for accelerators, angel networks, and venture studios that want to offer fundraising infrastructure to their portfolio companies without building from scratch.

---

## Project Structure

```
Fund-Flow-AI/
├── attached_assets/
│   ├── Fund_Database-Angel_Investors.csv   # Bundled angel investor database
│   └── Screenshot_*.png                    # UI screenshots
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                         # Full shadcn/ui component library (40+ components)
│   │   │   ├── CreateCampaignDialog.tsx    # Campaign creation workflow
│   │   │   ├── Layout.tsx                  # App shell with navigation
│   │   │   └── StatCard.tsx                # Dashboard metric cards
│   │   ├── hooks/
│   │   │   ├── use-auth.ts                 # Authentication state hook
│   │   │   └── use-campaigns.ts            # Campaign lifecycle state hook
│   │   └── App.tsx                         # Root application component
│   ├── public/
│   └── index.html
├── .replit                                 # Replit configuration
└── .gitignore
```

---

## Acquisition & Licensing

This codebase is available for acquisition. Buyers receive:
- Full source code with no obfuscation
- Bundled angel investor database (CSV)
- Complete shadcn/ui component library integration
- Auth and campaign management hooks ready to wire up
- Rights to white-label, extend, and commercialize

Interested buyers should open an issue or contact the repository owner directly.

---

## License

MIT License — see `LICENSE` for details.
