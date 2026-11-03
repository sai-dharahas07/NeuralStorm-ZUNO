from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.config import FRONTEND_ORIGINS
from app.models.quiz_attempt import QuizAttempt
from app.routes.health import router as health_router
from app.routes.quiz import router as quiz_router
from app.routes.progress import router as progress_router
from app.models.ai_evaluation import AIEvaluation
from app.routes import ai


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create missing tables for the initial MVP.
    if engine is not None:
        Base.metadata.create_all(bind=engine)

    yield


app = FastAPI(
    title="Neural Storm Adaptive Learning API",
    description=(
        "Backend API for the Neural Storm 2026 "
        "adaptive learning application."
    ),
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(health_router)
app.include_router(quiz_router)
app.include_router(progress_router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {
        "name": "Neural Storm Adaptive Learning API",
        "version": "0.2.0",
        "docs": "/docs",
        "health": "/health",
    }