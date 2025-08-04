# app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.auth import (
    authenticate_user,
    create_access_token,
    get_password_hash
)
from app.db.database import get_db
from app.db import crud
from app.schemas import UserCreate, UserRead, Token

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.post(
    "/signup",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED
)
def signup(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    hashed_pw = get_password_hash(user.password)
    return crud.create_user(db, user, hashed_pw)


@router.post(
    "/token",
    response_model=Token
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # creiamo il token con il claim "sub"
    access_token = create_access_token(data={"sub": str(user.tenant_id)})
    return {"access_token": access_token, "token_type": "bearer"}
