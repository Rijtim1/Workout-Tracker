from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING
import os


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

        # Create indexes for optimization
        await self.db["exercise_logs"].create_index("user_id", background=True)
        await self.db["exercise_logs"].create_index("exercise_id", background=True)
        await self.db["users"].create_index("username", unique=True, background=True)

    async def close(self):
        self.client.close()
        print("Closed connection to MongoDB")


# Use environment variables to get the URI and DB name
mongodb = MongoDB(uri=os.getenv("MONGODB_URI"), db_name="workout-db")


def init_db(app: FastAPI):
    @app.on_event("startup")
    async def startup_db_client():
        await mongodb.connect()

    @app.on_event("shutdown")
    async def shutdown_db_client():
        await mongodb.close()
