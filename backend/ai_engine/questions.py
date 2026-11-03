
# ai_engine/questions.py

import json
from pathlib import Path
from typing import Any


# Project root directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Question bank location
QUESTION_BANK_PATH = PROJECT_ROOT / "data" / "questions.json"

# Valid question difficulties
VALID_DIFFICULTIES = {"easy", "medium", "hard"}

# Valid answer options
VALID_OPTIONS = {"A", "B", "C", "D"}


def load_questions() -> list[dict[str, Any]]:
    """
    Load and validate all questions from questions.json.

    Returns:
        List of validated question dictionaries.

    Raises:
        FileNotFoundError: If the question bank is missing.
        ValueError: If the question bank contains invalid data.
    """

    if not QUESTION_BANK_PATH.exists():
        raise FileNotFoundError(
            f"Question bank not found: {QUESTION_BANK_PATH}"
        )

    try:
        with QUESTION_BANK_PATH.open("r", encoding="utf-8") as file:
            questions = json.load(file)
    except json.JSONDecodeError as error:
        raise ValueError(
            "questions.json contains invalid JSON."
        ) from error

    if not isinstance(questions, list):
        raise ValueError(
            "Question bank must contain a JSON list."
        )

    if not questions:
        raise ValueError("Question bank cannot be empty.")

    seen_ids = set()

    for question in questions:

        if not isinstance(question, dict):
            raise ValueError(
                "Every question must be a JSON object."
            )

        required_fields = {
            "id",
            "topic",
            "difficulty",
            "question",
            "options",
            "correct_answer",
        }

        missing_fields = required_fields - question.keys()

        if missing_fields:
            raise ValueError(
                f"Question is missing fields: {missing_fields}"
            )

        question_id = question["id"]

        if not isinstance(question_id, str) or not question_id.strip():
            raise ValueError("Question ID must be a non-empty string.")

        if question_id in seen_ids:
            raise ValueError(f"Duplicate question ID: {question_id}")

        seen_ids.add(question_id)

        if not isinstance(question["topic"], str) or not question["topic"].strip():
            raise ValueError(f"Invalid topic in {question_id}")

        if not isinstance(question["question"], str) or not question["question"].strip():
            raise ValueError(f"Invalid question text in {question_id}")

        difficulty = question["difficulty"]

        if difficulty not in VALID_DIFFICULTIES:
            raise ValueError(
                f"Invalid difficulty in {question_id}: {difficulty}"
            )

        options = question["options"]

        if not isinstance(options, dict) or set(options.keys()) != VALID_OPTIONS:
            raise ValueError(
                f"{question_id} must have options A, B, C and D."
            )

        if not all(
            isinstance(value, str) and value.strip()
            for value in options.values()
        ):
            raise ValueError(f"Invalid option text in {question_id}")

        correct_answer = question["correct_answer"]

        if correct_answer not in VALID_OPTIONS:
            raise ValueError(
                f"Invalid correct answer in {question_id}"
            )

    return questions


def get_student_questions(
    topic: str | None = None,
    difficulty: str | None = None,
) -> list[dict[str, Any]]:
    """
    Return questions safe for students.

    Correct answers are removed before returning.

    Optional filters:
        topic: Filter by topic.
        difficulty: Filter by difficulty.
    """

    questions = load_questions()

    if topic is not None:
        questions = [
            question
            for question in questions
            if question["topic"].casefold() == topic.casefold()
        ]

    if difficulty is not None:
        if difficulty not in VALID_DIFFICULTIES:
            raise ValueError(
                f"Invalid difficulty: {difficulty}"
            )

        questions = [
            question
            for question in questions
            if question["difficulty"] == difficulty
        ]

    # Remove correct answers from student-facing data
    student_questions = []

    for question in questions:
        safe_question = {
            "id": question["id"],
            "topic": question["topic"],
            "difficulty": question["difficulty"],
            "question": question["question"],
            "options": question["options"].copy(),
        }

        student_questions.append(safe_question)

    return student_questions


def get_correct_answer(question_id: str) -> str:
    """
    Retrieve the correct answer internally for scoring.

    Never expose this function's output directly to students.
    """

    questions = load_questions()

    for question in questions:
        if question["id"] == question_id:
            return question["correct_answer"]

    raise ValueError(
        f"Question ID not found: {question_id}"
    )


def get_question_by_id(
    question_id: str,
    include_answer: bool = False,
) -> dict[str, Any]:
    """
    Retrieve one question.

    By default, correct answers are excluded.
    """

    questions = load_questions()

    for question in questions:
        if question["id"] == question_id:

            result = {
                "id": question["id"],
                "topic": question["topic"],
                "difficulty": question["difficulty"],
                "question": question["question"],
                "options": question["options"].copy(),
            }

            if include_answer:
                result["correct_answer"] = question["correct_answer"]

            return result

    raise ValueError(
        f"Question ID not found: {question_id}"
    )


def get_question_count() -> int:
    """
    Return the total number of questions in the bank.
    """

    return len(load_questions())


def get_questions_by_difficulty() -> dict[str, int]:
    """
    Return question counts grouped by difficulty.
    """

    questions = load_questions()

    counts = {
        "easy": 0,
        "medium": 0,
        "hard": 0,
    }

    for question in questions:
        counts[question["difficulty"]] += 1

    return counts
