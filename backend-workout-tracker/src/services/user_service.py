from typing import Optional, List
from datetime import datetime, timedelta

from fastapi import HTTPException
import jwt
from bson import ObjectId  # type: ignore
from src.schemas.user import UserCreate, User, TokenData
from src.core.security import get_password_hash, decode_access_token
from src.db.database import mongodb
import logging
from src.core.config import settings


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
    return User(id=user_data["_id"], username=user.username, email=user.email, password_hash=user_data.get("password_hash"))


async def get_user_by_username(username: str) -> Optional[User]:
    """Retrieve a user by username."""
    user_data = await mongodb.db["users"].find_one({"username": username})
    if user_data:
        tokens = [
            TokenData(
                token=token["token"],
                createAt=token["createAt"],
                expiresAt=token["expiresAt"]
            )
            for token in user_data.get("tokens", [])
        ]
        return User(
            id=str(user_data["_id"]),
            username=user_data["username"],
            email=user_data["email"],
            password_hash=user_data["password_hash"],
            tokens=tokens
        )
    return None


async def add_token_to_user(user_id: str, token: str, expires_at: timedelta, create_at: datetime):
    """Add a token to the user's token list."""
    # Convert timedelta to total seconds
    expires_at_seconds = int(expires_at.total_seconds())
    await mongodb.db["users"].update_one(
        {"_id": user_id},
        {"$push": {"tokens": {"token": token,
                              "expiresAt": expires_at_seconds, "createAt": str(create_at)}}}
    )


async def invalidate_token_for_user(user_id: str, token: str):
    """Invalidate a specific token for a user."""
    await mongodb.db["users"].update_one(
        {"_id": user_id},  # Use user_id directly
        {"$pull": {"tokens": {"token": token}}}
    )


async def get_all_users() -> List[User]:
    """Retrieve all users from the database."""
    users = []
    async for user_data in mongodb.db["users"].find():
        # Exclude password_hash when creating User instance
        user_dict = {
            "id": str(user_data["_id"]),
            "username": user_data["username"],
            "email": user_data["email"],
            "password_hash": user_data["password_hash"],
        }
        users.append(User(**user_dict))
    return users


def get_user_id_from_token(token: str) -> str:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY,
                             algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.PyJWTError:  # Corrected exception handling
        raise HTTPException(status_code=401, detail="Invalid token")


# async def get_current_user(token: str = Depends(oauth2_scheme)):
#     try:
#         payload = decode_access_token(token)
#         username: str = payload.get("sub")
#         if username is None:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
#         user = await get_user_by_username(username)
#         if user is None:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
#         return user
#     except jwt.PyJWTError:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
#                             detail="Could not validate credentials")
