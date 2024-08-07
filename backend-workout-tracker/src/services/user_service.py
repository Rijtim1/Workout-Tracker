from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from src.schemas.user import UserCreate, User, TokenData
from src.core.security import get_password_hash
from src.db.database import mongodb


async def create_user(user: UserCreate) -> User:
    """Create a new user and store it in the database."""
    hashed_password = get_password_hash(user.password)
    user_data = {
        # Generate a new unique ID and store it as a string
        "_id": str(ObjectId()),
        "username": user.username,
        "email": user.email,
        "password_hash": hashed_password,
        "tokens": []  # Initialize tokens as an empty list
    }
    await mongodb.db["users"].insert_one(user_data)
    return User(id=user_data["_id"], username=user.username, email=user.email)


async def get_user_by_username(username: str) -> Optional[User]:
    """Retrieve a user by username."""
    user_data = await mongodb.db["users"].find_one({"username": username})
    if user_data:
        # Return a User model with password_hash and tokens included for internal use only
        return User(
            id=str(user_data["_id"]),
            username=user_data["username"],
            email=user_data["email"],
            password_hash=user_data["password_hash"],
            tokens=user_data.get("tokens", [])
        )
    return None


async def add_token_to_user(user_id: str, token: str, expires_at: datetime):
    """Add a token to the user's token list."""
    await mongodb.db["users"].update_one(
        {"_id": user_id},
        {"$push": {"tokens": {"token": token, "expiresAt": expires_at}}}
    )


async def invalidate_token_for_user(user_id: str, token: str):
    """Invalidate a specific token for a user."""
    await mongodb.db["users"].update_one(
        {"_id": user_id},
        {"$pull": {"tokens": {"token": token}}}
    )


async def get_all_users() -> List[User]:
    """Retrieve all users from the database."""
    users = []
    async for user_data in mongodb.db["users"].find():
        users.append(User(
            id=str(user_data["_id"]),
            username=user_data["username"],
            email=user_data["email"]
        ))
    return users
