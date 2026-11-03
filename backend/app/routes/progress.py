
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.quiz_attempt import QuizAttempt
from app.schemas.progress import StudentProgressResponse


router = APIRouter(
    prefix="/api/v1/students",
    tags=["Student Progress"]
)


@router.get(
    "/{student_id}/progress",
    response_model=StudentProgressResponse
)
def get_student_progress(
    student_id: str,
    db: Session = Depends(get_db)
):
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.student_id == student_id)
        .order_by(QuizAttempt.created_at.desc())
        .all()
    )

    total_quizzes = len(attempts)

    total_questions = sum(
        attempt.total_questions for attempt in attempts
    )

    total_correct = sum(
        attempt.correct_answers for attempt in attempts
    )

    average_score = (
        sum(attempt.score for attempt in attempts) / total_quizzes
        if total_quizzes > 0
        else 0.0
    )

    overall_accuracy = (
        (total_correct / total_questions) * 100
        if total_questions > 0
        else 0.0
    )

    latest_attempt = attempts[0] if attempts else None

    return StudentProgressResponse(
        student_id=student_id,
        total_quizzes_attempted=total_quizzes,
        total_questions_answered=total_questions,
        total_correct_answers=total_correct,
        average_score=round(average_score, 2),
        overall_accuracy=round(overall_accuracy, 2),
        latest_difficulty_level=(
            latest_attempt.difficulty_level if latest_attempt else None
        ),
        last_attempt_at=(
            latest_attempt.created_at if latest_attempt else None
        )
    )
