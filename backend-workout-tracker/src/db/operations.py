# src/db/operations.py
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI


class MongoDB:
    def __init__(self, uri: str, db_name: str):
        self.uri = uri
        self.db_name = db_name
        self.client = None
        self.db = None

    async def connect(self):
        self.client = AsyncIOMotorClient(self.uri)
        self.db = self.client[self.db_name]
        print("Connected to MongoDB")

    async def close(self):
        self.client.close()
        print("Closed connection to MongoDB")


mongodb = MongoDB(uri="mongodb://mongo:27017", db_name="workout-db")


def init_db(app: FastAPI):
    @app.on_event("startup")
    async def startup_db_client():
        await mongodb.connect()

    @app.on_event("shutdown")
    async def shutdown_db_client():
        await mongodb.close()
