from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class QuizAttemptCreate(BaseModel):
    student_id: str = Field(min_length=1, max_length=100)

    quiz_id: str = Field(min_length=1, max_length=100)

    score: float = Field(ge=0)

    total_questions: int = Field(gt=0)

    correct_answers: int = Field(ge=0)

    difficulty_level: str | None = Field(
        default=None,
        max_length=50,
    )

    answers: list[dict] | None = None


class QuizAttemptResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: str
    quiz_id: str
    score: float
    total_questions: int
    correct_answers: int
    difficulty_level: str | None
    answers: list[dict] | None
    created_at: datetime