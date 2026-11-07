
# ai_engine/recommender.py

"""
Personalized Learning Recommendation Engine - Phase 4

Generates learning recommendations using:
- Learning level
- Learning preferences
- Accessibility preferences

CPU-only and rule-based.
"""

from typing import Any


# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------

VALID_LEARNING_LEVELS = {
    "Beginner",
    "Intermediate",
    "Advanced",
}

VALID_FORMATS = {
    "visual",
    "text",
    "audio",
}

VALID_PACES = {
    "slow",
    "normal",
    "fast",
}


# ---------------------------------------------------------
# 1. VALIDATE LEARNING LEVEL
# ---------------------------------------------------------

def validate_learning_level(
    learning_level: str,
) -> str:
    """
    Validate and normalize learning level.
    """

    if not isinstance(learning_level, str):
        raise ValueError(
            "Learning level must be a string."
        )

    normalized = learning_level.strip().title()

    if normalized not in VALID_LEARNING_LEVELS:
        raise ValueError(
            "Learning level must be Beginner, "
            "Intermediate or Advanced."
        )

    return normalized


# ---------------------------------------------------------
# 2. VALIDATE LEARNING PREFERENCES
# ---------------------------------------------------------

def validate_learning_preferences(
    learning_preferences: dict[str, Any],
) -> dict[str, Any]:
    """
    Validate learning preferences.

    Supported:
        preferred_format: visual / text / audio
        preferred_pace: slow / normal / fast
        language: string
    """

    if not isinstance(learning_preferences, dict):
        raise ValueError(
            "Learning preferences must be a dictionary."
        )

    preferred_format = learning_preferences.get(
        "preferred_format", "text"
    )

    preferred_pace = learning_preferences.get(
        "preferred_pace", "normal"
    )

    language = learning_preferences.get(
        "language", "English"
    )

    if not isinstance(preferred_format, str):
        raise ValueError(
            "Preferred format must be a string."
        )

    preferred_format = preferred_format.strip().lower()

    if preferred_format not in VALID_FORMATS:
        raise ValueError(
            "Preferred format must be visual, text or audio."
        )

    if not isinstance(preferred_pace, str):
        raise ValueError(
            "Preferred pace must be a string."
        )

    preferred_pace = preferred_pace.strip().lower()

    if preferred_pace not in VALID_PACES:
        raise ValueError(
            "Preferred pace must be slow, normal or fast."
        )

    if not isinstance(language, str):
        raise ValueError(
            "Language must be a string."
        )

    language = language.strip()

    if not language:
        raise ValueError(
            "Language cannot be empty."
        )

    return {
        "preferred_format": preferred_format,
        "preferred_pace": preferred_pace,
        "language": language,
    }


# ---------------------------------------------------------
# 3. GENERATE LEVEL-BASED RECOMMENDATIONS
# ---------------------------------------------------------

def get_level_recommendations(
    learning_level: str,
) -> list[str]:
    """
    Return recommendations according to learning level.
    """

    recommendations = {
        "Beginner": [
            "Start with foundational concepts.",
            "Use simple explanations and guided examples.",
            "Practice Easy-level questions before progressing.",
            "Break complex topics into smaller learning steps.",
        ],
        "Intermediate": [
            "Practice Medium-level questions.",
            "Use worked examples to strengthen understanding.",
            "Review concepts where mistakes occur.",
            "Combine theory with practical exercises.",
        ],
        "Advanced": [
            "Practice Hard-level questions.",
            "Solve challenging real-world problems.",
            "Explore advanced concepts and applications.",
            "Use independent problem-solving exercises.",
        ],
    }

    return recommendations[learning_level].copy()


# ---------------------------------------------------------
# 4. GENERATE FORMAT-BASED RECOMMENDATIONS
# ---------------------------------------------------------

def get_format_recommendations(
    preferred_format: str,
) -> list[str]:
    """
    Return recommendations according to preferred format.
    """

    recommendations = {
        "visual": [
            "Use diagrams, charts and visual explanations.",
            "Study concepts using visual examples.",
        ],
        "text": [
            "Use structured text explanations.",
            "Review important concepts using written summaries.",
        ],
        "audio": [
            "Use audio explanations when available.",
            "Review concepts through spoken learning material.",
        ],
    }

    return recommendations[preferred_format].copy()


# ---------------------------------------------------------
# 5. GENERATE PACE-BASED RECOMMENDATIONS
# ---------------------------------------------------------

def get_pace_recommendations(
    preferred_pace: str,
) -> list[str]:
    """
    Return recommendations according to preferred pace.
    """

    recommendations = {
        "slow": [
            "Allow additional time for each learning activity.",
            "Use step-by-step explanations.",
            "Include short breaks between learning sessions.",
        ],
        "normal": [
            "Follow a balanced learning schedule.",
            "Alternate explanations with practice questions.",
        ],
        "fast": [
            "Use shorter review sessions.",
            "Progress to the next activity after demonstrating understanding.",
        ],
    }

    return recommendations[preferred_pace].copy()


# ---------------------------------------------------------
# 6. ACCESSIBILITY SUPPORT
# ---------------------------------------------------------

def get_accessibility_support(
    accessibility: dict[str, Any],
) -> dict[str, bool]:
    """
    Generate accessibility support settings.

    Returns all four required fields:
        simplified_text
        audio_support
        high_contrast
        clear_formatting

    These are support recommendations/settings, not
    a diagnosis of the student's disability.
    """

    if not isinstance(accessibility, dict):
        raise ValueError(
            "Accessibility must be a dictionary."
        )

    simplified_text = accessibility.get(
        "needs_simplified_text", False
    )

    audio_support = accessibility.get(
        "needs_audio_support", False
    )

    high_contrast = accessibility.get(
        "needs_high_contrast", False
    )

    disability_types = accessibility.get(
        "disability_type", []
    )

    # Validate boolean settings
    boolean_settings = {
        "needs_simplified_text": simplified_text,
        "needs_audio_support": audio_support,
        "needs_high_contrast": high_contrast,
    }

    for setting_name, setting_value in boolean_settings.items():

        if not isinstance(setting_value, bool):
            raise ValueError(
                f"{setting_name} must be a boolean."
            )

    # Validate disability types
    if not isinstance(disability_types, list):
        raise ValueError(
            "disability_type must be a list."
        )

    for disability in disability_types:

        if not isinstance(disability, str):
            raise ValueError(
                "Disability types must be strings."
            )

    normalized_disabilities = {
        disability.strip().lower()
        for disability in disability_types
    }

    # Optional automatic support recommendations
    if normalized_disabilities.intersection(
        {"dyslexia", "learning disability"}
    ):
        simplified_text = True

    if normalized_disabilities.intersection(
        {"visual impairment", "low vision"}
    ):
        high_contrast = True

    if normalized_disabilities.intersection(
        {"blindness", "visual impairment"}
    ):
        audio_support = True

    # Clear formatting is useful for all students
    clear_formatting = True

    return {
        "simplified_text": simplified_text,
        "audio_support": audio_support,
        "high_contrast": high_contrast,
        "clear_formatting": clear_formatting,
    }


# ---------------------------------------------------------
# 7. MAIN PERSONALIZED RECOMMENDATION FUNCTION
# ---------------------------------------------------------

def get_personalized_recommendations(
    learning_level: str,
    learning_preferences: dict,
    accessibility: dict,
) -> dict[str, Any]:
    """
    Generate personalized learning recommendations.

    Exact backend integration signature:

        get_personalized_recommendations(
            learning_level: str,
            learning_preferences: dict,
            accessibility: dict
        ) -> dict

    Returns:
        {
            "recommendations": list[str],
            "accessibility_support": {
                "simplified_text": bool,
                "audio_support": bool,
                "high_contrast": bool,
                "clear_formatting": bool
            }
        }
    """

    # Validate inputs
    learning_level = validate_learning_level(
        learning_level
    )

    preferences = validate_learning_preferences(
        learning_preferences
    )

    # Generate level-based recommendations
    recommendations = get_level_recommendations(
        learning_level
    )

    # Add format recommendations
    recommendations.extend(
        get_format_recommendations(
            preferences["preferred_format"]
        )
    )

    # Add pace recommendations
    recommendations.extend(
        get_pace_recommendations(
            preferences["preferred_pace"]
        )
    )

    # Add language preference
    recommendations.append(
        f"Provide learning materials in "
        f"{preferences['language']} when available."
    )

    # Generate accessibility support
    accessibility_support = get_accessibility_support(
        accessibility
    )

    # Add accessibility recommendations
    if accessibility_support["simplified_text"]:
        recommendations.append(
            "Use simplified text and clear explanations."
        )

    if accessibility_support["audio_support"]:
        recommendations.append(
            "Enable audio support for learning materials."
        )

    if accessibility_support["high_contrast"]:
        recommendations.append(
            "Enable high-contrast display settings."
        )

    if accessibility_support["clear_formatting"]:
        recommendations.append(
            "Use clear formatting, readable spacing and headings."
        )

    # Remove duplicate recommendations while preserving order
    recommendations = list(
        dict.fromkeys(recommendations)
    )

    return {
        "recommendations": recommendations,
        "accessibility_support": accessibility_support,
    }
