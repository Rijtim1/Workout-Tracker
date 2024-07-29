from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

# Define Pydantic models for exercises
class Exercise(BaseModel):
    name: str
    force: Optional[str] = None
    level: str
    mechanic: Optional[str] = None
    equipment: Optional[str] = None
    primaryMuscles: List[str]
    secondaryMuscles: List[str]
    instructions: List[str]
    category: str
    images: List[str]
    id: str