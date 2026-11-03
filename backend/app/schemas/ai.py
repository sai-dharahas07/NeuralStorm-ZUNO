
from typing import Any

from pydantic import BaseModel, Field


# -----------------------------
# AI REQUEST SCHEMAS
# -----------------------------

class AILearningPreferences(BaseModel):
    preferred_format: str = Field(
        description="visual, text, or audio"
    )
    preferred_pace: str = Field(
        description="slow, normal, or fast"
    )
    language: str


class AIAccessibilityRequirements(BaseModel):
    disability_type: list[str] = Field(default_factory=list)
    needs_simplified_text: bool
    needs_audio_support: bool
    needs_high_contrast: bool


class AIRequest(BaseModel):
    student_id: str = Field(min_length=1, max_length=100)
    topic: str = Field(min_length=1, max_length=200)

    # Question ID -> selected option (A/B/C/D)
    quiz_answers: dict[str, str]

    learning_preferences: AILearningPreferences
    accessibility: AIAccessibilityRequirements


# -----------------------------
# AI RESPONSE SCHEMAS
# -----------------------------

class AIDiagnosticResult(BaseModel):
    total_questions: int
    answered_questions: int
    correct_answers: int
    incorrect_answers: int
    unanswered_questions: int

    score_percentage: float
    accuracy: float
    learning_level: str


class AIAdaptiveResult(BaseModel):
    recommended_difficulty: str
    reason: str


class AIAccessibilitySupport(BaseModel):
    # Keep values flexible until we inspect the
    # actual accessibility module implementation.
    simplified_text: Any
    audio_support: Any
    high_contrast: Any
    clear_formatting: Any


class AIResponse(BaseModel):
    success: bool
    student_id: str
    topic: str

    diagnostic: AIDiagnosticResult
    adaptive: AIAdaptiveResult

    personalized_recommendations: list[str]
    accessibility_support: AIAccessibilitySupport
