from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class TokenData(BaseModel):
    token: str
    expiresAt: datetime


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: Optional[str]
    password_hash: Optional[str]  # Include password_hash as an optional field
    # Add tokens field to store user tokens
    tokens: Optional[List[TokenData]] = []

    class Config:
        orm_mode = True
