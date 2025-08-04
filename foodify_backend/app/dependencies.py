from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.core.security import decode_token
from app.schemas import TokenData

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Header(..., alias="Authorization"), db: Session = Depends(get_db)) -> TokenData:
    scheme, _, param = token.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(401, "Invalid authentication scheme")
    payload = decode_token(param)
    if not payload:
        raise HTTPException(401, "Invalid or expired token")
    return TokenData(user_id=payload["sub"], tenant_id=payload["tenant_id"])
