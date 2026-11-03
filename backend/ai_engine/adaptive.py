
# ai_engine/adaptive.py

"""
Adaptive Learning Engine - Phase 3

This module:
1. Determines initial difficulty from diagnostic results.
2. Adapts difficulty using recent practice performance.
3. Returns structured adaptive results for backend integration.

No GPU or ML model is required.
"""

from typing import Any, Optional

from ai_engine.difficulty import (
    calculate_learning_level,
    get_difficulty,
)


# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------

DIFFICULTIES = ["Easy", "Medium", "Hard"]

MIN_ANSWERS_FOR_ADAPTATION = 5

INCREASE_THRESHOLD = 80.0
DECREASE_THRESHOLD = 40.0


# ---------------------------------------------------------
# 1. GET INITIAL DIFFICULTY
# ---------------------------------------------------------

def get_initial_difficulty(
    learning_level: str,
) -> str:
    """
    Convert learning level into starting difficulty.

    Beginner     -> Easy
    Intermediate -> Medium
    Advanced     -> Hard
    """

    valid_levels = {
        "Beginner",
        "Intermediate",
        "Advanced",
    }

    if not isinstance(learning_level, str):
        raise ValueError(
            "Learning level must be a string."
        )

    learning_level = learning_level.strip().title()

    if learning_level not in valid_levels:
        raise ValueError(
            "Learning level must be Beginner, "
            "Intermediate or Advanced."
        )

    return get_difficulty(learning_level)


# ---------------------------------------------------------
# 2. GET DIFFICULTY FROM DIAGNOSTIC SCORE
# ---------------------------------------------------------

def get_difficulty_from_score(
    score_percentage: float,
) -> dict[str, Any]:
    """
    Determine learning level and difficulty from score.

    Thresholds:
        0-40%   -> Beginner / Easy
        >40-70% -> Intermediate / Medium
        >70%    -> Advanced / Hard
    """

    if isinstance(score_percentage, bool) or not isinstance(
        score_percentage, (int, float)
    ):
        raise ValueError(
            "Score percentage must be a number."
        )

    if not 0 <= score_percentage <= 100:
        raise ValueError(
            "Score percentage must be between 0 and 100."
        )

    learning_level = calculate_learning_level(
        score_percentage
    )

    recommended_difficulty = get_difficulty(
        learning_level
    )

    return {
        "score_percentage": round(
            float(score_percentage), 2
        ),
        "learning_level": learning_level,
        "recommended_difficulty": recommended_difficulty,
        "reason": (
            f"{learning_level} learning level "
            f"based on {score_percentage}% diagnostic score."
        ),
    }


# ---------------------------------------------------------
# 3. ADAPT DIFFICULTY FROM RECENT ANSWERS
# ---------------------------------------------------------

def adapt_difficulty(
    current_difficulty: str,
    recent_answers: list[bool],
    min_answers: int = MIN_ANSWERS_FOR_ADAPTATION,
) -> dict[str, Any]:
    """
    Adapt difficulty using recent practice answers.

    recent_answers:
        True  = correct answer
        False = incorrect answer

    Rules:
        Accuracy >= 80% -> Increase difficulty
        Accuracy <= 40% -> Decrease difficulty
        Otherwise      -> Maintain difficulty

    Adaptation happens only after min_answers responses.
    """

    # Validate difficulty
    if not isinstance(current_difficulty, str):
        raise ValueError(
            "Current difficulty must be a string."
        )

    current_difficulty = current_difficulty.strip().title()

    if current_difficulty not in DIFFICULTIES:
        raise ValueError(
            "Difficulty must be Easy, Medium or Hard."
        )

    # Validate recent answers
    if not isinstance(recent_answers, list):
        raise ValueError(
            "Recent answers must be a list."
        )

    for answer in recent_answers:
        if not isinstance(answer, bool):
            raise ValueError(
                "Recent answers must contain only True or False."
            )

    # Validate minimum answer count
    if (
        not isinstance(min_answers, int)
        or isinstance(min_answers, bool)
        or min_answers <= 0
    ):
        raise ValueError(
            "min_answers must be a positive integer."
        )

    # Maintain difficulty until enough answers exist
    if len(recent_answers) < min_answers:

        return {
            "current_difficulty": current_difficulty,
            "next_difficulty": current_difficulty,
            "recent_accuracy": None,
            "answers_considered": len(recent_answers),
            "adapted": False,
            "reason": (
                f"Need at least {min_answers} practice answers "
                "before adapting difficulty."
            ),
        }

    # Calculate recent accuracy
    correct_count = sum(recent_answers)

    recent_accuracy = (
        correct_count / len(recent_answers)
    ) * 100

    current_index = DIFFICULTIES.index(
        current_difficulty
    )

    next_index = current_index

    reason = "Performance is balanced. Maintain difficulty."

    # Increase difficulty
    if recent_accuracy >= INCREASE_THRESHOLD:

        next_index = min(
            current_index + 1,
            len(DIFFICULTIES) - 1,
        )

        if next_index > current_index:
            reason = (
                "Strong recent performance. "
                "Increase difficulty."
            )
        else:
            reason = (
                "Already at Hard difficulty. "
                "Maintain difficulty."
            )

    # Decrease difficulty
    elif recent_accuracy <= DECREASE_THRESHOLD:

        next_index = max(
            current_index - 1,
            0,
        )

        if next_index < current_index:
            reason = (
                "Student is struggling. "
                "Decrease difficulty."
            )
        else:
            reason = (
                "Already at Easy difficulty. "
                "Maintain difficulty."
            )

    next_difficulty = DIFFICULTIES[next_index]

    adapted = (
        next_difficulty != current_difficulty
    )

    return {
        "current_difficulty": current_difficulty,
        "next_difficulty": next_difficulty,
        "recent_accuracy": round(
            recent_accuracy, 2
        ),
        "answers_considered": len(recent_answers),
        "adapted": adapted,
        "reason": reason,
    }


# ---------------------------------------------------------
# 4. GET ADAPTIVE RESULT FROM DIAGNOSTIC
# ---------------------------------------------------------

def get_adaptive_result(
    diagnostic_result: dict[str, Any],
    recent_answers: Optional[list[bool]] = None,
) -> dict[str, Any]:
    """
    Generate adaptive result from diagnostic output.

    This function is suitable for direct backend integration.

    diagnostic_result:
        Output returned by evaluate_diagnostic().

    recent_answers:
        Optional recent practice answers.
        True = correct, False = incorrect.
    """

    if not isinstance(diagnostic_result, dict):
        raise ValueError(
            "Diagnostic result must be a dictionary."
        )

    if "score_percentage" not in diagnostic_result:
        raise ValueError(
            "Diagnostic result missing score_percentage."
        )

    if "learning_level" not in diagnostic_result:
        raise ValueError(
            "Diagnostic result missing learning_level."
        )

    score_percentage = diagnostic_result[
        "score_percentage"
    ]

    # Recalculate level and difficulty from score
    score_result = get_difficulty_from_score(
        score_percentage
    )

    learning_level = score_result["learning_level"]

    # Check diagnostic learning level consistency
    supplied_level = diagnostic_result[
        "learning_level"
    ]

    if supplied_level != learning_level:
        raise ValueError(
            "Diagnostic learning level does not match "
            "the score percentage."
        )

    initial_difficulty = score_result[
        "recommended_difficulty"
    ]

    # Without practice history, use initial difficulty
    if recent_answers is None:

        return {
            "learning_level": learning_level,
            "recommended_difficulty": initial_difficulty,
            "reason": score_result["reason"],
            "recent_accuracy": None,
            "adapted": False,
        }

    # Adapt using practice performance
    adaptation_result = adapt_difficulty(
        current_difficulty=initial_difficulty,
        recent_answers=recent_answers,
    )

    return {
        "learning_level": learning_level,
        "recommended_difficulty": adaptation_result[
            "next_difficulty"
        ],
        "reason": adaptation_result["reason"],
        "recent_accuracy": adaptation_result[
            "recent_accuracy"
        ],
        "adapted": adaptation_result["adapted"],
    }
