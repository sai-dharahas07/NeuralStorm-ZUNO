
# ai_engine/accessibility.py

"""
Accessibility Support Module - Phase 5

Provides accessibility settings and learning support
for students with different accessibility preferences.

No GPU, ML model or external API is required.
"""

from typing import Any


# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------

SUPPORTED_DISABILITIES = {
    "dyslexia",
    "visual impairment",
    "low vision",
    "blindness",
    "hearing impairment",
    "deafness",
    "adhd",
    "learning disability",
    "autism",
    "motor disability",
}

ACCESSIBILITY_FIELDS = {
    "simplified_text",
    "audio_support",
    "high_contrast",
    "clear_formatting",
}


# ---------------------------------------------------------
# 1. VALIDATE ACCESSIBILITY INPUT
# ---------------------------------------------------------

def validate_accessibility_preferences(
    accessibility: dict[str, Any],
) -> dict[str, Any]:
    """
    Validate and normalize accessibility preferences.

    Expected input:
        {
            "disability_type": ["dyslexia"],
            "needs_simplified_text": True,
            "needs_audio_support": True,
            "needs_high_contrast": False
        }
    """

    if not isinstance(accessibility, dict):
        raise ValueError(
            "Accessibility preferences must be a dictionary."
        )

    disability_types = accessibility.get(
        "disability_type", []
    )

    if not isinstance(disability_types, list):
        raise ValueError(
            "disability_type must be a list."
        )

    normalized_disabilities = []

    for disability in disability_types:

        if not isinstance(disability, str):
            raise ValueError(
                "Each disability type must be a string."
            )

        disability = disability.strip().lower()

        if not disability:
            raise ValueError(
                "Disability type cannot be empty."
            )

        normalized_disabilities.append(disability)

    # Validate explicit preferences
    simplified_text = accessibility.get(
        "needs_simplified_text", False
    )

    audio_support = accessibility.get(
        "needs_audio_support", False
    )

    high_contrast = accessibility.get(
        "needs_high_contrast", False
    )

    boolean_fields = {
        "needs_simplified_text": simplified_text,
        "needs_audio_support": audio_support,
        "needs_high_contrast": high_contrast,
    }

    for field_name, field_value in boolean_fields.items():

        if not isinstance(field_value, bool):
            raise ValueError(
                f"{field_name} must be a boolean."
            )

    return {
        "disability_type": normalized_disabilities,
        "needs_simplified_text": simplified_text,
        "needs_audio_support": audio_support,
        "needs_high_contrast": high_contrast,
    }


# ---------------------------------------------------------
# 2. GENERATE ACCESSIBILITY SETTINGS
# ---------------------------------------------------------

def get_accessibility_settings(
    accessibility: dict[str, Any],
) -> dict[str, bool]:
    """
    Generate accessibility configuration.

    Returns exactly four fields:
        simplified_text
        audio_support
        high_contrast
        clear_formatting
    """

    preferences = validate_accessibility_preferences(
        accessibility
    )

    disabilities = set(
        preferences["disability_type"]
    )

    # Explicit user preferences
    simplified_text = preferences[
        "needs_simplified_text"
    ]

    audio_support = preferences[
        "needs_audio_support"
    ]

    high_contrast = preferences[
        "needs_high_contrast"
    ]

    # Suggested defaults based on selected preferences
    if disabilities.intersection({
        "dyslexia",
        "learning disability",
    }):
        simplified_text = True

    if disabilities.intersection({
        "blindness",
        "visual impairment",
    }):
        audio_support = True

    if disabilities.intersection({
        "visual impairment",
        "low vision",
    }):
        high_contrast = True

    # Clear formatting is enabled by default
    clear_formatting = True

    return {
        "simplified_text": simplified_text,
        "audio_support": audio_support,
        "high_contrast": high_contrast,
        "clear_formatting": clear_formatting,
    }


# ---------------------------------------------------------
# 3. GET TEXT SIMPLIFICATION SUPPORT
# ---------------------------------------------------------

def get_text_support(
    accessibility_settings: dict[str, bool],
) -> dict[str, Any]:
    """
    Return text-related accessibility support.
    """

    if not isinstance(accessibility_settings, dict):
        raise ValueError(
            "Accessibility settings must be a dictionary."
        )

    simplified_text = accessibility_settings.get(
        "simplified_text", False
    )

    clear_formatting = accessibility_settings.get(
        "clear_formatting", True
    )

    if not isinstance(simplified_text, bool):
        raise ValueError(
            "simplified_text must be a boolean."
        )

    if not isinstance(clear_formatting, bool):
        raise ValueError(
            "clear_formatting must be a boolean."
        )

    return {
        "simplified_text": simplified_text,
        "clear_formatting": clear_formatting,
        "text_guidelines": [
            "Use short sentences.",
            "Explain one concept at a time.",
            "Use familiar words where possible.",
            "Explain technical terms clearly.",
            "Use headings and bullet points.",
            "Avoid unnecessary visual clutter.",
        ],
    }


# ---------------------------------------------------------
# 4. GET AUDIO SUPPORT
# ---------------------------------------------------------

def get_audio_support(
    accessibility_settings: dict[str, bool],
) -> dict[str, Any]:
    """
    Return audio accessibility configuration.

    Actual speech synthesis is handled by the frontend
    using browser text-to-speech.
    """

    if not isinstance(accessibility_settings, dict):
        raise ValueError(
            "Accessibility settings must be a dictionary."
        )

    audio_enabled = accessibility_settings.get(
        "audio_support", False
    )

    if not isinstance(audio_enabled, bool):
        raise ValueError(
            "audio_support must be a boolean."
        )

    return {
        "enabled": audio_enabled,
        "features": [
            "Read learning content aloud.",
            "Read quiz questions aloud.",
            "Allow students to replay spoken content.",
        ],
        "implementation": "browser_text_to_speech",
    }


# ---------------------------------------------------------
# 5. GET VISUAL ACCESSIBILITY SUPPORT
# ---------------------------------------------------------

def get_visual_support(
    accessibility_settings: dict[str, bool],
) -> dict[str, Any]:
    """
    Return visual accessibility configuration.
    """

    if not isinstance(accessibility_settings, dict):
        raise ValueError(
            "Accessibility settings must be a dictionary."
        )

    high_contrast = accessibility_settings.get(
        "high_contrast", False
    )

    clear_formatting = accessibility_settings.get(
        "clear_formatting", True
    )

    if not isinstance(high_contrast, bool):
        raise ValueError(
            "high_contrast must be a boolean."
        )

    if not isinstance(clear_formatting, bool):
        raise ValueError(
            "clear_formatting must be a boolean."
        )

    return {
        "high_contrast": high_contrast,
        "clear_formatting": clear_formatting,
        "visual_guidelines": [
            "Use readable font sizes.",
            "Maintain sufficient text contrast.",
            "Avoid relying only on color to communicate information.",
            "Use consistent spacing and alignment.",
            "Keep interactive controls clearly identifiable.",
        ],
    }


# ---------------------------------------------------------
# 6. GENERATE COMPLETE ACCESSIBILITY PROFILE
# ---------------------------------------------------------

def get_accessibility_profile(
    accessibility: dict[str, Any],
) -> dict[str, Any]:
    """
    Generate a complete accessibility profile.

    Suitable for backend integration.

    Returns:
        {
            "accessibility_support": {
                "simplified_text": bool,
                "audio_support": bool,
                "high_contrast": bool,
                "clear_formatting": bool
            },
            "text_support": {...},
            "audio_support": {...},
            "visual_support": {...}
        }
    """

    # Generate core settings
    settings = get_accessibility_settings(
        accessibility
    )

    # Generate additional support configurations
    text_support = get_text_support(settings)

    audio_support = get_audio_support(settings)

    visual_support = get_visual_support(settings)

    return {
        "accessibility_support": settings,
        "text_support": text_support,
        "audio_support": audio_support,
        "visual_support": visual_support,
    }


# ---------------------------------------------------------
# 7. GET FRONTEND ACCESSIBILITY FLAGS
# ---------------------------------------------------------

def get_frontend_accessibility_flags(
    accessibility: dict[str, Any],
) -> dict[str, bool]:
    """
    Return simple boolean flags for frontend usage.

    The frontend can use these flags to enable
    accessibility controls.
    """

    settings = get_accessibility_settings(
        accessibility
    )

    return {
        "simplified_text": settings["simplified_text"],
        "audio_support": settings["audio_support"],
        "high_contrast": settings["high_contrast"],
        "clear_formatting": settings["clear_formatting"],
    }
