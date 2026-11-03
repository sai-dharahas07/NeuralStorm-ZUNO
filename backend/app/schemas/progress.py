
from datetime import datetime
from pydantic import BaseModel


class StudentProgressResponse(BaseModel):
    student_id: str
    total_quizzes_attempted: int
    total_questions_answered: int
    total_correct_answers: int
    average_score: float
    overall_accuracy: float
    latest_difficulty_level: str | None
    last_attempt_at: datetime | None
