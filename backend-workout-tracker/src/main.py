from fastapi import FastAPI
from src.routers import exercises, users

app = FastAPI()

app.include_router(users.router, prefix="/api/user", tags=["users"])
app.include_router(exercises.router, prefix="/api/exercise", tags=["exercises"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
