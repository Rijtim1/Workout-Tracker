from typing import List, Optional
from src.schemas.exercise_schema import Exercise
from src.db.mongodb import mongodb


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
