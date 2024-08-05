from typing import Optional, List
from bson import ObjectId
from src.schemas.user import UserCreate, User
from src.core.security import get_password_hash
from src.db.database import mongodb

async def create_user(user: UserCreate) -> User:
    """Create a new user and store it in the database."""
    hashed_password = get_password_hash(user.password)
    user_data = {
        "_id": str(ObjectId()),  # Generate a new unique ID and store it as a string
        "username": user.username,
        "email": user.email,
        "password_hash": hashed_password
    }
    await mongodb.db["users"].insert_one(user_data)
    return User(id=user_data["_id"], username=user.username, email=user.email)

async def get_user_by_username(username: str) -> Optional[User]:
    """Retrieve a user by username."""
    user_data = await mongodb.db["users"].find_one({"username": username})
    if user_data:
        # Return a User model with password_hash included for internal use only
        return User(id=str(user_data["_id"]), username=user_data["username"], email=user_data["email"], password_hash=user_data["password_hash"])
    return None

async def get_all_users() -> List[User]:
    """Retrieve all users from the database."""
    users = []
    async for user_data in mongodb.db["users"].find():
        users.append(User(id=str(user_data["_id"]), username=user_data["username"], email=user_data["email"]))
    return users
