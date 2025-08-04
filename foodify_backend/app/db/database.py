# app/db/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# URL di connessione ricavato dalle impostazioni
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# Se usi SQLite, abilita check_same_thread; altrimenti ometti connect_args
connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# Creazione dell'engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class per i modelli
Base = declarative_base()

# Dependency per ottenere la sessione DB in FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
