# backend-workout-tracker/src/schemas/exercise_log_schema.py
from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId


class ExerciseLog(BaseModel):
    id: Optional[str] = Field(
        default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    exercise_id: str
    date: datetime
    sets: int
    reps: int
    weight: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True
        populate_by_name = True
        json_encoders = {ObjectId: str}
