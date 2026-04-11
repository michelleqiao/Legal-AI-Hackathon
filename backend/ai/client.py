import json
import os
import anthropic
from .prompts import (
    INCORPORATION_SYSTEM_PROMPT,
    AGREEMENTS_SYSTEM_PROMPT,
    PATENTS_SYSTEM_PROMPT,
    FUNDRAISING_SYSTEM_PROMPT,
    CHAT_SYSTEM_PROMPT,
)

MODEL = "claude-sonnet-4-6"

_client = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    return _client


def _call(system: str, user: str) -> str:
    """Send a single-turn message and return the text content."""
    response = _get_client().messages.create(
        model=MODEL,
        max_tokens=4096,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    return response.content[0].text


def _parse_json(raw: str, fallback: dict) -> dict:
    """
    Extract and parse JSON from a Claude response.
    Handles responses that wrap JSON in markdown code fences.
    Returns fallback dict if parsing fails.
    """
    text = raw.strip()
    # Strip markdown code fences if present
    if text.startswith("```"):
        lines = text.splitlines()
        # Drop opening fence line (```json or ```)
        lines = lines[1:]
        # Drop closing fence line
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return fallback


def get_incorporation_recommendation(answers: dict, decision_matrix: dict) -> dict:
    """
    Given founder's wizard answers and the decision matrix rules,
    return an entity/state recommendation with explanation and considerations.
    """
    user_message = (
        "Here are the founder's answers from the incorporation wizard:\n"
        f"{json.dumps(answers, indent=2)}\n\n"
        "Here is the decision matrix with the scoring rules:\n"
        f"{json.dumps(decision_matrix, indent=2)}\n\n"
        "Based on these answers and the decision matrix, recommend the best entity type and state."
    )
    raw = _call(INCORPORATION_SYSTEM_PROMPT, user_message)
    fallback = {
        "entity": "C-Corp",
        "state": "Delaware",
        "explanation": (
            "We were unable to process your answers automatically. "
            "Based on your responses, a C-Corp in Delaware is the most common default for startups. "
            "Please consult a lawyer to confirm this is right for your situation."
        ),
        "considerations": [
            "Always consult a startup attorney before making a final incorporation decision.",
            "Delaware C-Corps have ongoing franchise tax obligations.",
            "Consider your state of operations when deciding where to incorporate.",
        ],
    }
    return _parse_json(raw, fallback)


def draft_agreement(type: str, answers: dict) -> dict:
    """
    Draft a service or employment agreement based on the user's answers.
    Returns the full draft and a plain-English summary.
    """
    user_message = (
        f"Agreement type: {type}\n\n"
        "Here are the user's answers:\n"
        f"{json.dumps(answers, indent=2)}\n\n"
        f"Draft a complete {type} agreement based on these answers."
    )
    raw = _call(AGREEMENTS_SYSTEM_PROMPT, user_message)
    fallback = {
        "draft": (
            f"[Draft {type} agreement could not be generated automatically. "
            "Please try again or consult a lawyer.]"
        ),
        "summary": (
            "The agreement draft could not be generated. "
            "Please consult a lawyer to prepare this document."
        ),
    }
    return _parse_json(raw, fallback)


def get_patent_guidance(description: str) -> dict:
    """
    Given a description of an invention or creative work, return the applicable
    IP protection type, numbered steps to protect it, and key warnings.
    """
    user_message = (
        "Here is a description of the invention or creative work:\n\n"
        f"{description}\n\n"
        "What type of IP protection applies, and what steps should the founder take?"
    )
    raw = _call(PATENTS_SYSTEM_PROMPT, user_message)
    fallback = {
        "ip_type": "patent",
        "steps": [
            "Step 1: Document your invention thoroughly with dates and details.",
            "Step 2: Conduct a prior art search to check if similar inventions exist.",
            "Step 3: Consult a registered patent attorney before filing.",
        ],
        "warnings": [
            "IP guidance could not be generated automatically. Please consult an IP attorney.",
            "Timing is critical — public disclosure before filing can affect your rights.",
        ],
    }
    return _parse_json(raw, fallback)


def generate_termsheet(details: dict) -> dict:
    """
    Generate a term sheet summary for the given round details,
    with plain-English clause explanations.
    """
    user_message = (
        "Here are the funding round details:\n"
        f"{json.dumps(details, indent=2)}\n\n"
        "Generate a term sheet summary and explain each key clause."
    )
    raw = _call(FUNDRAISING_SYSTEM_PROMPT, user_message)
    fallback = {
        "termsheet": (
            "[Term sheet could not be generated automatically. "
            "Please try again or consult a startup attorney.]"
        ),
        "clause_explanations": [
            {
                "clause": "Error",
                "explanation": (
                    "The term sheet could not be generated. "
                    "Please consult a lawyer to review any term sheet before signing."
                ),
            }
        ],
    }
    return _parse_json(raw, fallback)


def chat(module: str, context: str, history: list, message: str) -> str:
    """
    Handle a follow-up chat message for any StartStack module.
    Returns a plain-English reply string.
    """
    system = CHAT_SYSTEM_PROMPT.format(module=module)

    # Build the messages list: history + current user message
    messages = []
    for entry in history:
        role = entry.get("role", "user")
        content = entry.get("content", "")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})

    # Prepend context to the current user message if provided
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
