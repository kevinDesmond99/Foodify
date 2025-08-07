# app/db/models.py

import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base

class User(Base):
    __tablename__ = "Users"

    # tenant_id: UUID primario, univoco e generato automaticamente
    tenant_id = Column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4, 
        unique=True, 
        nullable=False
    )

    # username: varchar univoco
    username = Column(
        String(150), 
        unique=True, 
        index=True, 
        nullable=False
    )

    # password: varchar (in produzione memorizza sempre hash, non plaintext)
    password = Column(
        String(256), 
        nullable=False
    )
