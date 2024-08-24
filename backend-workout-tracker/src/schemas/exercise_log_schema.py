from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ExerciseLog(BaseModel):
    id: Optional[str] = None  # Add this field to handle MongoDB ObjectId
    exercise_id: str
    date: datetime
    sets: int
    reps: int
    weight: Optional[float]
    notes: Optional[str] = None
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
