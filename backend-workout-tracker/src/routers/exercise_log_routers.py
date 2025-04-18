from fastapi import APIRouter, HTTPException, Depends
from typing import List
from src.schemas.exercise_log_schema import ExerciseLog
from src.services.exercise_log_service import (
    create_exercise_log,
    get_exercise_logs,
    get_exercise_log,
    update_exercise_log,
    delete_exercise_log
)
from src.services.exercise_service import get_exercise_by_id
from src.routers.users_routers import get_current_user
from src.schemas.user_schema import User
import logging

router = APIRouter()

@router.post("/", response_model=ExerciseLog)
async def create_exercise_log_endpoint(log: ExerciseLog, current_user: User = Depends(get_current_user)):
    if current_user is None:
        raise HTTPException(status_code=401, detail="User not authenticated")

    # Validate exercise_id exists
    exercise = await get_exercise_by_id(log.exercise_id)
    if not exercise:
        raise HTTPException(status_code=400, detail="Invalid exercise ID")

    # Set the user_id field before passing the log to the service function
    log.user_id = current_user.id
    return await create_exercise_log(log)

@router.get("/", response_model=List[ExerciseLog])
async def get_exercise_logs_endpoint(current_user: User = Depends(get_current_user)):
    if current_user is None:
        raise HTTPException(status_code=401, detail="User not authenticated")

    return await get_exercise_logs(current_user.id)

@router.get("/{log_id}", response_model=ExerciseLog)
async def get_exercise_log_endpoint(log_id: str, current_user: User = Depends(get_current_user)):
    log = await get_exercise_log(log_id)
    if log.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this log")
    return log

@router.put("/{log_id}", response_model=ExerciseLog)
async def update_exercise_log_endpoint(log_id: str, log: ExerciseLog, current_user: User = Depends(get_current_user)):
    existing_log = await get_exercise_log(log_id)
    if existing_log.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this log")

    # Validate exercise_id exists
    if log.exercise_id:
        exercise = await get_exercise_by_id(log.exercise_id)
        if not exercise:
            raise HTTPException(status_code=400, detail="Invalid exercise ID")

    return await update_exercise_log(log_id, log)

@router.delete("/{log_id}", response_model=dict)
async def delete_exercise_log_endpoint(log_id: str, current_user: User = Depends(get_current_user)):
    log = await get_exercise_log(log_id)
    if log.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this log")
    return await delete_exercise_log(log_id)
