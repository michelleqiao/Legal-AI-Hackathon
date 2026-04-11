# StartStack

> **Building the one-stop legal operating system for startups and SMBs — from incorporation to contracts, compliance, and global expansion.**

Startups and small businesses shouldn't need a $500/hr lawyer for every legal decision they face. StartStack is an AI-powered legal platform that handles the full lifecycle of a company's legal needs — starting with the very first decision every founder has to make: how to incorporate.

---

## Company Vision

Legal infrastructure for businesses is broken. It's expensive, inaccessible, and built for big companies with in-house counsel. StartStack is building the legal OS for the other 99% — solo founders, co-founder teams, and small businesses who need real legal help without the billable hours.

We're starting with incorporation and expanding into every legal need a growing company has:
- **Incorporation** → the right structure, filed correctly, from day one
- **Compliance** → stay legal as you grow, automatically
- **Contracts** → employment, licensing, NDAs, all in one place
- **International** → expand globally with confidence

---

## Product 1 — StartStack Incorporation

**From "what do I even form?" to incorporated — in minutes.**

Existing tools (Stripe Atlas, Clerky, Doola) assume you've already decided what to form. StartStack helps you make that decision — then handles everything after.

### The Problem

- Founders don't know whether to form an LLC, C-Corp, or S-Corp
- Choosing the wrong state has long-term consequences
- Document prep is error-prone when done manually
- Post-incorporation compliance (annual reports, 83(b) elections, cap tables) is consistently neglected

### What StartStack Does

1. **Guided Wizard** — ~8–10 questions about your business, team, and funding plans
2. **AI Recommendation** — plain-English explanation of the right entity type and state
3. **AI Chat** — ask follow-up questions ("Why not an LLC?", "My co-founder is in Canada — does that change anything?")
4. **End-to-end Filing** — StartStack generates and submits your incorporation documents
5. **Compliance Dashboard** — 83(b) elections, cap table, annual reports, and more

---

### Supported Entity Types (v1)

| Entity | Best For |
|---|---|
| C-Corp (Delaware) | VC-backed startups |
| LLC | Bootstrapped, flexible businesses |
| S-Corp | Small business, US citizens only |
| B-Corp / PBC | Mission-driven startups |

---

### Business Model

| Tier | Price | What's Included |
|---|---|---|
| Free | $0 | Wizard + AI chat (5 msgs) + recommendation report |
| Filing Package | $399 one-time | Document generation, state filing, EIN, registered agent (yr 1) |
| Compliance Subscription | $29/mo or $249/yr | Everything above + 83(b), cap table, annual filings, unlimited AI chat |

---

## Platform Roadmap

| Phase | Product | Timeline | Focus |
|---|---|---|---|
| v1 | Incorporation Core | Months 0–6 | Wizard, AI chat, end-to-end filing |
| v2 | Compliance Suite | Months 6–12 | 83(b), cap table, annual reports, document vault |
| v3 | Contracts Layer | Months 12–18 | Employment contracts, license agreements, AI-assisted review |
| v4 | International Expansion | Months 18–30 | Market entry advisory, multi-jurisdiction compliance |

**Long-term vision:** StartStack becomes the default legal infrastructure layer for startups and SMBs — from day zero incorporation through global expansion — replacing the need for a general counsel until a company is large enough to hire one.

---

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** FastAPI (Python)
- **AI:** Claude API (claude-sonnet-4-6)
- **Auth:** Clerk or Supabase Auth
- **DB:** PostgreSQL (Supabase)

---

## Status

Early-stage build. PRD complete. Next: wireframes, recommendation engine, filing partner evaluation.
