from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from models import Exercise
import json
import os

router = APIRouter()

# Load the JSON data
data_file_path = r"../data/exercises.json"
with open(data_file_path, "r") as file:
    exercises_data = json.load(file)

@router.get("/exercises", response_model=List[Exercise])
def get_exercises():
    return exercises_data

@router.get("/exercises/{exercise_id}", response_model=Exercise)
def get_exercise(exercise_id: str):
    for exercise in exercises_data:
        if exercise["id"] == exercise_id:
            return exercise
    raise HTTPException(status_code=404, detail="Exercise not found")

@router.get("/exercises/{exercise_id}/images")
def get_exercise_images(exercise_id: str):
    for exercise in exercises_data:
        if exercise["id"] == exercise_id:
            image_paths = [
                f"/images/{exercise_id}/{image}" for image in exercise["images"]
            ]
            return {"images": image_paths}
    raise HTTPException(status_code=404, detail="Exercise not found")

@router.get("/images/{exercise_id}/{image_name}")
def serve_image(exercise_id: str, image_name: str):
    image_path = os.path.join("..", "data", "exercises", exercise_id, image_name)
    if os.path.exists(image_path):
        return FileResponse(image_path)
    raise HTTPException(status_code=404, detail="Image not found")
