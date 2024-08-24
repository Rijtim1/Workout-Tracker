from fastapi import APIRouter, HTTPException, Depends
from typing import List
from src.schemas.exercise_schema import Exercise
from src.services.exercise_service import get_all_exercises, get_exercise_by_id

router = APIRouter()


@router.get("/exercises", response_model=List[Exercise])
async def get_all_exercises_endpoint():
    return await get_all_exercises()


@router.get("/exercises/{exercise_id}", response_model=Exercise)
async def get_exercises_by_exercise_id(exercise_id: str):
    exercise = await get_exercise_by_id(exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return exercise
