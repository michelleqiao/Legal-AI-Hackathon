# StartStack — Project Context for Claude

## Company Vision

We are building the **one-stop legal operating system for startups and SMBs**. The goal is to replace the need for expensive lawyers across every routine legal need a growing company has — incorporation, compliance, contracts, and international expansion.

This is a platform play, not a single product. Every feature we build should ladder up to making StartStack the default legal infrastructure layer for startups from day zero through global scale.

## The 5 Modules — What We're Building

StartStack is a single web app with 5 legal modules. Each module follows the same pattern: ask the user questions → AI generates output (recommendation, draft document, or guidance) → user can chat to refine.

### Module 1: Incorporation
1. Guided wizard (~8–10 questions)
2. AI recommends entity type (C-Corp, LLC, S-Corp, B-Corp/PBC) + state
3. Plain-English explanation + chat for follow-ups
4. Generates and files incorporation documents

### Module 2: Service & Employment Agreements
1. User selects agreement type (service or employment)
2. AI asks targeted questions (parties, scope, compensation, IP ownership, termination)
3. AI drafts the full agreement in plain English
4. User can chat to refine specific clauses

### Module 3: Patents & IP Protection
1. User describes their invention or IP
2. AI guides them through what's protectable (patent, trademark, copyright, trade secret)
3. Step-by-step guidance: prior art search, provisional patent, next steps
4. Plain-English throughout — no patent attorney jargon

### Module 4: Fundraising
1. User inputs round details (stage, amount, valuation, investor type)
2. AI generates a term sheet or SAFE/convertible note summary
3. AI explains every clause and its implications for dilution and control
4. Chat to explore scenarios ("what if the valuation cap is lower?")

## Target User

First-time or repeat founders — solo or small teams (2–3 people) — at the pre-incorporation stage. Non-legal background. Pre-revenue to seed stage. US-based for v1.

## Entity Types in Scope (v1)

- C-Corp (Delaware) — default for VC-backed startups
- LLC — bootstrapped, flexible
- S-Corp — small business, US citizens only
- B-Corp / PBC — mission-driven, investor-compatible

## Recommendation Engine

The wizard maps founder answers to a scoring matrix:

| Signal | Points to |
|---|---|
| Plans to raise VC | C-Corp (Delaware) |
| Solo founder, bootstrapped | LLC or S-Corp |
| Mission-driven | Delaware PBC |
| Non-US co-founders | C-Corp (eliminates S-Corp) |
| Wants pass-through tax | LLC or S-Corp |
| >100 shareholders anticipated | C-Corp (S-Corp ineligible) |
| Home state operations only | Consider home state LLC |

State logic:
- Default to Delaware for C-Corps
- Recommend home state for LLC with no VC plans
- Flag Wyoming as LLC alternative (low fees, privacy)

## AI Chat Principles

- Explain reasoning in plain English — no jargon
- NEVER give legal advice or tell founders what to decide
- Always recommend consulting a lawyer for final decisions
- Proactively surface tradeoffs the founder may not have considered
- Refer back to wizard answers when explaining recommendations
- If a question is out of scope, say so clearly and suggest a lawyer

## Business Model

- **Free:** Wizard (unlimited) + AI chat (5 msgs/session) + recommendation PDF
- **Filing Package ($399):** Document generation + state filing + EIN + registered agent (yr 1)
- **Compliance Subscription ($29/mo or $249/yr):** Everything above + 83(b) + cap table + annual filings + unlimited chat

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI (Python)
- AI: Claude API — model `claude-sonnet-4-6`
- Auth: Clerk or Supabase Auth
- DB: PostgreSQL (Supabase)

## What to Avoid

- Legal advice — the tool explains, never advises. Always recommend a lawyer for final decisions.
- Jargon in any user-facing output — if a 20-year-old without a law degree can't understand it, rewrite it
- International incorporations (out of scope until v4)
- Building edge cases before the core flow of each module works
- Overly long outputs — keep summaries tight, let users ask for more via chat

## Platform Roadmap Context

Each phase expands the platform into a new legal domain. When building any feature, keep the broader platform in mind — avoid decisions that would make it harder to expand into later phases.

| Phase | Product | What's coming |
|---|---|---|
| v1 | Incorporation Core | Wizard, AI chat, end-to-end filing |
| v2 | Compliance Suite | 83(b), cap table, annual reports, document vault |
| v3 | Contracts Layer | Employment contracts, license agreements, AI-assisted review |
| v4 | International Expansion | Market entry advisory, multi-jurisdiction compliance |

## Open Questions (Unresolved)

1. **Registered agent partner** — evaluating Northwest, Registered Agents Inc.
2. **State filing APIs** — most states lack APIs; may need IncFile/ZenBusiness partnership or form automation
3. **Legal review** — startup attorney should review recommendation logic + prompts before launch
4. **Liability** — ToS must state this is not legal advice; consider E&O insurance
