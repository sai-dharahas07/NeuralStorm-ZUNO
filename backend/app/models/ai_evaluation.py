
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    JSON,
    func,
)

from app.database import Base


class AIEvaluation(Base):
    __tablename__ = "ai_evaluations"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Student information
    student_id = Column(String(100), nullable=False, index=True)
    topic = Column(String(200), nullable=False)

    # Diagnostic results
    total_questions = Column(Integer, nullable=False)
    answered_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    incorrect_answers = Column(Integer, nullable=False)
    unanswered_questions = Column(Integer, nullable=False)

    score_percentage = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=False)
    learning_level = Column(String(50), nullable=False)

    # Adaptive learning results
    recommended_difficulty = Column(String(50), nullable=False)
    reason = Column(String, nullable=True)

    # Personalized recommendations
    personalized_recommendations = Column(
        JSON,
        nullable=False,
        default=list,
    )

    # Accessibility configuration
    accessibility_support = Column(
        JSON,
        nullable=False,
        default=dict,
    )

    # Evaluation timestamp
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
