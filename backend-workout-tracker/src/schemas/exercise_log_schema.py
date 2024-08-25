from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ExerciseLog(BaseModel):
    id: Optional[str] = None  # MongoDB ObjectId
    exercise_id: str
    exercise_name: Optional[str] = None  # New field for exercise name
    date: datetime
    sets: int
    reps: int
    weight: Optional[float]
    notes: Optional[str] = None
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
