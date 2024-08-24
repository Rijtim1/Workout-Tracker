from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from src.schemas.exercise_schema import Exercise
from src.services.exercise_service import (
    get_all_exercises,
    get_exercises_by_exercise_id,
    search_exercise,
)

router = APIRouter()


@router.get("/exercises", response_model=List[Exercise])
async def get_all_exercises_endpoint():
    return await get_all_exercises()


@router.get("/exercises/{exercise_id}", response_model=Exercise)
async def get_exercises_by_exercise_id_endpoint(exercise_id: str):
    return await get_exercises_by_exercise_id(exercise_id)


@router.get("/exercise/search", response_model=Exercise)
async def search_exercise_endpoint(
    exercise_id: Optional[str] = Query(
        None, description="Custom string ID of the exercise"),
    exercise_object_id: Optional[str] = Query(
        None, description="MongoDB ObjectId of the exercise")
):
    return await search_exercise(exercise_id, exercise_object_id)
