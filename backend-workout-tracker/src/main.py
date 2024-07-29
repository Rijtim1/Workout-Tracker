from fastapi import FastAPI
from src.database import engine, database
from src.models import Base
from src.routers import users, exercises

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(exercises.router, prefix="/exercises", tags=["exercises"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
