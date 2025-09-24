# app/db/crud.py
from uuid import UUID
from sqlalchemy.orm import Session
from app.db.models import Invite

def get_invite(db: Session, token: UUID) -> Invite | None:
    return db.query(Invite).filter(Invite.token == token).first()

def consume_invite(db: Session, token: UUID) -> Invite | None:
    invite = db.query(Invite).filter(Invite.token == token).first()
    if invite and not invite.used:
        invite.used = True
        db.commit()
        db.refresh(invite)
        return invite
    return None
