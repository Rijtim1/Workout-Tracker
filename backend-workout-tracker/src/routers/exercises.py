from fastapi import APIRouter, HTTPException
from typing import List
from src.schemas.exercise import Exercise
from src.services.exercise_service import load_exercises, get_exercise_by_id

router = APIRouter()

@router.get("/exercises", response_model=List[Exercise])
def get_all_exercises():
    return load_exercises()

@router.get("/exercises/{exercise_id}", response_model=Exercise)
def get_exercises_by_exercise_id(exercise_id: str):
    exercise = get_exercise_by_id(exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return exercise
