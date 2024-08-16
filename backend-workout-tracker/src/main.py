from fastapi import FastAPI
from src.routers import exercise_log_routers, exercises_routers, users_routers
from fastapi.middleware.cors import CORSMiddleware
from src.db.database import init_db

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the database
init_db(app)

# Include routers
app.include_router(users_routers.router, prefix="/api/user", tags=["users"])
app.include_router(exercises_routers.router, prefix="/api/exercise",
                   tags=["exercises"])
app.include_router(exercise_log_routers.router,
                   prefix="/api/exercise_logs", tags=["exercise_logs"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
