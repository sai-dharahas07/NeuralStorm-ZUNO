from pathlib import Path

# Include backend AI modules in the existing ai_engine package.
_BACKEND_AI_ENGINE = (
    Path(__file__).resolve().parent.parent
    / "backend"
    / "ai_engine"
)

if _BACKEND_AI_ENGINE.is_dir():
    __path__.append(str(_BACKEND_AI_ENGINE))
