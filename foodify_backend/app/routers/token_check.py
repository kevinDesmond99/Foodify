# app/routers/invite.py
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Invite

router = APIRouter(tags=["invite"])

@router.get(
    "/validate-token/{token}",
    status_code=status.HTTP_200_OK,
    response_model=dict
)
async def validate_token(token: UUID, db: Session = Depends(get_db)):
    invite = db.query(Invite).filter(Invite.token == token).first()
    if not invite:
        raise HTTPException(status_code=404, detail="Token non trovato")
    if invite.used:
        raise HTTPException(status_code=400, detail="Token già usato")
    return {"email": invite.email, "valid": True}

@router.post(
    "/consume-token/{token}",
    status_code=status.HTTP_200_OK,
    response_model=dict
)
async def consume_token(token: UUID, db: Session = Depends(get_db)):
    invite = db.query(Invite).filter(Invite.token == token).first()
    if not invite:
        raise HTTPException(status_code=404, detail="Token non trovato")
    if invite.used:
        raise HTTPException(status_code=400, detail="Token già usato")
    invite.used = True
    db.commit()
    return {"status": "ok"}
