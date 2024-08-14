from fastapi import APIRouter, HTTPException, Depends
from typing import List
from src.schemas.exercise_log import ExerciseLog
from src.services.exercise_log_service import (
    create_exercise_log,
    get_exercise_logs,
    get_exercise_log,
    update_exercise_log,
    delete_exercise_log
)

router = APIRouter()

@router.post("/", response_model=ExerciseLog)
async def create_exercise_log_endpoint(log: ExerciseLog):
    return await create_exercise_log(log)

@router.get("/", response_model=List[ExerciseLog])
async def get_exercise_logs_endpoint(user_id: str):
    return await get_exercise_logs(user_id)

@router.get("/{log_id}", response_model=ExerciseLog)
async def get_exercise_log_endpoint(log_id: str):
    return await get_exercise_log(log_id)

@router.put("/{log_id}", response_model=ExerciseLog)
async def update_exercise_log_endpoint(log_id: str, log: ExerciseLog):
    return await update_exercise_log(log_id, log)

@router.delete("/{log_id}", response_model=dict)
async def delete_exercise_log_endpoint(log_id: str):
    return await delete_exercise_log(log_id)
