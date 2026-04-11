import json
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional

from ai import (
    get_incorporation_recommendation,
    draft_agreement,
    get_patent_guidance,
    generate_termsheet,
    chat,
)

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="StartStack API",
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
    amount: float = Field(..., description="Investment amount in USD")
    valuation: float = Field(..., description="Pre-money valuation in USD")
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


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health")
def health_check():
    """Basic health check endpoint."""
    return {"status": "ok", "service": "StartStack API"}


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
    details = request.model_dump()
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


@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """
    Handle a follow-up chat message for any StartStack module.
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
