from typing import List, Optional
from src.schemas.exercise_schema import Exercise
from src.db.mongodb import mongodb
import json
from bson import ObjectId
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
    """Retrieve an exercise by its ID string."""
    # Assuming the 'id' in the database is a simple string like "3_4_Sit-Up"

    # Add a log to check the exercise ID received
    logging.debug(f"Looking for exercise with ID: {exercise_id}")

    # Adjusted to match 'id' as string, not as ObjectId
    exercise_data = await mongodb.db["exercises"].find_one({"id": exercise_id})

    if exercise_data:
        # Log the found exercise data for debugging
        logging.debug(f"Exercise found: {exercise_data}")
        return Exercise(**exercise_data)

    logging.debug("No exercise found with the provided ID.")
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
