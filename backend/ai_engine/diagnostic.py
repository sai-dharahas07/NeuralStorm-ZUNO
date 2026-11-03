
# ai_engine/diagnostic.py

from typing import Any

from ai_engine.questions import (
    get_student_questions,
    get_correct_answer,
)

from ai_engine.difficulty import (
    calculate_learning_level,
    get_difficulty,
)

from ai_engine.recommendations import (
    get_recommendations,
)


# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------

DIAGNOSTIC_TOPIC = "Machine Learning"

VALID_ANSWERS = {"A", "B", "C", "D"}


# ---------------------------------------------------------
# 1. GENERATE DIAGNOSTIC QUESTIONS
# ---------------------------------------------------------

def generate_diagnostic_questions(
    topic: str = DIAGNOSTIC_TOPIC,
) -> list[dict[str, Any]]:
    """
    Return diagnostic questions without exposing correct answers.
    """

    questions = get_student_questions(topic=topic)

    if not questions:
        raise ValueError(
            f"No diagnostic questions found for topic: {topic}"
        )

    return questions


# ---------------------------------------------------------
# 2. CALCULATE DIAGNOSTIC SCORE
# ---------------------------------------------------------

def calculate_diagnostic_score(
    correct_answers: int,
    total_questions: int,
) -> dict[str, float]:
    """
    Calculate diagnostic score and accuracy.

    Returns:
        {
            "score_percentage": float,
            "accuracy": float
        }
    """

    if not isinstance(total_questions, int) or isinstance(total_questions, bool):
        raise ValueError("Total questions must be an integer.")

    if not isinstance(correct_answers, int) or isinstance(correct_answers, bool):
        raise ValueError("Correct answers must be an integer.")

    if total_questions <= 0:
        raise ValueError(
            "Total questions must be greater than zero."
        )

    if correct_answers < 0:
        raise ValueError(
            "Correct answers cannot be negative."
        )

    if correct_answers > total_questions:
        raise ValueError(
            "Correct answers cannot exceed total questions."
        )

    score_percentage = (
        correct_answers / total_questions
    ) * 100

    return {
        "score_percentage": round(score_percentage, 2),
        "accuracy": round(score_percentage, 2),
    }


# ---------------------------------------------------------
# 3. EVALUATE STUDENT ANSWERS
# ---------------------------------------------------------

def evaluate_diagnostic(
    answers: dict[str, str],
    topic: str = DIAGNOSTIC_TOPIC,
) -> dict[str, Any]:
    """
    Evaluate diagnostic quiz answers.

    Example:
        {
            "ml_001": "A",
            "ml_002": "B",
            "ml_003": "C"
        }

    Missing answers are counted as unanswered.
    Wrong answers are counted as incorrect.

    Correct answers are retrieved securely from
    the question bank and never exposed to students.
    """

    # Validate input type
    if not isinstance(answers, dict):
        raise ValueError(
            "Answers must be a dictionary."
        )

    # Load questions without exposing answer keys
    questions = get_student_questions(topic=topic)

    if not questions:
        raise ValueError(
            f"No questions available for topic: {topic}"
        )

    # Get all valid question IDs
    valid_question_ids = {
        question["id"]
        for question in questions
    }

    # Validate question IDs
    unknown_ids = set(answers.keys()) - valid_question_ids

    if unknown_ids:
        raise ValueError(
            f"Unknown question IDs: {sorted(unknown_ids)}"
        )

    # Normalize and validate answers
    normalized_answers: dict[str, str] = {}

    for question_id, answer in answers.items():

        if not isinstance(question_id, str):
            raise ValueError(
                "Question IDs must be strings."
            )

        if not isinstance(answer, str):
            raise ValueError(
                f"Answer for {question_id} must be a string."
            )

        normalized_answer = answer.strip().upper()

        if normalized_answer not in VALID_ANSWERS:
            raise ValueError(
                f"Invalid answer for {question_id}. "
                "Choose A, B, C or D."
            )

        normalized_answers[question_id] = normalized_answer

    # Initialize counters
    total_questions = len(questions)

    correct_count = 0
    incorrect_count = 0
    unanswered_count = 0

    question_results = []

    # Evaluate all questions in the question bank
    for question in questions:

        question_id = question["id"]

        student_answer = normalized_answers.get(
            question_id
        )

        # Retrieve correct answer from private answer key
        correct_answer = get_correct_answer(
            question_id
        )

        if correct_answer is None:
            raise ValueError(
                f"Correct answer missing for question: {question_id}"
            )

        correct_answer = correct_answer.strip().upper()

        if correct_answer not in VALID_ANSWERS:
            raise ValueError(
                f"Invalid answer key for question: {question_id}"
            )

        # Evaluate student answer
        if student_answer is None:

            unanswered_count += 1
            is_correct = False

        elif student_answer == correct_answer:

            correct_count += 1
            is_correct = True

        else:

            incorrect_count += 1
            is_correct = False

        # Store individual question result
        question_results.append(
            {
                "question_id": question_id,
                "student_answer": student_answer,
                "is_correct": is_correct,
            }
        )

    # Calculate score
    score_data = calculate_diagnostic_score(
        correct_answers=correct_count,
        total_questions=total_questions,
    )

    score_percentage = score_data["score_percentage"]

    # Determine learning level
    learning_level = calculate_learning_level(
        score_percentage
    )

    # Determine recommended difficulty
    recommended_difficulty = get_difficulty(
        learning_level
    )

    # Get basic recommendations
    recommendations = get_recommendations(
        learning_level
    )

    # Return diagnostic result
    return {
        "topic": topic,
        "total_questions": total_questions,
        "answered_questions": len(normalized_answers),
        "correct_answers": correct_count,
        "incorrect_answers": incorrect_count,
        "unanswered_questions": unanswered_count,
        "score_percentage": score_percentage,
        "accuracy": score_data["accuracy"],
        "learning_level": learning_level,
        "recommended_difficulty": recommended_difficulty,
        "recommendations": recommendations,
        "question_results": question_results,
    }


# ---------------------------------------------------------
# 4. GET DIAGNOSTIC RESULT
# ---------------------------------------------------------

def get_diagnostic_result(
    answers: dict[str, str],
    topic: str = DIAGNOSTIC_TOPIC,
) -> dict[str, Any]:
    """
    Public function for obtaining diagnostic results.

    This function can be imported directly by FastAPI.
    """

    return evaluate_diagnostic(
        answers=answers,
        topic=topic,
    )
