import logging
from fastapi import HTTPException
from src.schemas.exercise_log_schema import ExerciseLog
from src.db.database import mongodb
from datetime import datetime
from typing import List
from bson import ObjectId
from src.services.exercise_service import get_exercise_by_id

# Set up logging
logging.basicConfig(level=logging.DEBUG)


async def create_exercise_log(log_data: ExerciseLog) -> ExerciseLog:
    """Create a new exercise log and store it in the database."""
    logging.debug(f"Creating exercise log for exercise_id: {
                  log_data.exercise_id}")

    # Validate the exercise ID exists
    exercise = await get_exercise_by_id(log_data.exercise_id)
    if not exercise:
        raise HTTPException(status_code=400, detail="Invalid exercise ID")

    # Convert to dictionary and add timestamps
    log_dict = log_data.dict(by_alias=True)
    log_dict["created_at"] = datetime.utcnow()
    log_dict["updated_at"] = datetime.utcnow()

    # Insert into MongoDB
    result = await mongodb.db["exercise_logs"].insert_one(log_dict)
    if result.inserted_id:
        log_data.id = str(result.inserted_id)
        return log_data

    raise HTTPException(
        status_code=400, detail="Failed to create exercise log")


async def get_exercise_logs(user_id: str) -> List[ExerciseLog]:
    """Retrieve all exercise logs for a specific user."""
    logging.debug(f"Fetching exercise logs for user_id: {user_id}")
    logs = []
    async for log_data in mongodb.db["exercise_logs"].find({"user_id": user_id}):
        exercise = await get_exercise_by_id(log_data["exercise_id"])
        log_data["exercise_name"] = exercise.name if exercise else "Unknown Exercise"
        log_data["id"] = str(log_data["_id"])
        logs.append(ExerciseLog(**log_data))
    return logs


async def get_exercise_log(log_id: str) -> ExerciseLog:
    """Retrieve a specific exercise log by its ID."""
    logging.debug(f"Fetching exercise log with log_id: {log_id}")
    log_data = await mongodb.db["exercise_logs"].find_one({"_id": ObjectId(log_id)})
    if not log_data:
        raise HTTPException(status_code=404, detail="Log not found")

    log_data["id"] = str(log_data["_id"])
    return ExerciseLog(**log_data)


async def update_exercise_log(log_id: str, log_data: ExerciseLog) -> ExerciseLog:
    """Update an existing exercise log."""
    logging.debug(f"Updating exercise log with log_id: {log_id}")
    log_data.updated_at = datetime.utcnow()

    # Update MongoDB
    updated_log = await mongodb.db["exercise_logs"].find_one_and_update(
        {"_id": ObjectId(log_id)},
        {"$set": log_data.dict(by_alias=True)},
        return_document=True
    )

    if not updated_log:
        raise HTTPException(status_code=404, detail="Log not found")

    updated_log["id"] = str(updated_log["_id"])
    return ExerciseLog(**updated_log)


async def delete_exercise_log(log_id: str):
    """Delete an exercise log."""
    logging.debug(f"Deleting exercise log with log_id: {log_id}")
    result = await mongodb.db["exercise_logs"].delete_one({"_id": ObjectId(log_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Log not found")

    return {"message": "Log deleted successfully"}
