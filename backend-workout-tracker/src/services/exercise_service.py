from typing import List, Optional
from fastapi import HTTPException, Query
from bson import ObjectId
from src.schemas.exercise_schema import Exercise
from src.db.mongodb import mongodb
import json
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)


async def get_all_exercises() -> List[Exercise]:
    exercises = []
    async for exercise_data in mongodb.db["exercises"].find():
        exercise_data["id"] = str(exercise_data["_id"])
        exercises.append(Exercise(**exercise_data))
    return exercises


async def get_exercise_by_id(exercise_id: str) -> Optional[Exercise]:
    logging.debug(f"Looking for exercise with ID: {exercise_id}")
    exercise_data = await mongodb.db["exercises"].find_one({"id": exercise_id})

    if exercise_data:
        logging.debug(f"Exercise found: {exercise_data}")
        return Exercise(**exercise_data)

    logging.debug("No exercise found with the provided ID.")
    return None


async def get_exercise_by_object_id(exercise_object_id: ObjectId) -> Optional[Exercise]:
    """Retrieve an exercise by its MongoDB ObjectId."""
    logging.debug(f"Looking for exercise with ObjectId: {exercise_object_id}")
    exercise_data = await mongodb.db["exercises"].find_one({"_id": exercise_object_id})

    if exercise_data:
        logging.debug(f"Exercise found: {exercise_data}")
        return Exercise(**exercise_data)

    logging.debug("No exercise found with the provided ObjectId.")
    return None


async def initialize_exercise_data():
    collection = mongodb.db["exercises"]

    # Check if the collection is empty
    if await collection.estimated_document_count() == 0:
        with open("data/exercises.json", "r") as file:
            exercises_data = json.load(file)

        # Ensure all exercises have a string 'id' field
        for exercise in exercises_data:
            exercise['_id'] = ObjectId()  # Use ObjectId for MongoDB _id
            # Keep the string-based ID for reference
            exercise['id'] = exercise['id']

        # Insert the data into the collection
        await collection.insert_many(exercises_data)
        print("Exercise data initialized.")
    else:
        print("Exercise data already exists. No initialization needed.")


async def get_exercises_by_exercise_id(exercise_id: str) -> Exercise:
    try:
        # Convert the string ID to ObjectId for MongoDB lookup
        object_id = ObjectId(exercise_id)
        # Try to find by ObjectId
        exercise = await get_exercise_by_object_id(object_id)
    except Exception:
        # If conversion fails, fallback to find by custom string ID
        exercise = await get_exercise_by_id(exercise_id)

    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return exercise


async def search_exercise(
    exercise_id: Optional[str] = Query(
        None, description="Custom string ID of the exercise"),
    exercise_object_id: Optional[str] = Query(
        None, description="MongoDB ObjectId of the exercise")
) -> Exercise:
    if exercise_object_id:
        try:
            # Convert the string ID to ObjectId for MongoDB lookup
            object_id = ObjectId(exercise_object_id)
            exercise = await get_exercise_by_object_id(object_id)
        except Exception:
            raise HTTPException(
                status_code=400, detail="Invalid ObjectId format"
            )
    elif exercise_id:
        # Find by custom string ID
        exercise = await get_exercise_by_id(exercise_id)
    else:
        raise HTTPException(
            status_code=400, detail="Either exercise_id or exercise_object_id must be provided"
        )

    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return exercise
