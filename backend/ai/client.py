import json
import os
import anthropic
from .prompts import (
    INCORPORATION_SYSTEM_PROMPT,
    AGREEMENTS_SYSTEM_PROMPT,
    PATENTS_SYSTEM_PROMPT,
    FUNDRAISING_SYSTEM_PROMPT,
    CHAT_SYSTEM_PROMPT,
    MEETING_NOTES_SYSTEM_PROMPT,
)

MODEL = "claude-sonnet-4-6"

_client = None


def _is_demo_mode() -> bool:
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    return not key or key == "your_key_here"


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    return _client


def _call(system: str, user: str) -> str:
    response = _get_client().messages.create(
        model=MODEL,
        max_tokens=4096,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    return response.content[0].text


def _parse_json(raw: str, fallback: dict) -> dict:
    text = raw.strip()
    if text.startswith("```"):
        lines = text.splitlines()[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return fallback


# ── DEMO RESPONSES ────────────────────────────────────────────────────────────

DEMO_RECOMMENDATION = {
    "entity": "Delaware C-Corp",
    "state": "Delaware",
    "explanation": (
        "Based on your answers, a Delaware C-Corporation is the right structure for you. "
        "You're planning to raise venture capital, and investors — especially institutional VCs — "
        "almost universally require a Delaware C-Corp. Delaware's Court of Chancery has centuries "
        "of established corporate case law, which makes it the gold standard for startups on a "
        "high-growth, fundraising track."
    ),
    "considerations": [
        "Delaware C-Corps are subject to double taxation — the company pays corporate income tax, and shareholders pay tax on dividends. For a VC-backed startup this is rarely a problem in early stages.",
        "You'll owe Delaware franchise tax annually (due March 1). Use the Assumed Par Value method — it's usually much cheaper than the Authorized Shares method.",
        "If you operate primarily in California, you'll also need to register as a foreign corporation there and pay California's $800/year minimum franchise tax.",
    ],
}

DEMO_SERVICE_AGREEMENT = {
    "draft": """SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of the date last signed below ("Effective Date") between:

CLIENT: Acme Corp, a Delaware corporation ("Client")
SERVICE PROVIDER: Jane Smith, an individual ("Provider")

1. SERVICES
Provider agrees to perform the following services ("Services"):
Product design and UX consulting, including user research, wireframing, and prototype design for Client's mobile application.

2. COMPENSATION
Client shall pay Provider $8,500 per month, invoiced on the 1st of each month. Payment is due within 15 days of receipt of invoice.

3. TERM
This Agreement begins on the Effective Date and continues for 6 months unless earlier terminated pursuant to Section 7.

4. INDEPENDENT CONTRACTOR
Provider is an independent contractor, not an employee of Client. Provider is responsible for all taxes on compensation received under this Agreement.

5. INTELLECTUAL PROPERTY
All work product, inventions, and deliverables created by Provider under this Agreement ("Work Product") shall be the sole and exclusive property of Client upon full payment. Provider hereby assigns all rights, title, and interest in the Work Product to Client.

6. CONFIDENTIALITY
Provider agrees to keep all Client information confidential and not to disclose it to any third party without Client's prior written consent. This obligation survives termination of this Agreement.

7. TERMINATION
Either party may terminate this Agreement with 14 days written notice. Client may terminate immediately for cause (material breach, misconduct, or failure to perform).

8. LIMITATION OF LIABILITY
Provider's total liability under this Agreement shall not exceed the fees paid in the 3 months preceding the claim.

9. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Delaware.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date below.

CLIENT: ___________________________  Date: __________
PROVIDER: _________________________  Date: __________""",
    "summary": (
        "This is a 6-month contract paying $8,500/month. Key points: "
        "the provider is an independent contractor (not an employee), "
        "all work created belongs to the client, "
        "everything discussed must stay confidential, "
        "and either side can end the contract with 2 weeks notice."
    ),
}

DEMO_EMPLOYMENT_AGREEMENT = {
    "draft": """EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into between Legal Foundry Inc. ("Company") and Alex Johnson ("Employee").

1. POSITION & START DATE
Employee is hired as Senior Software Engineer, reporting to the CTO. Start date: May 1, 2026.

2. COMPENSATION
Base salary: $145,000 per year, paid bi-weekly. Employee is eligible for an annual performance bonus at Company's discretion.

3. EQUITY
Subject to Board approval, Employee will receive an option to purchase 0.5% of Company's fully diluted shares. Options vest over 4 years with a 1-year cliff (25% vests after 12 months, remainder monthly over 36 months).

4. BENEFITS
Employee is entitled to: health insurance (Company pays 80%), 15 days PTO, standard public holidays, and remote-friendly work arrangement.

5. INTELLECTUAL PROPERTY ASSIGNMENT
All inventions, code, and work product created by Employee during employment — even outside working hours if related to Company's business — belong to the Company.

6. NON-SOLICITATION
For 12 months after termination, Employee may not solicit Company's employees or customers.

7. AT-WILL EMPLOYMENT
Employment is at-will. Either party may terminate at any time with 2 weeks notice (or immediate termination for cause).

8. GOVERNING LAW
This Agreement is governed by the laws of Delaware.

COMPANY: ___________________________  Date: __________
EMPLOYEE: __________________________  Date: __________""",
    "summary": (
        "Alex joins as Senior Software Engineer at $145k/year with 0.5% equity (4-year vest, 1-year cliff). "
        "Employment is at-will — either side can end it with 2 weeks notice. "
        "All work created belongs to the company, and Alex can't poach employees or clients for 1 year after leaving."
    ),
}

DEMO_PATENT_GUIDANCE = {
    "ip_type": "Utility Patent + Trade Secret",
    "steps": [
        "Document everything now — write down exactly how your invention works, with dates, diagrams, and your name. This creates a paper trail.",
        "Do NOT publicly disclose your invention yet. Public disclosure starts a 12-month clock in the US — after that you can't file. In most other countries, any disclosure before filing kills your rights.",
        "Run a prior art search on Google Patents (patents.google.com) and USPTO (patents.gov) to check if anything similar already exists.",
        "File a Provisional Patent Application (PPA) with the USPTO. This costs ~$320 and gives you 12 months of 'patent pending' status while you develop further. You don't need a lawyer for this step.",
        "Within 12 months of the PPA, file a full Non-Provisional Utility Patent Application. This is where you'll want a registered patent attorney — it typically costs $8,000–$15,000.",
        "Protect trade secrets in parallel — use NDAs with anyone who sees the invention, limit who has access, and document your security measures.",
    ],
    "warnings": [
        "Timing is critical — in most countries outside the US, you must file BEFORE any public disclosure. Don't demo, publish, or pitch without filing first.",
        "If you have co-inventors, everyone must be listed on the patent. Leaving someone off can invalidate it.",
        "A patent gives you the right to sue — not automatic protection. Enforcement is expensive. Consider whether trade secret protection is more practical for your situation.",
    ],
}

DEMO_TERMSHEET = {
    "termsheet": """TERM SHEET — SEED ROUND

Company: Legal Foundry Inc.
Date: April 2026
Round: Seed

─────────────────────────────────
FINANCING TERMS
─────────────────────────────────
Instrument:           SAFE (Simple Agreement for Future Equity)
Amount:               $750,000
Valuation Cap:        $5,000,000 (post-money)
Discount Rate:        20%
MFN Clause:           Yes
Pro-Rata Rights:      Yes (investors may participate in next priced round)

─────────────────────────────────
INVESTOR RIGHTS
─────────────────────────────────
Information Rights:   Quarterly financials for investments > $25,000
Major Investor:       Threshold of $50,000
Board Observer:       None at this stage

─────────────────────────────────
FOUNDER TERMS
─────────────────────────────────
Founder Vesting:      4 years / 1-year cliff (existing shares subject to reverse vesting)
IP Assignment:        All founders must execute PIIA before close
Closing Conditions:   Execution of SAFE documents, IP assignment, legal review

─────────────────────────────────
FEES & EXPENSES
─────────────────────────────────
Legal Fees:           Each party bears own legal costs
Closing:              Target 30 days from signing""",
    "clause_explanations": [
        {
            "clause": "Valuation Cap — $5,000,000",
            "explanation": "This is the maximum valuation at which your SAFE converts to equity. If your Series A is priced at $10M, SAFE investors convert as if the valuation was $5M — meaning they get more shares than new investors. It's the investor's reward for taking early risk.",
        },
        {
            "clause": "Discount Rate — 20%",
            "explanation": "SAFE investors also get a 20% discount on the price per share at the next round. They'll use whichever gives them more shares — the cap or the discount. This is a standard early investor perk.",
        },
        {
            "clause": "MFN Clause",
            "explanation": "Most Favoured Nation. If you raise another SAFE before your Series A with better terms (lower cap, higher discount), this investor automatically gets upgraded to those better terms too. Standard and founder-friendly.",
        },
        {
            "clause": "Pro-Rata Rights",
            "explanation": "Investors have the right (not obligation) to put more money in during your next priced round to avoid being diluted. Good investors — it means they're committed. Just know it can complicate your Series A if you have many SAFE holders exercising pro-rata.",
        },
        {
            "clause": "Founder Vesting",
            "explanation": "Your own shares will be subject to a 4-year reverse vesting schedule. If you leave the company in year 1, you don't keep all your equity. This protects investors (and your co-founders) from a founder walking away with a large stake.",
        },
    ],
}

DEMO_CHAT_RESPONSES = {
    "incorporation": [
        "Great question. The main reason we're recommending Delaware over your home state is that institutional investors — VCs, angels who've done this before — are very familiar with Delaware corporate law. Their lawyers know it, their docs are templated for it, and it avoids negotiation friction at your Series A. If you ever plan to raise from a top-tier VC, Delaware is essentially required.",
        "The double taxation concern is real but usually not an issue at the early stage. Most VC-backed startups don't pay dividends — profits get reinvested into the business. You only feel the double tax pinch if you're taking profits out, which most startups aren't doing in their first few years.",
        "Yes, you'll need to register as a foreign corporation in California if you're operating there, even if you're incorporated in Delaware. That means a one-time filing fee plus California's $800/year minimum franchise tax. It's an extra cost, but it's standard for any Delaware company operating in California — basically everyone does it.",
    ],
    "agreements": [
        "The IP assignment clause means anything you build while working for the company belongs to the company — including work done on weekends or evenings if it's related to the business. This is standard in employment agreements. If you have side projects you want to keep, list them explicitly in an exhibit before you sign.",
        "Non-solicitation means you can't poach employees or go after the company's customers for 12 months after you leave. It doesn't stop you from getting a job elsewhere in the same industry — that would be a non-compete, which is different (and often unenforceable in California).",
        "At-will employment means either you or the company can end the relationship at any time with 2 weeks notice. There's no severance obligation unless it's written into the agreement. If you want severance protection, that needs to be negotiated separately.",
    ],
    "patents": [
        "A provisional patent application is a low-cost way to get 12 months of 'patent pending' status without filing the full application. It costs about $320 with the USPTO and you can file it yourself. The key benefit: it locks in your filing date, which matters a lot for priority. Think of it as a placeholder while you keep developing.",
        "Trade secret protection is an alternative to patents that many startups prefer. It requires keeping your invention secret, using NDAs, and limiting access — but unlike a patent, it never expires and you don't have to publicly disclose how it works. The downside: if someone independently discovers the same thing, you have no recourse.",
        "Yes, you should file before your demo day. Any public disclosure — including a pitch to investors without an NDA — starts the 12-month US clock and immediately kills your rights in most other countries. File the provisional first, then demo freely.",
    ],
    "fundraising": [
        "A SAFE is not a loan — investors don't get their money back if the company fails. It's an agreement to receive equity in a future priced round. The investor is betting on you. The valuation cap sets the maximum price they'll pay for that equity when the conversion happens.",
        "The discount and the cap work in the investor's favour at conversion — they get whichever gives them more shares. In practice, at seed stage the cap usually drives the conversion math. The discount becomes more meaningful if your Series A valuation is close to the cap.",
        "Pro-rata rights are generally founder-friendly because they bring in more money from investors who already believe in you. The risk is that if you have 15 SAFE holders all exercising pro-rata, it can complicate your Series A lead investor's allocation. Most VCs will ask you to clean this up before they lead.",
    ],
}

DEMO_FILING_DOC = None  # Generated dynamically from form_data

DEMO_PATENT_APP = None  # Generated dynamically from filing_details

_demo_chat_counters: dict[str, int] = {}


def _get_demo_chat_response(module: str, message: str) -> str:
    responses = DEMO_CHAT_RESPONSES.get(module, DEMO_CHAT_RESPONSES["incorporation"])
    idx = _demo_chat_counters.get(module, 0) % len(responses)
    _demo_chat_counters[module] = idx + 1
    return responses[idx]


# ── PUBLIC FUNCTIONS ──────────────────────────────────────────────────────────

def get_incorporation_recommendation(answers: dict, decision_matrix: dict, vault_context: str = "") -> dict:
    if _is_demo_mode():
        return DEMO_RECOMMENDATION
    vault_section = f"\n\n{vault_context}\n" if vault_context else ""
    user_message = (
        "Here are the founder's answers from the incorporation wizard:\n"
        f"{json.dumps(answers, indent=2)}\n\n"
        "Here is the decision matrix with the scoring rules:\n"
        f"{json.dumps(decision_matrix, indent=2)}\n\n"
        f"{vault_section}"
        "Based on these answers and the decision matrix, recommend the best entity type and state."
    )
    raw = _call(INCORPORATION_SYSTEM_PROMPT, user_message)
    return _parse_json(raw, DEMO_RECOMMENDATION)


def draft_agreement(type: str, answers: dict, vault_context: str = "") -> dict:
    if _is_demo_mode():
        return DEMO_SERVICE_AGREEMENT if type == "service" else DEMO_EMPLOYMENT_AGREEMENT
    vault_section = f"\n\n{vault_context}\n" if vault_context else ""
    user_message = (
        f"Agreement type: {type}\n\n"
        "Here are the user's answers:\n"
        f"{json.dumps(answers, indent=2)}\n\n"
        f"{vault_section}"
        f"Draft a complete {type} agreement based on these answers."
        + (" Use any company details from the vault context above to customize the agreement." if vault_context else "")
    )
    raw = _call(AGREEMENTS_SYSTEM_PROMPT, user_message)
    fallback = DEMO_SERVICE_AGREEMENT if type == "service" else DEMO_EMPLOYMENT_AGREEMENT
    return _parse_json(raw, fallback)


def edit_section(section_text: str, instruction: str, document_context: str = "", vault_context: str = "") -> dict:
    """Rewrite a selected section of a legal document based on an instruction."""
    system = (
        "You are Legal Foundry's document editor. You rewrite specific sections of legal documents "
        "based on the user's instruction. Keep the legal tone professional. Never give legal advice. "
        "Return ONLY valid JSON in this exact format: "
        '{"rewritten": "the rewritten section text only", "summary": "one sentence explaining what changed"}'
    )
    vault_section = f"\n\n{vault_context}\n" if vault_context else ""
    doc_section = f"\n\nFull document context:\n{document_context[:3000]}" if document_context else ""
    user_message = (
        f"Instruction: {instruction}\n\n"
        f"Section to rewrite:\n{section_text}"
        f"{vault_section}"
        f"{doc_section}"
    )
    if _is_demo_mode():
        return {
            "rewritten": section_text,
            "summary": "Demo mode — no changes made. Connect your Anthropic API key to enable AI editing.",
        }
    raw = _call(system, user_message)
    return _parse_json(raw, {"rewritten": section_text, "summary": "Could not process edit."})


def get_patent_guidance(description: str) -> dict:
    if _is_demo_mode():
        return DEMO_PATENT_GUIDANCE
    user_message = (
        "Here is a description of the invention or creative work:\n\n"
        f"{description}\n\n"
        "What type of IP protection applies, and what steps should the founder take?"
    )
    raw = _call(PATENTS_SYSTEM_PROMPT, user_message)
    return _parse_json(raw, DEMO_PATENT_GUIDANCE)


def generate_termsheet(details: dict) -> dict:
    if _is_demo_mode():
        return DEMO_TERMSHEET
    user_message = (
        "Here are the funding round details:\n"
        f"{json.dumps(details, indent=2)}\n\n"
        "Generate a term sheet summary and explain each key clause."
    )
    raw = _call(FUNDRAISING_SYSTEM_PROMPT, user_message)
    return _parse_json(raw, DEMO_TERMSHEET)


def generate_filing_doc(entity: str, state: str, form_data: dict) -> dict:
    """Generate Articles of Incorporation filled with the user's form data."""
    import datetime

    company_name = form_data.get("company_name", "[COMPANY NAME]")
    shares = form_data.get("authorized_shares", "10,000,000")
    incorporator_name = form_data.get("incorporator_name", "[INCORPORATOR NAME]")
    incorporator_address = form_data.get("incorporator_address", "[INCORPORATOR ADDRESS]")
    agent_name = form_data.get("agent_name", "[REGISTERED AGENT NAME]")
    agent_address = form_data.get("agent_address", "[REGISTERED AGENT ADDRESS]")

    document = f"""CERTIFICATE OF INCORPORATION
OF
{company_name}

FIRST: The name of the corporation is {company_name}.

SECOND: The registered office of the corporation in the State of Delaware is located at {agent_address}. The name of its registered agent at such address is {agent_name}.

THIRD: The purpose of the corporation is to engage in any lawful act or activity for which corporations may be organized under the General Corporation Law of Delaware.

FOURTH: The total number of shares of stock which the corporation is authorized to issue is {shares} shares of Common Stock, each having a par value of $0.00001.

FIFTH: The name and mailing address of the incorporator is: {incorporator_name}, {incorporator_address}.

SIXTH: The corporation reserves the right to amend, alter, change or repeal any provision contained in this Certificate of Incorporation, in the manner now or hereafter prescribed by statute, and all rights conferred upon stockholders herein are granted subject to this reservation.

IN WITNESS WHEREOF, I have hereunto set my hand this ___ day of __________, {datetime.datetime.now().year}.

Incorporator: ___________________________
{incorporator_name}
{incorporator_address}"""

    filing_instructions = [
        "Review the Certificate of Incorporation carefully — ensure all names and addresses are accurate.",
        "Go to corp.delaware.gov and select 'File a New Domestic Corporation'.",
        "You will need a credit card. The standard filing fee is $89.",
        "Upload or enter the information from this document.",
        "You will receive a certified copy by email within 1-3 business days (or same day for expedited, +$50).",
        "After filing, apply for your EIN at irs.gov/ein — it's free and instant.",
        "Open a business bank account using your Certificate of Incorporation + EIN.",
    ]

    if not _is_demo_mode():
        system = (
            "You are a corporate attorney specializing in Delaware incorporations. "
            "Given the provided Articles of Incorporation draft, review and refine it to ensure "
            "it is complete, accurate, and follows standard Delaware corporate law requirements. "
            "Return ONLY valid JSON in this exact format: "
            '{"document": "full refined document text", "filing_instructions": ["step 1", "step 2"], '
            '"filing_url": "https://corp.delaware.gov"}'
        )
        user_message = (
            f"Entity type: {entity}\nState: {state}\n\n"
            "Here is the draft Certificate of Incorporation:\n\n"
            f"{document}\n\n"
            "Please review and refine this document. Return the JSON as specified."
        )
        raw = _call(system, user_message)
        parsed = _parse_json(raw, {})
        if parsed.get("document"):
            return {
                "document": parsed.get("document", document),
                "filing_instructions": parsed.get("filing_instructions", filing_instructions),
                "filing_url": parsed.get("filing_url", "https://corp.delaware.gov"),
            }

    return {
        "document": document,
        "filing_instructions": filing_instructions,
        "filing_url": "https://corp.delaware.gov",
    }


def generate_patent_app(guidance: dict, filing_details: dict) -> dict:
    """Generate a Provisional Patent Application filled with the user's filing details."""
    import datetime

    invention_title = filing_details.get("invention_title", "[INVENTION TITLE]")
    full_description = filing_details.get("full_description", "[DESCRIPTION]")
    inventors_raw = filing_details.get("inventors", "[INVENTOR NAME]")

    # Normalise inventors to a formatted string regardless of input type
    if isinstance(inventors_raw, list):
        inventors_formatted = ", ".join(str(i) for i in inventors_raw)
    else:
        inventors_formatted = str(inventors_raw)

    first_200 = full_description[:200] if len(full_description) > 200 else full_description
    today = datetime.date.today().strftime("%B %d, %Y")

    document = f"""PROVISIONAL PATENT APPLICATION

Title of Invention: {invention_title}

Inventors: {inventors_formatted}

FIELD OF THE INVENTION
{invention_title} relates to a field derived from the following description.

BACKGROUND
There is a need in the field for innovations that solve the problem described herein.

SUMMARY OF THE INVENTION
{full_description}

DETAILED DESCRIPTION
The following is a detailed description of the invention:

{full_description}

The invention described herein provides a novel solution that is not found in existing prior art.

CLAIMS
1. A method/system/apparatus comprising the elements described in the detailed description.
2. The method/system/apparatus of claim 1, further comprising additional novel elements.

ABSTRACT
{first_200}...

---
Filed by: {inventors_formatted}
Date: {today}"""

    filing_instructions = [
        "Create a free account at USPTO.gov/patents/apply.",
        "Select 'File a Provisional Application for Patent' (Form SB/16).",
        "Upload this document as your specification. You do not need formal claims for a provisional.",
        "Pay the filing fee (~$320 for micro entities, $640 for small entities).",
        "You will receive a filing receipt with your application number — keep this safe.",
        "You now have 12 months of 'patent pending' status. Use this time to develop further and file the non-provisional application.",
        "Do not make any public disclosures before filing — this could affect your patent rights.",
    ]

    if not _is_demo_mode():
        system = (
            "You are a registered US patent attorney. Given an invention description and a draft "
            "Provisional Patent Application, review and enhance the document to be thorough and "
            "professionally formatted. Return ONLY valid JSON in this exact format: "
            '{"document": "full refined PPA text", "filing_instructions": ["step 1", "step 2"], '
            '"filing_url": "https://www.uspto.gov/patents/apply"}'
        )
        ip_type = guidance.get("ip_type", "patent")
        user_message = (
            f"IP type identified: {ip_type}\n"
            f"Invention title: {invention_title}\n\n"
            "Here is the draft Provisional Patent Application:\n\n"
            f"{document}\n\n"
            "Please review and enhance this PPA. Return the JSON as specified."
        )
        raw = _call(system, user_message)
        parsed = _parse_json(raw, {})
        if parsed.get("document"):
            return {
                "document": parsed.get("document", document),
                "filing_instructions": parsed.get("filing_instructions", filing_instructions),
                "filing_url": parsed.get("filing_url", "https://www.uspto.gov/patents/apply"),
            }

    return {
        "document": document,
        "filing_instructions": filing_instructions,
        "filing_url": "https://www.uspto.gov/patents/apply",
    }


DEMO_MEETING_SUMMARY = {
    "tldr": "The founding team met to discuss incorporation structure, the first engineering hire, and the upcoming seed raise. Key decisions were made on entity type and equity structure. Several legal action items were identified.",
    "decisions": [
        "Incorporate as a Delaware C-Corp before the first hire",
        "Issue founder shares with 4-year vesting, 1-year cliff",
        "Raise $750K on a SAFE with a $5M valuation cap",
        "Engage a registered agent in Delaware before filing",
    ],
    "action_items": [
        {"task": "File Articles of Incorporation with Delaware", "owner": "CEO", "deadline": "End of week"},
        {"task": "Draft RSPA (Restricted Stock Purchase Agreement) for founder shares", "owner": "CEO", "deadline": "Before shares are issued"},
        {"task": "File 83(b) election with IRS within 30 days of stock grant", "owner": "All founders", "deadline": "30 days from grant — NO exceptions"},
        {"task": "Draft offer letter and PIIA for first engineering hire", "owner": "CEO", "deadline": "Before start date"},
        {"task": "Get SAFE drafted for seed round", "owner": "Legal counsel", "deadline": "Before investor meetings"},
    ],
    "legal_flags": [
        {
            "flag": "83(b) Election Required",
            "urgency": "high",
            "context": "Founder shares with vesting were discussed. Each founder must file an 83(b) election with the IRS within 30 days of the stock grant — no extensions, no exceptions. Missing this can result in ordinary income tax on full vested value."
        },
        {
            "flag": "IP Assignment Agreement Needed for New Hire",
            "urgency": "high",
            "context": "A new engineering hire was discussed. Before their start date, they must sign a PIIA (Proprietary Information and Inventions Assignment) to ensure all work belongs to the company."
        },
        {
            "flag": "SAFE is a Security — Verify Investor Accreditation",
            "urgency": "medium",
            "context": "The team plans to raise via SAFE. SAFE notes are securities under federal law. Investors must be accredited (Reg D Rule 506(b)) or the offering must otherwise qualify for an exemption. Consult a securities attorney before accepting investment."
        },
    ],
    "follow_ups": [
        "Has a registered agent been selected for Delaware?",
        "Do all founders have US citizenship/permanent residency? (Affects S-Corp eligibility, though C-Corp was chosen)",
        "Will the engineering hire be a contractor or full-time employee? (AB5 risk if in California)",
        "What is the 409A plan before issuing any stock options post-incorporation?",
    ],
}


def summarize_meeting(notes: str, title: str, attendees: str) -> dict:
    if _is_demo_mode():
        return DEMO_MEETING_SUMMARY
    user_message = (
        f"Meeting title: {title}\n"
        f"Attendees: {attendees}\n\n"
        f"Meeting notes / transcript:\n{notes}"
    )
    raw = _call(MEETING_NOTES_SYSTEM_PROMPT, user_message)
    return _parse_json(raw, DEMO_MEETING_SUMMARY)


def chat(module: str, context: str, history: list, message: str) -> str:
    if _is_demo_mode():
        return _get_demo_chat_response(module, message)
    system = CHAT_SYSTEM_PROMPT.format(module=module)
    messages = []
    for entry in history:
        role = entry.get("role", "user")
        content = entry.get("content", "")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})
    if context:
        user_content = (
            f"[Context from the {module} module]\n{context}\n\n"
            f"[My question]\n{message}"
        )
    else:
        user_content = message
    messages.append({"role": "user", "content": user_content})
    response = _get_client().messages.create(
        model=MODEL,
        max_tokens=2048,
        system=system,
        messages=messages,
    )
    return response.content[0].text
