from typing import List, Optional
from src.schemas.exercise_schema import Exercise
from src.db.mongodb import mongodb
import json


async def get_all_exercises() -> List[Exercise]:
    exercises = []
    async for exercise_data in mongodb.db["exercises"].find():
        exercise_data["id"] = str(exercise_data["_id"])
        exercises.append(Exercise(**exercise_data))
    return exercises


async def get_exercise_by_id(exercise_id: str) -> Optional[Exercise]:
    exercise_data = await mongodb.db["exercises"].find_one({"_id": exercise_id})
    if exercise_data:
        exercise_data["id"] = str(exercise_data["_id"])
        return Exercise(**exercise_data)
    return None


async def create_exercise(exercise_data: Exercise):
    exercise_dict = exercise_data.dict(by_alias=True)
    result = await mongodb.db["exercises"].insert_one(exercise_dict)
    exercise_data.id = str(result.inserted_id)
    return exercise_data


async def initialize_exercise_data():
    collection = mongodb.db["exercises"]

    # Check if the collection is empty
    if await collection.estimated_document_count() == 0:
        with open("data/exercises.json", "r") as file:
            exercises_data = json.load(file)

        # Insert the data into the collection
        await collection.insert_many(exercises_data)
        print("Exercise data initialized.")
    else:
        print("Exercise data already exists. No initialization needed.")
