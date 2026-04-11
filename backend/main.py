import io
import json
import os
from datetime import date
from pathlib import Path

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional

from ai import (
    get_incorporation_recommendation,
    draft_agreement,
    get_patent_guidance,
    generate_termsheet,
    generate_filing_doc,
    generate_patent_app,
    chat,
)

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Legal Foundry API",
    description="AI-powered legal platform for startups",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the decision matrix, relative to this file's parent directory
DECISION_MATRIX_PATH = Path(__file__).parent.parent / "data" / "decision_matrix.json"


def _load_decision_matrix() -> dict:
    """Load the decision matrix JSON. Returns an empty dict if file is missing."""
    if DECISION_MATRIX_PATH.exists():
        with open(DECISION_MATRIX_PATH, "r") as f:
            return json.load(f)
    return {}


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class RecommendRequest(BaseModel):
    answers: Dict[str, Any] = Field(..., description="Founder's wizard answers")


class RecommendResponse(BaseModel):
    entity: str
    state: str
    explanation: str
    considerations: List[str]


class DraftAgreementRequest(BaseModel):
    type: str = Field(..., description="'service' or 'employment'")
    answers: Dict[str, Any] = Field(..., description="User's answers for the agreement")


class DraftAgreementResponse(BaseModel):
    draft: str
    summary: str


class PatentGuidanceRequest(BaseModel):
    description: str = Field(..., description="Description of the invention or creative work")


class PatentGuidanceResponse(BaseModel):
    ip_type: str
    steps: List[str]
    warnings: List[str]


class GenerateTermsheetRequest(BaseModel):
    stage: str = Field(..., description="Funding stage, e.g. 'seed', 'pre-seed'")
    amount: str = Field(..., description="Investment amount, e.g. '$750,000'")
    valuation: str = Field(..., description="Pre-money valuation, e.g. '$5,000,000'")
    investor_type: str = Field(..., description="Type of investor, e.g. 'angels', 'vc'")
    instrument: str = Field(..., description="'SAFE', 'convertible note', or 'priced round'")


class ClauseExplanation(BaseModel):
    clause: str
    explanation: str


class GenerateTermsheetResponse(BaseModel):
    termsheet: str
    clause_explanations: List[ClauseExplanation]


class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str


class ChatRequest(BaseModel):
    module: str = Field(
        ...,
        description="'incorporation' | 'agreements' | 'patents' | 'fundraising'",
    )
    context: Optional[str] = Field(default="", description="Context from the current module session")
    history: Optional[List[ChatMessage]] = Field(default=[], description="Prior conversation turns")
    message: str = Field(..., description="The user's current message")


class ChatResponse(BaseModel):
    reply: str


class ExportPdfRequest(BaseModel):
    title: str
    content: str


class FilingDocRequest(BaseModel):
    entity: str = Field(..., description="e.g. 'Delaware C-Corp'")
    state: str = Field(..., description="e.g. 'Delaware'")
    form_data: Dict[str, Any] = Field(
        ...,
        description=(
            "company_name, authorized_shares, incorporator_name, "
            "incorporator_address, agent_name, agent_address"
        ),
    )


class FilingDocResponse(BaseModel):
    document: str
    filing_instructions: List[str]
    filing_url: str


class PatentAppRequest(BaseModel):
    guidance: Dict[str, Any] = Field(..., description="IP guidance result (ip_type, steps, warnings)")
    filing_details: Dict[str, Any] = Field(
        ...,
        description="invention_title, full_description, inventors, prior_art_done",
    )


class PatentAppResponse(BaseModel):
    document: str
    filing_instructions: List[str]
    filing_url: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health")
def health_check():
    """Basic health check endpoint."""
    return {"status": "ok", "service": "Legal Foundry API"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Accept a file upload and return basic metadata."""
    contents = await file.read()
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size_bytes": len(contents),
    }


@app.post("/recommend", response_model=RecommendResponse)
def recommend(request: RecommendRequest):
    """
    Given founder wizard answers, recommend the best entity type and state
    using the AI layer and the decision matrix.
    """
    decision_matrix = _load_decision_matrix()
    result = get_incorporation_recommendation(request.answers, decision_matrix)
    return RecommendResponse(
        entity=result.get("entity", "C-Corp"),
        state=result.get("state", "Delaware"),
        explanation=result.get("explanation", ""),
        considerations=result.get("considerations", []),
    )


@app.post("/draft-agreement", response_model=DraftAgreementResponse)
def draft_agreement_endpoint(request: DraftAgreementRequest):
    """
    Draft a service or employment agreement based on the user's answers.
    """
    if request.type not in ("service", "employment"):
        raise HTTPException(
            status_code=400,
            detail="'type' must be 'service' or 'employment'",
        )
    result = draft_agreement(request.type, request.answers)
    return DraftAgreementResponse(
        draft=result.get("draft", ""),
        summary=result.get("summary", ""),
    )


@app.post("/patent-guidance", response_model=PatentGuidanceResponse)
def patent_guidance(request: PatentGuidanceRequest):
    """
    Given a description of an invention or creative work, return IP guidance.
    """
    if not request.description.strip():
        raise HTTPException(status_code=400, detail="'description' must not be empty")
    result = get_patent_guidance(request.description)
    return PatentGuidanceResponse(
        ip_type=result.get("ip_type", "patent"),
        steps=result.get("steps", []),
        warnings=result.get("warnings", []),
    )


@app.post("/generate-termsheet", response_model=GenerateTermsheetResponse)
def generate_termsheet_endpoint(request: GenerateTermsheetRequest):
    """
    Generate a term sheet summary with plain-English clause explanations.
    """
    details = {
        "stage": request.stage,
        "amount": request.amount,
        "valuation": request.valuation,
        "investor_type": request.investor_type,
        "instrument": request.instrument,
    }
    result = generate_termsheet(details)
    raw_explanations = result.get("clause_explanations", [])
    clause_explanations = [
        ClauseExplanation(
            clause=item.get("clause", ""),
            explanation=item.get("explanation", ""),
        )
        for item in raw_explanations
        if isinstance(item, dict)
    ]
    return GenerateTermsheetResponse(
        termsheet=result.get("termsheet", ""),
        clause_explanations=clause_explanations,
    )


@app.post("/export-pdf")
def export_pdf(request: ExportPdfRequest):
    """
    Accept a title and content string, generate a clean PDF, and return it
    as a binary download.
    """
    from reportlab.lib.pagesizes import LETTER
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
    from reportlab.platypus import Frame, PageTemplate
    from reportlab.lib.enums import TA_LEFT, TA_CENTER

    INDIGO = colors.HexColor("#4F46E5")

    buffer = io.BytesIO()

    def _add_footer(canvas, doc):
        """Draw the Legal Foundry footer with page number on every page."""
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#9CA3AF"))
        page_width, _ = LETTER
        footer_text = f"Legal Foundry  |  Page {doc.page}"
        canvas.drawCentredString(page_width / 2, 0.5 * inch, footer_text)
        canvas.restoreState()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=LETTER,
        leftMargin=1.0 * inch,
        rightMargin=1.0 * inch,
        topMargin=1.0 * inch,
        bottomMargin=0.9 * inch,
        onFirstPage=_add_footer,
        onLaterPages=_add_footer,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "Legal FoundryTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=20,
        textColor=INDIGO,
        spaceAfter=16,
        alignment=TA_LEFT,
    )

    body_style = ParagraphStyle(
        "Legal FoundryBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        leading=16.5,  # 11pt * 1.5 line spacing
        spaceAfter=6,
        alignment=TA_LEFT,
    )

    story = []
    story.append(Paragraph(request.title, title_style))
    story.append(Spacer(1, 0.1 * inch))

    # Split content on newlines and emit each non-empty line as its own paragraph
    for line in request.content.splitlines():
        if line.strip():
            # Escape any HTML-like characters to avoid reportlab parse errors
            safe_line = (
                line.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
            )
            story.append(Paragraph(safe_line, body_style))
        else:
            story.append(Spacer(1, 0.08 * inch))

    doc.build(story, onFirstPage=_add_footer, onLaterPages=_add_footer)
    buffer.seek(0)

    safe_filename = request.title.replace("/", "-").replace("\\", "-")
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{safe_filename}.pdf"',
        },
    )


@app.post("/generate-filing-doc", response_model=FilingDocResponse)
def generate_filing_doc_endpoint(request: FilingDocRequest):
    """
    Generate a pre-filled Articles of Incorporation document and filing instructions.
    """
    result = generate_filing_doc(request.entity, request.state, request.form_data)
    return FilingDocResponse(
        document=result.get("document", ""),
        filing_instructions=result.get("filing_instructions", []),
        filing_url=result.get("filing_url", "https://corp.delaware.gov"),
    )


@app.post("/generate-patent-app", response_model=PatentAppResponse)
def generate_patent_app_endpoint(request: PatentAppRequest):
    """
    Generate a Provisional Patent Application and USPTO filing instructions.
    """
    result = generate_patent_app(request.guidance, request.filing_details)
    return PatentAppResponse(
        document=result.get("document", ""),
        filing_instructions=result.get("filing_instructions", []),
        filing_url=result.get("filing_url", "https://www.uspto.gov/patents/apply"),
    )


@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """
    Handle a follow-up chat message for any Legal Foundry module.
    """
    valid_modules = {"incorporation", "agreements", "patents", "fundraising"}
    if request.module not in valid_modules:
        raise HTTPException(
            status_code=400,
            detail=f"'module' must be one of: {', '.join(sorted(valid_modules))}",
        )
    history_dicts = [
        {"role": msg.role, "content": msg.content}
        for msg in (request.history or [])
    ]
    reply = chat(
        module=request.module,
        context=request.context or "",
        history=history_dicts,
        message=request.message,
    )
    return ChatResponse(reply=reply)
