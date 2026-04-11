# Legal Foundry — Project Context for Claude

## Company Vision

We are building the **one-stop legal operating system for startups and SMBs**. The goal is to replace the need for expensive lawyers across every routine legal need a growing company has — incorporation, compliance, contracts, and international expansion.

This is a platform play, not a single product. Every feature we build should ladder up to making Legal Foundry the default legal infrastructure layer for startups from day zero through global scale.

## The 5 Modules — What We're Building

Legal Foundry is a single web app with 5 legal modules. Each module follows the same pattern: ask the user questions → AI generates output (recommendation, draft document, or guidance) → user can chat to refine.

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

## Legal Guardrails (From US Incorporation Legal Guide)

### Critical Deadlines — Always Surface These
- **83(b) Election**: Must be filed with IRS within **30 days** of stock grant. No extensions. No exceptions. No grace period. Missing it results in ordinary income tax on full vested value as it vests — potentially hundreds of thousands of dollars. Always flag this prominently.
- **BOI Report (FinCEN)**: Must be filed within **90 days** of formation. $500/day civil penalty; up to $10,000 + prison for willful violation.
- **S-Corp Election (Form 2553)**: Must be filed within **75 days** of incorporation. Treated as C-Corp and pass-through status is permanently lost for that year if missed.
- **CA Statement of Information**: Due within 90 days of incorporation (Corps: SI-550, $25; LLCs: LLC-12, $20). $250 late penalty + risk of administrative suspension.
- **409A Valuation**: Required before any stock option grants. Option holders face immediate ordinary income tax + 20% excise tax if options are granted below FMV without a valid 409A.

### Entity-Specific Hard Disqualifiers
- **S-Corp is impossible if**: Non-US citizen/permanent resident shareholder, more than 100 shareholders, multiple classes of stock, corporate shareholder, missing the 75-day Form 2553 deadline.
- **S-Corp also requires**: CA Form 3560 (California S-Corp election) filed separately — the federal Form 2553 alone is not enough in California.
- **General Partnership**: NEVER recommend without flagging that all partners have unlimited personal liability including for other partners' actions. Always recommend LLC or Corp instead.
- **LLP in California**: Only available to licensed professionals (attorneys, CPAs, architects). Not available to general startups.

### California-Specific Warnings — Always Include When User is in CA
- Any entity operating in California pays **$800/year minimum franchise tax** — even with zero revenue — except LLCs formed after Jan 1, 2021 (waived first year).
- LLCs also pay a gross receipts fee on top: $900 (receipts $250k–$499k), $2,500 ($500k–$999k), $6,000 ($1M–$4.99M), $11,790 ($5M+).
- Delaware corps operating in California must **also register as a foreign corporation** (one-time filing + $800/yr min franchise tax). This is not optional.
- **AB5 (California)**: Independent contractors must pass the ABC test. Misclassification risk is high in CA — always flag when user mentions contractors.
- **Offer letters in California**: Must contain at-will employment language. Cannot promise continued employment.

### Sector-Specific Flags — Raise These When Relevant
- **Fintech/Payments**: Money transmitter license required; AML/KYC program; Bank Secrecy Act compliance.
- **Healthcare/MedTech**: HIPAA BAAs required; FDA clearance may be needed.
- **SaaS/Data/AI**: CCPA/CPRA compliance required if handling CA residents' data.
- **Crypto/Web3**: Howey Test analysis required before any token issuance. Consult securities counsel.
- **Cannabis**: No federal banking; state license required before any operations.

### Post-Formation Checklist — Always Mention These Steps
For C-Corps: EIN (free, instant) → BOI report (90 days) → Bylaws → Org meeting → Share issuance → RSPAs → 83(b) elections → IP/PIIA agreements → SI-550 → Equity plan + 409A if issuing options.
For LLCs: Articles of Organization → Operating Agreement → EIN → Statement of Information (90 days) → BOI report → Business bank account.

### What Legal Foundry Must NEVER Do
- Never tell a user their 83(b) deadline is not urgent or that they can file it later.
- Never recommend a General Partnership without a strong liability warning.
- Never suggest an S-Corp without checking all 4 eligibility requirements.
- Never help with token/crypto issuance without flagging securities law risk.
- Never give specific tax advice — always refer to a CPA for tax-specific questions.

## Open Questions (Unresolved)

1. **Registered agent partner** — evaluating Northwest, Registered Agents Inc.
2. **State filing APIs** — most states lack APIs; may need IncFile/ZenBusiness partnership or form automation
3. **Legal review** — startup attorney should review recommendation logic + prompts before launch
4. **Liability** — ToS must state this is not legal advice; consider E&O insurance
