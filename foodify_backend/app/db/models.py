# app/db/models.py

import uuid
from sqlalchemy import Boolean, Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"   # se vuoi allinearti a Supabase, usa proprio "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    encrypted_password = Column(String, nullable=False)

    def __repr__(self):
        return f"<User id={self.id} email={self.email}>"

class Invite(Base):
    __tablename__ = "invites"

    token = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
