
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ai_evaluation import AIEvaluation
from app.schemas.ai import AIRequest, AIResponse

from ai_engine.pipeline import evaluate_student
from ai_engine.questions import get_student_questions


router = APIRouter(
    prefix="/api/ai",
    tags=["AI Evaluation"]
)


@router.get("/questions")
def get_ai_questions():
    """
    Return Machine Learning questions for students.
    Correct answers are never exposed.
    """
    try:
        questions = get_student_questions(
            topic="Machine Learning"
        )

        if not questions:
            raise HTTPException(
                status_code=404,
                detail="No Machine Learning questions found."
            )

        return {
            "topic": "Machine Learning",
            "total_questions": len(questions),
            "questions": questions
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not load ML questions: {str(error)}"
        )


@router.post("/evaluate", response_model=AIResponse)
def evaluate_ai(
    request: AIRequest,
    db: Session = Depends(get_db)
):
    try:
        request_data = request.model_dump()

        # Run the actual adaptive learning engine
        result = evaluate_student(request_data)

        # Validate the engine response
        validated_result = AIResponse.model_validate(result)

        diagnostic = validated_result.diagnostic
        adaptive = validated_result.adaptive

        # Save evaluation in Supabase
        evaluation = AIEvaluation(
            student_id=validated_result.student_id,
            topic=validated_result.topic,

            total_questions=diagnostic.total_questions,
            answered_questions=diagnostic.answered_questions,
            correct_answers=diagnostic.correct_answers,
            incorrect_answers=diagnostic.incorrect_answers,
            unanswered_questions=diagnostic.unanswered_questions,

            score_percentage=diagnostic.score_percentage,
            accuracy=diagnostic.accuracy,
            learning_level=diagnostic.learning_level,

            recommended_difficulty=adaptive.recommended_difficulty,
            reason=adaptive.reason,

            personalized_recommendations=(
                validated_result.personalized_recommendations
            ),

            accessibility_support=(
                validated_result.accessibility_support.model_dump()
            )
        )

        db.add(evaluation)
        db.commit()

        return validated_result

    except Exception as error:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"AI evaluation failed: {str(error)}"
        )
