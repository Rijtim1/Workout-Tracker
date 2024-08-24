from fastapi import FastAPI
from src.db.mongodb import mongodb
from src.services.exercise_service import initialize_exercise_data


def init_db(app: FastAPI):
    @app.on_event("startup")
    async def startup_db_client():
        await mongodb.connect()
        await initialize_exercise_data()

    @app.on_event("shutdown")
    async def shutdown_db_client():
        await mongodb.close()
