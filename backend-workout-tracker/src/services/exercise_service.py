import json
from typing import List
from src.schemas.exercise import Exercise

data_file_path = "data/exercises.json"

def load_exercises() -> List[Exercise]:
    with open(data_file_path, "r") as file:
        exercises_data = json.load(file)
    return [Exercise(**exercise) for exercise in exercises_data]

def get_exercise_by_id(exercise_id: str) -> Exercise:
    exercises = load_exercises()
    for exercise in exercises:
        if exercise.id == exercise_id:
            return exercise
    return None
