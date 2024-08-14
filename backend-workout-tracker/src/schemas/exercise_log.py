from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId

class ExerciseLog(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
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
        from_attributes  = True
        populate_by_name  = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "user_id": "64f19a22f1c79b002ea9b456",
                "exercise_id": "64f19a22f1c79b002ea9b123",
                "date": "2024-08-15T14:15:22Z",
                "sets": 4,
                "reps": 10,
                "weight": 50.5,
                "notes": "Felt strong, increase weight next time"
            }
        }
