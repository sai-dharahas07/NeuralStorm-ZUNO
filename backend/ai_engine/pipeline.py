
# ai_engine/pipeline.py

"""
Complete AI Integration Pipeline - Phase 6.

Connects:
    questions.py
    diagnostic.py
    difficulty.py
    adaptive.py
    recommender.py
    accessibility.py

This module does not run a web server.
FastAPI imports evaluate_student().
"""

from typing import Any, Optional

from ai_engine.diagnostic import evaluate_diagnostic
from ai_engine.adaptive import get_adaptive_result
from ai_engine.recommender import get_personalized_recommendations


# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------

SUPPORTED_TOPIC = "Machine Learning"


# ---------------------------------------------------------
# 1. VALIDATE STUDENT REQUEST
# ---------------------------------------------------------

def validate_student_request(
    request_data: dict[str, Any],
) -> dict[str, Any]:
    """
    Validate and normalize the complete student request.
    """

    if not isinstance(request_data, dict):
        raise ValueError(
            "Student request must be a dictionary."
        )

    student_id = request_data.get("student_id")

    if not isinstance(student_id, str) or not student_id.strip():
        raise ValueError(
            "student_id must be a non-empty string."
        )

    topic = request_data.get(
        "topic", SUPPORTED_TOPIC
    )

    if not isinstance(topic, str) or not topic.strip():
        raise ValueError(
            "topic must be a non-empty string."
        )

    topic = topic.strip()

    if topic != SUPPORTED_TOPIC:
        raise ValueError(
            f"Unsupported topic: {topic}. "
            f"Currently supported: {SUPPORTED_TOPIC}."
        )

    quiz_answers = request_data.get(
        "quiz_answers", {}
    )

    if not isinstance(quiz_answers, dict):
        raise ValueError(
            "quiz_answers must be a dictionary."
        )

    learning_preferences = request_data.get(
        "learning_preferences", {}
    )

    if not isinstance(learning_preferences, dict):
        raise ValueError(
            "learning_preferences must be a dictionary."
        )

    accessibility = request_data.get(
        "accessibility", {}
    )

    if not isinstance(accessibility, dict):
        raise ValueError(
            "accessibility must be a dictionary."
        )

    return {
        "student_id": student_id.strip(),
        "topic": topic,
        "quiz_answers": quiz_answers.copy(),
        "learning_preferences": learning_preferences.copy(),
        "accessibility": accessibility.copy(),
    }


# ---------------------------------------------------------
# 2. EVALUATE STUDENT
# ---------------------------------------------------------

def evaluate_student(
    request_data: dict[str, Any],
    recent_answers: Optional[list[bool]] = None,
) -> dict[str, Any]:
    """
    Complete AI evaluation for one student.

    Input:
        request_data:
            student_id
            topic
            quiz_answers
            learning_preferences
            accessibility

        recent_answers:
            Optional practice history.
            True = correct.
            False = incorrect.

    Returns:
        Complete response compatible with
        POST /api/ai/evaluate.
    """

    # Validate request
    request = validate_student_request(
        request_data
    )

    # ---------------------------------------------
    # STEP 1: Diagnostic evaluation
    # ---------------------------------------------

    diagnostic_result = evaluate_diagnostic(
        answers=request["quiz_answers"],
        topic=request["topic"],
    )

    # ---------------------------------------------
    # STEP 2: Adaptive difficulty
    # ---------------------------------------------

    adaptive_result = get_adaptive_result(
        diagnostic_result=diagnostic_result,
        recent_answers=recent_answers,
    )

    # ---------------------------------------------
    # STEP 3: Personalized recommendations
    # ---------------------------------------------

    recommendation_result = (
        get_personalized_recommendations(
            learning_level=diagnostic_result[
                "learning_level"
            ],
            learning_preferences=request[
                "learning_preferences"
            ],
            accessibility=request["accessibility"],
        )
    )

    # ---------------------------------------------
    # STEP 4: Build API response
    # ---------------------------------------------

    return {
        "success": True,
        "student_id": request["student_id"],
        "topic": request["topic"],

        "diagnostic": {
            "total_questions": diagnostic_result[
                "total_questions"
            ],
            "answered_questions": diagnostic_result[
                "answered_questions"
            ],
            "correct_answers": diagnostic_result[
                "correct_answers"
            ],
            "incorrect_answers": diagnostic_result[
                "incorrect_answers"
            ],
            "unanswered_questions": diagnostic_result[
                "unanswered_questions"
            ],
            "score_percentage": diagnostic_result[
                "score_percentage"
            ],
            "accuracy": diagnostic_result[
                "accuracy"
            ],
            "learning_level": diagnostic_result[
                "learning_level"
            ],
        },

        "adaptive": {
            "recommended_difficulty": adaptive_result[
                "recommended_difficulty"
            ],
            "reason": adaptive_result["reason"],
        },

        "personalized_recommendations": (
            recommendation_result["recommendations"]
        ),

        "accessibility_support": (
            recommendation_result["accessibility_support"]
        ),
    }
