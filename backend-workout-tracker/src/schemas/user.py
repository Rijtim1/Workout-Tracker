from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: Optional[str]  # Use Optional[str] to align with MongoDB's _id field stored as string

    class Config:
        orm_mode = True
