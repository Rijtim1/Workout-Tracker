from fastapi import HTTPException
from src.schemas.exercise_log_schema import ExerciseLog
from src.db.database import mongodb
from datetime import datetime
from typing import List
from bson import ObjectId


async def create_exercise_log(log_data: ExerciseLog) -> ExerciseLog:
    """Create a new exercise log and store it in the database."""

    # Validate exercise_id as a valid ObjectId
    try:
        exercise_id = ObjectId(log_data.exercise_id)
    except Exception:
        raise HTTPException(
            status_code=400, detail="Invalid exercise ID format")

    # Check if the exercise exists in the database
    exercise_exists = await mongodb.db["exercises"].find_one({"_id": exercise_id})
    if not exercise_exists:
        raise HTTPException(
            status_code=400, detail="Exercise ID does not exist")

    log_dict = log_data.dict(by_alias=True)
    log_dict["created_at"] = datetime.utcnow()
    log_dict["updated_at"] = datetime.utcnow()

    result = await mongodb.db["exercise_logs"].insert_one(log_dict)
    if result.inserted_id:
        log_data.id = str(result.inserted_id)
        return log_data
    raise HTTPException(
        status_code=400, detail="Failed to create exercise log")


async def get_exercise_logs(user_id: str) -> List[ExerciseLog]:
    """Retrieve all exercise logs for a specific user."""
    logs = []
    async for log_data in mongodb.db["exercise_logs"].find({"user_id": user_id}):
        log_data["id"] = str(log_data["_id"])
        logs.append(ExerciseLog(**log_data))
    return logs


async def get_exercise_log(log_id: str) -> ExerciseLog:
    """Retrieve a specific exercise log by its ID."""
    log_data = await mongodb.db["exercise_logs"].find_one({"_id": ObjectId(log_id)})
    if log_data is None:
        raise HTTPException(status_code=404, detail="Log not found")
    log_data["id"] = str(log_data["_id"])
    return ExerciseLog(**log_data)


async def update_exercise_log(log_id: str, log_data: ExerciseLog) -> ExerciseLog:
    """Update an existing exercise log."""
    log_data.updated_at = datetime.utcnow()
    updated_log = await mongodb.db["exercise_logs"].find_one_and_update(
        {"_id": ObjectId(log_id)},
        {"$set": log_data.dict(by_alias=True)},
        return_document=True
    )
    if updated_log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    updated_log["id"] = str(updated_log["_id"])
    return ExerciseLog(**updated_log)


async def delete_exercise_log(log_id: str):
    """Delete an exercise log."""
    result = await mongodb.db["exercise_logs"].delete_one({"_id": ObjectId(log_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Log not found")
    return {"message": "Log deleted successfully"}
