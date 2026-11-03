from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    Integer,
    JSON,
    String,
)

from app.database import Base


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(String(100), nullable=False, index=True)

    quiz_id = Column(String(100), nullable=False)

    score = Column(Float, nullable=False)

    total_questions = Column(Integer, nullable=False)

    correct_answers = Column(Integer, nullable=False)

    difficulty_level = Column(
        String(50),
        nullable=True,
    )

    answers = Column(JSON, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )