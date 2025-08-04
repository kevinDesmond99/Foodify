# app/db/crud.py

from uuid import UUID
from sqlalchemy.orm import Session

from .models import User
from app.schemas import UserCreate

def get_user(db: Session, tenant_id: UUID) -> User | None:
    return db.query(User).filter(User.tenant_id == tenant_id).first()

def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate, hashed_password: str) -> User:
    db_user = User(
        username=user.username,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
