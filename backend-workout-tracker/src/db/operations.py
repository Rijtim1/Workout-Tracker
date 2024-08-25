from fastapi import FastAPI
from src.db.mongodb import MongoDB


mongodb = MongoDB(uri="mongodb://mongo:27017", db_name="workout-db")


def init_db(app: FastAPI):
    @app.on_event("startup")
    async def startup_db_client():
        await mongodb.connect()

    @app.on_event("shutdown")
    async def shutdown_db_client():
        await mongodb.close()
