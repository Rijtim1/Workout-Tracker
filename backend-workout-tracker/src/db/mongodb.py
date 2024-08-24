from motor.motor_asyncio import AsyncIOMotorClient
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

    async def close(self):
        self.client.close()
        print("Closed connection to MongoDB")


# Use environment variables to get the URI and DB name
mongodb = MongoDB(uri=os.getenv("MONGODB_URI"), db_name="workout-db")
