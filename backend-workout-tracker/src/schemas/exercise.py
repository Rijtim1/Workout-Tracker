from pydantic import BaseModel
from typing import List, Optional

class ExerciseBase(BaseModel):
    name: str
    level: str
    category: str

class ExerciseCreate(ExerciseBase):
    pass

class Exercise(ExerciseBase):
    id: str
    force: Optional[str] = None
    mechanic: Optional[str] = None
    equipment: Optional[str] = None
    primaryMuscles: List[str]
    secondaryMuscles: List[str]
    instructions: List[str]
    images: List[str]

    class Config:
        from_attributes = True