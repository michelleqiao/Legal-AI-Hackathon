# StartStack — Project Context for Claude

## What We're Building

StartStack is a web app that helps startup founders incorporate their company correctly and stay compliant — without needing a lawyer for every step.

The core flow:
1. Founder answers a guided wizard (~8–10 questions)
2. AI recommends the right entity type (C-Corp, LLC, S-Corp, B-Corp/PBC) and state
3. Founder can ask follow-up questions via AI chat
4. StartStack generates and files the incorporation documents on their behalf
5. Post-incorporation: compliance dashboard, cap table, 83(b), annual reports

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

- Legal advice — the tool explains, never advises
- Jargon in any user-facing output — if a 20-year-old without a law degree can't understand it, rewrite it
- Feature creep in v1 — focus on wizard → recommendation → filing before expanding
- International incorporations (out of scope until v4)
- Building edge cases before the core flow works

## Roadmap Context

| Phase | What's coming |
|---|---|
| v1 | Wizard, AI chat, end-to-end filing |
| v2 | 83(b), cap table, annual reports, document vault |
| v3 | Employment contracts, license agreements, AI-assisted review |
| v4 | International market entry advisory, multi-jurisdiction compliance |

## Open Questions (Unresolved)

1. **Registered agent partner** — evaluating Northwest, Registered Agents Inc.
2. **State filing APIs** — most states lack APIs; may need IncFile/ZenBusiness partnership or form automation
3. **Legal review** — startup attorney should review recommendation logic + prompts before launch
4. **Liability** — ToS must state this is not legal advice; consider E&O insurance
