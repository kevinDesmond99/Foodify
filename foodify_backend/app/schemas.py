from pydantic import BaseModel
from uuid import UUID

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    tenant_id: UUID

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    tenant_id: UUID

    class Config:
        orm_mode = True
