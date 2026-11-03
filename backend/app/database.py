from collections.abc import Generator

from fastapi import HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import DATABASE_URL


class Base(DeclarativeBase):
    pass


engine = None
SessionLocal = None

if DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
    )

    SessionLocal = sessionmaker(
        bind=engine,
        autoflush=False,
        expire_on_commit=False,
    )


def get_db() -> Generator[Session, None, None]:
    if SessionLocal is None:
        raise HTTPException(
            status_code=503,
            detail="Database is not configured",
        )

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def check_database_connection() -> bool:
    if engine is None:
        return False

    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return True