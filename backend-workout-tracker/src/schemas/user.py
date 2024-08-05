from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: Optional[str]
    password_hash: Optional[str]  # Include password_hash as an optional field

    class Config:
        orm_mode = True
