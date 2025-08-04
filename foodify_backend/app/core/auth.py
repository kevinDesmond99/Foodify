# app/core/auth.py

import jwt
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from uuid import UUID

from app.db import crud
from app.db.database import get_db
from app.schemas import TokenData

# Configurazione JWT
SECRET_KEY = "YOUR_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Schemi di hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Endpoint per il login (token URL)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def authenticate_user(db: Session, username: str, password: str):
    user = crud.get_user_by_username(db, username=username)
    if not user or not verify_password(password, user.password):
        return None
    return user


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    # assicura che il claim "sub" (subject) contenga sempre il tenant_id
    if "sub" not in to_encode and "tenant_id" in data:
        to_encode["sub"] = str(data["tenant_id"])
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        tenant_id_str: str = payload.get("sub")
        if tenant_id_str is None:
            raise credentials_exception
        token_data = TokenData(tenant_id=UUID(tenant_id_str))
    except (jwt.PyJWTError, ValueError):
        raise credentials_exception

    user = crud.get_user(db, tenant_id=token_data.tenant_id)
    if user is None:
        raise credentials_exception
    return user
